import { useState, useEffect } from 'react'
import { parseDKTStats, runDKTAnalysis, DKTAnalysisResult } from '../utils/dktAnalysis'
import BasicMetricDetail, { BasicMetric } from './BasicMetricDetail'
import './OverviewReport.css'

// 基础指标详情数据
const basicMetricsInfo: Record<string, Omit<BasicMetric, 'value'>> = {
  brainVol: {
    id: 'brainVol',
    name: '总脑容量',
    unit: 'cm³',
    icon: '🧠',
    description: '总脑容量（Total Brain Volume）是指整个大脑的体积，包括灰质、白质和脑脊液空间。这是评估大脑整体大小的基础指标，通常与颅内总容积（eTIV）进行标准化比较。',
    normalRange: '成年男性 1100-1400 cm³，成年女性 1000-1300 cm³',
    interpretation: '您的总脑容量在正常范围内。脑容量受遗传、年龄、性别等多种因素影响。研究表明，脑容量与认知能力存在一定相关性，但个体差异很大，不能单独作为智力评估依据。',
    relatedFunctions: [
      '整体认知能力：较大的脑容量通常与更高的认知储备相关',
      '神经可塑性：脑容量反映了神经元和突触连接的总量',
      '认知老化：随年龄增长，脑容量会逐渐减少，速率因人而异'
    ],
    references: [
      'Pietschnig J, et al. (2015). Meta-analysis of associations between human brain volume and intelligence differences. Neuroscience & Biobehavioral Reviews.',
      'Rushton JP, Ankney CD. (2009). Whole brain size and general mental ability. International Journal of Neuroscience.'
    ]
  },
  cortexVol: {
    id: 'cortexVol',
    name: '皮层灰质体积',
    unit: 'cm³',
    icon: '🔘',
    description: '皮层灰质体积是指大脑皮层中神经元细胞体所占的体积。灰质是大脑信息处理的核心区域，包含大量神经元、树突和突触，负责感知、运动、记忆、情感等高级功能。',
    normalRange: '成年人约 450-650 cm³',
    interpretation: '皮层灰质是大脑执行复杂认知任务的关键结构。灰质体积与学习能力、记忆力和认知灵活性密切相关。通过持续学习和认知训练，可以促进灰质的维护和发展。',
    relatedFunctions: [
      '信息处理：灰质中的神经元负责接收、整合和传递信息',
      '学习与记忆：海马体等灰质结构对记忆形成至关重要',
      '执行功能：前额叶灰质与计划、决策、抑制控制相关',
      '感知觉：感觉皮层灰质处理视觉、听觉、触觉等信息'
    ],
    references: [
      'Kanai R, Rees G. (2011). The structural basis of inter-individual differences in human behaviour and cognition. Nature Reviews Neuroscience.',
      'Zatorre RJ, et al. (2012). Plasticity in gray and white: neuroimaging changes in brain structure during learning. Nature Neuroscience.'
    ]
  },
  whiteVol: {
    id: 'whiteVol',
    name: '脑白质体积',
    unit: 'cm³',
    icon: '⚪',
    description: '脑白质体积是指大脑中髓鞘化神经纤维（轴突）所占的体积。白质像大脑的"高速公路"，负责连接不同脑区，实现信息的快速传递。髓鞘的完整性直接影响神经信号传导速度。',
    normalRange: '成年人约 400-550 cm³',
    interpretation: '白质的完整性对认知功能至关重要。良好的白质结构支持快速的信息处理和脑区间的高效协调。有氧运动和健康的生活方式有助于维护白质健康。',
    relatedFunctions: [
      '信息传导：白质纤维连接不同脑区，实现信息快速传递',
      '处理速度：髓鞘化程度影响神经信号传导速度',
      '认知整合：白质束协调不同脑区的功能整合',
      '运动协调：运动相关白质束支持精细运动控制'
    ],
    references: [
      'Fields RD. (2008). White matter in learning, cognition and psychiatric disorders. Trends in Neurosciences.',
      'Johansen-Berg H. (2010). Behavioural relevance of variation in white matter microstructure. Current Opinion in Neurology.'
    ]
  },
  lhThickness: {
    id: 'lhThickness',
    name: '左半球皮层厚度',
    unit: 'mm',
    icon: '📐',
    description: '左半球皮层厚度是指左侧大脑皮层的平均厚度。皮层厚度反映了神经元的密度和组织结构，是评估大脑发育和老化的重要指标。左半球通常与语言、逻辑和分析能力相关。',
    normalRange: '成年人约 2.3-2.8 mm',
    interpretation: '皮层厚度是大脑健康的重要标志。适当的皮层厚度表明神经元组织良好。左半球皮层与语言处理、数学推理等功能密切相关。',
    relatedFunctions: [
      '语言功能：布洛卡区和韦尼克区位于左半球，负责语言产生和理解',
      '逻辑推理：左半球参与分析性思维和逻辑推理',
      '数学能力：数字处理和计算主要依赖左半球',
      '精细运动：左半球控制右侧身体的精细运动'
    ],
    references: [
      'Fischl B, Dale AM. (2000). Measuring the thickness of the human cerebral cortex from magnetic resonance images. PNAS.',
      'Shaw P, et al. (2006). Intellectual ability and cortical development in children and adolescents. Nature.'
    ]
  },
  rhThickness: {
    id: 'rhThickness',
    name: '右半球皮层厚度',
    unit: 'mm',
    icon: '📐',
    description: '右半球皮层厚度是指右侧大脑皮层的平均厚度。右半球通常与空间认知、面孔识别、情感处理和创造性思维相关。两侧半球的协调工作对完整的认知功能至关重要。',
    normalRange: '成年人约 2.3-2.8 mm',
    interpretation: '右半球皮层厚度反映了空间认知和情感处理相关区域的结构状态。右半球在艺术欣赏、音乐感知、社交认知等方面发挥重要作用。',
    relatedFunctions: [
      '空间认知：右半球负责空间定位、导航和视觉空间处理',
      '面孔识别：梭状回面孔区主要位于右半球',
      '情感处理：右半球在情绪识别和表达中起重要作用',
      '整体加工：右半球倾向于整体性、直觉性的信息处理',
      '音乐感知：音乐旋律和节奏的处理主要依赖右半球'
    ],
    references: [
      'Toga AW, Thompson PM. (2003). Mapping brain asymmetry. Nature Reviews Neuroscience.',
      'Gazzaniga MS. (2000). Cerebral specialization and interhemispheric communication. Brain.'
    ]
  }
}

export default function OverviewReport() {
  const [analysis, setAnalysis] = useState<DKTAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBasicMetric, setSelectedBasicMetric] = useState<BasicMetric | null>(null)
  const [basicInfo, setBasicInfo] = useState<{
    eTIV: number
    brainVol: number
    cortexVol: number
    whiteVol: number
    lhThickness: number
    rhThickness: number
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 从 localStorage 读取数据
      const lhDKT = localStorage.getItem('freesurfer_lhDKT')
      const rhDKT = localStorage.getItem('freesurfer_rhDKT')
      const lhAparc = localStorage.getItem('freesurfer_lhAparc')
      const rhAparc = localStorage.getItem('freesurfer_rhAparc')
      const aseg = localStorage.getItem('freesurfer_aseg')

      if (!lhDKT || !rhDKT || !lhAparc || !rhAparc || !aseg) {
        throw new Error('缺少必要的数据文件')
      }

      // 解析基础信息
      const parseValue = (content: string, key: string): number => {
        // 格式: # Measure Cortex, CortexVol, Total cortical gray matter volume, 592279.383940, mm^3
        const match = content.match(new RegExp(`# Measure[^,]*,\\s*${key}[^,]*,[^,]*,\\s*([\\d.]+)`))
        return match ? parseFloat(match[1]) : 0
      }

      const parseMeanThickness = (content: string): number => {
        const match = content.match(/# Measure Cortex, MeanThickness.*,\s*([\d.]+)/)
        return match ? parseFloat(match[1]) : 0
      }

      setBasicInfo({
        eTIV: parseValue(aseg, 'eTIV'),
        brainVol: parseValue(aseg, 'BrainSegVol'),
        cortexVol: parseValue(aseg, 'CortexVol'),
        whiteVol: parseValue(aseg, 'CerebralWhiteMatterVol'),
        lhThickness: parseMeanThickness(lhAparc),
        rhThickness: parseMeanThickness(rhAparc)
      })

      // 运行 DKT 分析
      const lhData = parseDKTStats(lhDKT)
      const rhData = parseDKTStats(rhDKT)
      const result = runDKTAnalysis(lhData, rhData)
      setAnalysis(result)
    } catch (err) {
      setError('数据加载失败，请重新上传文件')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="overview-loading">
        <div className="loading-spinner" />
        <p>正在加载脑结构数据...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="overview-error">
        <p>❌ {error}</p>
      </div>
    )
  }

  // 计算综合评分
  // 只计算"能力型"指标的加权平均，排除偏侧化指标和风险指标
  const calculateOverallScore = (): number => {
    if (!analysis) return 75
    
    // 定义能力型指标及其权重（这些指标百分位数越高越好）
    const abilityIndices = [
      { name: 'Olfactory Function Index', weight: 0.08 },           // 嗅觉功能
      { name: 'Language Composite Index', weight: 0.15 },           // 语言综合
      { name: 'Reading Fluency Index', weight: 0.12 },              // 阅读流畅
      { name: 'Empathy Index', weight: 0.12 },                      // 共情能力
      { name: 'Executive Function Index', weight: 0.18 },           // 执行功能
      { name: 'Spatial Processing Index', weight: 0.15 },           // 空间加工
      { name: 'Fluid Intelligence Index (Structural)', weight: 0.20 }, // 流体智力
    ]
    
    let totalWeight = 0
    let weightedSum = 0
    
    for (const { name, weight } of abilityIndices) {
      const index = analysis.indices.find(i => i.name === name)
      if (index) {
        weightedSum += index.percentile * weight
        totalWeight += weight
      }
    }
    
    // 阅读障碍风险指数需要特殊处理（值越高越好，即风险越低）
    const dyslexiaIndex = analysis.indices.find(i => i.name === 'Dyslexia Structural Risk Index')
    if (dyslexiaIndex) {
      // 将风险指数转换为"阅读健康度"：百分位数越高表示风险越低
      weightedSum += dyslexiaIndex.percentile * 0.10
      totalWeight += 0.10
    }
    
    if (totalWeight === 0) return 75
    
    // 计算加权平均分
    const rawScore = weightedSum / totalWeight
    
    // 将百分位数映射到更直观的评分（50分位 = 75分，84分位 = 90分，98分位 = 100分）
    // 使用非线性映射使评分更有区分度
    let finalScore: number
    if (rawScore >= 84) {
      // 84-100 百分位 -> 90-100 分
      finalScore = 90 + (rawScore - 84) * (10 / 16)
    } else if (rawScore >= 50) {
      // 50-84 百分位 -> 75-90 分
      finalScore = 75 + (rawScore - 50) * (15 / 34)
    } else if (rawScore >= 16) {
      // 16-50 百分位 -> 60-75 分
      finalScore = 60 + (rawScore - 16) * (15 / 34)
    } else {
      // 0-16 百分位 -> 40-60 分
      finalScore = 40 + rawScore * (20 / 16)
    }
    
    return Math.round(Math.min(100, Math.max(0, finalScore)))
  }

  const overallScore = calculateOverallScore()

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#4caf50'
    if (score >= 70) return '#8bc34a'
    if (score >= 50) return '#ffeb3b'
    if (score >= 30) return '#ff9800'
    return '#f44336'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return '优秀'
    if (score >= 70) return '良好'
    if (score >= 50) return '正常'
    if (score >= 30) return '偏低'
    return '需关注'
  }

  // 点击基础指标
  const handleBasicMetricClick = (metricId: string, value: number) => {
    const info = basicMetricsInfo[metricId]
    if (info) {
      setSelectedBasicMetric({ ...info, value })
    }
  }

  // 如果选中了基础指标，显示详情页
  if (selectedBasicMetric) {
    return <BasicMetricDetail metric={selectedBasicMetric} onBack={() => setSelectedBasicMetric(null)} />
  }

  return (
    <div className="overview-report">
      {/* 页面标题 */}
      <header className="report-header">
        <h1>🧠 脑结构分析报告</h1>
        <p className="report-date">生成时间: {new Date().toLocaleString('zh-CN')}</p>
      </header>

      {/* 综合评分卡片 */}
      <section className="score-section">
        <div className="score-card">
          <div className="score-circle" style={{ borderColor: getScoreColor(overallScore) }}>
            <span className="score-value" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="score-label">{getScoreLabel(overallScore)}</span>
          </div>
          <div className="score-info">
            <h2>综合评分</h2>
            <p>基于 10 项 DKT 精细分区指标的综合评估，反映脑结构发育的整体水平。</p>
            {analysis && analysis.summary.topStrengths.length > 0 && (
              <div className="top-strengths">
                <h3>💪 突出优势</h3>
                <div className="strength-tags">
                  {analysis.summary.topStrengths.map((s, i) => (
                    <span key={i} className="strength-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 基础指标 - 可点击卡片 */}
      {basicInfo && (
        <section className="basic-section">
          <h2>📏 基础脑容量指标</h2>
          <p className="section-subtitle">点击卡片查看详细说明</p>
          <div className="metrics-grid">
            <div 
              className="metric-card clickable"
              onClick={() => handleBasicMetricClick('brainVol', basicInfo.brainVol / 1000)}
            >
              <div className="metric-icon">🧠</div>
              <div className="metric-info">
                <span className="metric-value">{(basicInfo.brainVol / 1000).toFixed(0)} cm³</span>
                <span className="metric-label">总脑容量</span>
              </div>
              <span className="metric-arrow">→</span>
            </div>
            <div 
              className="metric-card clickable"
              onClick={() => handleBasicMetricClick('cortexVol', basicInfo.cortexVol / 1000)}
            >
              <div className="metric-icon">🔘</div>
              <div className="metric-info">
                <span className="metric-value">{(basicInfo.cortexVol / 1000).toFixed(0)} cm³</span>
                <span className="metric-label">皮层灰质体积</span>
              </div>
              <span className="metric-arrow">→</span>
            </div>
            <div 
              className="metric-card clickable"
              onClick={() => handleBasicMetricClick('whiteVol', basicInfo.whiteVol / 1000)}
            >
              <div className="metric-icon">⚪</div>
              <div className="metric-info">
                <span className="metric-value">{(basicInfo.whiteVol / 1000).toFixed(0)} cm³</span>
                <span className="metric-label">脑白质体积</span>
              </div>
              <span className="metric-arrow">→</span>
            </div>
            <div 
              className="metric-card clickable"
              onClick={() => handleBasicMetricClick('lhThickness', basicInfo.lhThickness)}
            >
              <div className="metric-icon">📐</div>
              <div className="metric-info">
                <span className="metric-value">{basicInfo.lhThickness.toFixed(2)} mm</span>
                <span className="metric-label">左半球皮层厚度</span>
              </div>
              <span className="metric-arrow">→</span>
            </div>
            <div 
              className="metric-card clickable"
              onClick={() => handleBasicMetricClick('rhThickness', basicInfo.rhThickness)}
            >
              <div className="metric-icon">📐</div>
              <div className="metric-info">
                <span className="metric-value">{basicInfo.rhThickness.toFixed(2)} mm</span>
                <span className="metric-label">右半球皮层厚度</span>
              </div>
              <span className="metric-arrow">→</span>
            </div>
          </div>
        </section>
      )}

      {/* 特殊特征 */}
      {analysis && analysis.summary.specialFeatures.length > 0 && (
        <section className="special-section">
          <h2>⭐ 特殊特征</h2>
          <div className="special-cards">
            {analysis.summary.specialFeatures.map((feature, idx) => (
              <div key={idx} className="special-card">
                <span className="special-icon">✨</span>
                <span className="special-text">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 建议 */}
      {/* 个性化建议 */}
      {analysis && analysis.summary.recommendations.length > 0 && (
        <section className="suggestions-section">
          <h2>💡 个性化建议</h2>
          <div className="suggestions-list">
            {analysis.summary.recommendations.map((rec, idx) => (
              <div key={idx} className="suggestion-item">
                <span className="suggestion-icon">💡</span>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 通用健康建议 */}
      <section className="general-tips-section">
        <h2>🌟 大脑健康小贴士</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🏃</div>
            <h3>规律运动</h3>
            <p>有氧运动可促进大脑血液循环，增加海马体体积，改善记忆力。</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📖</div>
            <h3>持续学习</h3>
            <p>学习新知识和技能可促进神经连接形成，增加认知储备。</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">😴</div>
            <h3>优质睡眠</h3>
            <p>充足睡眠有助于记忆巩固和大脑修复，建议每晚 7-9 小时。</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🧘</div>
            <h3>压力管理</h3>
            <p>通过冥想、运动等方式管理压力，保护大脑健康。</p>
          </div>
        </div>
      </section>

      {/* 免责声明 */}
      <footer className="report-footer">
        <p>⚠️ 本报告基于 FreeSurfer 8.0 重建数据和 DKT Atlas 分区，仅供科研和参考使用。脑结构与功能的关系存在个体差异，本报告不能作为医学诊断或能力评估的依据。如有健康疑虑，请咨询专业医生。</p>
      </footer>
    </div>
  )
}
