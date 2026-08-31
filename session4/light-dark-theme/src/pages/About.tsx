import { mockTeam } from '../data/mockData'

export const About = () => {
  return (
    <div className="page about-page">
      <section className="about-hero">
        <div className="hero-badge">💡 About Our Platform</div>
        <h1 className="hero-title">Empowering the Next Generation of Frontend Engineers</h1>
        <p className="hero-description">
          Core Istanbul is an intensive learning ecosystem dedicated to turning aspiring programmers into production-ready full-stack and frontend software engineers.
        </p>
      </section>

      <section className="about-details">
        <div className="about-cards-grid">
          <div className="info-card">
            <span className="info-icon">🎯</span>
            <h3>Our Mission</h3>
            <p>
              Deliver practical, hands-on software development training based on real-world industry patterns, clean code principles, and modern web architectures.
            </p>
          </div>
          <div className="info-card">
            <span className="info-icon">⚡</span>
            <h3>Modern Stack</h3>
            <p>
              Emphasizing modern React 19, TypeScript strict mode, Vite tooling, React Router 7, and component composition with Context API.
            </p>
          </div>
          <div className="info-card">
            <span className="info-icon">🤝</span>
            <h3>Community First</h3>
            <p>
              Fostering collaborative growth through peer pair-programming, interactive code reviews, and direct instructor mentorship.
            </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Instructors & Mentors</h2>
            <p className="section-subtitle">Meet the team shaping the curriculum</p>
          </div>
        </div>

        <div className="team-grid">
          {mockTeam.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">{member.avatar}</div>
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role">{member.role}</span>
              <p className="team-bio">{member.bio}</p>
              <div className="team-skills">
                {member.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About
