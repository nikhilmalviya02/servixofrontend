const TermsPage = () => {
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
          Terms of Service
        </h1>
        
        <div style={{ backgroundColor: '#12121a', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '1rem' }}>By Using Our Platform, You Agree to Our Terms</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
            Welcome to ServexaGo! These terms and conditions govern your use of our service booking platform. By accessing or using ServexaGo, you agree to be bound by these terms.
          </p>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Service Agreement</h3>
          <p style={{ lineHeight: '1.6' }}>
            ServexaGo is a platform that connects users with verified service providers. We facilitate bookings but are not directly responsible for the services provided.
          </p>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>User Responsibilities</h3>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Provide accurate information when booking services</li>
            <li>Make payments on time for services rendered</li>
            <li>Treat service providers with respect</li>
            <li>Follow safety guidelines during service delivery</li>
            <li>Report any issues promptly</li>
          </ul>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Provider Responsibilities</h3>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Provide professional and quality services</li>
            <li>Arrive on time for scheduled appointments</li>
            <li>Maintain proper tools and equipment</li>
            <li>Follow safety protocols</li>
            <li>Communicate clearly with customers</li>
          </ul>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Payment Terms</h3>
          <p style={{ lineHeight: '1.6' }}>
            All payments are processed securely through our platform. Refunds are subject to our cancellation policy and may take 5-7 business days to process.
          </p>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Limitation of Liability</h3>
          <p style={{ lineHeight: '1.6' }}>
            ServexaGo is not liable for any damages arising from services provided by independent professionals. We encourage users to verify credentials and read reviews before booking.
          </p>
          
          <h3 style={{ color: '#f0f0f8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Contact Us</h3>
          <p style={{ lineHeight: '1.6' }}>
            For questions about these terms, contact us at legal@servexago.com
          </p>
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

export default TermsPage;
