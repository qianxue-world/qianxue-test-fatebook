import './Sidebar.css'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: 'overview' | 'special') => void
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo"></span>
        <h1>潜学分析平台</h1>
      </div>
      
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentPage === 'overview' ? 'active' : ''}`}
          onClick={() => onPageChange('overview')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">整体报告</span>
        </button>
        
        <button
          className={`nav-item ${currentPage === 'special' ? 'active' : ''}`}
          onClick={() => onPageChange('special')}
        >
          <span className="nav-icon">🔬</span>
          <span className="nav-text">DKT 精细分析</span>
        </button>
      </nav>
      
      <div className="sidebar-footer">
        <p>FreeSurfer 8.0</p>
        <p>DKT Atlas</p>
      </div>
    </aside>
  )
}
