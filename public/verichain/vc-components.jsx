// VeriChain shared UI primitives — Button, SourceChip, StackedBar,
// StatusBadge, CommitCard, DiffBlock, EmptyState, Toast, FaviconSquare,
// SegmentedControl, Toggle, Tab, IconButton, LMSChrome.
//
// Load AFTER React + tokens.css + vc-data.js.

const { useState, useEffect, useRef } = React;
const VC = window.VC_DATA;

// ── icons (16px stroke; only what the design needs) ───────────────
const Icon = {
  Chevron: ({ d = 'right', size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {d === 'right' && <path d="M6 4l4 4-4 4"/>}
      {d === 'left'  && <path d="M10 4l-4 4 4 4"/>}
      {d === 'down'  && <path d="M4 6l4 4 4-4"/>}
      {d === 'up'    && <path d="M4 10l4-4 4 4"/>}
    </svg>
  ),
  Check: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L6.5 12 13 4.5"/></svg>
  ),
  X: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
  ),
  Plus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
  ),
  Search: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>
  ),
  Filter: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 3.5h12M4 8h8M6.5 12.5h3"/></svg>
  ),
  Dot: ({ size = 4, color = 'currentColor' }) => (<span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, flex: `0 0 ${size}px` }} />),
  ChainLink: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 10l4-4M6.5 3.5L8 2a3 3 0 014 4l-1.5 1.5M9.5 12.5L8 14a3 3 0 01-4-4l1.5-1.5"/></svg>
  ),
  Clock: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/></svg>
  ),
  Doc: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2h6l2.5 2.5V14H4z"/><path d="M10 2v3h2.5"/></svg>
  ),
  Pencil: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2.5l2.5 2.5L6 12.5H3.5V10z"/></svg>
  ),
  Eye: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 8C3 5 5.5 3.5 8 3.5S13 5 14.5 8C13 11 10.5 12.5 8 12.5S3 11 1.5 8z"/><circle cx="8" cy="8" r="1.7"/></svg>
  ),
  Quote: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor"><path d="M3 7c0-2 1-3 2.5-3.5l.3.8C4.7 4.7 4 5.5 4 6.7H5v2.6H2.6V7zm5 0c0-2 1-3 2.5-3.5l.3.8c-1.1.4-1.8 1.2-1.8 2.4H10v2.6H7.6V7z"/></svg>
  ),
  GripDots: ({ size = 10 }) => (
    <svg width={size} height={size + 4} viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="2.5" r="1"/><circle cx="7" cy="2.5" r="1"/><circle cx="3" cy="7" r="1"/><circle cx="7" cy="7" r="1"/><circle cx="3" cy="11.5" r="1"/><circle cx="7" cy="11.5" r="1"/></svg>
  ),
  Declared: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2.5 6.5L5 9l4.5-5"/></svg>
  ),
  NotDeclared: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 3v3.5M6 8.5v.1"/><circle cx="6" cy="6" r="4.6"/></svg>
  ),
  Play: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 2.5v7l6-3.5z"/></svg>
  ),
};

// ── Button ────────────────────────────────────────────────────────
function Button({ variant = 'primary', size = 'md', children, onClick, leading, trailing, type, disabled, className = '', style }) {
  const cls = `vc-btn vc-btn--${variant}${size === 'sm' ? ' vc-btn--sm' : size === 'lg' ? ' vc-btn--lg' : ''} ${className}`;
  return (
    <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled} style={style}>
      {leading}
      <span className="vc-btn__label">{children}</span>
      {trailing}
    </button>
  );
}

// ── FaviconSquare ────────────────────────────────────────────────
function FaviconSquare({ src, size = 14 }) {
  const s = VC.SOURCES[src] || VC.SOURCES.unknown;
  return (
    <span style={{
      width: size, height: size, borderRadius: 3,
      background: s.fav.bg, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size <= 12 ? 8 : 9, fontWeight: 700, lineHeight: 1, flex: `0 0 ${size}px`,
      fontFamily: 'var(--ff-sans)',
    }}>{s.fav.letter}</span>
  );
}

// ── SourceChip ────────────────────────────────────────────────────
// variant: 'default' | 'plain' | 'bordered'
function SourceChip({ src, count, showFavicon = true, showDot = false, onClick, style, size = 'md' }) {
  const s = VC.SOURCES[src] || VC.SOURCES.unknown;
  const c = VC.SRC_COLOR[s.kind];
  const h = size === 'sm' ? 20 : 22;
  return (
    <span className="vc-chip" onClick={onClick} style={{
      borderLeft: `2px solid ${c.ink}`,
      height: h, fontSize: size === 'sm' ? 11.5 : 12,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>
      {showDot && <Icon.Dot size={6} color={c.ink} />}
      {showFavicon && <FaviconSquare src={src} size={size === 'sm' ? 12 : 13} />}
      <span style={{ color: 'var(--vc-ink-2)' }}>{s.label}</span>
      {count != null && <span className="vc-chip__count mono">{typeof count === 'number' ? `${count.toLocaleString()}` : count}</span>}
    </span>
  );
}

// ── StackedSourceBar ─────────────────────────────────────────────
// mix: { typed, research, ai, unknown } as percentages summing to 100
function StackedSourceBar({ mix, height = 8, showLegend = false, width, rounded = true, gap = 0, ariaLabel }) {
  if (!mix) return <span className="mono" style={{ color: 'var(--vc-ink-mute)', fontSize: 12 }}>—</span>;
  const segs = ['typed', 'research', 'ai', 'unknown']
    .map(k => ({ k, v: mix[k] || 0, color: `var(--src-${k})` }))
    .filter(s => s.v > 0);
  return (
    <div style={{ width: width || '100%' }} aria-label={ariaLabel}>
      <div style={{ display: 'flex', gap, height, borderRadius: rounded ? height / 2 : 0, overflow: 'hidden', background: 'var(--vc-line)' }}>
        {segs.map(s => (
          <div key={s.k} title={`${s.k}: ${s.v}%`} style={{ width: `${s.v}%`, background: s.color, transition: 'width .2s' }} />
        ))}
      </div>
      {showLegend && (
        <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11.5, color: 'var(--vc-ink-3)' }}>
          {segs.map(s => (
            <span key={s.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, background: s.color, borderRadius: 2 }} />
              <span style={{ textTransform: 'capitalize' }}>{s.k}</span>
              <span className="mono" style={{ color: 'var(--vc-ink-2)', fontWeight: 500 }}>{s.v}%</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'on-time':       { label: 'Submitted',     cls: '' },
    'submitted':     { label: 'Submitted',     cls: '' },
    'late':          { label: 'Late',          cls: 'vc-status--late' },
    'not-submitted': { label: 'Not submitted', cls: 'vc-status--miss' },
    'draft':         { label: 'Draft',         cls: 'vc-status--draft' },
  };
  const m = map[status] || map.submitted;
  return (
    <span className={`vc-status ${m.cls}`}>
      <span className="vc-status__dot" />
      <span>{m.label}</span>
    </span>
  );
}

// ── CommitCard — used in the lecturer timeline ───────────────────
function CommitCard({ commit, selected, onClick, density = 'comfortable' }) {
  const c = commit;
  const s = VC.SOURCES[c.src] || VC.SOURCES.typed;
  const col = VC.SRC_COLOR[s.kind];
  const isPaste = !!c.paste;
  const pad = density === 'compact' ? '8px 10px 8px 12px' : '10px 12px 10px 14px';
  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left',
      background: selected ? 'var(--vc-surface)' : 'transparent',
      borderLeft: `3px solid ${selected ? col.ink : 'transparent'}`,
      padding: pad, paddingLeft: density === 'compact' ? 10 : 12,
      cursor: 'pointer', border: 'none', borderRadius: 0,
      borderBottom: '1px solid var(--vc-line)',
      position: 'relative',
      transition: 'background .12s',
      fontFamily: 'inherit',
    }}
    onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'var(--vc-overlay)'; }}
    onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: selected ? col.ink : col.ink, opacity: selected ? 1 : .35 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-3)' }}>{c.t}</span>
        <span style={{ fontSize: 11, color: 'var(--vc-ink-mute)' }}>·</span>
        <span style={{ fontSize: 11.5, color: 'var(--vc-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 500 }}>
          {c.type === 'manual' ? 'manual' : 'auto'}
        </span>
        <span style={{ marginLeft: 'auto' }} />
        <span className="mono" style={{ fontSize: 11, color: c.delta.startsWith('-') ? 'var(--diff-del-ink)' : c.delta === '+0' ? 'var(--vc-ink-mute)' : 'var(--diff-add-ink)' }}>{c.delta}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--vc-ink)', lineHeight: 1.35, marginBottom: isPaste ? 6 : 0, fontWeight: selected ? 500 : 400 }}>{c.msg}</div>
      {isPaste && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <FaviconSquare src={c.paste.src} size={12} />
          <span style={{ fontSize: 11.5, color: 'var(--vc-ink-3)' }}>{VC.SOURCES[c.paste.src].label}</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-mute)' }}>· {c.paste.chars} chars</span>
        </div>
      )}
    </button>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--vc-line)' }}>
      {tabs.map(t => (
        <button key={t.value} onClick={() => onChange(t.value)} style={{
          fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500,
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '10px 2px', marginRight: 24,
          color: value === t.value ? 'var(--vc-ink)' : 'var(--vc-ink-3)',
          borderBottom: `2px solid ${value === t.value ? 'var(--vc-ink)' : 'transparent'}`,
          marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          {t.icon}{t.label}
          {t.badge != null && <span style={{ fontSize: 11, color: 'var(--vc-ink-mute)', fontWeight: 400 }}>{t.badge}</span>}
        </button>
      ))}
    </div>
  );
}

// ── Segmented control ────────────────────────────────────────────
function Segmented({ options, value, onChange, size = 'md' }) {
  const h = size === 'sm' ? 28 : 32;
  return (
    <div style={{
      display: 'inline-flex', padding: 2, background: 'var(--vc-bg-sunk)',
      borderRadius: 7, border: '1px solid var(--vc-line)',
    }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          fontFamily: 'inherit', fontSize: size === 'sm' ? 12.5 : 13, fontWeight: 500,
          height: h, padding: '0 14px',
          background: value === opt.value ? 'var(--vc-surface)' : 'transparent',
          color: value === opt.value ? 'var(--vc-ink)' : 'var(--vc-ink-3)',
          border: 'none', borderRadius: 5,
          cursor: 'pointer',
          boxShadow: value === opt.value ? '0 1px 2px rgba(15,26,20,.08), 0 0 0 1px var(--vc-line-2)' : 'none',
          transition: 'background .12s, color .12s',
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
      <span style={{
        width: 34, height: 20, borderRadius: 12, padding: 2,
        background: checked ? 'var(--vc-accent)' : 'var(--vc-line-hi)',
        transition: 'background .15s', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center',
        marginTop: 1,
      }}>
        <span style={{
          width: 16, height: 16, background: '#fff', borderRadius: '50%',
          transform: `translateX(${checked ? 14 : 0}px)`,
          transition: 'transform .15s',
          boxShadow: '0 1px 2px rgba(15,26,20,.18)',
        }} />
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0 }} />
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 13.5, color: 'var(--vc-ink)', fontWeight: 500 }}>{label}</span>
        {description && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--vc-ink-3)', marginTop: 2, lineHeight: 1.5 }}>{description}</span>}
      </span>
    </label>
  );
}

// ── Diff block (used in lecturer review right pane) ──────────────
// segments: [{ kind: 'add'|'del'|'context'|'paste', src?, text }]
function DiffBlock({ segments }) {
  return (
    <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 14.5, lineHeight: 1.7, color: 'var(--vc-ink-2)' }}>
      {segments.map((seg, i) => {
        if (seg.kind === 'context') return <span key={i}>{seg.text}</span>;
        if (seg.kind === 'add') return <span key={i} style={{ background: 'var(--diff-add-bg)', color: 'var(--diff-add-ink)', padding: '0 1px', borderRadius: 2 }}>{seg.text}</span>;
        if (seg.kind === 'del') return <span key={i} style={{ background: 'var(--diff-del-bg)', color: 'var(--diff-del-ink)', textDecoration: 'line-through', textDecorationColor: 'var(--diff-del-ink)', padding: '0 1px', borderRadius: 2 }}>{seg.text}</span>;
        if (seg.kind === 'paste') {
          const c = VC.SRC_COLOR[(VC.SOURCES[seg.src] || VC.SOURCES.unknown).kind];
          return (
            <span key={i} style={{
              display: 'block',
              borderLeft: `3px solid ${c.ink}`,
              background: c.bg,
              padding: '8px 12px',
              borderRadius: '0 4px 4px 0',
              margin: '8px 0',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontFamily: 'var(--ff-sans)', fontSize: 11, color: c.ink, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                <FaviconSquare src={seg.src} size={11} />
                Pasted · {VC.SOURCES[seg.src].label}
              </span>
              <span style={{ color: 'var(--vc-ink-2)' }}>{seg.text}</span>
            </span>
          );
        }
        return null;
      })}
    </div>
  );
}

// ── Toast (subtle, non-modal) ─────────────────────────────────────
function Toast({ children, onClose, action, style }) {
  return (
    <div style={{
      background: 'var(--vc-ink)', color: '#fff',
      borderRadius: 8, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 10px 28px rgba(15,26,20,.18)',
      fontSize: 13, maxWidth: 360,
      ...style,
    }}>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{children}</span>
      {action && (
        <button onClick={action.onClick} style={{
          fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#A8E5C5', padding: 0, whiteSpace: 'nowrap',
        }}>{action.label}</button>
      )}
      {onClose && (
        <button onClick={onClose} style={{
          fontFamily: 'inherit', background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,.55)', padding: 0, display: 'inline-flex', alignItems: 'center',
        }} aria-label="Dismiss"><Icon.X size={14} /></button>
      )}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────
function EmptyState({ title, body, action, icon }) {
  return (
    <div style={{
      padding: '28px 24px', textAlign: 'center',
      color: 'var(--vc-ink-3)', maxWidth: 360, margin: '0 auto',
    }}>
      {icon && <div style={{ color: 'var(--vc-ink-mute)', marginBottom: 12 }}>{icon}</div>}
      <div style={{ fontSize: 14, color: 'var(--vc-ink-2)', fontWeight: 500, marginBottom: 6 }}>{title}</div>
      {body && <div style={{ fontSize: 13, lineHeight: 1.55 }}>{body}</div>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}

// ── LMS Chrome — wraps a screen to suggest the host environment ──
function LMSChrome({ host = 'moodle', course = 'ECON1101 — Markets & Failures', section = 'Essay 2: Market Failure', children, height }) {
  const isCanvas = host === 'canvas';
  return (
    <div style={{
      width: '100%', height: height || '100%',
      display: 'flex', flexDirection: 'column',
      background: isCanvas ? '#F5F5F5' : '#F2F0EC',
      fontFamily: 'var(--ff-sans)',
    }}>
      {/* LMS top nav */}
      <div style={{
        height: 44, background: isCanvas ? '#2D3B45' : '#1C1D1F',
        color: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px',
        fontSize: 13, gap: 18, flexShrink: 0,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: .95 }}>
          <span style={{ width: 22, height: 22, borderRadius: 4, background: isCanvas ? '#E72429' : '#F98012', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{isCanvas ? 'C' : 'M'}</span>
          <span style={{ fontWeight: 500 }}>{isCanvas ? 'Canvas' : 'Moodle'}</span>
        </span>
        <span style={{ opacity: .55 }}>·</span>
        <span style={{ opacity: .8 }}>Dashboard</span>
        <span style={{ opacity: .8 }}>My courses</span>
        <span style={{ opacity: .8 }}>Calendar</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, opacity: .7, fontSize: 12.5 }}>
          <span>The University of Sydney</span>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', color: '#1C1D1F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>ME</span>
        </span>
      </div>
      {/* Breadcrumb */}
      <div style={{
        height: 38, background: isCanvas ? '#fff' : '#fff',
        borderBottom: '1px solid #E0DDD7',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        fontSize: 12.5, color: '#6F6B62', gap: 8, flexShrink: 0,
      }}>
        <span>{course}</span>
        <span style={{ opacity: .5 }}>›</span>
        <span>Assignments</span>
        <span style={{ opacity: .5 }}>›</span>
        <span style={{ color: '#1C1D1F', fontWeight: 500 }}>{section}</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--vc-accent)', fontSize: 11.5, fontWeight: 500 }}>
          <Icon.ChainLink size={11} /> VeriChain LTI tool
        </span>
      </div>
      {/* Slot */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--vc-bg)' }}>
        {children}
      </div>
    </div>
  );
}

// ── Brand mark (chain link with a leaf — subtle, never decorative) ─
function BrandMark({ size = 18, color }) {
  const col = color || 'var(--vc-accent)';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-label="VeriChain">
      <path d="M9 15l6-6"/>
      <path d="M10 5l1.5-1.5a4 4 0 015.5 5.5L15.5 10.5"/>
      <path d="M14 19l-1.5 1.5a4 4 0 01-5.5-5.5L8.5 13.5"/>
    </svg>
  );
}

Object.assign(window, {
  VC_UI: {
    Icon, Button, FaviconSquare, SourceChip, StackedSourceBar, StatusBadge,
    CommitCard, Tabs, Segmented, Toggle, DiffBlock, Toast, EmptyState,
    LMSChrome, BrandMark,
  },
});

// ── Navigation helper ─────────────────────────────────────────────
// Screens call window.vcNav(route, options) to navigate inside the
// prototype host. The host registers itself by setting window.vcNav.
// In the design canvas (no host), calls are silently ignored — screens
// remain visual.
window.vcNav = window.vcNav || function () {};
