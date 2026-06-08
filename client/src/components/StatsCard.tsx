interface Props {
  title: string;
  value: string | number;
  icon: string;
  sub?: string;
  color?: string;
}

export default function StatsCard({ title, value, icon, sub, color = 'var(--accent)' }: Props) {
  return (
    <div className="card" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--txt)', lineHeight: 1, marginBottom: 4 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 500 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}
