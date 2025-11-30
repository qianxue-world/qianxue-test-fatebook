import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import OverviewReport from './components/OverviewReport'
import SpecialReport from './components/SpecialReport'
import DataUpload from './components/DataUpload'
import './App.css'

type PageType = 'overview' | 'special'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('overview')
  const [hasData, setHasData] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    // 检查是否已有上传的数据
    const requiredKeys = ['lhDKT', 'rhDKT', 'lhAparc', 'rhAparc', 'aseg']
    const allPresent = requiredKeys.every(key => localStorage.getItem(`freesurfer_${key}`))
    setHasData(allPresent)
  }, [])

  const handleDataUploaded = () => {
    setHasData(true)
    setShowUpload(false)
  }

  const handleReupload = () => {
    setShowUpload(true)
  }

  // 首次没有数据或用户点击重新上传
  if (!hasData || showUpload) {
    return (
      <DataUpload 
        onDataUploaded={handleDataUploaded} 
        onCancel={hasData ? () => setShowUpload(false) : undefined}
      />
    )
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        <button className="reupload-btn" onClick={handleReupload} title="重新上传数据">
          📤 上传数据
        </button>
        {currentPage === 'overview' && <OverviewReport />}
        {currentPage === 'special' && <SpecialReport />}
      </main>
    </div>
  )
}

export default App
