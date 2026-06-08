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
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 60, paddingBottom: 100 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            {/* Tag */}
            <div className="anim-fade-up" style={{ marginBottom: 28 }}>
              <span style={{
                display: 'inline-block',
                padding: '7px 18px', borderRadius: 100,
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                fontSize: 13, fontWeight: 600, color: 'var(--accent)',
                letterSpacing: '0.3px',
              }}>
                Premium Automotive Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="anim-fade-up delay-1"
              style={{
                fontSize: 'clamp(42px, 8vw, 76px)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
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
              style={{ fontSize: 'clamp(16px, 2.2vw, 19px)', color: 'var(--txt2)', lineHeight: 1.7, marginBottom: 44, maxWidth: 540, margin: '0 auto 44px' }}
            >
              Buy, sell and rent premium vehicles. Connect directly with verified dealers via WhatsApp — no middlemen, no hassle.
            </p>

            {/* CTAs */}
            <div className="anim-fade-up delay-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/cars" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
                Explore Cars
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
                List Your Car
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, var(--bg))', pointerEvents: 'none' }} />
      </section>

      {/* ━━ METRICS STRIP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '0 0 100px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--border)',
            borderRadius: 20,
            overflow: 'hidden',
          }}>
            {[
              { value: '500+', label: 'Cars Listed' },
              { value: '200+', label: 'Verified Dealers' },
              { value: '1,000+', label: 'Deals Closed' },
              { value: '50+', label: 'Cities' },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  background: 'var(--bg2)',
                  padding: '36px 24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--txt3)', fontWeight: 500, letterSpacing: '0.3px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ FEATURED VEHICLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Curated Selection</p>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.02em' }}>
                Featured Vehicles
              </h2>
            </div>
            <Link to="/cars" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              View All
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
              <p style={{ marginBottom: 16 }}>No cars listed yet. Be the first dealer.</p>
              <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>List a Car</Link>
            </div>
          )}
        </div>
      </section>

      {/* ━━ HOW IT WORKS — Modern bento-style ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Simple Process</p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.02em' }}>
              How It Works
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            background: 'var(--border)',
            borderRadius: 24,
            overflow: 'hidden',
          }}>
            {[
              {
                step: '01',
                title: 'Browse',
                desc: 'Explore hundreds of verified listings. Filter by city, type, price range, and more.',
                accent: 'rgba(245,158,11,0.08)',
              },
              {
                step: '02',
                title: 'Connect',
                desc: 'Click "Go for Deal" to chat directly with the car owner on WhatsApp. No middlemen.',
                accent: 'rgba(249,115,22,0.08)',
              },
              {
                step: '03',
                title: 'Drive',
                desc: 'Rent instantly with our date picker, or negotiate a purchase on your own terms.',
                accent: 'rgba(217,119,6,0.08)',
              },
            ].map(({ step, title, desc, accent }) => (
              <div
                key={step}
                style={{
                  background: 'var(--bg)',
                  padding: '48px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background step number */}
                <div style={{
                  position: 'absolute', top: -10, right: -5,
                  fontSize: 120, fontWeight: 900,
                  color: accent,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  {step}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, color: 'var(--accent)',
                    letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14,
                  }}>
                    Step {step}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', marginBottom: 12, letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ SPLIT VALUE PROPOSITION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}>
            {/* For Buyers */}
            <div
              style={{
                borderRadius: 24,
                border: '1px solid var(--border)',
                padding: '48px 40px',
                background: 'var(--bg)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, var(--accent), transparent)',
              }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
                For Buyers & Renters
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--txt)', marginBottom: 16, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                Find your perfect car in minutes
              </h3>
              <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.7, marginBottom: 28 }}>
                Browse premium listings from verified dealers. Rent instantly or connect directly via WhatsApp to negotiate your deal.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  'Browse verified dealer listings',
                  'Direct WhatsApp connection',
                  'Instant rental booking',
                  'No platform fees',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(245,158,11,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'var(--accent)', fontWeight: 700,
                      flexShrink: 0,
                    }}>✓</div>
                    <span style={{ color: 'var(--txt2)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/cars" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Browse Cars
              </Link>
            </div>

            {/* For Dealers */}
            <div
              style={{
                borderRadius: 24,
                border: '1px solid rgba(245,158,11,0.2)',
                padding: '48px 40px',
                background: 'rgba(245,158,11,0.02)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, #f59e0b, #d97706)',
              }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
                For Dealers
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--txt)', marginBottom: 16, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                Grow your dealership online
              </h3>
              <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.7, marginBottom: 28 }}>
                Create your dealer profile and start listing cars in minutes. Manage your inventory, track views, and receive inquiries directly on WhatsApp.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  'Free dealer account',
                  'Unlimited listings',
                  'Dashboard analytics',
                  'WhatsApp deal notifications',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(245,158,11,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'var(--accent)', fontWeight: 700,
                      flexShrink: 0,
                    }}>✓</div>
                    <span style={{ color: 'var(--txt2)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
                onClick={() => sessionStorage.setItem('preselect_role', 'dealer')}
              >
                Become a Dealer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ TRUST BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '80px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 48,
            textAlign: 'center',
          }}>
            {[
              { title: 'Verified Dealers', desc: 'Every dealer is verified before listing. Your trust matters.' },
              { title: 'Direct Contact', desc: 'No gatekeeping. Chat directly with car owners via WhatsApp.' },
              { title: 'Instant Booking', desc: 'Pick your dates and confirm a rental in under 60 seconds.' },
              { title: 'Zero Fees', desc: 'No hidden charges. No platform cuts. Just deals between people.' },
            ].map(({ title, desc }) => (
              <div key={title}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)', marginBottom: 8 }}>{title}</h4>
                <p style={{ fontSize: 13, color: 'var(--txt3)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ CTA BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '100px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Get Started Today</p>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            color: 'var(--txt)',
            marginBottom: 16,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            Ready to drive your<br />
            <span className="gradient-text">dream car?</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--txt2)', marginBottom: 40, maxWidth: 460, margin: '0 auto 40px' }}>
            Join thousands of satisfied customers across Nigeria. Whether you're buying, selling, or renting — start here.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
              Browse Cars
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
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

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          section [style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          section [style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          section [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
