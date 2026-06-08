import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>EM</div>
              <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                EliteMotors
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.7, maxWidth: 220 }}>
              Premium car deals and rentals. Connect directly with verified dealers via WhatsApp.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '.5px' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/cars', label: 'Browse Cars' },
                { to: '/register', label: 'List Your Car' },
                { to: '/dashboard', label: 'Dealer Dashboard' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{ fontSize: 13, color: 'var(--txt2)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--txt2)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* For Dealers */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '.5px' }}>For Dealers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { to: '/register', label: 'Create Dealer Account' },
                { to: '/dashboard/upload', label: 'Upload a Car' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{ fontSize: 13, color: 'var(--txt2)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--txt2)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '.5px' }}>Connect</h4>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'WhatsApp' },
                { label: 'Email' },
                { label: 'Twitter' },
              ].map(({ label }) => (
                <button key={label} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: 8, padding: '7px 12px',
                  color: 'var(--txt2)', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font)',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--txt3)' }}>
            © {year} EliteMotors. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: 'var(--txt3)' }}>
            Built for car enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
