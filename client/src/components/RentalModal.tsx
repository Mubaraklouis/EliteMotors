import { useState, useEffect } from 'react';
import type { Car } from '../types';
import { rentalsService } from '../services/rentals.service';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Props {
  car: Car;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RentalModal({ car, onClose, onSuccess }: Props) {
  const { isAuthenticated } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const dailyRate = Number(car.daily_rate) || 0;
  const totalAmount = totalDays > 0 ? totalDays * dailyRate : 0;

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!startDate || !endDate) { setError('Please select start and end dates'); return; }
    if (totalDays < 1) { setError('End date must be after start date'); return; }

    setLoading(true);
    try {
      await rentalsService.createRental({
        carId: car.id,
        startDate,
        endDate,
        notes: notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to create rental. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt)', marginBottom: 4 }}>
              Rent This Car
            </h2>
            <p style={{ fontSize: 13, color: 'var(--txt2)' }}>
              {car.year} {car.make} {car.model}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--txt3)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 20, marginBottom: 12, color: 'var(--txt3)' }}>Locked</div>
            <p style={{ color: 'var(--txt2)', marginBottom: 20, fontSize: 14 }}>
              Please sign in to rent this car
            </p>
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Sign In to Continue
            </Link>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 20, marginBottom: 16, color: 'var(--success)' }}>Success</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>
              Rental Confirmed!
            </h3>
            <p style={{ color: 'var(--txt2)', fontSize: 14 }}>
              Your {totalDays}-day rental has been booked for ${totalAmount.toLocaleString()}.<br />
              The dealer will be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Cost Summary */}
            {totalDays > 0 && (
              <div style={{
                background: 'var(--accent-sub)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--txt2)' }}>
                  <span>Duration</span>
                  <span style={{ color: 'var(--txt)' }}>{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--txt2)' }}>
                  <span>Daily Rate</span>
                  <span style={{ color: 'var(--txt)' }}>${dailyRate.toLocaleString()}/day</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(245,158,11,0.2)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
                  <span style={{ color: 'var(--txt)' }}>Total Amount</span>
                  <span style={{ color: 'var(--accent)' }}>${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or requests..."
                style={{ minHeight: 80 }}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || totalDays < 1}
                style={{ flex: 2 }}
              >
                {loading ? <><span className="spinner" />Confirming…</> : `Confirm Rental — $${totalAmount.toLocaleString()}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
