// VeriChain — Lecturer assignment setup (inside LMS chrome)

const VCLecturerSetup = ({ height = 900 }) => {
  const { Button, Icon, Segmented, Toggle, BrandMark } = window.VC_UI;
  const [policy, setPolicy] = React.useState('declared');
  const [requireDecl, setRequireDecl] = React.useState(true);
  const [studentSees, setStudentSees] = React.useState(true);
  const [confTamper, setConfTamper] = React.useState(true);

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)' }}>
      {/* Slim LMS-inside header */}
      <header style={{ height: 48, padding: '0 20px', background: 'var(--vc-surface)', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="tertiary" size="sm" leading={<Icon.Chevron d="left" size={12}/>} onClick={() => window.vcNav('lecturer-list')}>Back to Moodle</Button>
        <span style={{ width: 1, height: 14, background: 'var(--vc-line)' }} />
        <BrandMark size={16} />
        <span style={{ fontSize: 13, color: 'var(--vc-ink-3)' }}>VeriChain · Assignment configuration</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--vc-ink-mute)' }}>ECON1101 · Sem 1, 2026 · Dr Hana Eriksen</span>
      </header>

      <main style={{ flex: 1, overflow: 'auto', padding: '40px 24px 64px' }}>
        <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>New assignment · step 2 of 2</div>
          <h1 style={{ fontSize: 30, letterSpacing: '-0.015em' }}>Configure VeriChain</h1>
          <p style={{ marginTop: 8, color: 'var(--vc-ink-3)', fontSize: 14 }}>
            These settings control what students see when they start the assignment, and how their writing is recorded. Most fields are inherited from Moodle.
          </p>

          {/* Inherited */}
          <SetupSection title="From Moodle" subtitle="Inherited from the assignment in your LMS — edit there to change.">
            <SetupField label="Assignment title">
              <input className="vc-input" defaultValue="Essay 2: Market Failure" />
            </SetupField>
            <SetupRow2>
              <SetupField label="Due date">
                <input className="vc-input" defaultValue="Friday 24 May 2026, 23:59 AEST" />
              </SetupField>
              <SetupField label="Word target">
                <input className="vc-input mono" defaultValue="1500" style={{ fontFamily: 'var(--ff-mono)' }} />
              </SetupField>
            </SetupRow2>
          </SetupSection>

          {/* AI policy */}
          <SetupSection title="AI use policy" subtitle="VeriChain accommodates different pedagogical positions rather than enforcing one. Pick the policy you've set for this assignment.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { v: 'allowed',   label: 'AI use allowed and welcomed', desc: 'Students can use AI freely. Sources are recorded for transparency but no declaration is required.' },
                { v: 'declared',  label: 'AI use allowed, with declaration', desc: 'Students may use AI but must briefly describe their use. Discrepancies between declared and observed use are visible to you, not flagged.' },
                { v: 'forbidden', label: 'AI use not permitted for this assignment', desc: 'Pastes from recognised AI tools are recorded plainly so you can see what happened.' },
              ].map(opt => (
                <PolicyOption key={opt.v} {...opt} selected={policy === opt.v} onClick={() => setPolicy(opt.v)} />
              ))}
            </div>
          </SetupSection>

          {/* Toggles */}
          <SetupSection title="Student experience">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Toggle
                checked={requireDecl}
                onChange={setRequireDecl}
                label="Require students to declare AI use upfront"
                description="If on, the declaration field on the start screen becomes required. Only relevant when AI use is allowed with declaration."
              />
              <Toggle
                checked={studentSees}
                onChange={setStudentSees}
                label="Allow students to view their own process record"
                description="Default on. Students see exactly the same process view their lecturer sees. Recommended unless your institution has a specific reason to withhold it."
              />
              <Toggle
                checked={confTamper}
                onChange={setConfTamper}
                label="Cryptographically chain commits (tamper-evident)"
                description="Each commit's hash includes its predecessor's. Allows a third party (you, the student, a moderator) to verify the record has not been altered after the fact. Recommended."
              />
            </div>
          </SetupSection>

          {/* Buttons */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--vc-line)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button size="md" onClick={() => window.vcNav('lecturer-list')}>Save and return to Moodle</Button>
            <Button variant="secondary" size="md" onClick={() => window.vcNav('onboarding', { persona: 'student' })}>Preview student view</Button>
            <Button variant="tertiary" onClick={() => window.vcNav('lecturer-list')}>Cancel</Button>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--vc-ink-mute)' }}>
              Saves to <span className="mono">VeriChain</span> and <span className="mono">Moodle</span>.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

function SetupSection({ title, subtitle, children }) {
  return (
    <section style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--vc-line)' }}>
      <h2 style={{ fontSize: 17, fontFamily: 'var(--ff-sans)', fontWeight: 600, color: 'var(--vc-ink)' }}>{title}</h2>
      {subtitle && <p style={{ marginTop: 4, fontSize: 13, color: 'var(--vc-ink-3)', lineHeight: 1.55 }}>{subtitle}</p>}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </section>
  );
}

function SetupField({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, color: 'var(--vc-ink-2)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

function SetupRow2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>;
}

function PolicyOption({ v, label, desc, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 16px', textAlign: 'left',
      background: selected ? 'var(--vc-surface)' : 'var(--vc-bg)',
      border: `1px solid ${selected ? 'var(--vc-accent)' : 'var(--vc-line)'}`,
      borderRadius: 8, cursor: 'pointer',
      fontFamily: 'inherit',
      boxShadow: selected ? '0 0 0 3px var(--vc-accent-ring)' : 'none',
      transition: 'border-color .12s, box-shadow .12s, background .12s',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', border: `1px solid ${selected ? 'var(--vc-accent)' : 'var(--vc-line-hi)'}`,
        flexShrink: 0, marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <span style={{ width: 8, height: 8, background: 'var(--vc-accent)', borderRadius: '50%' }} />}
      </span>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--vc-ink)' }}>{label}</div>
        <div style={{ fontSize: 12.5, color: 'var(--vc-ink-3)', marginTop: 4, lineHeight: 1.55 }}>{desc}</div>
      </div>
    </button>
  );
}

window.VCLecturerSetup = VCLecturerSetup;
