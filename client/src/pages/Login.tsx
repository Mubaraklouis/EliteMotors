import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left panel — branding */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 48px',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          borderRight: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}
        className="auth-panel"
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '30%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#000' }}>EM</div>
            <span style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EliteMotors</span>
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'var(--txt)', marginBottom: 16, lineHeight: 1.1 }}>
            Your next car<br />
            <span className="gradient-text">is one deal away</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--txt2)', lineHeight: 1.7, marginBottom: 40 }}>
            Connect with verified dealers, rent instantly, and buy with confidence — all via WhatsApp.
          </p>

          {/* Quote */}
          <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, borderLeft: '3px solid var(--accent)' }}>
            <p style={{ fontSize: 14, color: 'var(--txt2)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10 }}>
              "Found my dream car in 20 minutes. Contacted the dealer directly on WhatsApp, sealed the deal same day!"
            </p>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>— Chukwuemeka A., Lagos</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', maxWidth: 480 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--txt)', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--txt2)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--txt3)', cursor: 'pointer', fontSize: 16,
                }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: 32, padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.1)', fontSize: 13, color: 'var(--txt2)' }}>
          <strong style={{ color: 'var(--accent)' }}>Are you a dealer?</strong><br />
          Register as a dealer to list your cars and manage your inventory.{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Create dealer account →
          </Link>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .auth-panel { display: none !important; } }`}</style>
    </div>
  );
}
