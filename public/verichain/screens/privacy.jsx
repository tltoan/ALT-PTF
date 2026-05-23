// VeriChain — Privacy / "What's captured" page (shared, doc-style)

const VCPrivacy = ({ height = 2400 }) => {
  const { BrandMark, Icon, Button } = window.VC_UI;

  const sections = [
    { id: 'what',      label: 'What we capture' },
    { id: 'not',       label: 'What we don\'t' },
    { id: 'when',      label: 'When capture is active' },
    { id: 'where',     label: 'Where data lives' },
    { id: 'rights',    label: 'Your rights' },
    { id: 'tamper',    label: 'Tamper-evidence' },
    { id: 'contact',   label: 'Contact' },
  ];

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', background: 'var(--vc-bg)' }}>
      {/* Slim header */}
      <header style={{ height: 52, padding: '0 28px', background: 'var(--vc-surface)', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BrandMark size={20} />
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 16, fontWeight: 500 }}>VeriChain</span>
        <span style={{ width: 1, height: 14, background: 'var(--vc-line)' }} />
        <span style={{ fontSize: 12.5, color: 'var(--vc-ink-3)' }}>Documentation</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: 'var(--vc-ink-3)' }}>
          <a href="#" style={{ color: 'var(--vc-ink-3)' }}>Overview</a>
          <a href="#" style={{ color: 'var(--vc-ink-3)' }}>For students</a>
          <a href="#" style={{ color: 'var(--vc-ink-3)' }}>For institutions</a>
          <a href="#" style={{ color: 'var(--vc-ink)' }}>Privacy</a>
          <Button variant="secondary" size="sm">Open in LMS</Button>
        </span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 720px) 1fr', gap: 48, maxWidth: 1280, margin: '0 auto', padding: '56px 28px 96px' }}>
        {/* Side nav */}
        <nav style={{ position: 'sticky', top: 76, alignSelf: 'flex-start', height: 'fit-content' }}>
          <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>On this page</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--vc-ink-3)' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-mute)' }}>{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 28, padding: 12, background: 'var(--vc-surface)', border: '1px solid var(--vc-line)', borderRadius: 6, fontSize: 12, color: 'var(--vc-ink-3)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--vc-ink)', marginBottom: 6 }}>For privacy officers</div>
            Procurement summary, DPIA template, and retention schedule are available on request from your institutional contact.
          </div>
        </nav>

        {/* Document */}
        <main>
          <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Privacy &amp; data practices</div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 6, fontWeight: 400 }}>
            What VeriChain records, and what it doesn't.
          </h1>
          <p style={{ marginTop: 16, fontFamily: 'var(--ff-serif)', fontSize: 18, lineHeight: 1.65, color: 'var(--vc-ink-2)', maxWidth: 640 }}>
            VeriChain documents how a piece of writing was produced. It is not a surveillance tool, not an AI-detection tool, and it does not produce verdicts. This page describes — in plain language — exactly what is recorded, where it lives, and what you can do with it.
          </p>
          <div style={{ marginTop: 18, display: 'flex', gap: 8, fontSize: 12, color: 'var(--vc-ink-3)' }}>
            <span className="mono" style={{ padding: '3px 7px', background: 'var(--vc-bg-sunk)', border: '1px solid var(--vc-line)', borderRadius: 3 }}>v2026-05 · current</span>
            <span style={{ padding: '3px 0' }}>Reviewed by USyd Privacy Office, 18 March 2026.</span>
          </div>

          {/* 1. What we capture */}
          <PrSection id="what" n="01" title="What we capture">
            <p>While an assignment session is open, VeriChain records the following — and nothing else.</p>
            <PrList items={[
              ['Document snapshots', 'A full copy of the essay at every commit. Auto-commits happen roughly every five minutes during active writing; manual commits happen when you press save. Snapshots are stored as plain text plus structural metadata (headings, paragraph breaks).'],
              ['Paste events', 'When text is pasted into the editor, we record (a) the time, (b) the size in characters, and (c) the domain of the source tab — for example "rba.gov.au". The pasted text itself is recorded because it is now part of the document; the source page is not.'],
              ['Tab focus', 'The domains of tabs you focus during the session, plus the time you spent on each. Domains only — never URLs, page titles, or contents.'],
              ['Declared AI use', 'Anything you typed into the "Declare AI use" field, exactly as you wrote it, and any per-paste annotations you added.'],
              ['Session metadata', 'Start time, end time, total active writing time, session ID, and a per-commit cryptographic hash chained to the previous commit.'],
            ]} />
          </PrSection>

          {/* 2. What we don't */}
          <PrSection id="not" n="02" title="What we don't capture">
            <p>The following are explicitly outside what VeriChain records — by design, not by promise. The product cannot capture them because the browser does not give it the means.</p>
            <PrList items={[
              ['Keystrokes', 'We see commits — the document at points in time — not characters as you type them.'],
              ['Tab contents', 'Only the domain of a focused tab is recorded. The page itself is never read.'],
              ['Anything outside this session', 'When the assignment window is closed, no recording happens. Reopening creates a new session.'],
              ['Other browser windows', 'We see what happens inside the writing tab\'s session. Anything in another window, profile, or application is invisible to us.'],
              ['Audio, video, screenshots', 'None of these are captured. The product has no camera or microphone access.'],
            ]} />
          </PrSection>

          {/* 3. When */}
          <PrSection id="when" n="03" title="When capture is active">
            <p>Capture begins when you click <strong>Start writing</strong> on an assignment, and ends when you close the assignment tab or submit. If your network drops, recording pauses; queued commits send when you reconnect.</p>
            <PrCallout>
              <strong>Visible indicator.</strong> A green dot in the editor header reads "Recording" any time capture is active. If the dot is absent, nothing is being recorded.
            </PrCallout>
          </PrSection>

          {/* 4. Where */}
          <PrSection id="where" n="04" title="Where data lives, and for how long">
            <p>VeriChain stores records on infrastructure operated under the University of Sydney's data-sovereignty agreement. Data is encrypted at rest with AES-256 and in transit with TLS 1.3.</p>
            <PrGrid>
              <PrCell label="Region" value="Sydney, Australia (ap-southeast-2)" />
              <PrCell label="Encryption" value="AES-256 at rest · TLS 1.3 in transit" />
              <PrCell label="Retention" value="Process records: 7 years from submission (USyd policy 11.4)" />
              <PrCell label="Backups" value="Daily, encrypted; deleted 90 days after primary deletion" />
              <PrCell label="Access" value="Lecturers of record; the student themselves; institutional moderators on appeal" />
              <PrCell label="Third parties" value="None. Records are not shared with AI-detection vendors." />
            </PrGrid>
          </PrSection>

          {/* 5. Rights */}
          <PrSection id="rights" n="05" title="Your rights">
            <p>If you are a student covered by VeriChain at an Australian institution, the Privacy Act 1988 (Cth) and the Australian Privacy Principles give you specific rights. We have engineered the product to make these rights cheap to exercise.</p>
            <PrList items={[
              ['Access', 'View your complete process record at any time, from the same interface your lecturer uses.'],
              ['Export', 'Download a portable archive of your record — JSON commits plus rendered HTML — at any time. Pre- or post-submission.'],
              ['Correction', 'Add or amend annotations to your own pastes and commits. The original record remains; your correction is layered alongside it.'],
              ['Deletion', 'Request deletion of your process record after the grade has been finalised. Submission documents are retained per institutional policy; the process record is not.'],
              ['Complaint', 'Lodge a complaint with the OAIC or with your institution\'s privacy office. We will cooperate fully with any investigation.'],
            ]} />
          </PrSection>

          {/* 6. Tamper-evidence */}
          <PrSection id="tamper" n="06" title="How tamper-evidence works (in plain language)">
            <p>Every commit carries a small cryptographic fingerprint — a hash. That fingerprint depends on the document at that moment <em>and</em> on the previous commit's fingerprint. So a chain forms, in which any change to any earlier commit would change every fingerprint that comes after it.</p>
            <p>This means that nobody — not us, not a lecturer, not the student, not an attacker — can quietly alter a commit in the middle of the record without making the change obvious. A third party can verify the chain independently using the published verifier.</p>
            <PrCallout muted>
              No blockchain is involved. We just sign and chain hashes; the same technique Git has used since 2005. We mention this because "tamper-evidence" sometimes attracts more elaborate engineering than the problem requires.
            </PrCallout>
          </PrSection>

          {/* 7. Contact */}
          <PrSection id="contact" n="07" title="Contact for privacy questions">
            <PrGrid>
              <PrCell label="Institution-level" value="USyd Privacy Officer · privacy.officer@sydney.edu.au" />
              <PrCell label="Product-level" value="privacy@verichain.app · response within 7 days" />
              <PrCell label="Regulator" value="Office of the Australian Information Commissioner · oaic.gov.au" />
            </PrGrid>
            <p style={{ marginTop: 24 }}>This document supersedes all earlier versions. For a redlined view of changes from the previous release, see the <a href="#" style={{ color: 'var(--vc-accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>changelog</a>.</p>
          </PrSection>
        </main>

        {/* Right rail — examples */}
        <aside style={{ position: 'sticky', top: 76, alignSelf: 'flex-start', height: 'fit-content' }}>
          <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>What a record looks like</div>
          <ExampleRecord />
        </aside>
      </div>
    </div>
  );
};

function PrSection({ id, n, title, children }) {
  return (
    <section id={id} style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--vc-line)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--vc-ink-mute)' }}>{n}</span>
        <h2 style={{ fontSize: 26, letterSpacing: '-0.015em' }}>{title}</h2>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--ff-serif)', fontSize: 16, lineHeight: 1.7, color: 'var(--vc-ink-2)' }}>
        {children}
      </div>
    </section>
  );
}

function PrList({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map(([t, b]) => (
        <li key={t} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18, paddingBottom: 14, borderBottom: '1px dashed var(--vc-line)' }}>
          <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 13.5, fontWeight: 500, color: 'var(--vc-ink)' }}>{t}</div>
          <div style={{ fontSize: 15, lineHeight: 1.65 }}>{b}</div>
        </li>
      ))}
    </ul>
  );
}

function PrGrid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px', borderTop: '1px solid var(--vc-line)' }}>{children}</div>;
}

function PrCell({ label, value }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--vc-line)' }}>
      <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4, fontFamily: 'var(--ff-sans)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 13.5, color: 'var(--vc-ink-2)' }}>{value}</div>
    </div>
  );
}

function PrCallout({ children, muted }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderLeft: `3px solid ${muted ? 'var(--vc-line-hi)' : 'var(--vc-accent)'}`,
      background: muted ? 'var(--vc-bg-sunk)' : 'var(--vc-accent-lo)',
      fontFamily: 'var(--ff-sans)',
      fontSize: 13.5, lineHeight: 1.6,
      color: 'var(--vc-ink-2)',
      borderRadius: '0 4px 4px 0',
    }}>{children}</div>
  );
}

function ExampleRecord() {
  return (
    <div className="vc-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--vc-line)', background: 'var(--vc-bg-sunk)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <window.VC_UI.Icon.ChainLink size={12} />
        <span style={{ fontSize: 11.5, color: 'var(--vc-ink-2)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>commit chain · excerpt</span>
      </div>
      <pre className="mono" style={{ margin: 0, padding: '12px 12px', fontSize: 10.5, lineHeight: 1.7, color: 'var(--vc-ink-2)', background: 'var(--vc-surface)', whiteSpace: 'pre' }}>
{`commit 88c225 (HEAD)
parent  92b7c1
hash    sha-256:88c225e7…d901a
time    2026-05-22T13:48:14
type    auto
src     typed
delta   +212

commit 92b7c1
parent  ce4811
hash    sha-256:92b7c19a…fe28c
time    2026-05-22T13:42:01
type    manual
src     typed
delta   +346

commit ce4811
parent  f5009d
hash    sha-256:ce481133…40b62
time    2026-05-22T13:22:18
type    auto
src     research
paste   econlib.org +241

…`}
      </pre>
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--vc-line)', fontSize: 11.5, color: 'var(--vc-ink-3)', lineHeight: 1.5 }}>
        Each commit's hash includes the parent's, so the chain breaks if anything earlier is changed.
      </div>
    </div>
  );
}

window.VCPrivacy = VCPrivacy;
