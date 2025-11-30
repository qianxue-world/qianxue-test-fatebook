import { IndexResult } from '../utils/dktAnalysis'
import './IndexDetail.css'

interface Props {
  index: IndexResult
  onBack: () => void
}

// 基础侧化指标名称列表
const BASIC_LATERALIZATION_INDICES = [
  'Handedness Index',
  'Dominant Eye Index',
  'Preferred Nostril Index',
  'Language Lateralization Index'
]

// 高级功能偏侧化指标名称列表
const ADVANCED_LATERALIZATION_INDICES = [
  'Spatial Attention Lateralization Index',
  'Emotion Processing Lateralization Index',
  'Face Recognition Lateralization Index',
  'Music Perception Lateralization Index',
  'Theory of Mind Lateralization Index',
  'Logical Reasoning Lateralization Index',
  'Mathematical Ability Lateralization Index'
]

// 所有侧化指标
const ALL_LATERALIZATION_INDICES = [...BASIC_LATERALIZATION_INDICES, ...ADVANCED_LATERALIZATION_INDICES]

export default function IndexDetail({ index, onBack }: Props) {
  const isLateralizationIndex = ALL_LATERALIZATION_INDICES.includes(index.name)

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

  // 侧化指标的百分比计算 - 根据不同指标类型使用不同的阈值范围
  const getLateralizationPercent = (value: number): number => {
    let leftExtreme: number, rightExtreme: number
    
    switch (index.name) {
      case 'Handedness Index':
        leftExtreme = -1.28; rightExtreme = 1.28
        break
      case 'Dominant Eye Index':
        leftExtreme = -1.5; rightExtreme = 1.5
        break
      case 'Preferred Nostril Index':
        leftExtreme = -1.2; rightExtreme = 1.2
        break
      case 'Language Lateralization Index':
        // 语言偏侧化：正值=左脑优势，负值=右脑优势
        // 进度条标签是：左脑 | 双侧 | 右脑，需要反转
        leftExtreme = 0.20; rightExtreme = -0.15
        break
      case 'Spatial Attention Lateralization Index':
        leftExtreme = -0.40; rightExtreme = 0.80
        break
      case 'Emotion Processing Lateralization Index':
        leftExtreme = -0.50; rightExtreme = 0.90
        break
      case 'Face Recognition Lateralization Index':
        leftExtreme = -0.60; rightExtreme = 1.00
        break
      case 'Music Perception Lateralization Index':
        leftExtreme = -0.70; rightExtreme = 1.20
        break
      case 'Theory of Mind Lateralization Index':
        leftExtreme = -0.40; rightExtreme = 0.80
        break
      case 'Logical Reasoning Lateralization Index':
        leftExtreme = -0.80; rightExtreme = 0.50
        break
      case 'Mathematical Ability Lateralization Index':
        leftExtreme = -0.90; rightExtreme = 0.40
        break
      default:
        leftExtreme = -2; rightExtreme = 2
    }
    
    const range = rightExtreme - leftExtreme
    const percent = ((value - leftExtreme) / range) * 100
    return Math.max(0, Math.min(100, percent))
  }

  // 侧化指标的颜色
  const getLateralizationColor = (percent: number): string => {
    if (percent >= 70) return '#e91e63'
    if (percent >= 60) return '#f48fb1'
    if (percent >= 40) return '#9c27b0'
    if (percent >= 30) return '#7986cb'
    return '#3f51b5'
  }

  // 侧化指标的标签
  const getLateralizationLabel = (): string => {
    const value = index.value
    if (index.name === 'Handedness Index') {
      if (value >= 1.28) return '极纯右利手'
      if (value >= 0.84) return '强右利手'
      if (value >= 0.52) return '中等右利手'
      if (value >= -0.52) return '双手协调'
      if (value >= -0.84) return '中等左利手'
      return '强左利手'
    } else if (index.name === 'Dominant Eye Index') {
      if (value >= 1.5) return '极强右眼'
      if (value >= 0.8) return '明显右眼'
      if (value >= 0.3) return '轻度右眼'
      if (value >= -0.3) return '双眼均衡'
      if (value >= -0.8) return '轻度左眼'
      return '明显左眼'
    } else if (index.name === 'Preferred Nostril Index') {
      if (value >= 1.2) return '极强右鼻孔'
      if (value >= 0.7) return '明显右鼻孔'
      if (value >= 0.3) return '轻度右鼻孔'
      if (value >= -0.3) return '双鼻孔均衡'
      if (value >= -0.7) return '轻度左鼻孔'
      if (value >= -1.2) return '明显左鼻孔'
      return '极强左鼻孔'
    } else if (index.name === 'Language Lateralization Index') {
      if (value >= 0.20) return '典型左侧化'
      if (value >= 0.05) return '弱左侧化'
      if (value >= -0.05) return '双侧化'
      if (value >= -0.15) return '弱右侧化'
      return '显著右侧化'
    } else if (index.name === 'Spatial Attention Lateralization Index') {
      if (value >= 0.80) return '极强右偏'
      if (value >= 0.40) return '明显右偏'
      if (value >= -0.20) return '均衡'
      if (value >= -0.40) return '轻度左偏'
      return '明显左偏'
    } else if (index.name === 'Emotion Processing Lateralization Index') {
      if (value >= 0.90) return '极强右偏'
      if (value >= 0.50) return '明显右偏'
      if (value >= -0.30) return '均衡'
      if (value >= -0.50) return '轻度左偏'
      return '左偏(抑郁倾向)'
    } else if (index.name === 'Face Recognition Lateralization Index') {
      if (value >= 1.00) return '极强右偏'
      if (value >= 0.60) return '明显右偏'
      if (value >= -0.20) return '均衡'
      if (value >= -0.60) return '轻度左偏'
      return '罕见左偏'
    } else if (index.name === 'Music Perception Lateralization Index') {
      if (value >= 1.20) return '极强右偏'
      if (value >= 0.70) return '明显右偏'
      if (value >= -0.30) return '均衡'
      if (value >= -0.70) return '轻度左偏'
      return '罕见左偏'
    } else if (index.name === 'Theory of Mind Lateralization Index') {
      if (value >= 0.80) return '极强右偏'
      if (value >= 0.40) return '明显右偏'
      if (value >= -0.20) return '均衡'
      if (value >= -0.40) return '轻度左偏'
      return '明显左偏'
    } else if (index.name === 'Logical Reasoning Lateralization Index') {
      // 逻辑推理：负值=左脑优势
      if (value <= -0.80) return '极强左脑'
      if (value <= -0.50) return '显著左脑'
      if (value <= -0.20) return '轻度左脑'
      if (value <= 0.20) return '均衡'
      if (value <= 0.50) return '右脑优势'
      return '显著右脑'
    } else if (index.name === 'Mathematical Ability Lateralization Index') {
      // 数学能力：负值=左脑优势
      if (value <= -0.90) return '极强左脑'
      if (value <= -0.60) return '显著左脑'
      if (value <= -0.20) return '轻度左脑'
      if (value <= 0.20) return '均衡'
      if (value <= 0.40) return '右脑优势'
      return '显著右脑'
    }
    // 默认
    return '均衡'
  }

  const lateralizationPercent = isLateralizationIndex ? getLateralizationPercent(index.value) : 0
  const lateralizationColor = isLateralizationIndex ? getLateralizationColor(lateralizationPercent) : ''

  return (
    <div className="index-detail-page">
      <button className="back-button" onClick={onBack}>
        ← 返回
      </button>

      <header className="detail-header">
        <h1>{index.nameCN}</h1>
        <p className="detail-name-en">{index.name}</p>
      </header>

      {/* 核心数值 */}
      <section className="detail-score-section">
        {isLateralizationIndex ? (
          <>
            <div className="score-display">
              <div className="score-main">
                <span className="score-number">{index.value}</span>
                <span className="score-unit">偏侧指数</span>
              </div>
              <div className="score-percentile">
                <span 
                  className="percentile-label"
                  style={{ background: lateralizationColor }}
                >
                  {getLateralizationLabel()}
                </span>
              </div>
            </div>
            <div className="lateralization-bar-large">
              <div className="lat-bar-track">
                <div className="lat-bar-center-line" />
                <div 
                  className="lat-bar-marker"
                  style={{ left: `${lateralizationPercent}%` }}
                />
              </div>
              <div className="lat-bar-labels">
                {index.name === 'Logical Reasoning Lateralization Index' || index.name === 'Mathematical Ability Lateralization Index' ? (
                  <>
                    <span className="lat-label-left">左脑</span>
                    <span className="lat-label-center">均衡</span>
                    <span className="lat-label-right">右脑</span>
                  </>
                ) : index.name === 'Handedness Index' ? (
                  <>
                    <span className="lat-label-left">左手</span>
                    <span className="lat-label-center">双手</span>
                    <span className="lat-label-right">右手</span>
                  </>
                ) : index.name === 'Dominant Eye Index' ? (
                  <>
                    <span className="lat-label-left">左眼</span>
                    <span className="lat-label-center">均衡</span>
                    <span className="lat-label-right">右眼</span>
                  </>
                ) : index.name === 'Preferred Nostril Index' ? (
                  <>
                    <span className="lat-label-left">左鼻</span>
                    <span className="lat-label-center">均衡</span>
                    <span className="lat-label-right">右鼻</span>
                  </>
                ) : index.name === 'Language Lateralization Index' ? (
                  <>
                    <span className="lat-label-left">左脑</span>
                    <span className="lat-label-center">双侧</span>
                    <span className="lat-label-right">右脑</span>
                  </>
                ) : (
                  <>
                    <span className="lat-label-left">L侧</span>
                    <span className="lat-label-center">均衡</span>
                    <span className="lat-label-right">R侧</span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="score-display">
              <div className="score-main">
                <span className="score-number">{index.value}</span>
                <span className="score-unit">z-score</span>
              </div>
              <div className="score-percentile">
                <div 
                  className="percentile-circle"
                  style={{ borderColor: getPercentileColor(index.percentile) }}
                >
                  <span style={{ color: getPercentileColor(index.percentile) }}>
                    前{100 - index.percentile}%
                  </span>
                </div>
                <span 
                  className="percentile-label"
                  style={{ background: getPercentileColor(index.percentile) }}
                >
                  {getPercentileLabel(index.percentile)}
                </span>
              </div>
            </div>
            <div className="percentile-bar-large">
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${index.percentile}%`,
                    background: getPercentileColor(index.percentile)
                  }}
                />
                <div 
                  className="bar-marker"
                  style={{ left: `${index.percentile}%` }}
                />
              </div>
              <div className="bar-labels">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 解读 */}
      <section className="detail-section">
        <h2>📝 结果解读</h2>
        <div className="interpretation-box">
          <p>{index.interpretation}</p>
        </div>
      </section>

      {/* 阈值标准 */}
      <section className="detail-section">
        <h2>📊 阈值标准</h2>
        <div className="threshold-box">
          <code>{index.threshold}</code>
        </div>
      </section>

      {/* 计算方法 */}
      <section className="detail-section">
        <h2>🔬 计算方法</h2>
        <div className="method-box">
          <div className="method-item">
            <span className="method-label">计算公式:</span>
            <code className="formula">{index.formula}</code>
          </div>
          <div className="method-item">
            <span className="method-label">指标权重:</span>
            <span>{index.weights}</span>
          </div>
        </div>
      </section>

      {/* 涉及脑区 */}
      <section className="detail-section">
        <h2>🧠 涉及脑区</h2>
        <div className="regions-list">
          {index.regions.map((r, i) => (
            <span key={i} className="region-chip">{r}</span>
          ))}
        </div>
      </section>

      {/* Z-Score 详情表格 */}
      {index.details && index.details.length > 0 && (
        <section className="detail-section">
          <h2>📋 各区域 Z-Score 详情</h2>
          <div className="table-container">
            <table className="zscore-table">
              <thead>
                <tr>
                  <th>脑区</th>
                  <th>权重</th>
                  <th>左侧 z</th>
                  <th>右侧 z</th>
                  <th>左贡献</th>
                  <th>右贡献</th>
                  <th>厚:表:体</th>
                </tr>
              </thead>
              <tbody>
                {index.details.map((d, i) => (
                  <tr key={i}>
                    <td className="region-name">{d.region}</td>
                    <td>{(d.regionWeight * 100).toFixed(0)}%</td>
                    <td className={d.zL > 0 ? 'positive' : d.zL < 0 ? 'negative' : ''}>
                      {d.zL.toFixed(3)}
                    </td>
                    <td className={d.zR > 0 ? 'positive' : d.zR < 0 ? 'negative' : ''}>
                      {d.zR.toFixed(3)}
                    </td>
                    <td>{d.contribL.toFixed(3)}</td>
                    <td>{d.contribR.toFixed(3)}</td>
                    <td className="weights-cell">{d.weightsUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">
            💡 z-score 表示与参考人群平均值的标准差距离。正值表示高于平均，负值表示低于平均。
          </p>
        </section>
      )}

      {/* 参考文献 */}
      <section className="detail-section">
        <h2>📚 参考文献</h2>
        <div className="references-list">
          {index.references.map((r, i) => (
            <div key={i} className="reference-item">
              <span className="ref-number">[{i + 1}]</span>
              <span className="ref-text">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 免责声明 */}
      <footer className="detail-footer">
        <p>⚠️ 本指标基于脑结构数据的统计推断，仅供科研和参考使用。实际能力需要通过行为测试来确认。</p>
      </footer>
    </div>
  )
}
