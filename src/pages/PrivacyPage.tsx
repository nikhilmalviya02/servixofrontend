const PrivacyPage = () => {
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
          Privacy Policy
        </h1>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>Your Data is Secure with Us</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
            At ServexaGo, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our service booking platform.
          </p>
          
          <h3 style={{ color: '#1e293b', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Information We Collect</h3>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Name and contact information</li>
            <li>Service booking history</li>
            <li>Payment information (encrypted)</li>
            <li>Location data for service delivery</li>
            <li>Device and usage information</li>
          </ul>
          
          <h3 style={{ color: '#1e293b', marginTop: '1.5rem', marginBottom: '0.5rem' }}>How We Use Your Information</h3>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>To provide and improve our services</li>
            <li>To connect you with verified service providers</li>
            <li>To process payments securely</li>
            <li>To send important service updates</li>
            <li>To ensure platform safety and security</li>
          </ul>
          
          <h3 style={{ color: '#1e293b', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Data Protection</h3>
          <p style={{ lineHeight: '1.6' }}>
            We use industry-standard encryption and security measures to protect your personal information. Your data is never shared with third parties without your explicit consent, except as required by law.
          </p>
          
          <h3 style={{ color: '#1e293b', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Contact Us</h3>
          <p style={{ lineHeight: '1.6' }}>
            If you have questions about this privacy policy, please contact us at privacy@servexago.com
          </p>
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

export default PrivacyPage;
