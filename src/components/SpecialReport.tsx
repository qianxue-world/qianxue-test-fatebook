import { useState, useEffect } from 'react'
import { runDKTAnalysis, parseDKTStats, DKTAnalysisResult, IndexResult } from '../utils/dktAnalysis'
import IndexDetail from './IndexDetail'
import './SpecialReport.css'

export default function SpecialReport() {
  const [analysis, setAnalysis] = useState<DKTAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<IndexResult | null>(null)

  useEffect(() => {
    loadAndAnalyze()
  }, [])

  const loadAndAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      // 从 localStorage 读取数据
      const lhContent = localStorage.getItem('freesurfer_lhDKT')
      const rhContent = localStorage.getItem('freesurfer_rhDKT')

      if (!lhContent || !rhContent) {
        throw new Error('缺少必要的数据文件')
      }

      const lhData = parseDKTStats(lhContent)
      const rhData = parseDKTStats(rhContent)
      const result = runDKTAnalysis(lhData, rhData)
      setAnalysis(result)
    } catch (err) {
      setError('数据加载失败，请重新上传文件')
    }
    setLoading(false)
  }

  const getPercentileColor = (p: number) => {
    if (p >= 93) return '#4caf50'
    if (p >= 84) return '#8bc34a'
    if (p >= 70) return '#cddc39'
    if (p >= 30) return '#ffeb3b'
    if (p >= 16) return '#ff9800'
    return '#f44336'
  }

  const getPercentileLabel = (p: number) => {
    if (p >= 98) return '卓越'
    if (p >= 93) return '优秀'
    if (p >= 84) return '良好'
    if (p >= 70) return '较好'
    if (p >= 30) return '正常'
    if (p >= 16) return '偏低'
    return '需关注'
  }

  // 侧化指标：将 z-score 转换为左右偏向百分比 (50% = 平衡)
  // 根据不同指标类型使用不同的阈值范围
  const getLateralizationPercent = (value: number, type?: string): number => {
    // 根据指标类型定义左右极值范围
    let leftExtreme: number, rightExtreme: number
    
    switch (type) {
      case 'hand':
        leftExtreme = -1.28; rightExtreme = 1.28
        break
      case 'eye':
        leftExtreme = -1.5; rightExtreme = 1.5
        break
      case 'nostril':
        leftExtreme = -1.2; rightExtreme = 1.2
        break
      case 'lang':
        // 语言偏侧化：正值=左脑优势，负值=右脑优势
        // 进度条标签是：左脑 | 双侧 | 右脑，需要反转（正值在左边，负值在右边）
        leftExtreme = 0.20; rightExtreme = -0.15
        break
      case 'spatial':
        leftExtreme = -0.40; rightExtreme = 0.80
        break
      case 'emotion':
        leftExtreme = -0.50; rightExtreme = 0.90
        break
      case 'face':
        leftExtreme = -0.60; rightExtreme = 1.00
        break
      case 'music':
        leftExtreme = -0.70; rightExtreme = 1.20
        break
      case 'tom':
        leftExtreme = -0.40; rightExtreme = 0.80
        break
      case 'logic':
        // 逻辑推理：负值=左脑优势（好），正值=右脑优势
        leftExtreme = -0.80; rightExtreme = 0.50
        break
      case 'math':
        // 数学能力：负值=左脑优势（好），正值=右脑优势
        leftExtreme = -0.90; rightExtreme = 0.40
        break
      default:
        leftExtreme = -2; rightExtreme = 2
    }
    
    // 将值映射到 0-100，50 为中心
    const range = rightExtreme - leftExtreme
    const percent = ((value - leftExtreme) / range) * 100
    return Math.max(0, Math.min(100, percent))
  }

  // 侧化指标的标签
  const getLateralizationLabel = (value: number, type: 'hand' | 'eye' | 'lang' | 'nostril'): string => {
    if (type === 'hand') {
      if (value >= 1.28) return '极纯右利手'
      if (value >= 0.84) return '强右利手'
      if (value >= 0.52) return '中等右利手'
      if (value >= -0.52) return '双手协调'
      if (value >= -0.84) return '中等左利手'
      return '强左利手'
    } else if (type === 'eye') {
      if (value >= 1.5) return '极强右眼'
      if (value >= 0.8) return '明显右眼'
      if (value >= 0.3) return '轻度右眼'
      if (value >= -0.3) return '双眼均衡'
      if (value >= -0.8) return '轻度左眼'
      return '明显左眼'
    } else if (type === 'nostril') {
      if (value >= 1.2) return '极强右鼻孔'
      if (value >= 0.7) return '明显右鼻孔'
      if (value >= 0.3) return '轻度右鼻孔'
      if (value >= -0.3) return '双鼻孔均衡'
      if (value >= -0.7) return '轻度左鼻孔'
      if (value >= -1.2) return '明显左鼻孔'
      return '极强左鼻孔'
    } else {
      // 语言偏侧化
      if (value >= 0.20) return '典型左侧化'
      if (value >= 0.05) return '弱左侧化'
      if (value >= -0.05) return '双侧化'
      if (value >= -0.15) return '弱右侧化'
      return '显著右侧化'
    }
  }

  // 高级功能偏侧化指标的标签
  const getAdvancedLateralizationLabel = (value: number, type: 'spatial' | 'emotion' | 'face' | 'music' | 'tom' | 'logic' | 'math'): string => {
    if (type === 'spatial') {
      if (value >= 0.80) return '极强右偏'
      if (value >= 0.40) return '明显右偏'
      if (value >= -0.20) return '均衡'
      if (value >= -0.40) return '轻度左偏'
      return '明显左偏'
    } else if (type === 'emotion') {
      if (value >= 0.90) return '极强右偏'
      if (value >= 0.50) return '明显右偏'
      if (value >= -0.30) return '均衡'
      if (value >= -0.50) return '轻度左偏'
      return '左偏(抑郁倾向)'
    } else if (type === 'face') {
      if (value >= 1.00) return '极强右偏'
      if (value >= 0.60) return '明显右偏'
      if (value >= -0.20) return '均衡'
      if (value >= -0.60) return '轻度左偏'
      return '罕见左偏'
    } else if (type === 'music') {
      if (value >= 1.20) return '极强右偏'
      if (value >= 0.70) return '明显右偏'
      if (value >= -0.30) return '均衡'
      if (value >= -0.70) return '轻度左偏'
      return '罕见左偏'
    } else if (type === 'logic') {
      // 逻辑推理（负值=左脑优势）
      if (value <= -0.80) return '极强左脑'
      if (value <= -0.50) return '显著左脑'
      if (value <= -0.20) return '轻度左脑'
      if (value <= 0.20) return '均衡'
      if (value <= 0.50) return '右脑优势'
      return '显著右脑'
    } else if (type === 'math') {
      // 数学能力（负值=左脑优势）
      if (value <= -0.90) return '极强左脑'
      if (value <= -0.60) return '显著左脑'
      if (value <= -0.20) return '轻度左脑'
      if (value <= 0.20) return '均衡'
      if (value <= 0.40) return '右脑优势'
      return '显著右脑'
    } else {
      // 心理理论
      if (value >= 0.80) return '极强右偏'
      if (value >= 0.40) return '明显右偏'
      if (value >= -0.20) return '均衡'
      if (value >= -0.40) return '轻度左偏'
      return '明显左偏'
    }
  }

  // 侧化指标的颜色（蓝色系=左脑，粉色系=右脑）
  const getLateralizationColor = (percent: number): string => {
    if (percent >= 70) return '#e91e63' // 粉红 - 强右侧
    if (percent >= 60) return '#f48fb1' // 浅粉 - 偏右
    if (percent >= 40) return '#9c27b0' // 紫色 - 平衡
    if (percent >= 30) return '#7986cb' // 浅蓝 - 偏左
    return '#3f51b5' // 蓝色 - 强左侧
  }

  // 如果选中了某个指标，显示详情页
  if (selectedIndex) {
    return <IndexDetail index={selectedIndex} onBack={() => setSelectedIndex(null)} />
  }

  if (loading) {
    return (
      <div className="special-loading">
        <div className="loading-spinner" />
        <p>正在分析 DKT 数据...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="special-error">
        <p>❌ {error}</p>
      </div>
    )
  }

  // 高级功能偏侧化指标卡片
  const renderAdvancedLateralizationCard = (index: IndexResult, idx: number, type: 'spatial' | 'emotion' | 'face' | 'music' | 'tom' | 'logic' | 'math') => {
    const percent = getLateralizationPercent(index.value, type)
    const label = getAdvancedLateralizationLabel(index.value, type)
    const color = getLateralizationColor(percent)
    
    return (
      <div 
        key={idx} 
        className="index-card-clickable lateralization-card"
        onClick={() => setSelectedIndex(index)}
      >
        <div className="card-header">
          <span className="card-name">{index.nameCN}</span>
          <span 
            className="card-badge"
            style={{ background: color }}
          >
            {label}
          </span>
        </div>
        <div className="card-body">
          <div className="card-score">
            <span className="score-num">{index.value}</span>
            <span className="score-label">偏侧指数</span>
          </div>
        </div>
        <div className="lateralization-bar">
          <div className="lat-bar-left" style={{ width: `${100 - percent}%` }} />
          <div className="lat-bar-center" />
          <div className="lat-bar-right" style={{ width: `${percent}%` }} />
          <div 
            className="lat-bar-marker"
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="lateralization-labels">
          {type === 'spatial' ? (
            <>
              <span>左侧空间</span>
              <span>均衡</span>
              <span>右侧空间</span>
            </>
          ) : type === 'emotion' ? (
            <>
              <span>正性情绪</span>
              <span>均衡</span>
              <span>负性情绪</span>
            </>
          ) : type === 'face' ? (
            <>
              <span>分析型</span>
              <span>均衡</span>
              <span>整体型</span>
            </>
          ) : type === 'music' ? (
            <>
              <span>节奏型</span>
              <span>均衡</span>
              <span>旋律型</span>
            </>
          ) : type === 'tom' ? (
            <>
              <span>语言推理</span>
              <span>均衡</span>
              <span>直觉感知</span>
            </>
          ) : (
            <>
              <span>左脑</span>
              <span>均衡</span>
              <span>右脑</span>
            </>
          )}
        </div>
        <div className="card-footer">
          <span className="card-hint">点击查看详情</span>
          <span className="card-arrow">→</span>
        </div>
      </div>
    )
  }

  // 侧化指标卡片（左右脑偏向）
  const renderLateralizationCard = (index: IndexResult, idx: number, type: 'hand' | 'eye' | 'lang' | 'nostril') => {
    // 语言偏侧化使用不同的百分比计算
    const percent = getLateralizationPercent(index.value, type)
    const label = getLateralizationLabel(index.value, type)
    const color = getLateralizationColor(percent)
    
    return (
      <div 
        key={idx} 
        className="index-card-clickable lateralization-card"
        onClick={() => setSelectedIndex(index)}
      >
        <div className="card-header">
          <span className="card-name">{index.nameCN}</span>
          <span 
            className="card-badge"
            style={{ background: color }}
          >
            {label}
          </span>
        </div>
        <div className="card-body">
          <div className="card-score">
            <span className="score-num">{index.value}</span>
            <span className="score-label">偏侧指数</span>
          </div>
        </div>
        <div className="lateralization-bar">
          <div className="lat-bar-left" style={{ width: `${100 - percent}%` }} />
          <div className="lat-bar-center" />
          <div className="lat-bar-right" style={{ width: `${percent}%` }} />
          <div 
            className="lat-bar-marker"
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="lateralization-labels">
          {type === 'hand' ? (
            <>
              <span>左手</span>
              <span>双手</span>
              <span>右手</span>
            </>
          ) : type === 'eye' ? (
            <>
              <span>左眼</span>
              <span>均衡</span>
              <span>右眼</span>
            </>
          ) : type === 'nostril' ? (
            <>
              <span>左鼻</span>
              <span>均衡</span>
              <span>右鼻</span>
            </>
          ) : type === 'lang' ? (
            <>
              <span>左脑</span>
              <span>双侧</span>
              <span>右脑</span>
            </>
          ) : (
            <>
              <span>L侧</span>
              <span>均衡</span>
              <span>R侧</span>
            </>
          )}
        </div>
        <div className="card-footer">
          <span className="card-hint">点击查看详情</span>
          <span className="card-arrow">→</span>
        </div>
      </div>
    )
  }

  // 普通指标卡片
  const renderIndexCard = (index: IndexResult, idx: number) => (
    <div 
      key={idx} 
      className="index-card-clickable"
      onClick={() => setSelectedIndex(index)}
    >
      <div className="card-header">
        <span className="card-name">{index.nameCN}</span>
        <span 
          className="card-badge"
          style={{ background: getPercentileColor(index.percentile) }}
        >
          {getPercentileLabel(index.percentile)}
        </span>
      </div>
      <div className="card-body">
        <div className="card-score">
          <span className="score-num">{index.value}</span>
          <span className="score-label">z-score</span>
        </div>
        <div className="card-percentile">
          前<strong>{100 - index.percentile}%</strong>
        </div>
      </div>
      <div className="card-bar">
        <div 
          className="card-bar-fill"
          style={{ 
            width: `${index.percentile}%`,
            background: getPercentileColor(index.percentile)
          }}
        />
      </div>
      <div className="card-footer">
        <span className="card-hint">点击查看详情</span>
        <span className="card-arrow">→</span>
      </div>
    </div>
  )

  return (
    <div className="special-report">
      <header className="special-header">
        <h1>🔬 DKT 精细分区专业分析</h1>
        <p>基于 Desikan-Killiany-Tourville 图谱 | 点击卡片查看详情</p>
      </header>

      {analysis && (
        <>
          {/* 摘要 */}
          {(analysis.summary.topStrengths.length > 0 || analysis.summary.specialFeatures.length > 0 || analysis.summary.recommendations.length > 0) && (
            <section className="summary-section">
              <div className="summary-cards">
                {analysis.summary.topStrengths.length > 0 && (
                  <div className="summary-card strengths">
                    <h3>💪 突出优势</h3>
                    <ul>
                      {analysis.summary.topStrengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.summary.specialFeatures.length > 0 && (
                  <div className="summary-card features">
                    <h3>⭐ 特殊特征</h3>
                    <ul>
                      {analysis.summary.specialFeatures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.summary.recommendations.length > 0 && (
                  <div className="summary-card recommendations">
                    <h3>💡 个性化建议</h3>
                    <ul>
                      {analysis.summary.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 基础侧化指标: 惯用手(0), 主视眼(1), 主嗅鼻孔(2), 语言偏侧化(3) */}
          <section className="indices-section">
            <h2>🧠 基础侧化指标</h2>
            <p className="section-hint">蓝色 = 左侧优势 | 紫色 = 平衡 | 粉色 = 右侧优势</p>
            <div className="indices-grid">
              {renderLateralizationCard(analysis.indices[0], 0, 'hand')}
              {renderLateralizationCard(analysis.indices[1], 1, 'eye')}
              {renderLateralizationCard(analysis.indices[2], 2, 'nostril')}
              {renderLateralizationCard(analysis.indices[3], 3, 'lang')}
            </div>
          </section>

          {/* 高级功能偏侧化指标: 空间注意(4), 情绪加工(5), 面孔识别(6), 音乐感知(7), 心理理论(8), 逻辑推理(9), 数学能力(10) */}
          <section className="indices-section">
            <h2>🎭 高级功能偏侧化指标</h2>
            <p className="section-hint">基于 ENIGMA + UKBB + HCP 2024-2025 顶刊级参数 (n&gt;120,000+)</p>
            <div className="indices-grid">
              {renderAdvancedLateralizationCard(analysis.indices[4], 4, 'spatial')}
              {renderAdvancedLateralizationCard(analysis.indices[5], 5, 'emotion')}
              {renderAdvancedLateralizationCard(analysis.indices[6], 6, 'face')}
              {renderAdvancedLateralizationCard(analysis.indices[7], 7, 'music')}
              {renderAdvancedLateralizationCard(analysis.indices[8], 8, 'tom')}
              {renderAdvancedLateralizationCard(analysis.indices[9], 9, 'logic')}
              {renderAdvancedLateralizationCard(analysis.indices[10], 10, 'math')}
            </div>
          </section>

          {/* 感知指标: 嗅觉(11) */}
          <section className="indices-section">
            <h2>👃 感知功能指标</h2>
            <div className="indices-grid">
              {renderIndexCard(analysis.indices[11], 11)}
            </div>
          </section>

          {/* 语言指标: 语言综合(12), 阅读流畅(13), 阅读障碍风险(14) */}
          <section className="indices-section">
            <h2>📚 语言与阅读指标</h2>
            <div className="indices-grid">
              {renderIndexCard(analysis.indices[12], 12)}
              {renderIndexCard(analysis.indices[13], 13)}
              {renderIndexCard(analysis.indices[14], 14)}
            </div>
          </section>

          {/* 认知指标: 共情(15), 执行功能(16), 空间加工(17), 流体智力(18) */}
          <section className="indices-section">
            <h2>🎯 认知能力指标</h2>
            <div className="indices-grid">
              {analysis.indices.slice(15).map((index, idx) => renderIndexCard(index, idx + 15))}
            </div>
          </section>

          {/* 方法说明 */}
          <section className="method-section">
            <h2>📖 方法学说明</h2>
            <div className="method-content">
              <p><strong>数据来源:</strong> FreeSurfer 8.0 DKT Atlas</p>
              <p><strong>参考人群:</strong> 成年男性 (ENIGMA, UKBB, HCP 2022-2025, n&gt;120,000)</p>
              <p><strong>计算方法:</strong> 基于厚度、表面积、体积的加权 z-score</p>
              <p><strong>高级偏侧化指标:</strong> 基于 2024-2025 国际顶刊级 meta-analysis 参数</p>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
