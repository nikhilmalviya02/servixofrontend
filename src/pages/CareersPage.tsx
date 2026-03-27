const CareersPage = () => {
  return (
    <div style={{ 
      fontFamily: 'DM Sans, sans-serif', 
      backgroundColor: '#0a0a0f', 
      color: '#f0f0f8', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontFamily: 'Syne, sans-serif',
          fontSize: '2.5rem', 
          fontWeight: '800', 
          marginBottom: '2rem',
          color: '#f0f0f8'
        }}>
          Join Our Team
        </h1>
        
        <div style={{ backgroundColor: '#12121a', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '1rem' }}>Build Your Career with ServexaGo</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
            We're looking for talented individuals who are passionate about revolutionizing the service industry. Join us in our mission to connect people with trusted professionals across India.
          </p>
          
          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#1a1a26', padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>� Why Work With Us?</h3>
              <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>Competitive salary and benefits</li>
                <li>Flexible work arrangements</li>
                <li>Professional growth opportunities</li>
                <li>Innovative and collaborative culture</li>
                <li>Make a real impact in people's lives</li>
              </ul>
            </div>
            
            <div style={{ backgroundColor: '#1a1a26', padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ color: '#ffbe0b', marginBottom: '0.5rem' }}>� How to Apply</h3>
              <p style={{ marginBottom: '0.5rem' }}>Send your resume to: <strong>careers@servexago.com</strong></p>
              <p style={{ fontSize: '0.9rem', color: '#888899' }}>Please include the position title in your subject line</p>
            </div>
          </div>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '2rem', marginBottom: '1rem' }}>Open Positions</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ borderLeft: '3px solid #ff6b35', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#f0f0f8', marginBottom: '0.5rem' }}>Senior Frontend Developer</h4>
              <p style={{ fontSize: '0.9rem', color: '#888899', marginBottom: '0.5rem' }}>Experience: 3-5 years | Location: Bangalore/Remote</p>
              <p style={{ fontSize: '0.9rem', color: '#888899' }}>React, TypeScript, modern web technologies</p>
            </div>
            <div style={{ borderLeft: '3px solid #00d4ff', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#f0f0f8', marginBottom: '0.5rem' }}>Backend Engineer</h4>
              <p style={{ fontSize: '0.9rem', color: '#888899', marginBottom: '0.5rem' }}>Experience: 2-4 years | Location: Mumbai/Hybrid</p>
              <p style={{ fontSize: '0.9rem', color: '#888899' }}>Node.js, Python, cloud services, databases</p>
            </div>
            <div style={{ borderLeft: '3px solid #ffbe0b', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#f0f0f8', marginBottom: '0.5rem' }}>Product Manager</h4>
              <p style={{ fontSize: '0.9rem', color: '#888899', marginBottom: '0.5rem' }}>Experience: 3-6 years | Location: Delhi</p>
              <p style={{ fontSize: '0.9rem', color: '#888899' }}>Product strategy, user research, agile methodologies</p>
            </div>
            <div style={{ borderLeft: '3px solid #4ade80', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#f0f0f8', marginBottom: '0.5rem' }}>Customer Success Manager</h4>
              <p style={{ fontSize: '0.9rem', color: '#888899', marginBottom: '0.5rem' }}>Experience: 2-3 years | Location: Pune</p>
              <p style={{ fontSize: '0.9rem', color: '#888899' }}>Customer support, relationship management, problem-solving</p>
            </div>
            <div style={{ borderLeft: '3px solid #b478ff', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#f0f0f8', marginBottom: '0.5rem' }}>Marketing Specialist</h4>
              <p style={{ fontSize: '0.9rem', color: '#888899', marginBottom: '0.5rem' }}>Experience: 1-3 years | Location: Remote</p>
              <p style={{ fontSize: '0.9rem', color: '#888899' }}>Digital marketing, content creation, social media</p>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem' }}>
            <h3 style={{ color: '#ff6b35', marginBottom: '0.5rem' }}>Internship Opportunities</h3>
            <p style={{ lineHeight: '1.6' }}>
              We offer exciting internship programs for students and recent graduates. Gain hands-on experience in a fast-growing startup environment. Send your resume to <strong>internships@servexago.com</strong>
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a 
            href="/" 
            style={{ 
              color: '#ff6b35', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
