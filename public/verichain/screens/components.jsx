// VeriChain — Component Library artboard

const VCComponents = () => {
  const { Button, SourceChip, StackedSourceBar, StatusBadge, CommitCard, Toast, EmptyState, Tabs, Segmented, Toggle, DiffBlock, Icon, FaviconSquare } = window.VC_UI;
  const VC = window.VC_DATA;

  const [tab, setTab] = React.useState('essay');
  const [seg, setSeg] = React.useState('declared');
  const [t1, setT1] = React.useState(true);
  const [t2, setT2] = React.useState(false);

  const sampleCommit = VC.COMMITS_CLEAN[8]; // the GPT-paste one

  return (
    <div className="vc" style={{ padding: '48px 60px', minHeight: '100%' }}>
      <header style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Foundation</div>
        <h1>Component library</h1>
        <p style={{ marginTop: 8, maxWidth: 580 }}>Primitives used across all seven screens. Every other view assembles these — adding new primitives is a deliberate act.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px 44px' }}>

        {/* Buttons */}
        <CompPanel title="Buttons" code="<Button variant primary | secondary | tertiary />">
          <CompRow label="Primary">
            <Button>Start writing</Button>
            <Button trailing={<Icon.Chevron d="right" size={13}/>}>Continue</Button>
            <Button size="sm">Save</Button>
            <Button disabled>Disabled</Button>
          </CompRow>
          <CompRow label="Secondary">
            <Button variant="secondary">Cancel</Button>
            <Button variant="secondary" leading={<Icon.Filter size={13}/>}>Filter</Button>
            <Button variant="secondary" size="sm">Annotate</Button>
          </CompRow>
          <CompRow label="Tertiary">
            <Button variant="tertiary">Privacy details</Button>
            <Button variant="tertiary" trailing={<Icon.Chevron d="right" size={11}/>}>See process</Button>
          </CompRow>
        </CompPanel>

        {/* Tabs / Segmented */}
        <CompPanel title="Tabs & segmented control">
          <CompRow label="Tabs">
            <Tabs value={tab} onChange={setTab} tabs={[
              { value: 'essay',   label: 'Essay',   icon: <Icon.Doc size={13}/> },
              { value: 'process', label: 'Process', icon: <Icon.ChainLink size={13}/>, badge: '16' },
            ]} />
          </CompRow>
          <CompRow label="Segmented (3 options)">
            <Segmented value={seg} onChange={setSeg} options={[
              { value: 'allowed', label: 'AI welcomed' },
              { value: 'declared', label: 'With declaration' },
              { value: 'forbidden', label: 'Not permitted' },
            ]} />
          </CompRow>
          <CompRow label="Segmented (2, small)">
            <Segmented size="sm" value="day" onChange={()=>{}} options={[
              { value: 'day',   label: 'Today' },
              { value: 'all',   label: 'All time' },
            ]} />
          </CompRow>
        </CompPanel>

        {/* Source chips */}
        <CompPanel title="Source chip" code="<SourceChip src='gpt' count={1240} />">
          <CompRow label="Categories">
            <SourceChip src="typed" />
            <SourceChip src="rba" />
            <SourceChip src="gpt" />
            <SourceChip src="unknown" />
          </CompRow>
          <CompRow label="With paste count">
            <SourceChip src="rba" count="218 chars" />
            <SourceChip src="gpt" count="199 chars" />
            <SourceChip src="jstor" count="264 chars" />
          </CompRow>
          <CompRow label="Small">
            <SourceChip src="oecd" size="sm" />
            <SourceChip src="econ_lib" size="sm" />
            <SourceChip src="claude" size="sm" />
          </CompRow>
        </CompPanel>

        {/* Stacked source bar */}
        <CompPanel title="Stacked source bar" code="<StackedSourceBar mix={{ typed, research, ai, unknown }} />">
          <CompRow label="Default · 8px">
            <div style={{ width: 220 }}><StackedSourceBar mix={{ typed: 71, research: 21, ai: 6, unknown: 2 }} /></div>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--vc-ink-3)' }}>mostly typed</span>
          </CompRow>
          <CompRow label="Heavy AI">
            <div style={{ width: 220 }}><StackedSourceBar mix={{ typed: 22, research: 11, ai: 64, unknown: 3 }} /></div>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--vc-ink-3)' }}>heavy AI paste</span>
          </CompRow>
          <CompRow label="With legend">
            <div style={{ width: 280 }}>
              <StackedSourceBar mix={{ typed: 71, research: 21, ai: 6, unknown: 2 }} showLegend />
            </div>
          </CompRow>
        </CompPanel>

        {/* Status indicators */}
        <CompPanel title="Status indicator">
          <CompRow label="States">
            <StatusBadge status="submitted" />
            <StatusBadge status="late" />
            <StatusBadge status="not-submitted" />
            <StatusBadge status="draft" />
          </CompRow>
          <CompRow label="Declared / not declared (with tooltip cue)">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--vc-ink-2)' }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--vc-accent-lo)', color: 'var(--vc-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Declared /></span>
              Declared AI use
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--vc-ink-2)' }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--vc-bg-sunk)', color: 'var(--vc-ink-mute)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon.NotDeclared /></span>
              Not declared
            </span>
          </CompRow>
        </CompPanel>

        {/* Toggle */}
        <CompPanel title="Toggle">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 0' }}>
            <Toggle checked={t1} onChange={setT1} label="Allow students to view their own process record" description="On by default. Students see exactly what their lecturer sees." />
            <Toggle checked={t2} onChange={setT2} label="Require declaration of AI use upfront" description="Asked once before the writing session begins." />
          </div>
        </CompPanel>

        {/* Commit card */}
        <CompPanel title="Commit card" code="<CommitCard commit={…} selected />" col2 wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--vc-line)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ background: 'var(--vc-bg-sunk)' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--vc-ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--vc-line)' }}>Resting · auto</div>
              <CommitCard commit={VC.COMMITS_CLEAN[3]} />
            </div>
            <div style={{ background: 'var(--vc-bg-sunk)', borderLeft: '1px solid var(--vc-line)' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--vc-ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--vc-line)' }}>Selected · manual</div>
              <CommitCard commit={VC.COMMITS_CLEAN[2]} selected />
            </div>
            <div style={{ background: 'var(--vc-bg-sunk)', borderTop: '1px solid var(--vc-line)' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--vc-ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--vc-line)' }}>With paste · research</div>
              <CommitCard commit={VC.COMMITS_CLEAN[4]} />
            </div>
            <div style={{ background: 'var(--vc-bg-sunk)', borderLeft: '1px solid var(--vc-line)', borderTop: '1px solid var(--vc-line)' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--vc-ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--vc-line)' }}>With paste · AI · selected</div>
              <CommitCard commit={VC.COMMITS_CLEAN[8]} selected />
            </div>
          </div>
        </CompPanel>

        {/* Diff block */}
        <CompPanel title="Diff block" code="<DiffBlock segments={…} />" col2 wide>
          <div style={{ background: 'var(--vc-surface)', border: '1px solid var(--vc-line)', borderRadius: 6, padding: 18 }}>
            <DiffBlock segments={[
              { kind: 'context', text: 'A second category concerns costs that a transaction imposes on parties outside it. ' },
              { kind: 'paste', src: 'rba', text: 'Reserve Bank analysis of Australian emissions-intensive industries finds that the social cost of a tonne of CO₂ exceeded the private price faced by producers by a factor of three to five over the decade to 2023.' },
              { kind: 'context', text: ' ' },
              { kind: 'add',     text: 'Where the polluter pays nothing for the harm imposed downstream, the polluting activity is, from society\'s point of view, over-produced. ' },
              { kind: 'del',     text: 'This is broken because polluters get away with it. ' },
            ]} />
          </div>
        </CompPanel>

        {/* Toast */}
        <CompPanel title="Toast (subtle, non-modal)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
            <Toast onClose={()=>{}} action={{ label: 'Add note', onClick: ()=>{} }}>
              Paste from <strong style={{ fontWeight: 600, color: '#fff' }}>chat.openai.com</strong> — 199 characters recorded.
            </Toast>
            <Toast onClose={()=>{}}>Auto-saved 4s ago · commit 88c225</Toast>
          </div>
        </CompPanel>

        {/* Empty states */}
        <CompPanel title="Empty states">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ border: '1px dashed var(--vc-line-2)', borderRadius: 6, padding: '6px 0', background: 'var(--vc-bg-sunk)' }}>
              <EmptyState
                title="No sources yet"
                body="As you open tabs and paste content, this list will fill in."
                icon={<Icon.Quote size={18}/>}
              />
            </div>
            <div style={{ border: '1px dashed var(--vc-line-2)', borderRadius: 6, padding: '6px 0', background: 'var(--vc-bg-sunk)' }}>
              <EmptyState
                title="No submissions yet"
                body="Once your students begin writing, their drafts appear here in real time."
                icon={<Icon.Doc size={18}/>}
              />
            </div>
          </div>
        </CompPanel>

      </div>
    </div>
  );
};

function CompPanel({ title, code, children, col2, wide }) {
  return (
    <section style={{ gridColumn: wide ? '1 / -1' : 'auto' }}>
      <header style={{ marginBottom: 14, display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: 16, fontFamily: 'var(--ff-sans)', fontWeight: 600, color: 'var(--vc-ink)' }}>{title}</h3>
        {code && <code className="mono" style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', background: 'var(--vc-bg-sunk)', padding: '2px 6px', borderRadius: 3 }}>{code}</code>}
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </section>
  );
}

function CompRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 10, borderBottom: '1px dashed var(--vc-line)' }}>
      <div style={{ width: 160, flexShrink: 0, fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, flex: 1, paddingTop: 2, paddingBottom: 4 }}>{children}</div>
    </div>
  );
}

window.VCComponents = VCComponents;
