import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  dealerOnly?: boolean;
}

export default function ProtectedRoute({ children, dealerOnly = false }: Props) {
  const { isAuthenticated, isDealer, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-amber" style={{ width: 32, height: 32, margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--txt2)', fontSize: 14 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (dealerOnly && !isDealer) return <Navigate to="/cars" replace />;

  return <>{children}</>;
}
