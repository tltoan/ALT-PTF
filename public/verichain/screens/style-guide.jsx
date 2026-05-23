// VeriChain — Style Guide artboard

const VCStyleGuide = () => {
  const { BrandMark, SourceChip, Button, StackedSourceBar, FaviconSquare } = window.VC_UI;
  return (
    <div className="vc" style={{ padding: '56px 64px', minHeight: '100%' }}>
      {/* Masthead */}
      <header style={{ display: 'flex', alignItems: 'flex-end', gap: 24, paddingBottom: 28, borderBottom: '1px solid var(--vc-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BrandMark size={26} />
          <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>VeriChain</span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Style guide · v0.4</div>
          <div style={{ fontSize: 12, color: 'var(--vc-ink-3)', marginTop: 2 }} className="mono">Last revised 2026-05-21</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 48px', marginTop: 36 }}>
        {/* Voice */}
        <section style={{ gridColumn: '1 / -1' }}>
          <h1 style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 400, maxWidth: 760 }}>
            VeriChain documents how students work.<br />
            <span style={{ color: 'var(--vc-ink-3)' }}>It does not accuse them.</span>
          </h1>
          <p style={{ marginTop: 16, fontSize: 15, maxWidth: 640, lineHeight: 1.6 }}>
            The interface speaks like a court reporter, not a prosecutor. Prefer documentary language —
            <em> observed, recorded, declared, source</em> — over adversarial language —
            <em> flagged, suspicious, violation, caught</em>. Surface facts. Let the lecturer judge.
          </p>
        </section>

        {/* Palette */}
        <section>
          <SectionLabel n="01" title="Palette" subtitle="Neutral foundation, one accent, four source categories." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 14 }}>
            <Swatch token="--vc-bg" label="Background" hex="#FAFAF8" />
            <Swatch token="--vc-surface" label="Surface" hex="#FFFFFF" border />
            <Swatch token="--vc-ink" label="Ink" hex="#0F1A14" dark />
            <Swatch token="--vc-accent" label="Accent · Forest" hex="#1F8A5A" dark />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            <Swatch token="--vc-ink-3" label="Ink · 60" hex="#4F5B53" dark />
            <Swatch token="--vc-ink-mute" label="Ink · 40" hex="#97A199" dark />
            <Swatch token="--vc-line" label="Line" hex="#E5E7E3" />
            <Swatch token="--vc-bg-sunk" label="Surface · sunk" hex="#F4F3EE" />
          </div>
        </section>

        {/* Source palette */}
        <section>
          <SectionLabel n="02" title="Source categories" subtitle="Used only in process views — colours are categorical, not normative." />
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SourceRow src="typed"    name="Typed in session" desc="Characters that originated in the editor during this session." />
            <SourceRow src="rba"      name="Research source"  desc="Pasted from a third-party site (news, journal, gov, library)." kind="research" />
            <SourceRow src="gpt"      name="AI source"        desc="Pasted from a recognised generative-AI tool. Amber, not red — the product does not condemn AI use." kind="ai" />
            <SourceRow src="unknown"  name="Unknown / external" desc="Paste from an unrecognised origin (private window, app outside the browser)." />
          </div>
        </section>

        {/* Typography */}
        <section>
          <SectionLabel n="03" title="Typography" subtitle="Serif for the document body — academic register. Humanist sans for UI. Mono for measurement." />
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <TypeRow stack="Fraunces" role="Serif · document & headings" size={32} sample="When markets fail to self-correct" />
            <TypeRow stack="Geist" role="Sans · interface" size={18} sample="Pasted from rba.gov.au — 218 characters" />
            <TypeRow stack="Geist Mono" role="Mono · time, hashes, counts" size={14} sample="14:48 · +346 · a1f3e0c" mono />
          </div>
        </section>

        {/* Spacing & elevation */}
        <section>
          <SectionLabel n="04" title="Surface & rhythm" subtitle="Borders, not shadows. Density closer to Linear than Notion." />
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            {[4, 6, 8, 10, 12, 16, 24, 32].map(n => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: n, height: n, background: 'var(--vc-accent)', borderRadius: 1 }} />
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--vc-ink-3)' }}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            <div style={{ background: 'var(--vc-surface)', border: '1px solid var(--vc-line)', borderRadius: 8, padding: 14, flex: 1 }}>
              <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Resting</div>
              <div style={{ fontSize: 13, color: 'var(--vc-ink-2)', marginTop: 4 }}>1px line · no shadow</div>
            </div>
            <div style={{ background: 'var(--vc-surface)', borderRadius: 8, padding: 14, flex: 1, boxShadow: 'var(--shadow-pop)' }}>
              <div style={{ fontSize: 11.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Popover</div>
              <div style={{ fontSize: 13, color: 'var(--vc-ink-2)', marginTop: 4 }}>Soft shadow only on lifted surfaces</div>
            </div>
          </div>
        </section>

        {/* Don'ts */}
        <section style={{ gridColumn: '1 / -1', marginTop: 8 }}>
          <SectionLabel n="05" title="What this product is not" subtitle="A short list of design decisions we have made on principle." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 16 }}>
            {[
              ['No verdict UI', 'No trust scores, gauges, percentages of authenticity. We surface facts.'],
              ['No red alarms', 'AI use is not condemned. AI source is amber, not red. Late is the warmest colour in the palette.'],
              ['No mascots, no sparkles', 'No illustrations of students or laptops. No "AI sparkle" iconography. This is academic infrastructure.'],
              ['Borders, not shadows', 'Elevation is signalled by 1px lines. Shadow is reserved for genuinely floating things.'],
              ['One accent', 'Forest green is the only chromatic UI colour. Source categories live only inside process views.'],
              ['Snappy, not showy', 'No transition longer than 200ms. The product should feel like a tool, not a demo.'],
            ].map(([t, b]) => (
              <div key={t} style={{ padding: 14, border: '1px solid var(--vc-line)', borderRadius: 8, background: 'var(--vc-surface)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--vc-ink)' }}>{t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--vc-ink-3)', marginTop: 6, lineHeight: 1.55 }}>{b}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

function SectionLabel({ n, title, subtitle }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-mute)', letterSpacing: '.04em' }}>{n}</span>
        <h2 style={{ fontSize: 22 }}>{title}</h2>
      </div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--vc-ink-3)', marginTop: 6, maxWidth: 520 }}>{subtitle}</div>}
    </div>
  );
}

function Swatch({ token, label, hex, dark, border }) {
  return (
    <div>
      <div style={{
        height: 72, background: `var(${token})`,
        border: border ? '1px solid var(--vc-line)' : 'none',
        borderRadius: 6,
        padding: 10,
        color: dark ? '#fff' : 'var(--vc-ink-3)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <span className="mono" style={{ fontSize: 10.5, opacity: .8 }}>{token}</span>
        <span className="mono" style={{ fontSize: 11, fontWeight: 500 }}>{hex}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--vc-ink-2)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function SourceRow({ src, name, desc, kind }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '10px 14px', background: 'var(--vc-surface)', border: '1px solid var(--vc-line)', borderRadius: 6 }}>
      <div style={{ width: 44, paddingTop: 2 }}>
        <window.VC_UI.SourceChip src={src} size="sm" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--vc-ink)', fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--vc-ink-3)', marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-mute)', whiteSpace: 'nowrap' }}>
        var(--src-{(window.VC_DATA.SOURCES[src] || {}).kind})
      </div>
    </div>
  );
}

function TypeRow({ stack, role, size, sample, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, paddingBottom: 14, borderBottom: '1px dashed var(--vc-line)' }}>
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--vc-ink)', fontWeight: 500 }}>{stack}</div>
        <div style={{ fontSize: 11.5, color: 'var(--vc-ink-3)', marginTop: 2 }}>{role}</div>
      </div>
      <div style={{
        fontFamily: stack === 'Fraunces' ? 'var(--ff-serif)' : stack === 'Geist Mono' ? 'var(--ff-mono)' : 'var(--ff-sans)',
        fontSize: size,
        fontWeight: stack === 'Fraunces' ? 400 : 500,
        color: 'var(--vc-ink)',
        flex: 1,
        letterSpacing: stack === 'Fraunces' ? '-0.01em' : 'normal',
      }}>{sample}</div>
    </div>
  );
}

window.VCStyleGuide = VCStyleGuide;
