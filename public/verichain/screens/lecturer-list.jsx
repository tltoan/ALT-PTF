// VeriChain — Lecturer submission list

const VCLecturerList = ({ height = 900, density = 'comfortable' }) => {
  const { Button, BrandMark, Icon, StackedSourceBar, StatusBadge, Segmented } = window.VC_UI;
  const VC = window.VC_DATA;

  const [filter, setFilter] = React.useState('all');
  const [sort, setSort] = React.useState({ key: 'time', dir: 'desc' });
  const [search, setSearch] = React.useState('');

  // Sort + filter
  const rows = React.useMemo(() => {
    let r = VC.SUBMISSIONS.slice();
    if (filter !== 'all') {
      r = r.filter(x => {
        if (filter === 'submitted') return x.status === 'on-time' || x.status === 'late';
        if (filter === 'late') return x.status === 'late';
        if (filter === 'missing') return x.status === 'not-submitted';
        if (filter === 'declared') return x.declared;
        return true;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(x => x.name.toLowerCase().includes(q));
    }
    const k = sort.key, d = sort.dir === 'asc' ? 1 : -1;
    r.sort((a, b) => {
      let av = a[k], bv = b[k];
      if (k === 'name') return av.localeCompare(bv) * d;
      if (k === 'time') {
        // "—" sinks
        if (a.status === 'not-submitted') return 1;
        if (b.status === 'not-submitted') return -1;
        const order = { 'Today': 1, 'Yesterday': 0, '—': -2 };
        const aa = (order[a.date] || 0) * 10000 + parseInt((a.time || '0').replace(':',''));
        const bb = (order[b.date] || 0) * 10000 + parseInt((b.time || '0').replace(':',''));
        return (bb - aa) * (d === 1 ? -1 : 1);
      }
      if (k === 'words' || k === 'commits') return ((av || 0) - (bv || 0)) * d;
      if (k === 'ai') return ((a.mix?.ai || 0) - (b.mix?.ai || 0)) * d;
      return 0;
    });
    return r;
  }, [filter, sort, search]);

  const counts = {
    all: VC.SUBMISSIONS.length,
    submitted: VC.SUBMISSIONS.filter(x => x.status !== 'not-submitted').length,
    late: VC.SUBMISSIONS.filter(x => x.status === 'late').length,
    missing: VC.SUBMISSIONS.filter(x => x.status === 'not-submitted').length,
    declared: VC.SUBMISSIONS.filter(x => x.declared).length,
  };

  const rowH = density === 'compact' ? 38 : 46;

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)' }}>
      {/* Header */}
      <header style={{ height: 52, padding: '0 20px', background: 'var(--vc-surface)', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <BrandMark size={18} />
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 16, fontWeight: 500 }}>VeriChain</span>
        <span style={{ width: 1, height: 14, background: 'var(--vc-line)' }} />
        <span style={{ fontSize: 13, color: 'var(--vc-ink-3)' }}>ECON1101 — Markets &amp; Failures</span>
        <span style={{ color: 'var(--vc-ink-mute)', fontSize: 13 }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Essay 2: Market Failure</span>

        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--vc-ink-3)' }}>
            <Icon.Clock size={12} />
            Due Friday 24 May, 23:59
          </span>
          <Button variant="secondary" size="sm">Export CSV</Button>
          <Button variant="secondary" size="sm" onClick={() => window.vcNav('lecturer-setup')}>Settings</Button>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--vc-ink-2)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>HE</span>
        </span>
      </header>

      {/* Title bar */}
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid var(--vc-line)', background: 'var(--vc-bg)' }}>
        <h1 style={{ fontSize: 26, letterSpacing: '-0.015em' }}>Essay 2 · Submissions</h1>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 18, fontSize: 13, color: 'var(--vc-ink-3)' }}>
          <span><span className="mono" style={{ color: 'var(--vc-ink)', fontWeight: 500 }}>{counts.submitted}</span> of {counts.all} submitted</span>
          <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
          <span><span className="mono">{counts.late}</span> late</span>
          <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
          <span><span className="mono">{counts.missing}</span> not submitted</span>
          <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
          <span><span className="mono">{counts.declared}</span> declared AI use</span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--vc-line)', background: 'var(--vc-bg)' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { v: 'all', l: 'All', n: counts.all },
            { v: 'submitted', l: 'Submitted', n: counts.submitted },
            { v: 'late', l: 'Late', n: counts.late },
            { v: 'missing', l: 'Not submitted', n: counts.missing },
            { v: 'declared', l: 'Declared AI', n: counts.declared },
          ].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)} style={{
              fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500,
              background: filter === f.v ? 'var(--vc-surface)' : 'transparent',
              color: filter === f.v ? 'var(--vc-ink)' : 'var(--vc-ink-3)',
              border: '1px solid', borderColor: filter === f.v ? 'var(--vc-line-2)' : 'transparent',
              padding: '5px 10px', cursor: 'pointer', borderRadius: 5,
              display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 4,
            }}>
              {f.l}
              <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-mute)' }}>{f.n}</span>
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--vc-ink-mute)' }}>
              <Icon.Search size={13} />
            </span>
            <input type="text" placeholder="Search students" value={search} onChange={(e) => setSearch(e.target.value)} style={{
              fontFamily: 'inherit', fontSize: 12.5,
              width: 220, height: 30, padding: '0 12px 0 30px',
              background: 'var(--vc-surface)', color: 'var(--vc-ink)',
              border: '1px solid var(--vc-line-2)', borderRadius: 6, outline: 'none',
            }} />
          </div>
          <Button variant="secondary" size="sm" leading={<Icon.Filter size={12}/>}>Filters</Button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--vc-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--ff-sans)' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr style={{ background: 'var(--vc-bg-sunk)', borderBottom: '1px solid var(--vc-line)' }}>
              <ColH onClick={() => setSort(s => ({ key: 'name', dir: s.key === 'name' && s.dir === 'asc' ? 'desc' : 'asc' }))} sort={sort} sortKey="name" style={{ width: 220, paddingLeft: 32 }}>Student</ColH>
              <ColH onClick={() => setSort(s => ({ key: 'time', dir: s.key === 'time' && s.dir === 'desc' ? 'asc' : 'desc' }))} sort={sort} sortKey="time" style={{ width: 130 }}>Submitted</ColH>
              <ColH onClick={() => setSort(s => ({ key: 'words', dir: s.key === 'words' && s.dir === 'desc' ? 'asc' : 'desc' }))} sort={sort} sortKey="words" style={{ width: 90, textAlign: 'right' }} num>Words</ColH>
              <ColH style={{ width: 90, textAlign: 'right' }} num sort={sort} sortKey="dur">Session</ColH>
              <ColH style={{ width: 240 }} onClick={() => setSort(s => ({ key: 'ai', dir: s.key === 'ai' && s.dir === 'desc' ? 'asc' : 'desc' }))} sort={sort} sortKey="ai">Source mix</ColH>
              <ColH style={{ width: 110 }}>AI declared</ColH>
              <ColH style={{ width: 130 }}>Status</ColH>
              <ColH style={{ width: 92, textAlign: 'right', paddingRight: 32 }}>{' '}</ColH>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <LecListRow key={r.id} row={r} rowH={rowH} density={density} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ height: 36, padding: '0 32px', background: 'var(--vc-surface)', borderTop: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--vc-ink-3)' }}>
        <span><span className="mono">{rows.length}</span> of <span className="mono">{counts.all}</span> shown</span>
        <span style={{ marginLeft: 'auto', color: 'var(--vc-ink-mute)' }}>VeriChain · ECON1101 · Sem 1, 2026</span>
      </div>
    </div>
  );
};

function ColH({ children, onClick, sort, sortKey, style, num }) {
  const active = sort && sort.key === sortKey;
  return (
    <th onClick={onClick} style={{
      textAlign: num ? 'right' : 'left',
      padding: '8px 12px', fontSize: 11, fontWeight: 600,
      color: active ? 'var(--vc-ink)' : 'var(--vc-ink-3)',
      letterSpacing: '.06em', textTransform: 'uppercase',
      cursor: onClick ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        {active && (sort.dir === 'asc' ? <window.VC_UI.Icon.Chevron d="up" size={10} /> : <window.VC_UI.Icon.Chevron d="down" size={10} />)}
      </span>
    </th>
  );
}

function LecListRow({ row: r, rowH, density }) {
  const { Icon, StackedSourceBar, StatusBadge, Button } = window.VC_UI;
  const [hover, setHover] = React.useState(false);
  const notSub = r.status === 'not-submitted';
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => { if (!notSub) window.vcNav(r.alert === 'discrepancy' ? 'lecturer-review-discrepancy' : 'lecturer-review-clean', { studentId: r.id }); }}
      style={{
        borderBottom: '1px solid var(--vc-line)',
        background: hover ? 'var(--vc-overlay)' : 'transparent',
        transition: 'background .1s',
        height: rowH,
        cursor: notSub ? 'default' : 'pointer',
      }}
    >
      <td style={{ padding: '6px 12px 6px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <LecListAvatar name={r.name} muted={notSub} />
          <span style={{ fontWeight: 500, color: notSub ? 'var(--vc-ink-mute)' : 'var(--vc-ink)', fontSize: 13.5 }}>{r.name}</span>
          {r.alert && <span title="Heavy AI paste without declaration" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--src-ai)' }} />}
        </div>
      </td>
      <td style={{ padding: '6px 12px', color: notSub ? 'var(--vc-ink-mute)' : 'var(--vc-ink-2)' }}>
        {notSub ? '—' : (
          <span>
            <span style={{ color: 'var(--vc-ink-3)' }}>{r.date}</span>
            <span style={{ color: 'var(--vc-ink-mute)', margin: '0 6px' }}>·</span>
            <span className="mono">{r.time}</span>
          </span>
        )}
      </td>
      <td style={{ padding: '6px 12px', textAlign: 'right' }} className="mono">
        {notSub ? <span style={{ color: 'var(--vc-ink-mute)' }}>—</span> : r.words.toLocaleString()}
      </td>
      <td style={{ padding: '6px 12px', textAlign: 'right', color: notSub ? 'var(--vc-ink-mute)' : 'var(--vc-ink-3)' }} className="mono">
        {r.dur}
      </td>
      <td style={{ padding: '6px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 130 }}><StackedSourceBar mix={r.mix} height={6} /></div>
          {r.mix && (
            <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-3)' }}>
              <span style={{ color: r.mix.ai > 50 ? 'var(--src-ai)' : 'var(--vc-ink-3)' }}>{r.mix.ai}%</span> AI
            </span>
          )}
        </div>
      </td>
      <td style={{ padding: '6px 12px' }}>
        {notSub ? <span style={{ color: 'var(--vc-ink-mute)' }}>—</span> : (
          r.declared ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--vc-ink-2)' }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--vc-accent-lo)', color: 'var(--vc-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Declared /></span>
              Declared
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--vc-ink-3)' }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--vc-bg-sunk)', color: 'var(--vc-ink-mute)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon.NotDeclared /></span>
              <span style={{ color: 'var(--vc-ink-mute)' }}>Not declared</span>
            </span>
          )
        )}
      </td>
      <td style={{ padding: '6px 12px' }}>
        <StatusBadge status={r.status} />
      </td>
      <td style={{ padding: '6px 32px 6px 12px', textAlign: 'right' }}>
        {!notSub && (
          <Button variant={hover ? 'secondary' : 'tertiary'} size="sm" trailing={<Icon.Chevron d="right" size={11}/>}
            onClick={() => window.vcNav(r.alert === 'discrepancy' ? 'lecturer-review-discrepancy' : 'lecturer-review-clean', { studentId: r.id })}>
            Review
          </Button>
        )}
      </td>
    </tr>
  );
}

function LecListAvatar({ name, muted }) {
  const initials = name.split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  // Stable color per name
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  const hue = h % 360;
  return (
    <span style={{
      width: 24, height: 24, borderRadius: '50%',
      background: muted ? 'var(--vc-bg-sunk)' : `oklch(74% 0.04 ${hue})`,
      color: muted ? 'var(--vc-ink-mute)' : 'var(--vc-ink)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10.5, fontWeight: 600, fontFamily: 'var(--ff-sans)',
    }}>{initials}</span>
  );
}

window.VCLecturerList = VCLecturerList;
