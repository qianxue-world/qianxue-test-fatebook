import { useState, useEffect, useCallback } from 'react'
import './App.css'

// 答案类型
interface Answer {
  num: number
  text: string
}

interface FateBook {
  name: string
  answers: Answer[]
  createdAt: string
}

// 生成随机答案
const positiveAnswers = [
  '是的，放手去做吧', '时机已到', '相信你的直觉', '好运即将降临',
  '答案就在你心中', '勇敢迈出第一步', '一切都会好起来', '坚持下去',
  '改变带来机遇', '你比想象中更强大', '爱会指引方向', '顺其自然',
  '新的开始在等你', '相信过程', '你值得拥有', '机会就在眼前',
  '前方是光明', '你的选择是对的', '继续前进', '成功在望',
]

const neutralAnswers = [
  '再等等看', '需要更多思考', '换个角度想想', '时机未到',
  '保持耐心', '观察周围的信号', '倾听内心的声音', '不急于决定',
  '静待花开', '顺势而为', '保持开放', '让时间给你答案',
]

const negativeAnswers = [
  '暂时放下', '此路不通', '需要改变方向', '退一步海阔天空',
  '放下执念', '接受现实', '学会说不', '保护好自己',
]

function generateRandomBook(): FateBook {
  const allAnswers = [...positiveAnswers, ...neutralAnswers, ...negativeAnswers]
  const answers: Answer[] = []

  for (let i = 1; i <= 100; i++) {
    answers.push({
      num: i,
      text: allAnswers[Math.floor(Math.random() * allAnswers.length)],
    })
  }

  return {
    name: '命运之书',
    answers,
    createdAt: new Date().toISOString(),
  }
}

// 从localStorage加载或生成新书
function loadOrCreateBook(): FateBook {
  const saved = localStorage.getItem('fateBook')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      // 解析失败，生成新书
    }
  }
  const book = generateRandomBook()
  localStorage.setItem('fateBook', JSON.stringify(book))
  return book
}

type Step = 'question' | 'priming' | 'number' | 'answer'

// 星空闪烁的答案项
interface StarItem {
  id: number
  text: string
  x: number
  y: number
  delay: number
  duration: number
}

function App() {
  const [book, setBook] = useState<FateBook>(loadOrCreateBook)
  const [step, setStep] = useState<Step>('question')
  const [question, setQuestion] = useState('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [showSettings, setShowSettings] = useState(false)
  const [starItems, setStarItems] = useState<StarItem[]>([])

  // 生成星空闪烁位置
  useEffect(() => {
    if (step === 'priming') {
      const items: StarItem[] = book.answers.map((answer, i) => ({
        id: i,
        text: `${answer.num}. ${answer.text}`,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        delay: Math.random() * 8,
        duration: 3 + Math.random() * 4,
      }))
      setStarItems(items)
    }
  }, [step, book.answers])

  // 30秒倒计时
  useEffect(() => {
    if (step !== 'priming') return
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step, countdown])

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      setStep('priming')
      setCountdown(30)
      setError('')
    }
  }

  const handleSkipPriming = useCallback(() => {
    setStep('number')
  }, [])

  const handlePrimingComplete = useCallback(() => {
    setStep('number')
  }, [])

  const handleNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(number)
    if (isNaN(num) || num < 1 || num > book.answers.length) {
      setError(`请输入1-${book.answers.length}之间的数字`)
      return
    }
    setError('')
    setStep('answer')
  }

  const getAnswer = () => {
    const num = parseInt(number)
    return book.answers.find((a) => a.num === num)
  }

  const reset = () => {
    setStep('question')
    setQuestion('')
    setNumber('')
    setError('')
    setCountdown(30)
  }

  const generateNewBook = () => {
    const newBook = generateRandomBook()
    setBook(newBook)
    localStorage.setItem('fateBook', JSON.stringify(newBook))
  }

  const exportBook = () => {
    const dataStr = JSON.stringify(book, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fate-book-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importBook = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as FateBook
        if (imported.answers && Array.isArray(imported.answers)) {
          setBook(imported)
          localStorage.setItem('fateBook', JSON.stringify(imported))
          alert('导入成功！')
        } else {
          alert('文件格式不正确')
        }
      } catch {
        alert('文件解析失败')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="app">
      {/* 设置按钮 */}
      <button
        className="settings-btn"
        onClick={() => setShowSettings(!showSettings)}
      >
        ✧
      </button>

      {/* 设置面板 */}
      {showSettings && (
        <div className="settings-panel">
          <h3>✧ 命运水晶设置</h3>
          <p className="book-info">当前书籍：{book.answers.length} 个答案</p>
          <div className="settings-actions">
            <button className="btn btn-small" onClick={generateNewBook}>
              ✦ 生成新书
            </button>
            <button className="btn btn-small" onClick={exportBook}>
              ↗ 导出JSON
            </button>
            <label className="btn btn-small btn-import">
              ↙ 导入JSON
              <input type="file" accept=".json" onChange={importBook} hidden />
            </label>
          </div>
          <button
            className="btn btn-close"
            onClick={() => setShowSettings(false)}
          >
            关闭
          </button>
        </div>
      )}

      {/* 潜意识启动阶段 - 星空闪烁 */}
      {step === 'priming' && (
        <div className="priming-container">
          {/* 星空闪烁背景 */}
          <div className={`star-field ${countdown <= 0 ? 'fadeout' : ''}`}>
            {starItems.map((item) => (
              <div
                key={item.id}
                className="star-item"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  animationDelay: `${item.delay}s`,
                  animationDuration: `${item.duration}s`,
                }}
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* 前景引导层 */}
          <div className="subliminal-overlay">
            <div className="subliminal-center">
              <div className="focus-point">✧</div>
              <h2>跟随星光呼吸...</h2>
              <p className="breath-guide">星光变亮时吸气，变暗时呼气</p>
              <p className="breath-hint">让思绪随星光流动，不必刻意记住什么</p>
              <div className="countdown-circle">
                <span>{countdown}</span>
              </div>
              {countdown > 0 ? (
                <button className="btn btn-text" onClick={handleSkipPriming}>
                  跳过
                </button>
              ) : (
                <button className="btn btn-ready" onClick={handlePrimingComplete}>
                  我准备好了
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 主界面 */}
      {step !== 'priming' && (
        <div className="main-container">
          {step === 'question' && (
            <div className="question-page">
              <div className="crystal-ball-small">✧</div>
              <h1 className="title">命运水晶</h1>
              <p className="subtitle">问出你的问题，星光将指引方向</p>
              <form onSubmit={handleQuestionSubmit} className="form">
                <textarea
                  className="input textarea"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="在心中想好问题，写下来..."
                  rows={3}
                />
                <button type="submit" className="btn" disabled={!question.trim()}>
                  ✧ 开始占卜
                </button>
              </form>
            </div>
          )}

          {step === 'number' && (
            <div className="number-page">
              <div className="crystal-ball-small">✧</div>
              <h2>你的问题</h2>
              <p className="question-text">"{question}"</p>
              <form onSubmit={handleNumberSubmit} className="form">
                <p className="hint">输入脑海中浮现的数字（1-{book.answers.length}）</p>
                <input
                  type="number"
                  className="input number-input"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="1-100"
                  min={1}
                  max={book.answers.length}
                  autoFocus
                />
                {error && <p className="error">{error}</p>}
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep('question')}
                  >
                    返回
                  </button>
                  <button type="submit" className="btn">
                    揭示答案
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'answer' && (
            <div className="answer-page">
              {/* 水晶球 */}
              <div className="crystal-ball">
                <div className="crystal-glow"></div>
                <div className="crystal-inner">
                  <span className="answer-number">#{number}</span>
                  <span className="answer-text">{getAnswer()?.text}</span>
                </div>
                <div className="crystal-shine"></div>
              </div>
              <p className="answer-hint">✧ 这是命运给你的答案 ✧</p>
              <button className="btn" onClick={reset}>
                再问一个问题
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
