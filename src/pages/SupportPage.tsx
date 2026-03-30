const SupportPage = () => {
  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif', 
      backgroundColor: '#ffffff', 
      color: '#1e293b', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontFamily: 'Inter, sans-serif',
          fontSize: '2.5rem', 
          fontWeight: '800', 
          marginBottom: '2rem',
          color: '#1e293b'
        }}>
          Support Center
        </h1>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>How Can We Help You?</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
            At ServexaGo, we're committed to providing you with the best service experience. Our support team is here to help with any questions or issues you may have.
          </p>
          
          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ color: '#0ea5e9', marginBottom: '0.5rem' }}>📧 Email Support</h3>
              <p style={{ marginBottom: '0.5rem' }}>Get help via email: <strong>support@servexago.com</strong></p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Response time: 24-48 hours</p>
            </div>
            
            <div style={{ backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ color: '#06b6d4', marginBottom: '0.5rem' }}>📞 Phone Support</h3>
              <p style={{ marginBottom: '0.5rem' }}>Call us: <strong>+91 98765 43210</strong></p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Available: Mon-Fri, 9AM-6PM</p>
            </div>
          </div>
          
          <h3 style={{ color: '#1e293b', marginTop: '2rem', marginBottom: '1rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How do I book a service?</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Browse services, select what you need, and follow the booking process.</p>
            </div>
            <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How do I cancel a booking?</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Go to My Bookings and select the booking you want to cancel.</p>
            </div>
            <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '1rem' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How do payments work?</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Payments are processed securely through our platform.</p>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a 
            href="/" 
            style={{ 
              color: '#3b82f6', 
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

export default SupportPage;
