import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { carsService } from '../services/cars.service';
import ImageUpload from '../components/ImageUpload';

type Step = 1 | 2 | 3 | 4;

const STEPS = ['Basic Info', 'Specifications', 'Images', 'Preview'];

interface FormData {
  title: string; make: string; model: string; year: string;
  city: string; listingType: string; condition: string;
  price: string; dailyRate: string; mileage: string;
  color: string; fuelType: string; transmission: string;
  seats: string; doors: string; description: string;
  features: string[];
}

const INIT: FormData = {
  title: '', make: '', model: '', year: '',
  city: '', listingType: 'rent', condition: 'used',
  price: '', dailyRate: '', mileage: '',
  color: '', fuelType: 'petrol', transmission: 'automatic',
  seats: '5', doors: '4', description: '',
  features: [],
};

export default function UploadCar() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INIT);
  const [images, setImages] = useState<File[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !form.features.includes(val)) {
      setForm((f) => ({ ...f, features: [...f.features, val] }));
      setFeatureInput('');
    }
  };
  const removeFeature = (feat: string) => setForm((f) => ({ ...f, features: f.features.filter((x) => x !== feat) }));

  const validateStep = (): boolean => {
    setError('');
    if (step === 1) {
      if (!form.title || !form.make || !form.model || !form.year) {
        setError('Title, make, model and year are required'); return false;
      }
      if (isNaN(Number(form.year)) || Number(form.year) < 1900) {
        setError('Enter a valid year'); return false;
      }
    }
    if (step === 2) {
      if (form.listingType !== 'sale' && !form.dailyRate) {
        setError('Daily rate is required for rental listings'); return false;
      }
      if (form.listingType !== 'rent' && !form.price) {
        setError('Sale price is required for sale listings'); return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4) as Step);
  };

  const back = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'features') {
          fd.append('features', JSON.stringify(v));
        } else if (v !== '') {
          fd.append(k === 'listingType' ? 'listingType' : k === 'dailyRate' ? 'dailyRate' : k === 'fuelType' ? 'fuelType' : k, v as string);
        }
      });
      images.forEach((img) => fd.append('images', img));
      await carsService.createCar(fd);
      navigate('/dashboard', { state: { success: 'Car listed successfully!' } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to upload car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Link to="/dashboard" style={{ color: 'var(--txt3)', textDecoration: 'none', fontSize: 14 }}>← Dashboard</Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--txt)' }}>Upload a New Car</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36 }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, maxWidth: 560 }}>
          {STEPS.map((label, i) => {
            const s = (i + 1) as Step;
            const done = step > s;
            const active = step === s;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div className={`step-dot ${done ? 'done' : active ? 'active' : ''}`}>
                    {done ? '✓' : s}
                  </div>
                  <span style={{ fontSize: 11, color: active ? 'var(--accent)' : 'var(--txt3)', marginTop: 4, fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? 'var(--accent)' : 'var(--border)', margin: '0 8px', marginBottom: 20, transition: 'background .3s' }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ maxWidth: 620 }}>
          <div className="card" style={{ padding: '32px 28px' }}>
            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>Basic Information</h2>
                <div className="form-group">
                  <label className="form-label">Listing Title *</label>
                  <input id="car-title" type="text" className="form-input" placeholder="e.g. 2020 Toyota Camry XLE — Lagos" value={form.title} onChange={(e) => set('title', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Make *</label>
                    <input id="car-make" type="text" className="form-input" placeholder="e.g. Toyota" value={form.make} onChange={(e) => set('make', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model *</label>
                    <input id="car-model" type="text" className="form-input" placeholder="e.g. Camry" value={form.model} onChange={(e) => set('model', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year *</label>
                    <input id="car-year" type="number" className="form-input" placeholder="2020" min="1900" max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => set('year', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input id="car-city" type="text" className="form-input" placeholder="e.g. Lagos" value={form.city} onChange={(e) => set('city', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Listing Type *</label>
                    <select id="car-listing-type" className="form-select" value={form.listingType} onChange={(e) => set('listingType', e.target.value)}>
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                      <option value="both">Rent & Sale</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Condition *</label>
                    <select id="car-condition" className="form-select" value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                      <option value="new">Brand New</option>
                      <option value="used">Used</option>
                      <option value="certified_pre_owned">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>Specifications & Pricing</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {(form.listingType === 'rent' || form.listingType === 'both') && (
                    <div className="form-group">
                      <label className="form-label">Daily Rate ($) {form.listingType !== 'sale' ? '*' : ''}</label>
                      <input id="car-daily-rate" type="number" className="form-input" placeholder="e.g. 150" min="0" value={form.dailyRate} onChange={(e) => set('dailyRate', e.target.value)} />
                    </div>
                  )}
                  {(form.listingType === 'sale' || form.listingType === 'both') && (
                    <div className="form-group">
                      <label className="form-label">Sale Price ($) {form.listingType !== 'rent' ? '*' : ''}</label>
                      <input id="car-price" type="number" className="form-input" placeholder="e.g. 25000" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} />
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Mileage (km)</label>
                    <input id="car-mileage" type="number" className="form-input" placeholder="e.g. 45000" min="0" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <input id="car-color" type="text" className="form-input" placeholder="e.g. Pearl White" value={form.color} onChange={(e) => set('color', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fuel Type</label>
                    <select id="car-fuel" className="form-select" value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)}>
                      {['petrol','diesel','electric','hybrid','hydrogen'].map((f) => (
                        <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <select id="car-transmission" className="form-select" value={form.transmission} onChange={(e) => set('transmission', e.target.value)}>
                      {['automatic','manual','cvt'].map((t) => (
                        <option key={t} value={t}>{t.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Seats</label>
                    <input id="car-seats" type="number" className="form-input" min="1" max="20" value={form.seats} onChange={(e) => set('seats', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Doors</label>
                    <input id="car-doors" type="number" className="form-input" min="1" max="8" value={form.doors} onChange={(e) => set('doors', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea id="car-description" className="form-textarea" placeholder="Describe the car — history, condition, highlights…" value={form.description} onChange={(e) => set('description', e.target.value)} style={{ minHeight: 120 }} />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>Features & Images</h2>

                <div className="form-group">
                  <label className="form-label">Features (press Enter to add)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Leather Seats, Sunroof, Backup Camera…"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={addFeature} style={{ flexShrink: 0 }}>Add</button>
                  </div>
                  {form.features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                      {form.features.map((f) => (
                        <span key={f} className="tag">
                          {f}
                          <button className="tag-remove" onClick={() => removeFeature(f)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Car Photos (first = cover)</label>
                  <ImageUpload files={images} onChange={setImages} maxFiles={6} />
                </div>
              </div>
            )}

            {/* STEP 4 — Preview */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 20 }}>Preview & Publish</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {images.length > 0 && (
                    <div style={{ borderRadius: 14, overflow: 'hidden', height: 200 }}>
                      <img
                        src={URL.createObjectURL(images[0])}
                        alt="Cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span className="badge badge-amber">{form.listingType.toUpperCase()}</span>
                      <span className="badge badge-gray">{form.condition.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>{form.title || 'Untitled'}</h3>
                    <p style={{ color: 'var(--txt2)', fontSize: 14, marginBottom: 16 }}>
                      {form.make} {form.model} · {form.year}
                      {form.city && ` · ${form.city}`}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                      {form.dailyRate && <div style={{ color: 'var(--txt2)' }}>Rental: <strong style={{ color: 'var(--accent)' }}>${form.dailyRate}/day</strong></div>}
                      {form.price && <div style={{ color: 'var(--txt2)' }}>Sale: <strong style={{ color: 'var(--accent)' }}>${Number(form.price).toLocaleString()}</strong></div>}
                      <div style={{ color: 'var(--txt2)' }}>Fuel: <strong style={{ color: 'var(--txt)' }}>{form.fuelType}</strong></div>
                      <div style={{ color: 'var(--txt2)' }}>Transmission: <strong style={{ color: 'var(--txt)' }}>{form.transmission}</strong></div>
                      <div style={{ color: 'var(--txt2)' }}>Seats: <strong style={{ color: 'var(--txt)' }}>{form.seats}</strong></div>
                      {form.mileage && <div style={{ color: 'var(--txt2)' }}>Mileage: <strong style={{ color: 'var(--txt)' }}>{Number(form.mileage).toLocaleString()} km</strong></div>}
                    </div>
                    {form.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                        {form.features.map((f) => <span key={f} className="tag">{f}</span>)}
                      </div>
                    )}
                    <div style={{ marginTop: 14, fontSize: 12, color: 'var(--txt3)' }}>
                      {images.length} photo{images.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              {step > 1 && (
                <button className="btn btn-outline" onClick={back} style={{ flex: 1 }}>
                  ← Back
                </button>
              )}
              {step < 4 ? (
                <button className="btn btn-primary" onClick={next} style={{ flex: 2 }}>
                  Next: {STEPS[step]} →
                </button>
              ) : (
                <button
                  id="publish-car-btn"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ flex: 2, fontSize: 15 }}
                >
                  {loading ? <><span className="spinner" /> Publishing…</> : 'Publish Listing'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
