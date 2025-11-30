/**
 * DKT 指标解释常量和函数
 * 将所有 interpretation 逻辑集中管理
 */

// 惯用手指数解释
export function getHandednessInterpretation(value: number): string {
  if (value >= 1.28) {
    return '极纯右利手 (前10%人群)。运动皮层显示极强的左半球优势，右手精细运动控制能力突出，属于强右利手群体。'
  } else if (value >= 0.84) {
    return '强右利手 (前20%人群)。左半球运动皮层优势明显，符合典型右利手者的脑结构特征。'
  } else if (value >= 0.52) {
    return '中等右利手 (前30%人群)。左半球运动皮层占优势，日常任务中偏好使用右手。'
  } else if (value >= -0.52) {
    return '双手协调/混合型 (约60%人群，最常见)。运动皮层高度对称，可能具有良好的双手协调能力，或为混合利手。'
  } else if (value >= -0.84) {
    return '中等左利手 (后30%人群)。右半球运动皮层占优势，日常任务中偏好使用左手。'
  }
  return '强左利手 (后10%人群)。右半球运动皮层优势明显，属于典型左利手群体。'
}

// 主视眼指数解释
export function getDominantEyeInterpretation(value: number): string {
  if (value >= 1.5) {
    return '极强右眼主导 (约4-6%人群，95%+置信度)。左侧视觉皮层优势极为明显，右眼在视觉任务中占绝对主导地位。'
  } else if (value >= 0.8) {
    return '明显右眼主导 (约18-22%人群)。左侧视觉皮层优势明显，右眼在精细视觉任务中更为敏锐。'
  } else if (value >= 0.3) {
    return '轻度右眼偏好 (约25-30%人群)。左侧视觉皮层略占优势，右眼可能在某些视觉任务中稍占优势。'
  } else if (value >= -0.3) {
    return '双眼高度均衡 (约35-40%人群，最常见)。视觉皮层高度对称，无明显主导眼，双眼视觉功能均衡。'
  } else if (value >= -0.8) {
    return '轻度左眼偏好 (约12-15%人群)。右侧视觉皮层略占优势，左眼可能在某些视觉任务中稍占优势。'
  }
  return '明显/极强左眼主导 (约5-7%人群)。右侧视觉皮层优势明显，左眼在视觉任务中占主导地位。'
}

// 主嗅鼻孔指数解释
export function getNostrilInterpretation(value: number): string {
  if (value >= 1.2) return '极强右鼻孔偏好（前5%）——你闻香水只用右边！'
  if (value >= 0.7) return '明显右鼻孔偏好——吃东西时右鼻孔更灵敏'
  if (value >= 0.3) return '轻度右鼻孔偏好——潜意识里更爱用右边闻'
  if (value > -0.3) return '鼻孔高度均衡——你是个"双鼻孔自由人"'
  if (value > -0.7) return '轻度左鼻孔偏好'
  if (value > -1.2) return '明显左鼻孔偏好'
  return '极强左鼻孔偏好（后5%）——你可能是个左撇子味觉家！'
}

// 嗅觉功能指数解释
export function getOlfactoryInterpretation(value: number): string {
  if (value > 1.5) {
    return '嗅觉功能优秀 (前7%)。嗅觉相关皮层发育良好，可能具有敏锐的嗅觉辨别能力。'
  } else if (value > 1.0) {
    return '嗅觉功能良好 (前16%)。嗅觉皮层发育较好，嗅觉感知能力高于平均水平。'
  } else if (value > -0.5) {
    return '嗅觉功能正常。嗅觉相关皮层发育处于正常范围。'
  }
  return '嗅觉功能需关注。嗅觉相关皮层体积偏小，建议关注嗅觉健康。'
}

// 语言综合指数解释
export function getLanguageInterpretation(value: number): string {
  if (value > 2.4) {
    return '语言能力卓越 (前0.7%)。语言相关皮层高度发达，可能具有出色的语言理解、表达和学习能力。适合语言学、翻译、写作等领域。'
  } else if (value > 2.0) {
    return '语言能力优秀 (前2.5%)。Broca区和Wernicke区发育良好，语言处理能力显著高于平均水平。'
  } else if (value > 1.0) {
    return '语言能力良好 (前16%)。语言皮层发育较好，具有良好的语言理解和表达能力。'
  } else if (value > -0.5) {
    return '语言能力正常。语言相关皮层发育处于正常范围。'
  }
  return '语言能力需关注。语言皮层发育偏弱，可通过语言训练来改善。'
}

// 阅读流畅性指数解释
export function getReadingInterpretation(value: number): string {
  if (value > 2.0) {
    return '阅读能力优秀 (前2.5%)。视觉词形区和语音加工区发育良好，可能具有快速阅读和文字处理能力。'
  } else if (value > 1.0) {
    return '阅读能力良好 (前16%)。阅读相关皮层发育较好，阅读流畅性高于平均水平。'
  } else if (value > -0.5) {
    return '阅读能力正常。阅读相关皮层发育处于正常范围。'
  }
  return '阅读能力需关注。阅读相关皮层发育偏弱，可通过阅读训练来改善。'
}

// 语言偏侧化指数解释
export function getLanguageLateralizationInterpretation(value: number): string {
  if (value >= 0.20) return '典型左侧化（最常见模式，约85%人群）'
  if (value >= 0.05) return '弱左侧化（约10%人群）'
  if (value >= -0.05) return '双侧化（稀有模式，约3%人群）'
  if (value >= -0.15) return '弱右侧化（约1.5%人群）'
  return '显著右侧化（<0.5%人群）'
}

// 共情能力指数解释
export function getEmpathyInterpretation(value: number): string {
  if (value > 1.6) {
    return '共情能力优秀 (前5%)。前扣带回和岛叶发育良好，可能具有出色的情绪感知和共情能力。适合心理咨询、社会工作等领域。'
  } else if (value > 1.5) {
    return '共情能力良好 (前7%)。共情相关皮层发育较好，情绪理解和社交认知能力高于平均水平。'
  } else if (value > 0.5) {
    return '共情能力较好。共情相关皮层发育良好，具有正常的情绪感知能力。'
  } else if (value > -0.5) {
    return '共情能力正常。共情相关皮层发育处于正常范围。'
  }
  return '共情能力需关注。共情相关皮层发育偏弱，可通过社交训练来改善。'
}

// 执行功能指数解释
export function getExecutiveInterpretation(value: number): string {
  if (value > 1.9) {
    return '执行功能卓越 (前3%)。前额叶皮层高度发达，可能具有出色的计划、决策、工作记忆和认知控制能力。适合管理、战略规划等领域。'
  } else if (value > 1.8) {
    return '执行功能优秀 (前4%)。前额叶发育良好，执行功能显著高于平均水平。'
  } else if (value > 1.0) {
    return '执行功能良好 (前16%)。前额叶发育较好，具有良好的计划和决策能力。'
  } else if (value > -0.5) {
    return '执行功能正常。前额叶发育处于正常范围。'
  }
  return '执行功能需关注。前额叶发育偏弱，可通过认知训练来改善。'
}

// 空间加工指数解释
export function getSpatialInterpretation(value: number): string {
  if (value > 1.5) {
    return '空间能力优秀 (前7%)。顶叶皮层高度发达，可能具有出色的空间想象、心理旋转和导航能力。适合建筑、设计、工程等领域。'
  } else if (value > 1.2) {
    return '空间能力良好 (前11%)。顶叶发育较好，空间加工能力高于平均水平。'
  } else if (value > 0.5) {
    return '空间能力较好。顶叶发育良好，具有正常的空间感知能力。'
  } else if (value > -0.5) {
    return '空间能力正常。顶叶发育处于正常范围。'
  }
  return '空间能力需关注。顶叶发育偏弱，可通过空间训练来改善。'
}

// 流体智力指数解释
export function getFluidIntelligenceInterpretation(value: number): string {
  if (value > 2.1) {
    return '流体智力结构估计卓越 (前1.8%)。多个认知相关皮层区域高度发达，脑结构为高水平认知功能提供了良好的生理基础。注意：这是结构指标能达到的最高估计。'
  } else if (value > 2.0) {
    return '流体智力结构估计优秀 (前2.5%)。认知相关皮层发育良好，具有较高的认知潜力。'
  } else if (value > 1.5) {
    return '流体智力结构估计良好 (前7%)。认知相关皮层发育较好，认知能力高于平均水平。'
  } else if (value > 0.5) {
    return '流体智力结构估计较好。认知相关皮层发育良好。'
  } else if (value > -0.5) {
    return '流体智力结构估计正常。认知相关皮层发育处于正常范围。'
  }
  return '流体智力结构估计需关注。认知相关皮层发育偏弱，可通过认知训练来改善。'
}

// 空间注意偏向指数解释
export function getSpatialAttentionInterpretation(value: number): string {
  if (value >= 0.80) {
    return '极强右偏（前5%）。右侧顶叶注意网络显著优势，空间注意力高度偏向左侧视野，可能在左侧空间任务中表现更敏锐。'
  } else if (value >= 0.40) {
    return '明显右偏（前15%）。右侧顶叶占优势，空间注意力偏向左侧视野，符合典型的右半球空间优势模式。'
  } else if (value >= -0.20) {
    return '均衡/轻度右偏。空间注意网络左右均衡，双侧视野注意力分配较为对称。'
  } else if (value >= -0.40) {
    return '轻度左偏。左侧顶叶略占优势，空间注意力可能偏向右侧视野。'
  }
  return '明显左偏（较罕见）。左侧顶叶显著优势，空间注意力偏向右侧视野，属于非典型模式。'
}

// 情绪加工偏侧化指数解释
export function getEmotionLateralizationInterpretation(value: number): string {
  if (value >= 0.90) {
    return '极强右偏（前8%）。右侧情绪加工网络显著优势，对负性情绪（恐惧、悲伤）的感知可能更敏锐。'
  } else if (value >= 0.50) {
    return '明显右偏。右侧岛叶和眶额皮层占优势，情绪感知偏向负性情绪加工，符合典型的右半球情绪优势假说。'
  } else if (value >= -0.30) {
    return '均衡。情绪加工网络左右均衡，正负情绪加工能力较为对称。'
  } else if (value >= -0.50) {
    return '轻度左偏。左侧情绪网络略占优势，可能对正性情绪更敏感。'
  }
  return '明显左偏（常见于抑郁倾向）。左侧情绪网络显著优势，研究表明这种模式与抑郁倾向相关，建议关注情绪健康。'
}

// 面孔识别偏侧化指数解释
export function getFaceRecognitionInterpretation(value: number): string {
  if (value >= 1.00) {
    return '极强右偏（前3%）。右侧梭状回面孔区（FFA）高度发达，面孔识别能力可能非常出色，适合需要快速识别面孔的职业。'
  } else if (value >= 0.60) {
    return '明显右偏（前10%）。右侧面孔加工网络占优势，符合典型的右半球面孔识别优势模式，面孔记忆能力较好。'
  } else if (value >= -0.20) {
    return '均衡。面孔识别网络左右较为均衡，面孔识别能力处于正常范围。'
  } else if (value >= -0.60) {
    return '轻度左偏（较少见）。左侧面孔网络略占优势，可能更擅长分析性的面孔特征加工。'
  }
  return '明显左偏（罕见）。左侧面孔网络显著优势，属于非典型模式，可能与面孔识别困难相关。'
}

// 音乐感知偏侧化指数解释
export function getMusicLateralizationInterpretation(value: number): string {
  if (value >= 1.20) {
    return '极强右偏（前1%）。右侧听觉皮层高度发达，对音乐旋律、音高和音色的感知可能非常敏锐，具有音乐天赋潜质。'
  } else if (value >= 0.70) {
    return '明显右偏（前8%）。右侧颞上回占优势，符合典型的右半球音乐加工优势模式，对旋律和节奏的感知能力较好。'
  } else if (value >= -0.30) {
    return '均衡。音乐感知网络左右较为均衡，音乐感知能力处于正常范围。'
  } else if (value >= -0.70) {
    return '轻度左偏。左侧听觉皮层略占优势，可能更擅长音乐的节奏和时序加工。'
  }
  return '明显左偏（罕见）。左侧听觉皮层显著优势，属于非典型模式。'
}

// 心理理论偏侧化指数解释
export function getTheoryOfMindInterpretation(value: number): string {
  if (value >= 0.80) {
    return '极强右偏（前8%）。右侧颞顶联合区（TPJ）和角回高度发达，心智化能力可能非常出色，善于理解他人意图和信念。'
  } else if (value >= 0.40) {
    return '明显右偏（前20%）。右侧心理理论网络占优势，符合典型的右半球社会认知优势模式，社交直觉较好。'
  } else if (value >= -0.20) {
    return '均衡。心理理论网络左右较为均衡，社会认知能力处于正常范围。'
  } else if (value >= -0.40) {
    return '轻度左偏。左侧心理理论网络略占优势，可能更擅长语言性的心智推理。'
  }
  return '明显左偏。左侧心理理论网络显著优势，属于非典型模式。'
}

// 阅读障碍风险指数解释
export function getDyslexiaRiskInterpretation(value: number): { riskLevel: string; interpretation: string } {
  if (value < -1.0) {
    return {
      riskLevel: '高风险',
      interpretation: '阅读障碍结构风险较高。左侧阅读相关皮层（颞上回、梭状回、顶下小叶、缘上回、颞中回）相对右侧明显偏小。这种左侧化不足的模式与阅读障碍的神经基础相关。建议进行专业的阅读能力评估，如有困难可寻求专业干预。'
    }
  } else if (value < -0.5) {
    return {
      riskLevel: '中风险',
      interpretation: '阅读障碍结构风险中等。左侧阅读相关皮层相对右侧略小，可能存在一定的阅读困难风险。建议关注阅读能力发展，如有困难可进行针对性训练。'
    }
  } else if (value < 0.5) {
    return {
      riskLevel: '低风险',
      interpretation: '阅读障碍结构风险较低。左右半球阅读相关皮层发育较为均衡，符合正常的左侧化模式。'
    }
  }
  return {
    riskLevel: '极低风险',
    interpretation: '阅读障碍结构风险极低。左侧阅读相关皮层发育良好，呈现典型的左侧优势模式，有利于阅读能力的发展。'
  }
}

// 逻辑推理偏侧化指数解释
export function getLogicalReasoningInterpretation(value: number): string {
  if (value <= -0.80) {
    return '极强左脑优势（前1%，逻辑天赋爆表）。左侧前额叶和顶叶高度发达，抽象推理和规则整合能力极为出色，适合数学、编程、哲学等需要严密逻辑的领域。'
  } else if (value <= -0.50) {
    return '显著左脑优势（前5%）。左侧执行控制网络占优势，逻辑推理能力显著高于平均水平，擅长演绎推理和问题解决。'
  } else if (value <= -0.20) {
    return '轻度左脑偏好（前20%）。左侧前额叶略占优势，符合典型的左半球逻辑优势模式，具有良好的分析推理能力。'
  } else if (value <= 0.20) {
    return '均衡/轻度右偏（最常见50%）。逻辑推理网络左右较为均衡，可能同时具备分析型和空间型推理能力。'
  } else if (value <= 0.50) {
    return '右脑优势（后10%）。右侧前额叶占优势，可能在空间型逻辑、整体性推理方面更强，适合建筑设计、战略规划等领域。'
  }
  return '显著右脑优势（罕见）。右侧推理网络显著优势，属于非典型模式，可能具有独特的空间-逻辑整合能力。'
}

// 数学能力偏侧化指数解释
export function getMathematicalAbilityInterpretation(value: number): string {
  if (value <= -0.90) {
    return '极强左脑优势（前1%，数学天赋变态强）。左侧内顶叶数值处理核心高度发达，数学直觉和算术能力极为出色，适合数学、物理、工程等高度数值化的领域。'
  } else if (value <= -0.60) {
    return '显著左脑优势（前3%）。左侧顶叶和额叶数学网络占优势，数学能力显著高于平均水平，擅长符号运算和代数推理。'
  } else if (value <= -0.20) {
    return '轻度左脑偏好（前15%）。左侧数值处理区略占优势，符合典型的左半球数学优势模式，具有良好的算术和代数能力。'
  } else if (value <= 0.20) {
    return '均衡/轻度右偏（最常见60%）。数学能力网络左右较为均衡，可能同时具备代数型和几何型数学思维。'
  } else if (value <= 0.40) {
    return '右脑优势（后10%）。右侧顶叶占优势，可能在空间数学、几何推理方面更强，适合几何学、拓扑学、建筑设计等领域。'
  }
  return '显著右脑优势（罕见）。右侧数学网络显著优势，属于非典型模式，可能具有独特的空间-数学整合能力。'
}
