import { useState } from 'react'
import { mockOffices, mockFAQs } from '../data/mockData'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 4000)
  }

  return (
    <div className="page contact-page">
      <section className="contact-hero">
        <div className="hero-badge">📬 Get in Touch</div>
        <h1 className="hero-title">We'd Love to Hear From You</h1>
        <p className="hero-description">
          Have a question about our React sessions, mentoring, or partnership opportunities? Send us a message or reach out directly.
        </p>
      </section>

      <div className="contact-layout-grid">
        {/* Contact Form */}
        <div className="contact-form-container">
          <h2 className="section-title">Send a Message</h2>
          <p className="section-subtitle">Fill out the mock contact form below</p>

          {submitted && (
            <div className="success-banner">
              🎉 Thank you, <strong>{formData.name || 'Friend'}</strong>! Your mock message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Session question / general inquiry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={4}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message 🚀
            </button>
          </form>
        </div>

        {/* Office Locations */}
        <div className="contact-info-container">
          <h2 className="section-title">Our Campuses</h2>
          <p className="section-subtitle">Find us at our collaborative learning hubs</p>

          <div className="offices-list">
            {mockOffices.map((office) => (
              <div key={office.city} className="office-card">
                <div className="office-header">
                  <span className="office-city">{office.city}, {office.country}</span>
                  {office.isHeadquarters && <span className="hq-badge">HQ</span>}
                </div>
                <p className="office-address">📍 {office.address}</p>
                <div className="office-details">
                  <span>📞 {office.phone}</span>
                  <span>✉️ {office.email}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-info-box">
            <h4>💡 Need Immediate Support?</h4>
            <p>Our core team is available Monday to Friday from 09:00 to 18:00 (GMT+3).</p>
          </div>
        </div>
      </div>

      {/* FAQs section */}
      <section className="faqs-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Common questions regarding the React Router setup</p>
          </div>
        </div>

        <div className="faqs-list">
          {mockFAQs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-card ${openFaq === faq.id ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle-icon">{openFaq === faq.id ? '−' : '+'}</span>
              </div>
              {openFaq === faq.id && <p className="faq-answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Contact
