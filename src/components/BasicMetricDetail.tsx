import './BasicMetricDetail.css'

export interface BasicMetric {
  id: string
  name: string
  value: number
  unit: string
  icon: string
  description: string
  normalRange: string
  interpretation: string
  relatedFunctions: string[]
  references: string[]
}

interface Props {
  metric: BasicMetric
  onBack: () => void
}

export default function BasicMetricDetail({ metric, onBack }: Props) {
  return (
    <div className="basic-metric-detail">
      <button className="back-button" onClick={onBack}>
        ← 返回
      </button>

      <header className="detail-header">
        <span className="detail-icon">{metric.icon}</span>
        <h1>{metric.name}</h1>
      </header>

      {/* 核心数值 */}
      <section className="value-section">
        <div className="value-display">
          <span className="value-number">{metric.value.toFixed(metric.unit === 'mm' ? 2 : 0)}</span>
          <span className="value-unit">{metric.unit}</span>
        </div>
        <div className="normal-range">
          <span className="range-label">参考范围:</span>
          <span className="range-value">{metric.normalRange}</span>
        </div>
      </section>

      {/* 指标说明 */}
      <section className="detail-section">
        <h2>📝 指标说明</h2>
        <div className="description-box">
          <p>{metric.description}</p>
        </div>
      </section>

      {/* 结果解读 */}
      <section className="detail-section">
        <h2>🔍 结果解读</h2>
        <div className="interpretation-box">
          <p>{metric.interpretation}</p>
        </div>
      </section>

      {/* 相关功能 */}
      <section className="detail-section">
        <h2>🧠 相关脑功能</h2>
        <div className="functions-list">
          {metric.relatedFunctions.map((func, i) => (
            <div key={i} className="function-item">
              <span className="function-bullet">•</span>
              <span>{func}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 参考文献 */}
      <section className="detail-section">
        <h2>📚 参考文献</h2>
        <div className="references-list">
          {metric.references.map((ref, i) => (
            <div key={i} className="reference-item">
              <span className="ref-number">[{i + 1}]</span>
              <span className="ref-text">{ref}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="detail-footer">
        <p>⚠️ 脑容量指标受年龄、性别、体型等多种因素影响，需结合个人情况综合解读。</p>
      </footer>
    </div>
  )
}
