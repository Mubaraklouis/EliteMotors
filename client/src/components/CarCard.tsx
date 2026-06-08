import { Link } from 'react-router-dom';
import type { Car } from '../types';
import { carsService } from '../services/cars.service';

interface Props {
  car: Car;
  onRent?: (car: Car) => void;
}

const fuelIcons: Record<string, string> = {
  petrol: '⛽', diesel: '🛢️', electric: '⚡', hybrid: '🔋', hydrogen: '💨',
};

const listingBadge = (type: string) => {
  if (type === 'sale') return { label: 'FOR SALE', cls: 'badge-amber' };
  if (type === 'rent') return { label: 'FOR RENT', cls: 'badge-blue' };
  return { label: 'RENT / BUY', cls: 'badge-orange' };
};

const statusColor = (status: string) => {
  if (status === 'available') return 'badge-green';
  if (status === 'rented') return 'badge-orange';
  if (status === 'sold') return 'badge-red';
  return 'badge-gray';
};

export default function CarCard({ car, onRent }: Props) {
  const badge = listingBadge(car.listing_type);
  const imgSrc = carsService.imgUrl(car.primary_image);

  const handleRentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRent) onRent(car);
  };

  const handleDealClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // We'll link to car detail where full dealer phone is available
    window.location.href = `/cars/${car.id}?action=deal`;
  };

  return (
    <Link to={`/cars/${car.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="car-card">
        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--bg2)' }}>
          <img
            src={imgSrc}
            alt={car.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
            }}
          />
          {/* Listing type badge */}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className={`badge ${badge.cls}`}>{badge.label}</span>
          </div>
          {/* Status badge */}
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className={`badge ${statusColor(car.status)}`}>{car.status}</span>
          </div>
          {car.is_featured && (
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <span className="badge badge-amber">⭐ Featured</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px 18px' }}>
          {/* Title */}
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: 'var(--txt)',
            marginBottom: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {car.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--txt2)', marginBottom: 12 }}>
            {car.make} {car.model} · {car.year}
          </p>

          {/* Specs row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--txt3)', display: 'flex', alignItems: 'center', gap: 3 }}>
              {fuelIcons[car.fuel_type] ?? '⛽'} {car.fuel_type}
            </span>
            <span style={{ fontSize: 12, color: 'var(--txt3)', display: 'flex', alignItems: 'center', gap: 3 }}>
              ⚙️ {car.transmission}
            </span>
            <span style={{ fontSize: 12, color: 'var(--txt3)', display: 'flex', alignItems: 'center', gap: 3 }}>
              👤 {car.seats} seats
            </span>
            {car.city && (
              <span style={{ fontSize: 12, color: 'var(--txt3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                📍 {car.city}
              </span>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 16 }}>
            {(car.listing_type === 'rent' || car.listing_type === 'both') && car.daily_rate && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
                  ${Number(car.daily_rate).toLocaleString()}
                </span>
                <span style={{ fontSize: 12, color: 'var(--txt3)' }}>/day</span>
              </div>
            )}
            {(car.listing_type === 'sale' || car.listing_type === 'both') && car.price && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: car.listing_type === 'both' ? 14 : 20, fontWeight: car.listing_type === 'both' ? 600 : 800, color: car.listing_type === 'both' ? 'var(--txt2)' : 'var(--accent)' }}>
                  ${Number(car.price).toLocaleString()}
                </span>
                {car.listing_type !== 'both' && <span style={{ fontSize: 12, color: 'var(--txt3)' }}>sale price</span>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-whatsapp btn-sm"
              onClick={handleDealClick}
              style={{ flex: 1 }}
            >
              💬 Deal
            </button>
            {(car.listing_type === 'rent' || car.listing_type === 'both') && car.status === 'available' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleRentClick}
                style={{ flex: 1 }}
              >
                🚗 Rent
              </button>
            )}
          </div>

          {/* Views */}
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--txt3)' }}>
            👁 {car.views} views
          </div>
        </div>
      </div>
    </Link>
  );
}
