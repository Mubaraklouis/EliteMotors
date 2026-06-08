import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import type { Car, CarImage, Dealer } from '../types';
import { carsService } from '../services/cars.service';
import RentalModal from '../components/RentalModal';
import { useAuth } from '../context/AuthContext';

const fuelIcons: Record<string, string> = {
  petrol: '⛽', diesel: '🛢️', electric: '⚡', hybrid: '🔋', hydrogen: '💨',
};

const conditionLabel: Record<string, string> = {
  new: 'Brand New', used: 'Used', certified_pre_owned: 'Certified Pre-Owned',
};

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showRental, setShowRental] = useState(searchParams.get('action') === 'rent');
  const [rentalSuccess, setRentalSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    carsService.getCar(id)
      .then(({ car, images, dealer }) => {
        setCar(car);
        setImages(images);
        setDealer(dealer);
      })
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-open deal on WhatsApp if ?action=deal
  useEffect(() => {
    if (searchParams.get('action') === 'deal' && car && dealer?.phone) {
      const phone = dealer.phone.replace(/\D/g, '');
      const msg = encodeURIComponent(`Hi! I'm interested in your ${car.year} ${car.make} ${car.model} listed on EliteMotors. Is it still available?`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    }
  }, [car, dealer, searchParams]);

  const handleWhatsApp = () => {
    if (!dealer?.phone) return;
    const phone = dealer.phone.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Hi! I'm interested in your ${car!.year} ${car!.make} ${car!.model} (${car!.listing_type === 'rent' ? 'rental' : 'purchase'}) listed on EliteMotors. Is it still available?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const allImages = images.length > 0
    ? images.map((img) => carsService.imgUrl(img.url))
    : [carsService.imgUrl(car?.primary_image)];

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)' }}>
        <div className="container" style={{ paddingTop: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <div className="skeleton" style={{ height: 420, borderRadius: 16, marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ width: 80, height: 60, borderRadius: 8 }} />)}
              </div>
            </div>
            <div>
              {[180, 120, 80, 200].map((h, i) => (
                <div key={i} className="skeleton" style={{ height: h, borderRadius: 12, marginBottom: 16 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🚗</div>
        <h2 style={{ color: 'var(--txt)' }}>Car not found</h2>
        <Link to="/cars" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse All Cars</Link>
      </div>
    );
  }

  const canRent = (car.listing_type === 'rent' || car.listing_type === 'both') && car.status === 'available' && !!car.daily_rate;

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 32 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--txt3)', marginBottom: 28 }}>
          <Link to="/" style={{ color: 'var(--txt3)', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/cars" style={{ color: 'var(--txt3)', textDecoration: 'none' }}>Cars</Link>
          <span>›</span>
          <span style={{ color: 'var(--txt)' }}>{car.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 32, alignItems: 'start' }}>
          {/* LEFT — Gallery */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 12, aspectRatio: '16/10', position: 'relative' }}>
              <img
                src={allImages[activeImg]}
                alt={car.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = carsService.imgUrl(null); }}
              />
              {/* Status overlay */}
              {car.status !== 'available' && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '10px 24px', borderRadius: 40 }}>
                    {car.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 76, height: 56, borderRadius: 10, overflow: 'hidden',
                      border: `2px solid ${activeImg === i ? 'var(--accent)' : 'var(--border)'}`,
                      padding: 0, cursor: 'pointer', background: 'var(--bg2)',
                    }}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Full Specs */}
            <div className="card" style={{ marginTop: 28, padding: '24px 28px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--txt)', marginBottom: 20 }}>Full Specifications</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                {[
                  { label: 'Make', value: car.make },
                  { label: 'Model', value: car.model },
                  { label: 'Year', value: car.year },
                  { label: 'Condition', value: conditionLabel[car.condition] ?? car.condition },
                  { label: 'Fuel Type', value: `${fuelIcons[car.fuel_type] ?? ''} ${car.fuel_type}` },
                  { label: 'Transmission', value: car.transmission },
                  { label: 'Seats', value: `${car.seats} seats` },
                  { label: 'Doors', value: `${car.doors} doors` },
                  ...(car.color ? [{ label: 'Color', value: car.color }] : []),
                  ...(car.mileage ? [{ label: 'Mileage', value: `${car.mileage.toLocaleString()} km` }] : []),
                  ...(car.vin ? [{ label: 'VIN', value: car.vin }] : []),
                  ...(car.city ? [{ label: 'Location', value: car.city }] : []),
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--txt3)' }}>{label}</span>
                    <span style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="card" style={{ marginTop: 20, padding: '24px 28px' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Description</h2>
                <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.7 }}>{car.description}</p>
              </div>
            )}

            {/* Features */}
            {car.features?.length > 0 && (
              <div className="card" style={{ marginTop: 20, padding: '24px 28px' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Features</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {car.features.map((f) => (
                    <span key={f} className="tag">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}

            <p style={{ marginTop: 20, fontSize: 12, color: 'var(--txt3)' }}>
              👁 {car.views} views
            </p>
          </div>

          {/* RIGHT — Info & Actions */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div className="card" style={{ padding: '28px 24px', marginBottom: 20 }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className={`badge ${car.status === 'available' ? 'badge-green' : 'badge-red'}`}>{car.status}</span>
                <span className="badge badge-amber">{car.listing_type === 'both' ? 'RENT & BUY' : car.listing_type.toUpperCase()}</span>
                <span className="badge badge-gray">{conditionLabel[car.condition] ?? car.condition}</span>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', marginBottom: 4, lineHeight: 1.2 }}>{car.title}</h1>
              <p style={{ fontSize: 14, color: 'var(--txt2)', marginBottom: 20 }}>
                {car.make} {car.model} · {car.year}
                {car.city && ` · 📍 ${car.city}`}
              </p>

              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                {(car.listing_type === 'rent' || car.listing_type === 'both') && car.daily_rate && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>
                      ${Number(car.daily_rate).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--txt3)', marginLeft: 4 }}>/day</span>
                  </div>
                )}
                {(car.listing_type === 'sale' || car.listing_type === 'both') && car.price && (
                  <div>
                    <span style={{ fontSize: car.listing_type === 'both' ? 18 : 32, fontWeight: car.listing_type === 'both' ? 600 : 900, color: car.listing_type === 'both' ? 'var(--txt2)' : 'var(--accent)' }}>
                      ${Number(car.price).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--txt3)', marginLeft: 4 }}>sale price</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dealer?.phone ? (
                  <button
                    id="whatsapp-deal-btn"
                    className="btn btn-whatsapp btn-lg"
                    onClick={handleWhatsApp}
                    style={{ width: '100%', fontSize: 15 }}
                  >
                    💬 Go for Deal on WhatsApp
                  </button>
                ) : (
                  <div className="alert alert-info">No contact number available</div>
                )}

                {canRent && (
                  <button
                    id="rent-now-btn"
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      if (!isAuthenticated) {
                        window.location.href = `/login?redirect=/cars/${car.id}`;
                      } else {
                        setShowRental(true);
                      }
                    }}
                    style={{ width: '100%', fontSize: 15 }}
                  >
                    🚗 Rent Now
                  </button>
                )}

                {rentalSuccess && (
                  <div className="alert alert-success">✅ Rental confirmed! The dealer will contact you shortly.</div>
                )}
              </div>
            </div>

            {/* Dealer card */}
            {dealer && (
              <div className="card" style={{ padding: '20px 24px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>Listed By</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: '#000', flexShrink: 0,
                  }}>
                    {dealer.business_name?.[0]?.toUpperCase() ?? 'D'}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>{dealer.business_name}</div>
                    {dealer.city && <div style={{ fontSize: 13, color: 'var(--txt3)' }}>📍 {dealer.city}</div>}
                    {dealer.rating > 0 && (
                      <div style={{ fontSize: 13, color: 'var(--accent)' }}>
                        {'⭐'.repeat(Math.round(dealer.rating))} {Number(dealer.rating).toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
                {dealer.description && (
                  <p style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.6 }}>{dealer.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rental modal */}
      {showRental && car && (
        <RentalModal
          car={car}
          onClose={() => setShowRental(false)}
          onSuccess={() => {
            setShowRental(false);
            setRentalSuccess(true);
            setCar((c) => c ? { ...c, status: 'rented' } : c);
          }}
        />
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          .container > div > div:last-child {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
