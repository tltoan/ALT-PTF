// VeriChain — Student submission confirmation

const VCStudentSubmitted = ({ height = 900 }) => {
  const { Button, BrandMark, Icon, SourceChip, StackedSourceBar } = window.VC_UI;
  const VC = window.VC_DATA;

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)' }}>
      <header style={{ height: 48, padding: '0 14px', background: 'var(--vc-surface)', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BrandMark size={18} />
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 15, fontWeight: 500 }}>VeriChain</span>
        <span style={{ width: 1, height: 14, background: 'var(--vc-line)' }} />
        <span style={{ fontSize: 12.5, color: 'var(--vc-ink-3)' }}>ECON1101 / Essay 2</span>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          {/* Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--vc-accent-lo)', color: 'var(--vc-accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5L7.5 13 14 5.5"/></svg>
            </span>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--vc-accent-hi)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Submission recorded</div>
              <h1 style={{ fontSize: 30, marginTop: 4, fontWeight: 500, letterSpacing: '-0.015em' }}>Submitted to ECON1101 · Essay 2.</h1>
            </div>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--vc-ink-2)', maxWidth: 540 }}>
            Your essay and its process record have been delivered to Dr Hana Eriksen and to your Moodle gradebook. You can return to your course now, or open your own copy of the process record.
          </p>

          {/* Summary card */}
          <div className="vc-card" style={{ marginTop: 32, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--ff-sans)', fontSize: 13, fontWeight: 600, color: 'var(--vc-ink-2)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Submission summary</h3>
              <span className="mono" style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', marginLeft: 'auto' }}>
                receipt · 7a39c1e · 23 May 2026, 14:08:51
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22, paddingBottom: 18, borderBottom: '1px solid var(--vc-line)' }}>
              <SubStat label="Words" value={<><span className="mono">1,487</span> <span style={{ fontSize: 12, color: 'var(--vc-ink-mute)' }}>/ 1,500</span></>} />
              <SubStat label="Session" value={<span className="mono">1h 32m</span>} sub="active writing time" />
              <SubStat label="Commits" value={<span className="mono">18</span>} sub="3 manual · 15 auto" />
            </div>

            <div style={{ marginTop: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Source composition</div>
              <StackedSourceBar mix={{ typed: 71, research: 21, ai: 6, unknown: 2 }} height={10} showLegend />
            </div>

            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--vc-line)' }}>
              <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Sources observed</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['gpt','rba','jstor','econ_lib','oecd','treasury'].map(s => <SourceChip key={s} src={s} size="sm" />)}
              </div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--vc-line)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ width: 24, height: 24, borderRadius: 5, background: 'var(--vc-accent-lo)', color: 'var(--vc-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <Icon.Declared />
              </span>
              <div style={{ fontSize: 12.5, color: 'var(--vc-ink-2)', lineHeight: 1.55 }}>
                <div style={{ fontWeight: 600, color: 'var(--vc-ink)', marginBottom: 2 }}>AI use declared</div>
                "Used ChatGPT to brainstorm the structure and to draft the Pigouvian-tax sentence in section 3. Final wording is my own."
              </div>
            </div>
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--vc-ink-3)', lineHeight: 1.55, maxWidth: 540 }}>
            Your lecturer will see your essay and its process record. You can view your own history any time before grades are released.
          </p>

          <div style={{ marginTop: 26, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button size="lg" leading={<Icon.Chevron d="left" size={12}/>} onClick={() => window.vcNav('lecturer-list', { persona: 'lecturer' })}>Return to course</Button>
            <Button variant="secondary" onClick={() => window.vcNav('lecturer-review-clean')}>View my submission history</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

function SubStat({ label, value, sub }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, color: 'var(--vc-ink)', lineHeight: 1.1, fontWeight: 500, fontFamily: 'var(--ff-serif)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--vc-ink-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

window.VCStudentSubmitted = VCStudentSubmitted;
