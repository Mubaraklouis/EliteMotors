import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Car } from '../types';
import { carsService } from '../services/cars.service';
import CarCard from '../components/CarCard';
import RentalModal from '../components/RentalModal';

export default function Landing() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    carsService.getCars({ limit: 6 })
      .then((res) => setFeaturedCars(res.cars))
      .catch(() => {})
      .finally(() => setLoadingCars(false));
  }, []);

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="hero-gradient"
        style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(245,158,11,0.05) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.05) 0%, transparent 40%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 60, paddingBottom: 80 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            {/* Tag */}
            <div className="anim-fade-up" style={{ marginBottom: 24 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 16px', borderRadius: 20,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                fontSize: 13, fontWeight: 600, color: 'var(--accent)',
              }}>
                🏎️ Premium Automotive Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="anim-fade-up delay-1"
              style={{
                fontSize: 'clamp(42px, 8vw, 80px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                marginBottom: 24,
                color: 'var(--txt)',
              }}
            >
              Find Your{' '}
              <span className="gradient-text">Dream Car</span>
            </h1>

            {/* Subheading */}
            <p
              className="anim-fade-up delay-2"
              style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--txt2)', lineHeight: 1.6, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}
            >
              Buy, sell & rent premium vehicles. Connect directly with verified dealers via WhatsApp — no middlemen, no hassle.
            </p>

            {/* CTAs */}
            <div className="anim-fade-up delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/cars" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
                Explore Cars →
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
                🏢 List Your Car
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="anim-fade-up delay-4" style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {['✅ Verified Dealers', '💬 WhatsApp Deals', '🚗 Instant Rentals'].map((item) => (
                <span key={item} style={{ fontSize: 13, color: 'var(--txt2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(transparent, var(--bg))',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div
            className="glass glow-amber"
            style={{
              borderRadius: 20, padding: '28px 40px',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 24, textAlign: 'center',
            }}
          >
            {[
              { value: '500+', label: 'Cars Listed', icon: '🚗' },
              { value: '200+', label: 'Verified Dealers', icon: '✅' },
              { value: '1,000+', label: 'Deals Completed', icon: '🤝' },
              { value: '50+', label: 'Cities Covered', icon: '📍' },
            ].map(({ value, label, icon }) => (
              <div key={label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)', marginBottom: 4, letterSpacing: '-.02em' }}>
                  {icon} {value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--txt2)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Cars ───────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 8 }}>
                Featured <span className="gradient-text">Vehicles</span>
              </h2>
              <p className="section-sub">Hand-picked premium listings</p>
            </div>
            <Link to="/cars" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {loadingCars ? (
            <div className="grid-cars">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 18 }}>
                    <div className="skeleton" style={{ height: 16, marginBottom: 8, width: '70%' }} />
                    <div className="skeleton" style={{ height: 12, marginBottom: 16, width: '50%' }} />
                    <div className="skeleton" style={{ height: 36 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid-cars">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} onRent={setSelectedCar} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--txt2)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
              <p>No cars listed yet. Be the first!</p>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: 16, textDecoration: 'none' }}>List a Car</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-sub">Three simple steps to your next car</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              {
                step: '01', icon: '🔍', title: 'Browse',
                desc: 'Explore hundreds of verified listings — filter by city, type, price, and more.',
              },
              {
                step: '02', icon: '💬', title: 'Connect',
                desc: 'Click "Go for Deal" and chat directly with the car owner on WhatsApp — no middlemen.',
              },
              {
                step: '03', icon: '🚗', title: 'Drive',
                desc: 'Rent instantly with our date picker, or negotiate a purchase deal on your terms.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="card anim-fade-up" style={{ padding: '32px 28px', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                  border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 20px',
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '.5px', marginBottom: 8 }}>
                  STEP {step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: 'var(--txt)' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ───────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Choose Your <span className="gradient-text">Plan</span>
            </h2>
            <p className="section-sub">Start free. Upgrade when you're ready to sell.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 700, margin: '0 auto' }}>
            {/* Free */}
            <div className="card" style={{ padding: '32px 28px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Free Plan</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--txt)', marginBottom: 4 }}>$0</div>
              <div style={{ fontSize: 13, color: 'var(--txt3)', marginBottom: 28 }}>Forever free</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Browse all car listings', 'WhatsApp dealer directly', 'Rent cars instantly', 'View car details & specs'].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--txt2)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn btn-outline" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                Get Started Free
              </Link>
            </div>

            {/* Dealer */}
            <div
              className="card glow-amber"
              style={{ padding: '32px 28px', borderColor: 'rgba(245,158,11,0.3)', position: 'relative', background: 'rgba(245,158,11,0.03)' }}
            >
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                <span className="badge badge-amber">⭐ MOST POPULAR</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Dealer Plan</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--txt)', marginBottom: 4 }}>Free<span style={{ fontSize: 16, color: 'var(--txt2)' }}> to start</span></div>
              <div style={{ fontSize: 13, color: 'var(--txt3)', marginBottom: 28 }}>Premium listings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {[
                  'Everything in Free',
                  'List unlimited cars',
                  'Dealer dashboard',
                  'Analytics & insights',
                  'Priority placement',
                  'WhatsApp deal button',
                ].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--txt2)' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                onClick={() => {
                  sessionStorage.setItem('preselect_role', 'dealer');
                }}
              >
                🏢 Become a Dealer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #92400e, #78350f, #451a03)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-.02em' }}>
            Ready to Drive Your Dream Car?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', marginBottom: 36 }}>
            Join thousands of satisfied customers across Nigeria
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn btn-lg" style={{ textDecoration: 'none', background: '#fff', color: '#000', fontWeight: 700 }}>
              Browse Cars Now
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ textDecoration: 'none', borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Rental modal */}
      {selectedCar && (
        <RentalModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onSuccess={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
}
