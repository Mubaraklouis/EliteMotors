import { useState, useEffect, useCallback } from 'react';
import type { Car, CarFilters } from '../types';
import { carsService } from '../services/cars.service';
import CarCard from '../components/CarCard';
import CarFiltersBar from '../components/CarFilters';
import RentalModal from '../components/RentalModal';

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CarFilters>({ page: 1, limit: 12 });
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await carsService.getCars(filters);
      setCars(res.cars);
      setTotal(res.total);
      setPages(res.pages);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFilterChange = (f: CarFilters) => setFilters({ ...f, page: 1, limit: 12 });
  const goToPage = (p: number) => setFilters((f) => ({ ...f, page: p }));

  const currentPage = filters.page ?? 1;

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--txt)', marginBottom: 6 }}>
            Available <span className="gradient-text">Vehicles</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--txt2)' }}>
            {loading ? 'Loading…' : `${total.toLocaleString()} car${total !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <CarFiltersBar filters={filters} onChange={handleFilterChange} />

        {/* Grid */}
        {loading ? (
          <div className="grid-cars">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: 18 }}>
                  <div className="skeleton" style={{ height: 16, marginBottom: 8, width: '70%' }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 16, width: '45%' }} />
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    {[60, 80, 55].map((w, j) => <div key={j} className="skeleton" style={{ height: 12, width: w }} />)}
                  </div>
                  <div className="skeleton" style={{ height: 36 }} />
                </div>
              </div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <>
            <div className="grid-cars">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} onRent={setSelectedCar} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 48, flexWrap: 'wrap' }}>
                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  ←
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === pages)
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`e-${i}`} style={{ padding: '0 4px', color: 'var(--txt3)', display: 'flex', alignItems: 'center' }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`page-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => goToPage(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= pages}
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--txt2)' }}>No results</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--txt)', marginBottom: 8 }}>No cars found</h3>
            <p style={{ color: 'var(--txt2)', marginBottom: 24, fontSize: 14 }}>Try adjusting your search or clearing the filters</p>
            <button className="btn btn-primary" onClick={() => setFilters({ page: 1, limit: 12 })}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedCar && (
        <RentalModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onSuccess={() => { setSelectedCar(null); fetchCars(); }}
        />
      )}
    </div>
  );
}
