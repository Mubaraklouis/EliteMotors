import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isDealer, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path ? 'var(--accent)' : 'var(--txt2)';

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'all .3s ease',
          background: scrolled
            ? 'rgba(9,9,15,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>EM</div>
            <span style={{
              fontWeight: 800, fontSize: 18, letterSpacing: '-.02em',
              background: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              EliteMotors
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 4, flex: 1 }} className="desktop-nav">
            {[
              { path: '/', label: 'Home' },
              { path: '/cars', label: 'Cars' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(path),
                  background: location.pathname === path ? 'var(--accent-sub)' : 'transparent',
                  transition: 'all .2s',
                }}
              >
                {label}
              </Link>
            ))}
            {isDealer && (
              <Link
                to="/dashboard"
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive('/dashboard'),
                  background: location.pathname.startsWith('/dashboard') ? 'var(--accent-sub)' : 'transparent',
                  transition: 'all .2s',
                }}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                  Get Started
                </Link>
              </>
            ) : (
              <div style={{ position: 'relative' }}>
                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: 10, padding: '6px 12px',
                    cursor: 'pointer', color: 'var(--txt)',
                    fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                    transition: 'all .2s',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: '#000',
                  }}>
                    {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.full_name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--txt3)' }}>▼</span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div
                      className="glass"
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        width: 200, borderRadius: 12, padding: 8,
                        zIndex: 20, animation: 'scaleIn .15s ease',
                      }}
                    >
                      <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{user?.full_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 2 }}>{user?.email}</div>
                        {isDealer && (
                          <span className="badge badge-amber" style={{ marginTop: 6 }}>Dealer</span>
                        )}
                      </div>

                      {isDealer && (
                        <Link
                          to="/dashboard"
                          style={{
                            display: 'block', padding: '8px 12px',
                            borderRadius: 8, textDecoration: 'none',
                            fontSize: 13, color: 'var(--txt)', fontWeight: 500,
                          }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '8px 12px', borderRadius: 8,
                          background: 'none', border: 'none',
                          fontSize: 13, color: '#ef4444',
                          fontFamily: 'var(--font)', cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="mobile-only"
              onClick={() => setMobileOpen((o) => !o)}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 10px',
                color: 'var(--txt)', cursor: 'pointer', fontSize: 18,
                display: 'none',
              }}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="glass"
            style={{
              padding: '16px 24px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {[
              { path: '/', label: 'Home' },
              { path: '/cars', label: 'Cars' },
              ...(isDealer ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '10px 12px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 14,
                  color: 'var(--txt)', fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 12, display: 'flex', gap: 8 }}>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn btn-outline btn-sm" style={{ textDecoration: 'none', flex: 1 }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', flex: 1 }}>Get Started</Link>
                </>
              ) : (
                <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: 64 }} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </>
  );
}
