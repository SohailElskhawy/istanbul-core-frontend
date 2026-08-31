import { useState } from 'react'
import { mockProducts, mockStats } from '../data/mockData'

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const categories = ['All', ...new Set(mockProducts.map((p) => p.category))]

  const filteredProducts =
    selectedCategory === 'All'
      ? mockProducts
      : mockProducts.filter((p) => p.category === selectedCategory)

  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-badge">🚀 Session 4: React Routing & Mock Data</div>
        <h1 className="hero-title">
          Explore Our Learning Tracks & Resources
        </h1>
        <p className="hero-description">
          Building scalable, performant React applications with TypeScript, nested layouts, and robust state management.
        </p>

        <div className="stats-row">
          {mockStats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Curriculum</h2>
            <p className="section-subtitle">Loaded dynamically from local mock dataset</p>
          </div>

          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-cards">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <span className="product-icon">{product.icon}</span>
                <span className="product-badge">{product.category}</span>
              </div>
              <h3 className="product-title">{product.title}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <span className="product-rating">⭐ {product.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
