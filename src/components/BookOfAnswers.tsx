import { useState, useEffect, useRef } from 'react'

interface Props {
  onBack: () => void
}

const DEFAULT_ANSWERS = [
  '是的', '不是', '也许吧', '绝对可以', '绝对不行', '再想想', '相信自己',
  '顺其自然', '时机未到', '现在就行动', '等待更好的机会', '答案在你心中',
  '放手去做', '三思而后行', '听从内心', '寻求帮助', '独立完成', '改变方向',
  '坚持下去', '适时放弃', '这是命中注定', '你可以改变它', '接受现实',
  '勇敢面对', '暂时搁置', '立即决定', '需要更多信息', '相信直觉',
  '理性分析', '感性选择', '两者皆可', '两者皆不可', '选择第一个',
  '选择最后一个', '随机选择', '问问朋友', '自己决定', '明天再说',
  '现在就做', '永远不要', '总有一天', '很快就会', '需要耐心',
  '加快速度', '慢慢来', '大胆尝试', '谨慎行事', '冒险一次',
  '保守一点', '打破常规', '遵循传统', '创新思维', '经典方法',
  '向前看', '回顾过去', '活在当下', '规划未来', '享受过程',
  '关注结果', '质量优先', '效率优先', '平衡发展', '专注一点',
  '全面发展', '深入研究', '广泛涉猎', '精益求精', '适可而止',
  '追求完美', '接受不完美', '高标准', '低期望', '乐观面对',
  '做好最坏打算', '期待最好结果', '顺势而为', '逆流而上', '随遇而安',
  '主动出击', '静观其变', '积极争取', '耐心等待', '果断行动',
  '深思熟虑', '跟随感觉', '依靠逻辑', '相信缘分', '创造机会',
  '把握机遇', '制造惊喜', '保持神秘', '坦诚相待', '适度保留',
  '全力以赴', '留有余地', '破釜沉舟', '稳扎稳打', '一步到位',
  '循序渐进', '大刀阔斧', '小心翼翼', '勇往直前', '以退为进'
]

type Phase = 'generate' | 'subliminal' | 'think' | 'input' | 'reveal'

interface BookData {
  title: string
  answers: string[]
  createdAt: string
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function BookOfAnswers({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('generate')
  const [book, setBook] = useState<BookData | null>(null)
  const [countdown, setCountdown] = useState(30)
  const [inputNumber, setInputNumber] = useState('')
  const [revealedAnswer, setRevealedAnswer] = useState<{ num: number; answer: string } | null>(null)
  const [bookTitle, setBookTitle] = useState('我的答案之书')
  const timerRef = useRef<number | null>(null)

  // 生成新书
  const generateBook = () => {
    const answers = shuffleArray(DEFAULT_ANSWERS).slice(0, 100)
    const newBook: BookData = {
      title: bookTitle,
      answers,
      createdAt: new Date().toISOString()
    }
    setBook(newBook)
    setPhase('subliminal')
    setCountdown(30)
  }

  // 倒计时
  useEffect(() => {
    if (phase === 'subliminal' && countdown > 0) {
      timerRef.current = window.setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (phase === 'subliminal' && countdown === 0) {
      setPhase('think')
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, countdown])

  // 跳过倒计时
  const skipCountdown = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase('think')
  }

  // 提交数字
  const handleSubmit = () => {
    const num = parseInt(inputNumber)
    if (book && num >= 1 && num <= 100) {
      setRevealedAnswer({ num, answer: book.answers[num - 1] })
      setPhase('reveal')
    }
  }

  // 导出JSON
  const exportJSON = () => {
    if (!book) return
    const blob = new Blob([JSON.stringify(book, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = `${book.title}_${Date.now()}.json`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  // 重新开始
  const restart = () => {
    setPhase('generate')
    setInputNumber('')
    setRevealedAnswer(null)
    setCountdown(30)
  }

  // 再问一次（保持同一本书）
  const askAgain = () => {
    setPhase('subliminal')
    setInputNumber('')
    setRevealedAnswer(null)
    setCountdown(30)
  }

  // 生成页面
  if (phase === 'generate') {
    return (
      <div className="feature-page">
        <aside className="feature-sidebar">
          <button className="back-btn" onClick={onBack}>← 返回首页</button>
          <div className="settings-card">
            <h3>📖 答案之书</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
              生成一本专属于你的答案之书，包含100个随机答案。
              通过潜意识引导，让命运为你指引方向。
            </p>
          </div>
          <div className="settings-card">
            <h3>💾 已有答案书？</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 12 }}>
              导入之前保存的JSON文件
            </p>
            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              📂 导入JSON
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (ev) => {
                    try {
                      const data = JSON.parse(ev.target?.result as string)
                      if (data.answers?.length === 100) {
                        setBook(data)
                        setBookTitle(data.title || '导入的答案书')
                        setPhase('subliminal')
                      }
                    } catch { alert('文件格式错误') }
                  }
                  reader.readAsText(file)
                }
              }} />
            </label>
          </div>
        </aside>
        <main className="feature-main">
          <h1 className="feature-title-main">📖 答案之书</h1>
          <p className="feature-subtitle">Book of Answers - 让潜意识为你指引方向</p>
          
          <div className="book-generate-card">
            <div className="book-icon">📚</div>
            <h2>创建你的答案之书</h2>
            <div className="setting-item" style={{ maxWidth: 300, margin: '20px auto' }}>
              <label>书名</label>
              <input 
                type="text" 
                className="text-input"
                value={bookTitle} 
                onChange={e => setBookTitle(e.target.value)}
                placeholder="给你的答案书起个名字"
              />
            </div>
            <button className="btn btn-primary btn-large" onClick={generateBook}>
              ✨ 生成答案之书
            </button>
          </div>
        </main>
      </div>
    )
  }

  // 潜意识引导页面
  if (phase === 'subliminal' && book) {
    // 创建多列滚动效果
    const columns = 8
    const itemsPerColumn = Math.ceil(book.answers.length / columns)
    
    return (
      <div className="subliminal-page">
        <div className="subliminal-background">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="subliminal-column"
              style={{ 
                left: `${colIndex * (100 / columns)}%`,
                animationDuration: `${20 + colIndex * 3}s`,
                animationDirection: colIndex % 2 === 0 ? 'normal' : 'reverse'
              }}
            >
              {/* 重复两次以实现无缝滚动 */}
              {[0, 1].map(repeat => (
                <div key={repeat} className="subliminal-column-content">
                  {book.answers.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn).map((answer, i) => {
                    const actualIndex = colIndex * itemsPerColumn + i
                    return (
                      <div key={`${repeat}-${i}`} className="subliminal-item">
                        {actualIndex + 1}. {answer}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="subliminal-overlay">
          <div className="subliminal-center">
            <div className="focus-point">●</div>
            <h2>请盯着中心点</h2>
            <p>放松30秒，不要刻意去看背景文字</p>
            <p>让眼睛自然浏览...</p>
            <div className="countdown-circle">
              <span>{countdown}</span>
            </div>
            <button className="btn btn-text" onClick={skipCountdown} style={{ color: 'rgba(255,255,255,0.5)' }}>
              跳过
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 思考阶段
  if (phase === 'think') {
    return (
      <div className="think-page">
        <div className="think-content">
          <div className="think-icon">🔮</div>
          <h2>现在，闭上眼睛</h2>
          <p>在心中默想你的问题...</p>
          <p className="think-hint">让一个 1-100 的数字自然浮现</p>
          <button className="btn btn-primary btn-large" onClick={() => setPhase('input')}>
            我想好了
          </button>
        </div>
      </div>
    )
  }

  // 输入数字
  if (phase === 'input') {
    return (
      <div className="think-page">
        <div className="think-content">
          <div className="think-icon">✨</div>
          <h2>你心中的数字是？</h2>
          <input
            type="number"
            className="number-input"
            min={1}
            max={100}
            value={inputNumber}
            onChange={e => setInputNumber(e.target.value)}
            placeholder="1-100"
            autoFocus
          />
          <button 
            className="btn btn-primary btn-large" 
            onClick={handleSubmit}
            disabled={!inputNumber || +inputNumber < 1 || +inputNumber > 100}
          >
            揭示答案
          </button>
        </div>
      </div>
    )
  }

  // 揭示答案
  if (phase === 'reveal' && revealedAnswer) {
    return (
      <div className="feature-page">
        <aside className="feature-sidebar">
          <button className="back-btn" onClick={onBack}>← 返回首页</button>
          <div className="settings-card">
            <h3>📖 {book?.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>
              你选择了第 {revealedAnswer.num} 个答案
            </p>
          </div>
          <div className="settings-card">
            <h3>🔧 操作</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-secondary" onClick={askAgain}>🔄 再问一次</button>
              <button className="btn btn-secondary" onClick={exportJSON}>💾 导出JSON</button>
              <button className="btn btn-secondary" onClick={restart}>📚 生成新书</button>
            </div>
          </div>
        </aside>
        <main className="feature-main">
          <div className="reveal-card">
            <div className="reveal-number">#{revealedAnswer.num}</div>
            <div className="reveal-answer">{revealedAnswer.answer}</div>
            <p className="reveal-hint">这就是命运给你的答案 ✨</p>
          </div>
        </main>
      </div>
    )
  }

  return null
}
