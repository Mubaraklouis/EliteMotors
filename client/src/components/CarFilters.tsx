import type { CarFilters } from '../types';

interface Props {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
}

export default function CarFiltersBar({ filters, onChange }: Props) {
  const hasFilters = !!(filters.search || filters.city || (filters.listing_type && filters.listing_type !== 'all'));

  return (
    <div
      className="glass"
      style={{
        borderRadius: 16, padding: '16px 20px',
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        marginBottom: 32,
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, pointerEvents: 'none', color: 'var(--txt3)' }}>Search</span>
        <input
          type="text"
          className="form-input"
          placeholder="Search make, model, title…"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Listing type */}
      <select
        className="form-select"
        value={filters.listing_type ?? 'all'}
        onChange={(e) => onChange({ ...filters, listing_type: e.target.value, page: 1 })}
        style={{ flex: '0 1 160px', minWidth: 140 }}
      >
        <option value="all">All Types</option>
        <option value="rent">For Rent</option>
        <option value="sale">For Sale</option>
      </select>

      {/* City */}
      <div style={{ position: 'relative', flex: '0 1 160px', minWidth: 130 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, pointerEvents: 'none', color: 'var(--txt3)' }}>City</span>
        <input
          type="text"
          className="form-input"
          placeholder="City…"
          value={filters.city ?? ''}
          onChange={(e) => onChange({ ...filters, city: e.target.value, page: 1 })}
          style={{ paddingLeft: 30 }}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onChange({ page: 1 })}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
