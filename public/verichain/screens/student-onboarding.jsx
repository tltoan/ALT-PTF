// VeriChain — Student onboarding screen

const VCStudentOnboarding = ({ height = 900 }) => {
  const { Button, BrandMark, Icon } = window.VC_UI;
  const [expanded, setExpanded] = React.useState(false);
  const [declared, setDeclared] = React.useState('');
  const [started, setStarted] = React.useState(false);

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Slim app header */}
      <header style={{
        height: 52, padding: '0 24px', background: 'var(--vc-surface)',
        borderBottom: '1px solid var(--vc-line)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <BrandMark size={20} />
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 17, fontWeight: 500 }}>VeriChain</span>
        <span style={{ width: 1, height: 16, background: 'var(--vc-line)' }} />
        <span style={{ fontSize: 13, color: 'var(--vc-ink-3)' }}>ECON1101 — Markets &amp; Failures</span>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--vc-ink-3)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--vc-ink-2)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 600 }}>OA</span>
          Olukunle Adesanya
        </span>
      </header>

      {/* Centred column */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '64px 24px', background: 'var(--vc-bg)' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
            ECON1101 · Essay 2
          </div>
          <h1 style={{ fontSize: 38, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 560 }}>
            When markets fail: public goods, externalities and the limits of self-correction
          </h1>

          <div style={{ marginTop: 20, display: 'flex', gap: 24, fontSize: 13, color: 'var(--vc-ink-3)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Clock size={13} />
              Due <span style={{ color: 'var(--vc-ink)', fontWeight: 500 }}>Friday 24 May, 23:59</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Doc size={13} />
              <span className="mono">1,500</span> word target
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Pencil size={13} />
              Worth <span className="mono">25%</span>
            </span>
          </div>

          {/* The explainer */}
          <section style={{ marginTop: 44, paddingTop: 28, borderTop: '1px solid var(--vc-line)' }}>
            <p style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, lineHeight: 1.55, color: 'var(--vc-ink)', maxWidth: 580 }}>
              While you work on this assignment, VeriChain records your writing process — the order you wrote things in, the sources you pasted from, and any AI tools you used. Your lecturer sees this alongside your submission.
            </p>
          </section>

          {/* Expandable: what's captured / not */}
          <section style={{ marginTop: 32 }}>
            <button onClick={() => setExpanded(e => !e)} style={{
              fontFamily: 'inherit', background: 'transparent', border: '1px solid var(--vc-line)',
              borderRadius: 8, padding: '12px 14px', width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              color: 'var(--vc-ink)', fontSize: 13.5, fontWeight: 500,
              transition: 'background .12s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--vc-overlay)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Icon.Eye size={14} />
              <span style={{ flex: 1 }}>What's captured, and what isn't</span>
              <span style={{ color: 'var(--vc-ink-3)', transition: 'transform .15s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                <Icon.Chevron d="down" size={14} />
              </span>
            </button>
            {expanded && (
              <div style={{ marginTop: 14, padding: '20px 22px', background: 'var(--vc-surface)', border: '1px solid var(--vc-line)', borderRadius: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  <CapturedCol heading="Captured" tint="ok" items={[
                    'The tabs you visit during this session (domain only — not their contents).',
                    'Anything pasted into the editor, plus the domain it came from.',
                    'A snapshot of your document at each commit (auto every ~5 minutes, or manual).',
                    'The time and duration of this writing session.',
                  ]} />
                  <CapturedCol heading="Not captured" tint="off" items={[
                    'Your keystrokes. We see commits, not characters as you type them.',
                    'The contents of any tab — only its domain.',
                    'Anything outside this assignment session.',
                    'Anything in other browser windows or applications.',
                  ]} />
                </div>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--vc-line)', fontSize: 12.5, color: 'var(--vc-ink-3)', lineHeight: 1.55 }}>
                  Records are stored under the University of Sydney's research-data retention policy. You can <a href="#privacy" style={{ color: 'var(--vc-accent)', textDecoration: 'underline', textDecorationColor: 'var(--vc-accent-lo)', textUnderlineOffset: 3 }}>request a full export of your own record</a> at any time.
                </div>
              </div>
            )}
          </section>

          {/* Optional declaration */}
          <section style={{ marginTop: 40 }}>
            <label style={{ display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, color: 'var(--vc-ink)', fontWeight: 500 }}>Declare AI use you intend to make</span>
                <span style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Optional</span>
              </div>
              <textarea
                className="vc-input vc-textarea"
                placeholder="e.g., 'Using ChatGPT to brainstorm structure and check grammar.'"
                value={declared}
                onChange={(e) => setDeclared(e.target.value)}
                style={{ fontFamily: 'var(--ff-sans)', minHeight: 76 }}
              />
              <div style={{ fontSize: 12.5, color: 'var(--vc-ink-3)', marginTop: 8, lineHeight: 1.5 }}>
                Declaring expected AI use upfront is treated more favourably than AI use only discovered in the record. You can also add a note for any individual paste while you write.
              </div>
            </label>
          </section>

          {/* Actions */}
          <div style={{ marginTop: 44, paddingTop: 28, borderTop: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button size="lg" onClick={() => { setStarted(true); setTimeout(() => window.vcNav('workspace'), 350); }}>Start writing</Button>
            <Button variant="tertiary" onClick={() => window.vcNav('privacy')}>Privacy details</Button>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--vc-ink-mute)' }}>
              Session ID will be issued when you begin.
            </span>
          </div>

          {started && (
            <div style={{ marginTop: 18, padding: '10px 14px', background: 'var(--vc-accent-lo)', borderRadius: 6, fontSize: 13, color: 'var(--vc-accent-hi)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon.Check /> Session opened. Opening the writing workspace…
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function CapturedCol({ heading, items, tint }) {
  const dot = tint === 'ok' ? 'var(--vc-accent)' : 'var(--vc-ink-mute)';
  return (
    <div>
      <div style={{ fontSize: 11.5, color: 'var(--vc-ink-2)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 12 }}>
        {heading}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((t, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.55, color: 'var(--vc-ink-2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, marginTop: 8, flexShrink: 0 }} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

window.VCStudentOnboarding = VCStudentOnboarding;
