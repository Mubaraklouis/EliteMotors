import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Car } from '../types';
import { carsService } from '../services/cars.service';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const { user, dealer } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const data = await carsService.getMyCars();
      setCars(data);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleDelete = async (car: Car) => {
    if (!confirm(`Delete "${car.title}"? This cannot be undone.`)) return;
    setDeletingId(car.id);
    try {
      await carsService.deleteCar(car.id);
      setSuccessMsg(`"${car.title}" deleted.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchCars();
    } catch {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalViews = cars.reduce((sum, c) => sum + (c.views || 0), 0);
  const activeListings = cars.filter((c) => c.status === 'available').length;
  const rentedCars = cars.filter((c) => c.status === 'rented').length;

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--txt)' }}>
                  Welcome back, <span className="gradient-text">{dealer?.business_name ?? user?.full_name ?? 'Dealer'}</span>
                </h1>
                <span className="badge badge-amber">Dealer</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--txt2)' }}>
                Manage your listings, track performance, and connect with buyers.
              </p>
            </div>
            <Link to="/dashboard/upload" className="btn btn-primary" style={{ textDecoration: 'none', flexShrink: 0 }}>
              + Upload New Car
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          <StatsCard title="Total Listings" value={cars.length} icon="" />
          <StatsCard title="Active Listings" value={activeListings} icon="" color="var(--success)" />
          <StatsCard title="Currently Rented" value={rentedCars} icon="" color="var(--warn)" />
          <StatsCard title="Total Views" value={totalViews} icon="" color="#60a5fa" />
        </div>

        {/* Success message */}
        {successMsg && <div className="alert alert-success" style={{ marginBottom: 20 }}>{successMsg}</div>}

        {/* Listings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--txt)' }}>My Listings</h2>
          {!loading && cars.length > 0 && (
            <p style={{ fontSize: 13, color: 'var(--txt3)' }}>{cars.length} car{cars.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="card" style={{ padding: '56px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--txt2)' }}>No listings</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 8 }}>No listings yet</h3>
            <p style={{ color: 'var(--txt2)', marginBottom: 24, fontSize: 14 }}>Upload your first car to start receiving inquiries</p>
            <Link to="/dashboard/upload" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              + Upload Your First Car
            </Link>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Car', 'Type', 'Price', 'Status', 'Views', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background .15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Car info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 52, height: 38, borderRadius: 8, overflow: 'hidden', background: 'var(--bg2)', flexShrink: 0 }}>
                            <img
                              src={carsService.imgUrl(car.primary_image)}
                              alt={car.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.src = carsService.imgUrl(null); }}
                            />
                          </div>
                          <div>
                            <Link to={`/cars/${car.id}`} style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', textDecoration: 'none', display: 'block', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {car.title}
                            </Link>
                            <div style={{ fontSize: 12, color: 'var(--txt3)' }}>{car.make} {car.model} · {car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`badge ${car.listing_type === 'sale' ? 'badge-amber' : car.listing_type === 'rent' ? 'badge-blue' : 'badge-orange'}`}>
                          {car.listing_type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {car.daily_rate ? `$${Number(car.daily_rate).toLocaleString()}/day` : ''}
                        {car.daily_rate && car.price ? ' · ' : ''}
                        {car.price ? `$${Number(car.price).toLocaleString()}` : ''}
                        {!car.daily_rate && !car.price ? '—' : ''}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`badge ${
                          car.status === 'available' ? 'badge-green' :
                          car.status === 'rented' ? 'badge-orange' :
                          car.status === 'sold' ? 'badge-red' : 'badge-gray'
                        }`}>{car.status}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--txt3)' }}>
                        {car.views}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link to={`/cars/${car.id}`} className="btn btn-ghost btn-xs" style={{ textDecoration: 'none' }}>
                            View
                          </Link>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => handleDelete(car)}
                            disabled={deletingId === car.id}
                          >
                            {deletingId === car.id ? <span className="spinner spinner-white" style={{ width: 12, height: 12 }} /> : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
