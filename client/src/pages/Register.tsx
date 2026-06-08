import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'renter' | 'dealer'>(
    (sessionStorage.getItem('preselect_role') as 'dealer' | null) ?? 'renter'
  );
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    businessName: '', city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionStorage.removeItem('preselect_role');
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate(role === 'dealer' ? '/dashboard' : '/cars', { replace: true });
  }, [isAuthenticated, navigate, role]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setError('All fields are required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (role === 'dealer' && !form.businessName) {
      setError('Business name is required for dealers');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
        businessName: role === 'dealer' ? form.businessName : undefined,
        city: form.city || undefined,
      });
      navigate(role === 'dealer' ? '/dashboard' : '/cars', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏎</div>
            <span style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EliteMotors</span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--txt)', marginTop: 20, marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'var(--txt2)' }}>
            Already have one?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>

        <div className="glass" style={{ borderRadius: 20, padding: '28px 32px' }}>
          {/* Role tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {(['renter', 'dealer'] as const).map((r) => (
              <button
                key={r}
                id={`role-${r}`}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 9, border: 'none',
                  background: role === r ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'transparent',
                  color: role === r ? '#000' : 'var(--txt2)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  fontFamily: 'var(--font)', transition: 'all .2s',
                }}
              >
                {r === 'renter' ? '🔍 Buyer / Renter' : '🏢 Car Dealer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="reg-name" type="text" className="form-input" placeholder="John Doe" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone (WhatsApp)</label>
                <input id="reg-phone" type="tel" className="form-input" placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="reg-email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="reg-password" type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            </div>

            {/* Dealer-only fields */}
            {role === 'dealer' && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
                    Dealer Information
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input id="reg-business" type="text" className="form-input" placeholder="e.g. Lagos Premium Motors" value={form.businessName} onChange={(e) => update('businessName', e.target.value)} required={role === 'dealer'} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input id="reg-city" type="text" className="form-input" placeholder="e.g. Lagos, Abuja…" value={form.city} onChange={(e) => update('city', e.target.value)} />
                </div>
              </>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <button
              id="reg-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 4 }}
            >
              {loading
                ? <><span className="spinner" /> Creating account…</>
                : role === 'dealer' ? '🏢 Create Dealer Account →' : '🚀 Get Started Free →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--txt3)', marginTop: 20 }}>
          By creating an account you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
