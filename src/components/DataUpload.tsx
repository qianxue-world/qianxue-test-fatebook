import { useState, useCallback } from 'react'
import './DataUpload.css'

interface Props {
  onDataUploaded: () => void
  onCancel?: () => void
}

interface FileStatus {
  fileName?: string
  isValid: boolean
  error?: string
}

interface UploadedFiles {
  lhDKT: FileStatus
  rhDKT: FileStatus
  lhAparc: FileStatus
  rhAparc: FileStatus
  aseg: FileStatus
}

// 文件类型配置
const fileTypes = [
  { key: 'lhDKT', label: '左半球 DKT', pattern: /lh\.aparc\.DKTatlas\.stats$/i, hint: 'lh.aparc.DKTatlas.stats', required: true },
  { key: 'rhDKT', label: '右半球 DKT', pattern: /rh\.aparc\.DKTatlas\.stats$/i, hint: 'rh.aparc.DKTatlas.stats', required: true },
  { key: 'lhAparc', label: '左半球 Aparc', pattern: /lh\.aparc\.stats$/i, hint: 'lh.aparc.stats', required: true },
  { key: 'rhAparc', label: '右半球 Aparc', pattern: /rh\.aparc\.stats$/i, hint: 'rh.aparc.stats', required: true },
  { key: 'aseg', label: '皮下结构', pattern: /aseg\.stats$/i, hint: 'aseg.stats', required: true },
] as const

// 根据文件名自动识别文件类型
function detectFileType(fileName: string): keyof UploadedFiles | null {
  for (const ft of fileTypes) {
    if (ft.pattern.test(fileName)) {
      return ft.key as keyof UploadedFiles
    }
  }
  return null
}

// 验证文件名是否匹配期望的类型
function validateFileName(fileName: string, expectedType: keyof UploadedFiles): { isValid: boolean; error?: string } {
  const expectedConfig = fileTypes.find(f => f.key === expectedType)
  if (!expectedConfig) return { isValid: false, error: '未知文件类型' }
  
  // 检查是否匹配期望的模式
  if (expectedConfig.pattern.test(fileName)) {
    return { isValid: true }
  }
  
  // 检查是否是其他类型的文件（用户可能拖错了）
  const detectedType = detectFileType(fileName)
  if (detectedType) {
    const detectedConfig = fileTypes.find(f => f.key === detectedType)
    return { 
      isValid: false, 
      error: `这是 ${detectedConfig?.label} 文件，不是 ${expectedConfig.label}` 
    }
  }
  
  // 检查常见错误：lh/rh 混淆
  if (expectedType.startsWith('lh') && fileName.includes('rh.')) {
    return { isValid: false, error: '这是右半球(rh)文件，需要左半球(lh)文件' }
  }
  if (expectedType.startsWith('rh') && fileName.includes('lh.')) {
    return { isValid: false, error: '这是左半球(lh)文件，需要右半球(rh)文件' }
  }
  
  return { isValid: false, error: `文件名不匹配，期望: ${expectedConfig.hint}` }
}

export default function DataUpload({ onDataUploaded, onCancel }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    lhDKT: { isValid: false },
    rhDKT: { isValid: false },
    lhAparc: { isValid: false },
    rhAparc: { isValid: false },
    aseg: { isValid: false },
  })
  const [isDraggingFolder, setIsDraggingFolder] = useState(false)

  const handleFileUpload = useCallback(async (file: File, type: keyof UploadedFiles) => {
    try {
      setError(null)
      
      // 验证文件名
      const validation = validateFileName(file.name, type)
      if (!validation.isValid) {
        setUploadedFiles(prev => ({
          ...prev,
          [type]: { fileName: file.name, isValid: false, error: validation.error }
        }))
        return
      }
      
      const text = await file.text()
      
      // 验证文件内容格式
      if (!text.includes('# Measure')) {
        setUploadedFiles(prev => ({
          ...prev,
          [type]: { fileName: file.name, isValid: false, error: '文件格式不正确' }
        }))
        return
      }

      // 保存到 localStorage
      localStorage.setItem(`freesurfer_${type}`, text)
      setUploadedFiles(prev => ({
        ...prev,
        [type]: { fileName: file.name, isValid: true }
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件上传失败')
    }
  }, [])

  // 处理文件夹拖拽 - 递归读取所有文件
  const processEntry = useCallback(async (entry: FileSystemEntry): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        (entry as FileSystemFileEntry).file((file) => {
          resolve([file])
        }, () => resolve([]))
      })
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader()
      return new Promise((resolve) => {
        const allFiles: File[] = []
        const readEntries = () => {
          dirReader.readEntries(async (entries) => {
            if (entries.length === 0) {
              resolve(allFiles)
            } else {
              for (const e of entries) {
                const files = await processEntry(e)
                allFiles.push(...files)
              }
              readEntries()
            }
          }, () => resolve(allFiles))
        }
        readEntries()
      })
    }
    return []
  }, [])

  // 自动匹配并上传文件
  const autoMatchAndUpload = useCallback(async (files: File[]) => {
    let matchedCount = 0
    
    for (const file of files) {
      const detectedType = detectFileType(file.name)
      if (detectedType) {
        await handleFileUpload(file, detectedType)
        matchedCount++
      }
    }
    
    if (matchedCount === 0 && files.length > 0) {
      setError('未找到匹配的 FreeSurfer stats 文件')
    } else if (matchedCount > 0) {
      setError(null)
    }
  }, [handleFileUpload])

  // 处理文件夹拖拽区域的拖放
  const handleFolderDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFolder(false)
    
    const items = e.dataTransfer.items
    const allFiles: File[] = []
    
    // 使用 webkitGetAsEntry 来支持文件夹
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const entry = item.webkitGetAsEntry?.()
      if (entry) {
        const files = await processEntry(entry)
        allFiles.push(...files)
      } else if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) allFiles.push(file)
      }
    }
    
    await autoMatchAndUpload(allFiles)
  }, [processEntry, autoMatchAndUpload])

  const handleDrop = (e: React.DragEvent, type: keyof UploadedFiles) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0], type)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: keyof UploadedFiles) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0], type)
    }
  }

  const canProceed = uploadedFiles.lhDKT.isValid && uploadedFiles.rhDKT.isValid && 
                     uploadedFiles.lhAparc.isValid && uploadedFiles.rhAparc.isValid && 
                     uploadedFiles.aseg.isValid

  const handleProceed = () => {
    if (canProceed) {
      onDataUploaded()
    }
  }

  const clearData = () => {
    fileTypes.forEach(f => localStorage.removeItem(`freesurfer_${f.key}`))
    setUploadedFiles({
      lhDKT: { isValid: false },
      rhDKT: { isValid: false },
      lhAparc: { isValid: false },
      rhAparc: { isValid: false },
      aseg: { isValid: false },
    })
    setError(null)
  }

  const uploadedCount = Object.values(uploadedFiles).filter(f => f.isValid).length

  return (
    <div className="data-upload">
      <div className="upload-header">
        <h1>🧠 FreeSurfer 数据上传</h1>
        <p>请上传您的 FreeSurfer 分析结果文件以开始脑结构分析</p>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {/* 文件夹拖拽区域 */}
      <div 
        className={`folder-drop-zone ${isDraggingFolder ? 'dragging' : ''}`}
        onDrop={handleFolderDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingFolder(true) }}
        onDragLeave={() => setIsDraggingFolder(false)}
      >
        <div className="folder-drop-content">
          <span className="folder-icon">📂</span>
          <h3>拖拽 stats 文件夹到这里</h3>
          <p>自动识别并匹配所有 FreeSurfer stats 文件</p>
          <p className="folder-hint">已识别 {uploadedCount}/5 个文件</p>
        </div>
      </div>

      <div className="divider">
        <span>或者单独上传每个文件</span>
      </div>

      <div className="upload-grid">
        {fileTypes.map(({ key, label, hint }) => {
          const fileStatus = uploadedFiles[key as keyof UploadedFiles]
          const hasFile = fileStatus.fileName
          const isValid = fileStatus.isValid
          const hasError = fileStatus.error
          
          return (
            <div key={key} className="upload-card">
              <h3>{label}</h3>
              <div 
                className={`drop-zone ${isValid ? 'uploaded' : ''} ${hasError ? 'error' : ''}`}
                onDrop={(e) => handleDrop(e, key as keyof UploadedFiles)}
                onDragOver={(e) => e.preventDefault()}
              >
                {hasFile ? (
                  <div className="uploaded-info">
                    <span className={`status-icon ${isValid ? 'valid' : 'invalid'}`}>
                      {isValid ? '✅' : '❌'}
                    </span>
                    <span className="file-name">{fileStatus.fileName}</span>
                    {hasError && <span className="error-hint">{fileStatus.error}</span>}
                  </div>
                ) : (
                  <>
                    <div className="drop-icon">📁</div>
                    <p>拖拽或点击选择</p>
                    <p className="file-hint">{hint}</p>
                  </>
                )}
                <input
                  type="file"
                  accept=".stats,.txt"
                  onChange={(e) => handleFileSelect(e, key as keyof UploadedFiles)}
                  className="file-input"
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="upload-actions">
        {onCancel && (
          <button className="cancel-button" onClick={onCancel}>
            ← 返回
          </button>
        )}
        <button className="clear-button" onClick={clearData} disabled={uploadedCount === 0}>
          清除数据
        </button>
        <button className={`proceed-button ${canProceed ? 'ready' : ''}`} onClick={handleProceed} disabled={!canProceed}>
          {canProceed ? '开始分析 🚀' : `请上传所有文件 (${uploadedCount}/5)`}
        </button>
      </div>

      <div className="upload-help">
        <h4>📋 文件说明</h4>
        <ul>
          <li><strong>lh/rh.aparc.DKTatlas.stats</strong> - DKT 分区皮层统计</li>
          <li><strong>lh/rh.aparc.stats</strong> - Desikan 分区皮层统计</li>
          <li><strong>aseg.stats</strong> - 皮下结构和总体积统计</li>
        </ul>
        <p>💡 这些文件位于 FreeSurfer 输出目录的 <code>stats/</code> 文件夹中</p>
        <p>💡 支持直接拖拽整个 <code>stats</code> 文件夹，自动识别所需文件</p>
      </div>
    </div>
  )
}
