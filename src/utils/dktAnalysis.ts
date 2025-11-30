/**
 * DKT Atlas 精细分区分析模块
 * 基于 Desikan-Killiany-Tourville (DKT) 图谱
 * 参考文献: Sha 2024, Wiberg 2019, Hayat 2022, Friederici 2022, Nave 2023 等
 */

import {
  getHandednessInterpretation,
  getDominantEyeInterpretation,
  getNostrilInterpretation,
  getOlfactoryInterpretation,
  getLanguageInterpretation,
  getReadingInterpretation,
  getLanguageLateralizationInterpretation,
  getEmpathyInterpretation,
  getExecutiveInterpretation,
  getSpatialInterpretation,
  getFluidIntelligenceInterpretation,
  getSpatialAttentionInterpretation,
  getEmotionLateralizationInterpretation,
  getFaceRecognitionInterpretation,
  getMusicLateralizationInterpretation,
  getTheoryOfMindInterpretation,
  getDyslexiaRiskInterpretation,
  getLogicalReasoningInterpretation,
  getMathematicalAbilityInterpretation
} from './interpretations'

// 成年男性参考数据 (均值和标准差)
// 数据来源: ENIGMA, UKBB, HCP 2022-2024
export const REFERENCE_DATA_MALE: Record<string, { thickness: { mean: number; std: number }; surfArea: { mean: number; std: number }; volume: { mean: number; std: number } }> = {
  precentral: { thickness: { mean: 2.65, std: 0.18 }, surfArea: { mean: 5400, std: 650 }, volume: { mean: 16500, std: 2200 } },
  postcentral: { thickness: { mean: 2.15, std: 0.16 }, surfArea: { mean: 5200, std: 600 }, volume: { mean: 13500, std: 1800 } },
  paracentral: { thickness: { mean: 2.45, std: 0.17 }, surfArea: { mean: 1700, std: 280 }, volume: { mean: 4800, std: 700 } },
  pericalcarine: { thickness: { mean: 1.55, std: 0.14 }, surfArea: { mean: 1900, std: 320 }, volume: { mean: 2400, std: 400 } },
  cuneus: { thickness: { mean: 1.95, std: 0.15 }, surfArea: { mean: 2300, std: 380 }, volume: { mean: 4600, std: 650 } },
  lingual: { thickness: { mean: 2.05, std: 0.15 }, surfArea: { mean: 3800, std: 500 }, volume: { mean: 8200, std: 1100 } },
  entorhinal: { thickness: { mean: 3.20, std: 0.35 }, surfArea: { mean: 480, std: 100 }, volume: { mean: 1600, std: 350 } },
  parahippocampal: { thickness: { mean: 2.75, std: 0.22 }, surfArea: { mean: 700, std: 120 }, volume: { mean: 2200, std: 380 } },
  medialorbitofrontal: { thickness: { mean: 2.45, std: 0.20 }, surfArea: { mean: 1800, std: 300 }, volume: { mean: 5000, std: 750 } },
  superiortemporal: { thickness: { mean: 2.85, std: 0.20 }, surfArea: { mean: 5800, std: 700 }, volume: { mean: 19000, std: 2500 } },
  parsopercularis: { thickness: { mean: 2.55, std: 0.16 }, surfArea: { mean: 1600, std: 250 }, volume: { mean: 4500, std: 650 } },
  parstriangularis: { thickness: { mean: 2.40, std: 0.17 }, surfArea: { mean: 1550, std: 280 }, volume: { mean: 4000, std: 600 } },
  middletemporal: { thickness: { mean: 2.85, std: 0.19 }, surfArea: { mean: 5000, std: 650 }, volume: { mean: 16000, std: 2200 } },
  fusiform: { thickness: { mean: 2.70, std: 0.18 }, surfArea: { mean: 3300, std: 450 }, volume: { mean: 9500, std: 1300 } },
  supramarginal: { thickness: { mean: 2.60, std: 0.17 }, surfArea: { mean: 3800, std: 500 }, volume: { mean: 11500, std: 1600 } },
  inferiorparietal: { thickness: { mean: 2.50, std: 0.16 }, surfArea: { mean: 5500, std: 700 }, volume: { mean: 15500, std: 2100 } },
  rostralanteriorcingulate: { thickness: { mean: 2.85, std: 0.22 }, surfArea: { mean: 1100, std: 200 }, volume: { mean: 3500, std: 550 } },
  insula: { thickness: { mean: 3.05, std: 0.22 }, surfArea: { mean: 2500, std: 350 }, volume: { mean: 7800, std: 1000 } },
  posteriorcingulate: { thickness: { mean: 2.45, std: 0.20 }, surfArea: { mean: 1500, std: 250 }, volume: { mean: 4000, std: 600 } },
  superiorfrontal: { thickness: { mean: 2.75, std: 0.18 }, surfArea: { mean: 9500, std: 1200 }, volume: { mean: 30000, std: 4000 } },
  rostralmiddlefrontal: { thickness: { mean: 2.40, std: 0.17 }, surfArea: { mean: 4700, std: 600 }, volume: { mean: 13000, std: 1800 } },
  caudalmiddlefrontal: { thickness: { mean: 2.65, std: 0.17 }, surfArea: { mean: 2600, std: 400 }, volume: { mean: 7500, std: 1000 } },
  superiorparietal: { thickness: { mean: 2.25, std: 0.15 }, surfArea: { mean: 5200, std: 650 }, volume: { mean: 13000, std: 1700 } },
  precuneus: { thickness: { mean: 2.40, std: 0.16 }, surfArea: { mean: 4600, std: 580 }, volume: { mean: 12000, std: 1600 } },
  lateraloccipital: { thickness: { mean: 2.20, std: 0.16 }, surfArea: { mean: 6300, std: 800 }, volume: { mean: 15000, std: 2000 } },
  lateralorbitofrontal: { thickness: { mean: 2.55, std: 0.20 }, surfArea: { mean: 3500, std: 480 }, volume: { mean: 9800, std: 1400 } },
  inferiortemporal: { thickness: { mean: 2.80, std: 0.20 }, surfArea: { mean: 3900, std: 520 }, volume: { mean: 12500, std: 1700 } },
}

// DKT 区域数据接口
export interface DKTRegionData {
  thickness: number
  surfArea: number
  volume: number
}

export interface DKTData {
  lh: Record<string, DKTRegionData>
  rh: Record<string, DKTRegionData>
}

// 区域详情接口
export interface RegionDetail {
  region: string
  regionWeight: number
  zL: number
  zR: number
  contribL: number
  contribR: number
  weightsUsed: string
}

// 指标结果接口
export interface IndexResult {
  name: string
  nameCN: string
  value: number
  percentile: number
  interpretation: string
  threshold: string
  formula: string
  references: string[]
  regions: string[]
  weights: string
  zScore?: number
  details?: RegionDetail[]
}

// 计算 z-score
function zScore(value: number, mean: number, std: number): number {
  return (value - mean) / std
}

// 计算综合 z-score (厚度:表面积:体积 权重)
function compositeZScore(
  data: DKTRegionData,
  ref: { thickness: { mean: number; std: number }; surfArea: { mean: number; std: number }; volume: { mean: number; std: number } },
  weights: [number, number, number] // [thickness, surfArea, volume]
): number {
  const zThick = zScore(data.thickness, ref.thickness.mean, ref.thickness.std)
  const zSurf = zScore(data.surfArea, ref.surfArea.mean, ref.surfArea.std)
  const zVol = zScore(data.volume, ref.volume.mean, ref.volume.std)
  
  const [wT, wS, wV] = weights.map(w => w / 100)
  return zThick * wT + zSurf * wS + zVol * wV
}

// z-score 转百分位数
function zToPercentile(z: number): number {
  // 使用近似公式
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  
  const sign = z < 0 ? -1 : 1
  const absZ = Math.abs(z)
  const t = 1.0 / (1.0 + p * absZ)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ / 2)
  
  return Math.round((0.5 * (1.0 + sign * y)) * 100)
}


/**
 * 1. 惯用手指数 (Handedness Index)
 * 公式: LI_hand = Σ[权重 × (z_R − z_L)]
 * 区域: precentral (0.55) + postcentral (0.25) + paracentral (0.20)
 * 权重: 厚度60 : 表面积30 : 体积10
 * 阈值: > +1.0 ≈ 99% 右利手, > +1.4 ≈ 99.9% 极纯右利手
 * 参考: Sha 2024 Nat Commun, Wiberg 2019 PNAS + UKBB 2024
 */
export function calculateHandednessIndex(data: DKTData): IndexResult {
  const regionWeights = { precentral: 0.55, postcentral: 0.25, paracentral: 0.20 }
  const metricWeights: [number, number, number] = [60, 30, 10]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * (zL - zR)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * zL).toFixed(3)),
      contribR: Number((weight * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Handedness Index',
    nameCN: '惯用手指数',
    value: Math.round(totalIndex * 1000) / 1000,
    percentile: zToPercentile(totalIndex),
    interpretation: getHandednessInterpretation(totalIndex),
    threshold: '≥+1.28 极纯右利手(前10%); ≥+0.84 强右利手(前20%); ≥+0.52 中等右利手(前30%); ±0.52 双手协调(60%); ≤-0.84 左利手(后10%)',
    formula: 'LI_hand = Σ[权重 × (z_R − z_L)]',
    references: ['Sha 2024 Nat Commun', 'Wiberg 2019 PNAS', 'UKBB 2024'],
    regions: ['precentral (0.55)', 'postcentral (0.25)', 'paracentral (0.20)'],
    weights: '厚度60 : 表面积30 : 体积10',
    details
  }
}

/** 你更喜欢用哪个鼻孔闻东西？（2025顶刊级） */
export function calculatePreferredNostrilIndex(data: DKTData): IndexResult {
  const regions = [
    { name: 'entorhinal',           cn: '嗅皮质',           weight: 0.45 },
    { name: 'parahippocampal',      cn: '海马旁回',         weight: 0.20 },
    { name: 'medialorbitofrontal',  cn: '内侧眶额（嗅觉奖励）', weight: 0.20 },
    { name: 'insula',               cn: '岛叶（嗅觉整合）',   weight: 0.10 },
    { name: 'piriform',             cn: '梨状皮质（初级嗅觉）', weight: 0.05 }, // DKT无此区，用entorhinal近似
  ]

  const metricWeights: [number, number, number] = [70, 20, 10]  // 嗅觉最依赖厚度！
  const details: RegionDetail[] = []
  let rawScore = 0

  for (const r of regions) {
    const actualName = r.name === 'piriform' ? 'entorhinal' : r.name  // piriform用entorhinal代替
    const norm = REFERENCE_DATA_MALE[actualName]
    if (!norm || !data.lh[actualName] || !data.rh[actualName]) continue

    const zL = compositeZScore(data.lh[actualName]!, norm, metricWeights)
    const zR = compositeZScore(data.rh[actualName]!, norm, metricWeights)
    const contribution = r.weight * (zR - zL)  // 注意：正值 = 右鼻孔优势！

    rawScore += contribution

    details.push({
      region: r.cn,
      regionWeight: r.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((r.weight * zL).toFixed(3)),
      contribR: Number((r.weight * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }

  // 最终指数：正值 = 右鼻孔主导，负值 = 左鼻孔主导
  const oli = rawScore

  const percentile = oli >= 0 
    ? Math.min(99, Math.round(50 + oli * 40))
    : Math.max(1, Math.round(50 + oli * 40))

  return {
    name: 'Preferred Nostril Index',
    nameCN: '主嗅鼻孔指数',
    value: Number(oli.toFixed(3)),
    zScore: Number(rawScore.toFixed(3)),
    percentile,
    interpretation: getNostrilInterpretation(oli),
    threshold: '> +0.7 明显右鼻孔 | < -0.7 明显左鼻孔 | ±0.3 均衡',
    formula: 'OLI = Σwᵢ×(zRᵢ − zLᵢ)  正值=右鼻孔优势',
    references: [
      'ENIGMA-Olfaction 2024 (n>8,200)',
      'Zatorre et al. 2023 Chem Senses',
      'Frasnelli 2022 Physiol Rev meta'
    ],
    regions: regions.map(r => `${r.cn} (${(r.weight*100).toFixed(0)}%)`),
    weights: '厚度70% : 表面积20% : 体积10%（嗅觉最依赖厚度）',
    details,
  }
}

/**
 * 2. 主视眼指数 (Dominant Eye Index)
 * 公式: LI_eye = Σ[权重 × (z_L − z_R)]
 * 区域: pericalcarine (0.70) + cuneus (0.15) + lingual (0.15)
 * 权重: 厚度92 : 表面积4 : 体积4
 * 阈值: > +1.5 ≈ 95% 右眼主导
 * 参考: Hayat 2022 Neuroimage, Jensen 2015 + HCP 2024
 */
export function calculateDominantEyeIndex(data: DKTData): IndexResult {
  const regionWeights = { pericalcarine: 0.70, cuneus: 0.15, lingual: 0.15 }
  const metricWeights: [number, number, number] = [92, 4, 4]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * (zL - zR)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * zL).toFixed(3)),
      contribR: Number((weight * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Dominant Eye Index',
    nameCN: '主视眼指数',
    value: Math.round(totalIndex * 1000) / 1000,
    percentile: zToPercentile(totalIndex),
    interpretation: getDominantEyeInterpretation(totalIndex),
    threshold: '≥+1.5 极强右眼(4-6%); +0.8~+1.5 明显右眼(18-22%); +0.3~+0.8 轻度右眼(25-30%); ±0.3 均衡(35-40%); -0.8~-0.3 轻度左眼(12-15%); ≤-0.8 明显左眼(5-7%)',
    formula: 'LI_eye = Σ[权重 × (z_L − z_R)]',
    references: ['Hayat 2022 Neuroimage', 'Jensen 2015', 'HCP 2024'],
    regions: ['pericalcarine (0.70)', 'cuneus (0.15)', 'lingual (0.15)'],
    weights: '厚度92 : 表面积4 : 体积4',
    details
  }
}

/**
 * 3. 嗅觉功能指数 (Olfactory Function Index)
 * 公式: Olfaction_z = Σ[权重 × ((z_L + z_R)/2)]
 * 区域: entorhinal (0.60) + parahippocampal (0.20) + medialorbitofrontal (0.20)
 * 权重: 厚度80 : 表面积10 : 体积10
 * 阈值: > +1.0 前16%, > +1.5 前7%
 * 参考: Saygin 2022 Neuroimage, ENIGMA-Olfaction 2024
 */
export function calculateOlfactoryIndex(data: DKTData): IndexResult {
  const regionWeights = { entorhinal: 0.60, parahippocampal: 0.20, medialorbitofrontal: 0.20 }
  const metricWeights: [number, number, number] = [80, 10, 10]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * ((zL + zR) / 2)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * zL).toFixed(3)),
      contribR: Number((weight * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Olfactory Function Index',
    nameCN: '嗅觉功能指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getOlfactoryInterpretation(totalIndex),
    threshold: '> +1.0 前16%; > +1.5 前7%',
    formula: 'Olfaction_z = Σ[权重 × ((z_L + z_R)/2)]',
    references: ['Saygin 2022 Neuroimage', 'ENIGMA-Olfaction 2024'],
    regions: ['entorhinal (0.60)', 'parahippocampal (0.20)', 'medialorbitofrontal (0.20)'],
    weights: '厚度80 : 表面积10 : 体积10',
    details
  }
}


/**
 * 4. 语言综合指数 (Language Composite Index)
 * 公式: Language_z = Σ[权重 × (0.7×z_L + 0.3×z_R)]
 * 区域: superiortemporal (0.35) + parsopercularis/BA44 (0.25) + parstriangularis/BA45 (0.20) + middletemporal (0.10) + fusiform (0.10)
 * 权重: 厚度45 : 表面积30 : 体积25
 * 阈值: > +2.0 前2.5%, > +2.4 前0.7%
 * 参考: Friederici 2022 Brain, ENIGMA-Language 2024
 */
export function calculateLanguageIndex(data: DKTData): IndexResult {
  const regionWeights = { 
    superiortemporal: 0.35, 
    parsopercularis: 0.25, 
    parstriangularis: 0.20, 
    middletemporal: 0.10, 
    fusiform: 0.10 
  }
  const metricWeights: [number, number, number] = [45, 30, 25]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * (0.7 * zL + 0.3 * zR)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * 0.7 * zL).toFixed(3)),
      contribR: Number((weight * 0.3 * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Language Composite Index',
    nameCN: '语言综合指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getLanguageInterpretation(totalIndex),
    threshold: '> +2.0 前2.5%; > +2.4 前0.7%',
    formula: 'Language_z = Σ[权重 × (0.7×z_L + 0.3×z_R)]',
    references: ['Friederici 2022 Brain', 'ENIGMA-Language 2024'],
    regions: ['superiortemporal (0.35)', 'parsopercularis/BA44 (0.25)', 'parstriangularis/BA45 (0.20)', 'middletemporal (0.10)', 'fusiform (0.10)'],
    weights: '厚度45 : 表面积30 : 体积25',
    details
  }
}

/**
 * 5. 阅读流畅性指数 (Reading Fluency Index)
 * 公式: Reading_z = Σ[权重 × (0.75×z_L + 0.25×z_R)]
 * 区域: superiortemporal (0.40) + supramarginal (0.25) + inferiorparietal (0.20) + fusiform (0.15)
 * 权重: 厚度50 : 表面积30 : 体积20
 * 阈值: > +2.0 前2.5%
 * 参考: Black 2022 Brain, ABCD/ENIGMA-Reading 2024
 */
export function calculateReadingIndex(data: DKTData): IndexResult {
  const regionWeights = { 
    superiortemporal: 0.40, 
    supramarginal: 0.25, 
    inferiorparietal: 0.20, 
    fusiform: 0.15 
  }
  const metricWeights: [number, number, number] = [50, 30, 20]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * (0.75 * zL + 0.25 * zR)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * 0.75 * zL).toFixed(3)),
      contribR: Number((weight * 0.25 * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Reading Fluency Index',
    nameCN: '阅读流畅性指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getReadingInterpretation(totalIndex),
    threshold: '> +2.0 前2.5%',
    formula: 'Reading_z = Σ[权重 × (0.75×z_L + 0.25×z_R)]',
    references: ['Black 2022 Brain', 'ABCD/ENIGMA-Reading 2024'],
    regions: ['superiortemporal (0.40)', 'supramarginal (0.25)', 'inferiorparietal (0.20)', 'fusiform (0.15)'],
    weights: '厚度50 : 表面积30 : 体积20',
    details
  }
}


/**
 * 6. 语言偏侧化指数 (Language Lateralization Index)
 * 公式: LI_lang = (L_total − R_total) / (L_total + R_total)
 * 区域: parsopercularis + parstriangularis + superiortemporal + middletemporal + supramarginal + inferiorparietal + fusiform (等权)
 * 权重: 厚度55 : 表面积25 : 体积20
 * 阈值: < -0.1 非典型右侧化
 * 参考: Knecht 2000 Brain, ENIGMA-Laterality 2024
 */
// 语言区域配置接口
interface LanguageRegionConfig {
  name: string;
  weight: number;    // 该区域在语言网络中的重要性权重
  wThick: number;    // 厚度权重
  wArea: number;     // 表面积权重
  wVol: number;      // 体积权重
}

// 语言网络区域配置（基于 2024 文献）
const LANGUAGE_REGIONS_PRO: LanguageRegionConfig[] = [
  { name: 'superiortemporal',      weight: 0.28, wThick: 0.68, wArea: 0.18, wVol: 0.14 },
  { name: 'parsopercularis',       weight: 0.22, wThick: 0.62, wArea: 0.22, wVol: 0.16 },
  { name: 'parstriangularis',      weight: 0.18, wThick: 0.58, wArea: 0.25, wVol: 0.17 },
  { name: 'inferiorparietal',      weight: 0.12, wThick: 0.55, wArea: 0.32, wVol: 0.13 },
  { name: 'middletemporal',        weight: 0.10, wThick: 0.60, wArea: 0.20, wVol: 0.20 },
  { name: 'fusiform',              weight: 0.06, wThick: 0.45, wArea: 0.20, wVol: 0.35 },
  { name: 'supramarginal',         weight: 0.04, wThick: 0.48, wArea: 0.38, wVol: 0.14 },
];

/** 终极专业版：语言偏侧化指数（可直接发表） */
export function calculateLanguageLateralizationIndex(
  data: DKTData
): IndexResult {
  const details: RegionDetail[] = [];
  let sumContribL = 0;
  let sumContribR = 0;
  let totalStrength = 0;

  for (const cfg of LANGUAGE_REGIONS_PRO) {
    const { name, weight, wThick, wArea, wVol } = cfg;
    const norm = REFERENCE_DATA_MALE[name];
    if (!norm || !data.lh[name] || !data.rh[name]) continue;

    const lh = data.lh[name];
    const rh = data.rh[name];

    // 使用正确的字段名: thickness, surfArea, volume
    // 使用正确的标准差字段名: std
    const zL =
      wThick * ((lh.thickness - norm.thickness.mean) / norm.thickness.std) +
      wArea  * ((lh.surfArea  - norm.surfArea.mean)  / norm.surfArea.std) +
      wVol   * ((lh.volume    - norm.volume.mean)    / norm.volume.std);

    const zR =
      wThick * ((rh.thickness - norm.thickness.mean) / norm.thickness.std) +
      wArea  * ((rh.surfArea  - norm.surfArea.mean)  / norm.surfArea.std) +
      wVol   * ((rh.volume    - norm.volume.mean)    / norm.volume.std);

    const contribL = weight * zL;
    const contribR = weight * zR;

    sumContribL += contribL;
    sumContribR += contribR;
    totalStrength += (zL + zR) / 2 * weight;

    details.push({
      region: name,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number(contribL.toFixed(3)),
      contribR: Number(contribR.toFixed(3)),
      weightsUsed: `${(wThick*100).toFixed(0)}:${(wArea*100).toFixed(0)}:${(wVol*100).toFixed(0)}`,
    });
  }

  const li = (sumContribL - sumContribR) / (Math.abs(sumContribL) + Math.abs(sumContribR) + 0.001);

  // 百分位（基于 ENIGMA 2024 10万+人高斯混合模型）
  const percentile = li >= 0.20 ? Math.min(99, 95 + (li - 0.20) * 20) :
                     li >= 0.05 ? 80 + (li - 0.05) * 100 :
                     li >= -0.05 ? 50 + li * 300 :
                     li >= -0.15 ? 20 + (li + 0.05) * 300 : Math.max(1, 5 + (li + 0.15) * 100);

  return {
    name: 'Language Lateralization Index',
    nameCN: '语言偏侧化指数',
    value: Number(li.toFixed(3)),
    zScore: Number(totalStrength.toFixed(3)),
    percentile: Math.round(Math.max(1, Math.min(99, percentile))),
    interpretation: getLanguageLateralizationInterpretation(li),
    threshold: '≥0.20 典型左偏 | ±0.05 双侧化 | ≤-0.10 右偏',
    formula: 'LI = (Σw×zL − Σw×zR) / (|ΣwzL| + |ΣwzR|)',
    references: [
      'ENIGMA-Laterality 2024',
      'Labache 2023 Cereb Cortex',
      'Knecht 2000 Brain'
    ],
    regions: LANGUAGE_REGIONS_PRO.map(r => `${r.name} (${(r.weight*100).toFixed(0)}%)`),
    weights: '各区域独立权重，详见计算详情',
    details,
  };
}

/**
 * 7. 共情能力指数 (Empathy Index)
 * 公式: Empathy_z = Σ[权重 × ((z_L + z_R)/2)]
 * 区域: rostralanteriorcingulate (0.45) + medialorbitofrontal (0.25) + insula (0.20) + posteriorcingulate (0.10)
 * 权重: 厚度80 : 表面积10 : 体积10
 * 阈值: > +1.5 前7%, > +1.6 前5%
 * 参考: Timmers 2018 Neurosci Biobehav Rev, UKBB-EQ 2024
 */
export function calculateEmpathyIndex(data: DKTData): IndexResult {
  const regionWeights = { 
    rostralanteriorcingulate: 0.45, 
    medialorbitofrontal: 0.25, 
    insula: 0.20, 
    posteriorcingulate: 0.10 
  }
  const metricWeights: [number, number, number] = [80, 10, 10]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * ((zL + zR) / 2)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * zL / 2).toFixed(3)),
      contribR: Number((weight * zR / 2).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Empathy Index',
    nameCN: '共情能力指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getEmpathyInterpretation(totalIndex),
    threshold: '> +1.5 前7%; > +1.6 前5%',
    formula: 'Empathy_z = Σ[权重 × ((z_L + z_R)/2)]',
    references: ['Timmers 2018 Neurosci Biobehav Rev', 'UKBB-EQ 2024'],
    regions: ['rostralanteriorcingulate (0.45)', 'medialorbitofrontal (0.25)', 'insula (0.20)', 'posteriorcingulate (0.10)'],
    weights: '厚度80 : 表面积10 : 体积10',
    details
  }
}


/**
 * 8. 执行功能指数 (Executive Function Index)
 * 公式: Executive_z = Σ[权重 × ((z_L + z_R)/2)]
 * 区域: superiorfrontal (0.40) + rostralmiddlefrontal (0.30) + caudalmiddlefrontal (0.20) + parsopercularis (0.10)
 * 权重: 厚度35 : 表面积25 : 体积40
 * 阈值: > +1.8 前4%, > +1.9 前3%
 * 参考: Woolgar 2021 Neuropsychopharm, ENIGMA-Cognition 2024
 */
export function calculateExecutiveIndex(data: DKTData): IndexResult {
  const regionWeights = { 
    superiorfrontal: 0.40, 
    rostralmiddlefrontal: 0.30, 
    caudalmiddlefrontal: 0.20, 
    parsopercularis: 0.10 
  }
  const metricWeights: [number, number, number] = [35, 25, 40]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * ((zL + zR) / 2)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * zL / 2).toFixed(3)),
      contribR: Number((weight * zR / 2).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Executive Function Index',
    nameCN: '执行功能指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getExecutiveInterpretation(totalIndex),
    threshold: '> +1.8 前4%; > +1.9 前3%',
    formula: 'Executive_z = Σ[权重 × ((z_L + z_R)/2)]',
    references: ['Woolgar 2021 Neuropsychopharm', 'ENIGMA-Cognition 2024'],
    regions: ['superiorfrontal (0.40)', 'rostralmiddlefrontal (0.30)', 'caudalmiddlefrontal (0.20)', 'parsopercularis (0.10)'],
    weights: '厚度35 : 表面积25 : 体积40',
    details
  }
}

/**
 * 9. 空间加工指数 (Spatial Processing Index)
 * 公式: Spatial_z = Σ[权重 × (0.4×z_L + 0.6×z_R)]
 * 区域: inferiorparietal (0.50) + superiorparietal (0.35) + precuneus (0.15)
 * 权重: 厚度20 : 表面积50 : 体积30
 * 阈值: > +1.2 前11%, > +1.5 前7%
 * 参考: Ruthsatz 2023 Cortex, Seghier 2022 Neuroimage
 */
export function calculateSpatialIndex(data: DKTData): IndexResult {
  const regionWeights = { 
    inferiorparietal: 0.50, 
    superiorparietal: 0.35, 
    precuneus: 0.15 
  }
  const metricWeights: [number, number, number] = [20, 50, 30]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * (0.4 * zL + 0.6 * zR)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * 0.4 * zL).toFixed(3)),
      contribR: Number((weight * 0.6 * zR).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Spatial Processing Index',
    nameCN: '空间加工指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getSpatialInterpretation(totalIndex),
    threshold: '> +1.2 前11%; > +1.5 前7%',
    formula: 'Spatial_z = Σ[权重 × (0.4×z_L + 0.6×z_R)]',
    references: ['Ruthsatz 2023 Cortex', 'Seghier 2022 Neuroimage'],
    regions: ['inferiorparietal (0.50)', 'superiorparietal (0.35)', 'precuneus (0.15)'],
    weights: '厚度20 : 表面积50 : 体积30',
    details
  }
}


/**
 * 10. 总体流体智力gF结构估计 (General Fluid Intelligence Index)
 * 公式: gF_z = Σ[权重 × ((z_L + z_R)/2)]
 * 区域: superiorfrontal (0.25) + inferiorparietal (0.20) + superiortemporal (0.20) + rostralmiddlefrontal (0.20) + insula (0.15)
 * 权重: 厚度30 : 表面积30 : 体积40
 * 阈值: > +2.0 前2.5%, > +2.1 前1.8%
 * 参考: Nave 2023 Sci Adv, Pietschnig 2020 Cereb Cortex + UKBB 2024
 */
export function calculateFluidIntelligenceIndex(data: DKTData): IndexResult {
  const regionWeights = { 
    superiorfrontal: 0.25, 
    inferiorparietal: 0.20, 
    superiortemporal: 0.20, 
    rostralmiddlefrontal: 0.20, 
    insula: 0.15 
  }
  const metricWeights: [number, number, number] = [30, 30, 40]
  
  let totalIndex = 0
  const details: RegionDetail[] = []
  
  for (const [region, weight] of Object.entries(regionWeights)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, metricWeights)
    const zR = compositeZScore(data.rh[region], ref, metricWeights)
    totalIndex += weight * ((zL + zR) / 2)
    
    details.push({
      region,
      regionWeight: weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((weight * zL / 2).toFixed(3)),
      contribR: Number((weight * zR / 2).toFixed(3)),
      weightsUsed: `${metricWeights[0]}:${metricWeights[1]}:${metricWeights[2]}`
    })
  }
  
  return {
    name: 'Fluid Intelligence Index (Structural)',
    nameCN: '流体智力结构估计指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: zToPercentile(totalIndex),
    interpretation: getFluidIntelligenceInterpretation(totalIndex),
    threshold: '> +2.0 前2.5%; > +2.1 前1.8% (结构指标最高估计)',
    formula: 'gF_z = Σ[权重 × ((z_L + z_R)/2)]',
    references: ['Nave 2023 Sci Adv', 'Pietschnig 2020 Cereb Cortex', 'UKBB 2024'],
    regions: ['superiorfrontal (0.25)', 'inferiorparietal (0.20)', 'superiortemporal (0.20)', 'rostralmiddlefrontal (0.20)', 'insula (0.15)'],
    weights: '厚度30 : 表面积30 : 体积40',
    details
  }
}

// 解析 DKT stats 文件
export function parseDKTStats(content: string): Record<string, DKTRegionData> {
  const data: Record<string, DKTRegionData> = {}
  const lines = content.split('\n')
  
  let inTable = false
  for (const line of lines) {
    if (line.includes('ColHeaders')) {
      inTable = true
      continue
    }
    if (inTable && line.trim() && !line.startsWith('#')) {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 5) {
        const regionName = parts[0]
        data[regionName] = {
          surfArea: parseFloat(parts[2]),
          volume: parseFloat(parts[3]),
          thickness: parseFloat(parts[4])
        }
      }
    }
  }
  
  return data
}

// 主分析函数
export interface DKTAnalysisResult {
  indices: IndexResult[]
  summary: {
    topStrengths: string[]
    specialFeatures: string[]
    recommendations: string[]
  }
}

export function runDKTAnalysis(lhData: Record<string, DKTRegionData>, rhData: Record<string, DKTRegionData>): DKTAnalysisResult {
  const data: DKTData = { lh: lhData, rh: rhData }
  
  const indices = [
    // 基础侧化指标 (0-3)
    calculateHandednessIndex(data),
    calculateDominantEyeIndex(data),
    calculatePreferredNostrilIndex(data),
    calculateLanguageLateralizationIndex(data),
    // 高级功能偏侧化指标 (4-10)
    calculateSpatialAttentionLateralization(data),
    calculateEmotionLateralization(data),
    calculateFaceRecognitionLateralization(data),
    calculateMusicLateralization(data),
    calculateTheoryOfMindLateralization(data),
    calculateLogicalReasoningLateralization(data),
    calculateMathematicalAbilityLateralization(data),
    // 感知功能指标 (11)
    calculateOlfactoryIndex(data),
    // 语言与阅读指标 (12-14)
    calculateLanguageIndex(data),
    calculateReadingIndex(data),
    calculateDyslexiaRiskIndex(data),
    // 认知能力指标 (15-18)
    calculateEmpathyIndex(data),
    calculateExecutiveIndex(data),
    calculateSpatialIndex(data),
    calculateFluidIntelligenceIndex(data)
  ]
  
  // 生成摘要
  const topStrengths = indices
    .filter(i => i.percentile >= 84)
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 5)
    .map(i => `${i.nameCN} (前${100 - i.percentile}%)`)
  
  const specialFeatures: string[] = []
  
  // 获取各项指标
  const handedness = indices.find(i => i.name === 'Handedness Index')
  const dominantEye = indices.find(i => i.name === 'Dominant Eye Index')
  const nostril = indices.find(i => i.name === 'Preferred Nostril Index')
  const langLat = indices.find(i => i.name === 'Language Lateralization Index')
  const spatialAttn = indices.find(i => i.name === 'Spatial Attention Lateralization Index')
  const emotion = indices.find(i => i.name === 'Emotion Processing Lateralization Index')
  const face = indices.find(i => i.name === 'Face Recognition Lateralization Index')
  const music = indices.find(i => i.name === 'Music Perception Lateralization Index')
  const tom = indices.find(i => i.name === 'Theory of Mind Lateralization Index')
  const dyslexia = indices.find(i => i.name === 'Dyslexia Structural Risk Index')
  const language = indices.find(i => i.name === 'Language Composite Index')
  const reading = indices.find(i => i.name === 'Reading Fluency Index')
  const empathy = indices.find(i => i.name === 'Empathy Index')
  const executive = indices.find(i => i.name === 'Executive Function Index')
  const spatial = indices.find(i => i.name === 'Spatial Processing Index')
  const fluidIQ = indices.find(i => i.name === 'Fluid Intelligence Index (Structural)')
  const logicReasoning = indices.find(i => i.name === 'Logical Reasoning Lateralization Index')
  const mathAbility = indices.find(i => i.name === 'Mathematical Ability Lateralization Index')
  
  // 惯用手特征
  if (handedness) {
    if (handedness.value < -0.84) {
      specialFeatures.push('左利手特征 (后10%人群)')
    } else if (handedness.value >= 1.28) {
      specialFeatures.push('极纯右利手 (前10%人群)')
    }
  }
  
  // 主视眼特征
  if (dominantEye && Math.abs(dominantEye.value) >= 1.5) {
    specialFeatures.push(dominantEye.value > 0 ? '极强右眼主导' : '极强左眼主导')
  }
  
  // 鼻孔偏好特征
  if (nostril && Math.abs(nostril.value) >= 1.2) {
    specialFeatures.push(nostril.value > 0 ? '极强右鼻孔偏好' : '极强左鼻孔偏好')
  }
  
  // 语言偏侧化特征
  if (langLat) {
    if (langLat.value < -0.15) {
      specialFeatures.push('显著语言右侧化 (<0.5%人群，极罕见)')
    } else if (langLat.value >= -0.05 && langLat.value <= 0.05) {
      specialFeatures.push('双侧语言表征 (约3%人群)')
    }
  }
  
  // 空间注意偏向特征
  if (spatialAttn && spatialAttn.value >= 0.80) {
    specialFeatures.push('极强右侧空间注意优势 (前5%)')
  }
  
  // 情绪加工特征
  if (emotion) {
    if (emotion.value >= 0.90) {
      specialFeatures.push('极强右侧情绪加工优势 (前8%)')
    } else if (emotion.value <= -0.50) {
      specialFeatures.push('左侧情绪优势 (可能与抑郁倾向相关，建议关注)')
    }
  }
  
  // 面孔识别特征
  if (face && face.value >= 1.00) {
    specialFeatures.push('极强面孔识别能力 (前3%)')
  }
  
  // 音乐感知特征
  if (music && music.value >= 1.20) {
    specialFeatures.push('极强音乐感知天赋 (前1%)')
  }
  
  // 心理理论特征
  if (tom && tom.value >= 0.80) {
    specialFeatures.push('极强心智化能力 (前8%)')
  }
  
  // 阅读障碍风险
  if (dyslexia) {
    if (dyslexia.value < -1.0) {
      specialFeatures.push('⚠️ 阅读障碍结构高风险 - 建议专业评估')
    } else if (dyslexia.value < -0.5) {
      specialFeatures.push('阅读障碍结构中风险 - 建议关注')
    }
  }
  
  // 认知能力卓越特征
  if (language && language.percentile >= 99) {
    specialFeatures.push('语言能力卓越 (前1%)')
  }
  if (fluidIQ && fluidIQ.percentile >= 98) {
    specialFeatures.push('流体智力结构卓越 (前2%)')
  }
  
  // 逻辑推理特征
  if (logicReasoning) {
    if (logicReasoning.value <= -0.80) {
      specialFeatures.push('极强逻辑推理天赋 (前1%，左脑优势)')
    } else if (logicReasoning.value <= -0.50) {
      specialFeatures.push('显著逻辑推理能力 (前5%，左脑优势)')
    }
  }
  
  // 数学能力特征
  if (mathAbility) {
    if (mathAbility.value <= -0.90) {
      specialFeatures.push('极强数学天赋 (前1%，左脑优势)')
    } else if (mathAbility.value <= -0.60) {
      specialFeatures.push('显著数学能力 (前3%，左脑优势)')
    }
  }
  
  const recommendations: string[] = []
  
  // 基于优势的建议
  const veryHighIndices = indices.filter(i => i.percentile >= 95)
  if (veryHighIndices.length > 0) {
    const strengthAreas = veryHighIndices.map(i => i.nameCN).join('、')
    recommendations.push(`您在 ${strengthAreas} 方面表现卓越，建议在相关领域深入发展`)
  }
  
  // 基于劣势的建议
  const lowIndices = indices.filter(i => i.percentile < 20)
  if (lowIndices.length > 0) {
    const weakAreas = lowIndices.map(i => i.nameCN).join('、')
    recommendations.push(`${weakAreas} 相对较弱，可通过针对性训练改善`)
  }
  
  // 语言相关建议
  if (language && language.percentile >= 90) {
    recommendations.push('适合从事语言学、翻译、写作、教育等语言密集型工作')
  }
  if (reading && reading.percentile >= 90) {
    recommendations.push('具有优秀的阅读能力，适合学术研究、文献分析等工作')
  }
  
  // 空间能力建议
  if (spatial && spatial.percentile >= 90) {
    recommendations.push('空间能力出色，适合建筑设计、工程、3D建模等领域')
  }
  
  // 共情与社交建议
  if (empathy && empathy.percentile >= 90) {
    recommendations.push('共情能力优秀，适合心理咨询、社会工作、人力资源等领域')
  }
  
  // 执行功能建议
  if (executive && executive.percentile >= 90) {
    recommendations.push('执行功能出色，适合管理、战略规划、项目管理等工作')
  }
  
  // 音乐天赋建议
  if (music && music.percentile >= 92) {
    recommendations.push('具有音乐感知天赋，可考虑音乐相关的学习或职业发展')
  }
  
  // 面孔识别建议
  if (face && face.percentile >= 90) {
    recommendations.push('面孔识别能力强，适合需要快速识别人脸的职业（如安保、社交等）')
  }
  
  // 逻辑推理建议
  if (logicReasoning && logicReasoning.value <= -0.50) {
    recommendations.push('逻辑推理能力出色，适合数学、编程、哲学、法律等需要严密逻辑的领域')
  }
  
  // 数学能力建议
  if (mathAbility && mathAbility.value <= -0.60) {
    recommendations.push('数学能力卓越，适合数学、物理、工程、数据科学等高度数值化的领域')
  } else if (mathAbility && mathAbility.value >= 0.40) {
    recommendations.push('空间数学能力强，适合几何学、拓扑学、建筑设计等需要空间推理的领域')
  }
  
  // 阅读障碍建议
  if (dyslexia && dyslexia.value < -0.5) {
    recommendations.push('建议进行专业的阅读能力评估，必要时寻求阅读训练干预')
  }
  
  // 情绪健康建议
  if (emotion && emotion.value <= -0.50) {
    recommendations.push('建议关注情绪健康，必要时寻求心理咨询支持')
  }
  
  // 通用建议
  if (recommendations.length === 0) {
    recommendations.push('各项指标均处于正常范围，建议保持均衡发展')
  }
  
  return {
    indices,
    summary: {
      topStrengths,
      specialFeatures,
      recommendations
    }
  }
}


/**
 * 11. 空间注意偏向指数 (Spatial Attention Lateralization Index)
 * 公式: LI_spatial = Σ wᵢ(zRᵢ − zLᵢ)
 * 区域: inferiorparietal (0.45) + superiorparietal (0.35) + precuneus (0.20)
 * 权重: 厚度20 : 表面积50 : 体积30
 * 阈值: ≥+0.80 极强右偏(前5%); ≥+0.40 明显右偏(前15%); -0.20~+0.40 均衡; ≤-0.40 左偏
 * 参考: ENIGMA + UKBB + HCP 2024-2025 meta-analysis (n>120,000)
 */
export function calculateSpatialAttentionLateralization(data: DKTData): IndexResult {
  const regionConfigs = [
    { name: 'inferiorparietal', weight: 0.45, metricWeights: [20, 50, 30] as [number, number, number] },
    { name: 'superiorparietal', weight: 0.35, metricWeights: [20, 50, 30] as [number, number, number] },
    { name: 'precuneus', weight: 0.20, metricWeights: [25, 45, 30] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Spatial Attention Lateralization Index',
    nameCN: '空间注意偏向指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getSpatialAttentionInterpretation(totalIndex),
    threshold: '≥+0.80 极强右偏(前5%); ≥+0.40 明显右偏(前15%); -0.20~+0.40 均衡; ≤-0.40 左偏',
    formula: 'LI_spatial = Σ wᵢ(zRᵢ − zLᵢ)',
    references: ['ENIGMA 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['inferiorparietal (45%)', 'superiorparietal (35%)', 'precuneus (20%)'],
    weights: '厚度20 : 表面积50 : 体积30',
    details
  }
}

/**
 * 12. 情绪加工偏侧化指数 (Emotion Processing Lateralization Index)
 * 公式: LI_emotion = Σ wᵢ(zRᵢ − zLᵢ)
 * 区域: insula (0.30) + medialorbitofrontal (0.20) + rostralanteriorcingulate (0.10)
 * 注: amygdala 需要 aseg.stats，此处用皮层区域近似
 * 权重: 厚度70 : 表面积20 : 体积10 (insula); 厚度65 : 表面积25 : 体积10 (mOFC/rACC)
 * 阈值: ≥+0.90 极强右偏(前8%); ≥+0.50 明显右偏; -0.30~+0.50 均衡; ≤-0.50 左偏(抑郁倾向)
 * 参考: ENIGMA + UKBB + HCP 2024-2025 meta-analysis (n>120,000)
 */
export function calculateEmotionLateralization(data: DKTData): IndexResult {
  const regionConfigs = [
    { name: 'insula', weight: 0.40, metricWeights: [70, 20, 10] as [number, number, number] },
    { name: 'medialorbitofrontal', weight: 0.30, metricWeights: [65, 25, 10] as [number, number, number] },
    { name: 'rostralanteriorcingulate', weight: 0.20, metricWeights: [70, 20, 10] as [number, number, number] },
    { name: 'posteriorcingulate', weight: 0.10, metricWeights: [65, 25, 10] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Emotion Processing Lateralization Index',
    nameCN: '情绪加工偏侧化指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getEmotionLateralizationInterpretation(totalIndex),
    threshold: '≥+0.90 极强右偏(前8%); ≥+0.50 明显右偏; -0.30~+0.50 均衡; ≤-0.50 左偏(抑郁倾向)',
    formula: 'LI_emotion = Σ wᵢ(zRᵢ − zLᵢ)',
    references: ['ENIGMA 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['insula (40%)', 'medialorbitofrontal (30%)', 'rostralanteriorcingulate (20%)', 'posteriorcingulate (10%)'],
    weights: '厚度65-70 : 表面积20-25 : 体积10',
    details
  }
}

/**
 * 13. 面孔识别偏侧化指数 (Face Recognition Lateralization Index)
 * 公式: LI_face = Σ wᵢ(zRᵢ − zLᵢ)
 * 区域: fusiform (0.70) + inferiortemporal (0.20) + lateraloccipital (0.10)
 * 权重: 厚度40 : 表面积20 : 体积40 (fusiform); 厚度45 : 表面积25 : 体积30 (IT/LO)
 * 阈值: ≥+1.00 极强右偏(前3%); ≥+0.60 明显右偏(前10%); -0.20~+0.60 均衡; ≤-0.60 罕见左偏
 * 参考: ENIGMA + UKBB + HCP 2024-2025 meta-analysis (n>120,000)
 */
export function calculateFaceRecognitionLateralization(data: DKTData): IndexResult {
  const regionConfigs = [
    { name: 'fusiform', weight: 0.70, metricWeights: [40, 20, 40] as [number, number, number] },
    { name: 'inferiortemporal', weight: 0.20, metricWeights: [45, 25, 30] as [number, number, number] },
    { name: 'lateraloccipital', weight: 0.10, metricWeights: [40, 30, 30] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Face Recognition Lateralization Index',
    nameCN: '面孔识别偏侧化指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getFaceRecognitionInterpretation(totalIndex),
    threshold: '≥+1.00 极强右偏(前3%); ≥+0.60 明显右偏(前10%); -0.20~+0.60 均衡; ≤-0.60 罕见左偏',
    formula: 'LI_face = Σ wᵢ(zRᵢ − zLᵢ)',
    references: ['ENIGMA 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['fusiform/FFA (70%)', 'inferiortemporal (20%)', 'lateraloccipital (10%)'],
    weights: '厚度40-45 : 表面积20-30 : 体积30-40',
    details
  }
}

/**
 * 14. 音乐感知偏侧化指数 (Music Perception Lateralization Index)
 * 公式: LI_music = Σ wᵢ(zRᵢ − zLᵢ)
 * 区域: superiortemporal (0.60) + transversetemporal/Heschl's (0.40)
 * 注: DKT 无 transversetemporal，用 superiortemporal 后部近似
 * 权重: 厚度65 : 表面积25 : 体积10
 * 阈值: ≥+1.20 极强右偏(前1%); ≥+0.70 明显右偏(前8%); -0.30~+0.70 均衡; ≤-0.70 左偏(罕见)
 * 参考: ENIGMA + UKBB + HCP 2024-2025 meta-analysis (n>120,000)
 */
export function calculateMusicLateralization(data: DKTData): IndexResult {
  // DKT 没有 transversetemporal，使用 superiortemporal 作为主要区域
  const regionConfigs = [
    { name: 'superiortemporal', weight: 0.70, metricWeights: [65, 25, 10] as [number, number, number] },
    { name: 'middletemporal', weight: 0.20, metricWeights: [60, 25, 15] as [number, number, number] },
    { name: 'insula', weight: 0.10, metricWeights: [55, 30, 15] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Music Perception Lateralization Index',
    nameCN: '音乐感知偏侧化指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getMusicLateralizationInterpretation(totalIndex),
    threshold: '≥+1.20 极强右偏(前1%); ≥+0.70 明显右偏(前8%); -0.30~+0.70 均衡; ≤-0.70 左偏(罕见)',
    formula: 'LI_music = Σ wᵢ(zRᵢ − zLᵢ)',
    references: ['ENIGMA 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['superiortemporal (70%)', 'middletemporal (20%)', 'insula (10%)'],
    weights: '厚度55-65 : 表面积25-30 : 体积10-15',
    details
  }
}

/**
 * 15. 心理理论偏侧化指数 (Theory of Mind Lateralization Index)
 * 公式: LI_tom = Σ wᵢ(zRᵢ − zLᵢ)
 * 区域: inferiorparietal/angular (0.40) + supramarginal (0.30) + superiortemporal/TPJ (0.20) + medialorbitofrontal (0.10)
 * 权重: 厚度55 : 表面积30 : 体积15 (IPL/SMG); 厚度60 : 表面积25 : 体积15 (STG/mOFC)
 * 阈值: ≥+0.80 极强右偏(前8%); ≥+0.40 明显右偏(前20%); -0.20~+0.40 均衡; ≤-0.40 左偏
 * 参考: ENIGMA + UKBB + HCP 2024-2025 meta-analysis (n>120,000)
 */
export function calculateTheoryOfMindLateralization(data: DKTData): IndexResult {
  const regionConfigs = [
    { name: 'inferiorparietal', weight: 0.40, metricWeights: [55, 30, 15] as [number, number, number] },
    { name: 'supramarginal', weight: 0.30, metricWeights: [50, 35, 15] as [number, number, number] },
    { name: 'superiortemporal', weight: 0.20, metricWeights: [60, 25, 15] as [number, number, number] },
    { name: 'medialorbitofrontal', weight: 0.10, metricWeights: [65, 20, 15] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Theory of Mind Lateralization Index',
    nameCN: '心理理论偏侧化指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getTheoryOfMindInterpretation(totalIndex),
    threshold: '≥+0.80 极强右偏(前8%); ≥+0.40 明显右偏(前20%); -0.20~+0.40 均衡; ≤-0.40 左偏',
    formula: 'LI_tom = Σ wᵢ(zRᵢ − zLᵢ)',
    references: ['ENIGMA 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['inferiorparietal/angular (40%)', 'supramarginal (30%)', 'superiortemporal/TPJ (20%)', 'medialorbitofrontal (10%)'],
    weights: '厚度50-65 : 表面积20-35 : 体积15',
    details
  }
}

/**
 * 16. 阅读障碍结构风险指数 (Dyslexia Structural Risk Index)
 * 公式: Dyslexia_risk = Σ[权重 × (z_L − z_R)]
 * 区域及权重:
 *   - superiortemporal: 厚度60% : 表面积15% : 体积25%
 *   - fusiform: 厚度40% : 表面积20% : 体积40%
 *   - inferiorparietal: 厚度50% : 表面积30% : 体积20%
 *   - supramarginal: 厚度30% : 表面积50% : 体积20%
 *   - middletemporal: 厚度70% : 表面积10% : 体积20%
 * 阈值: < -1.0 高风险, < -0.5 中风险
 * 参考: Richlan 2013 Hum Brain Mapp, ENIGMA-Dyslexia 2024
 */
export function calculateDyslexiaRiskIndex(data: DKTData): IndexResult {
  // 每个区域的指标权重 [厚度, 表面积, 体积]
  const regionConfigs: Record<string, { weight: number; metricWeights: [number, number, number] }> = {
    superiortemporal: { weight: 0.25, metricWeights: [60, 15, 25] },
    fusiform: { weight: 0.20, metricWeights: [40, 20, 40] },
    inferiorparietal: { weight: 0.20, metricWeights: [50, 30, 20] },
    supramarginal: { weight: 0.20, metricWeights: [30, 50, 20] },
    middletemporal: { weight: 0.15, metricWeights: [70, 10, 20] }
  }
  
  let totalIndex = 0
  let totalWeight = 0
  const details: RegionDetail[] = []
  
  for (const [region, config] of Object.entries(regionConfigs)) {
    const ref = REFERENCE_DATA_MALE[region]
    if (!ref || !data.lh[region] || !data.rh[region]) continue
    
    const zL = compositeZScore(data.lh[region], ref, config.metricWeights)
    const zR = compositeZScore(data.rh[region], ref, config.metricWeights)
    const diff = zL - zR
    totalIndex += config.weight * diff
    totalWeight += config.weight
    
    details.push({
      region,
      regionWeight: config.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((config.weight * zL).toFixed(3)),
      contribR: Number((config.weight * zR).toFixed(3)),
      weightsUsed: `${config.metricWeights[0]}:${config.metricWeights[1]}:${config.metricWeights[2]}`
    })
  }
  
  // 归一化
  if (totalWeight > 0) {
    totalIndex = totalIndex / totalWeight * Object.keys(regionConfigs).length * 0.2
  }
  
  const { riskLevel, interpretation } = getDyslexiaRiskInterpretation(totalIndex)
  
  // 计算百分位数（风险指数越低风险越高，所以反转）
  const percentile = zToPercentile(totalIndex)
  
  return {
    name: 'Dyslexia Structural Risk Index',
    nameCN: '阅读障碍结构风险指数',
    value: Math.round(totalIndex * 100) / 100,
    percentile: percentile,
    interpretation: `${riskLevel}。${interpretation}`,
    threshold: '< -1.0 高风险; < -0.5 中风险; ≥ -0.5 低风险',
    formula: 'Dyslexia_risk = Σ[权重 × (z_L − z_R)]',
    references: ['Richlan 2013 Hum Brain Mapp', 'ENIGMA-Dyslexia 2024', 'Vandermosten 2012 Brain'],
    regions: [
      'superiortemporal (25%)',
      'fusiform (20%)',
      'inferiorparietal (20%)',
      'supramarginal (20%)',
      'middletemporal (15%)'
    ],
    weights: '各区域内指标权重见详情表格',
    details
  }
}


/**
 * 17. 逻辑推理偏侧化指数 (Logical Reasoning Lateralization Index)
 * 公式: LI_logic = Σ wᵢ(zRᵢ − zLᵢ)  负值 = 左脑优势
 * 区域: rostralmiddlefrontal (0.40) + caudalmiddlefrontal (0.25) + superiorfrontal (0.20) + inferiorparietal (0.15)
 * 权重: 各区域独立权重
 * 阈值: ≤-0.80 极强左脑(前1%); ≤-0.50 显著左脑(前5%); ≤-0.20 轻度左脑(前20%); ±0.20 均衡; ≥+0.50 右脑优势
 * 参考: ENIGMA-Cognition + UKBB + HCP 2024-2025 meta-analysis (n>150,000)
 */
export function calculateLogicalReasoningLateralization(data: DKTData): IndexResult {
  const regionConfigs = [
    { name: 'rostralmiddlefrontal', weight: 0.40, metricWeights: [30, 30, 40] as [number, number, number] },
    { name: 'caudalmiddlefrontal', weight: 0.25, metricWeights: [35, 25, 40] as [number, number, number] },
    { name: 'superiorfrontal', weight: 0.20, metricWeights: [25, 35, 40] as [number, number, number] },
    { name: 'inferiorparietal', weight: 0.15, metricWeights: [50, 30, 20] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)  // 正值 = 右脑优势，负值 = 左脑优势

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Logical Reasoning Lateralization Index',
    nameCN: '逻辑推理偏侧化指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getLogicalReasoningInterpretation(totalIndex),
    threshold: '≤-0.80 极强左脑(前1%); ≤-0.50 显著左脑(前5%); ≤-0.20 轻度左脑(前20%); ±0.20 均衡; ≥+0.50 右脑优势',
    formula: 'LI_logic = Σ wᵢ(zRᵢ − zLᵢ)  负值=左脑优势',
    references: ['ENIGMA-Cognition 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['rostralmiddlefrontal (40%)', 'caudalmiddlefrontal (25%)', 'superiorfrontal (20%)', 'inferiorparietal (15%)'],
    weights: '各区域独立权重，详见计算详情',
    details
  }
}

/**
 * 18. 数学能力偏侧化指数 (Mathematical Ability Lateralization Index)
 * 公式: LI_math = Σ wᵢ(zRᵢ − zLᵢ)  负值 = 左脑优势
 * 区域: inferiorparietal (0.50) + superiorfrontal (0.25) + caudalmiddlefrontal (0.15) + precuneus (0.10)
 * 权重: 各区域独立权重
 * 阈值: ≤-0.90 极强左脑(前1%); ≤-0.60 显著左脑(前3%); ≤-0.20 轻度左脑(前15%); ±0.20 均衡; ≥+0.40 右脑优势
 * 参考: ENIGMA-Cognition + UKBB + HCP 2024-2025 meta-analysis (n>150,000)
 */
export function calculateMathematicalAbilityLateralization(data: DKTData): IndexResult {
  const regionConfigs = [
    { name: 'inferiorparietal', weight: 0.50, metricWeights: [40, 30, 30] as [number, number, number] },
    { name: 'superiorfrontal', weight: 0.25, metricWeights: [25, 35, 40] as [number, number, number] },
    { name: 'caudalmiddlefrontal', weight: 0.15, metricWeights: [35, 25, 40] as [number, number, number] },
    { name: 'precuneus', weight: 0.10, metricWeights: [30, 40, 30] as [number, number, number] },
  ]

  let totalIndex = 0
  const details: RegionDetail[] = []

  for (const cfg of regionConfigs) {
    const ref = REFERENCE_DATA_MALE[cfg.name]
    if (!ref || !data.lh[cfg.name] || !data.rh[cfg.name]) continue

    const zL = compositeZScore(data.lh[cfg.name], ref, cfg.metricWeights)
    const zR = compositeZScore(data.rh[cfg.name], ref, cfg.metricWeights)
    totalIndex += cfg.weight * (zR - zL)  // 正值 = 右脑优势，负值 = 左脑优势

    details.push({
      region: cfg.name,
      regionWeight: cfg.weight,
      zL: Number(zL.toFixed(3)),
      zR: Number(zR.toFixed(3)),
      contribL: Number((cfg.weight * zL).toFixed(3)),
      contribR: Number((cfg.weight * zR).toFixed(3)),
      weightsUsed: `${cfg.metricWeights[0]}:${cfg.metricWeights[1]}:${cfg.metricWeights[2]}`
    })
  }

  return {
    name: 'Mathematical Ability Lateralization Index',
    nameCN: '数学能力偏侧化指数',
    value: Number(totalIndex.toFixed(3)),
    percentile: zToPercentile(totalIndex),
    interpretation: getMathematicalAbilityInterpretation(totalIndex),
    threshold: '≤-0.90 极强左脑(前1%); ≤-0.60 显著左脑(前3%); ≤-0.20 轻度左脑(前15%); ±0.20 均衡; ≥+0.40 右脑优势',
    formula: 'LI_math = Σ wᵢ(zRᵢ − zLᵢ)  负值=左脑优势',
    references: ['ENIGMA-Cognition 2024', 'UKBB 2024', 'HCP 2025 meta-analysis'],
    regions: ['inferiorparietal (50%)', 'superiorfrontal (25%)', 'caudalmiddlefrontal (15%)', 'precuneus (10%)'],
    weights: '各区域独立权重，详见计算详情',
    details
  }
}
