// VeriChain — Lecturer review (the most important screen)
// state: 'clean' | 'discrepancy'
// Two tabs: Essay (default) and Process (3-pane: timeline · doc · diff).

const VCLecturerReview = ({ state = 'clean', height = 900, density = 'comfortable' }) => {
  const { Button, BrandMark, Icon, FaviconSquare, SourceChip, StackedSourceBar, CommitCard, Tabs, DiffBlock } = window.VC_UI;
  const VC = window.VC_DATA;

  const isDisc = state === 'discrepancy';
  const commits = isDisc ? VC.COMMITS_DISCREPANCY : VC.COMMITS_CLEAN;
  const student = isDisc
    ? { name: 'Kai Mahmood', sid: '430918221', time: '11:30, today', words: 1453, mix: { typed: 22, research: 11, ai: 64, unknown: 3 }, declared: null, sourcesUsed: ['gpt','claude'], sessions: '01:55:02', commits: 9 }
    : { name: 'Olukunle Adesanya', sid: '430471098', time: '14:22, today', words: 1487, mix: { typed: 71, research: 21, ai: 6, unknown: 2 }, declared: 'Used ChatGPT to brainstorm structure and to draft the Pigouvian-tax sentence in §3. Final wording is my own.', sourcesUsed: ['gpt','rba','jstor','econ_lib','oecd','treasury'], sessions: '01:32:14', commits: 18 };

  const [tab, setTab] = React.useState('process');  // 'essay' | 'process'
  const [selIdx, setSelIdx] = React.useState(isDisc ? 2 : 8); // pick a paste-commit by default
  React.useEffect(() => { setSelIdx(isDisc ? 2 : 8); }, [isDisc]);

  const sel = commits[selIdx];
  const prev = commits[Math.max(0, selIdx - 1)];

  // Diff segments for the right pane — driven by the selected commit
  const diff = React.useMemo(() => makeDiffForCommit(sel, isDisc), [sel, isDisc]);

  // What proportion of the essay should be rendered up to the selected commit?
  const docFraction = Math.min(1, (selIdx + 1) / commits.length);

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)' }}>
      {/* Top header */}
      <header style={{ height: 48, padding: '0 20px', background: 'var(--vc-surface)', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Button variant="tertiary" size="sm" leading={<Icon.Chevron d="left" size={12}/>} onClick={() => window.vcNav('lecturer-list')}>All submissions</Button>
        <span style={{ width: 1, height: 14, background: 'var(--vc-line)' }} />
        <BrandMark size={16} />
        <span style={{ fontSize: 13, color: 'var(--vc-ink-3)' }}>
          {student.name} <span style={{ color: 'var(--vc-ink-mute)' }}>· {student.sid}</span>
        </span>
        <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
        <span style={{ fontSize: 13, color: 'var(--vc-ink-3)' }}>Essay 2: Market Failure</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--vc-ink-3)' }}>Submitted <span className="mono">{student.time}</span></span>
          <Button variant="secondary" size="sm" leading={<Icon.Chevron d="left" size={11}/>}
            onClick={() => window.vcNav(isDisc ? 'lecturer-review-clean' : 'lecturer-review-discrepancy')}>Prev student</Button>
          <Button variant="secondary" size="sm" trailing={<Icon.Chevron d="right" size={11}/>}
            onClick={() => window.vcNav(isDisc ? 'lecturer-review-clean' : 'lecturer-review-discrepancy')}>Next student</Button>
        </span>
      </header>

      {/* Tabs + summary strip */}
      <div style={{ padding: '14px 24px 0', background: 'var(--vc-bg)', borderBottom: '1px solid var(--vc-line)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
          <Tabs value={tab} onChange={setTab} tabs={[
            { value: 'essay',   label: 'Essay',   icon: <Icon.Doc size={13}/> },
            { value: 'process', label: 'Process', icon: <Icon.ChainLink size={13}/>, badge: commits.length },
          ]} />
          <span style={{ marginLeft: 'auto', paddingBottom: 10, fontSize: 11.5, color: 'var(--vc-ink-mute)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon.Eye size={11} /> You are reviewing — no actions are sent to the student.
          </span>
        </div>

        {/* Summary header strip */}
        <div style={{ paddingTop: 14, paddingBottom: 16, display: 'grid', gridTemplateColumns: '120px 120px 1fr 1fr', gap: 32, alignItems: 'center' }}>
          <ReviewSum label="Session" value={<span className="mono">{student.sessions}</span>} sub="active writing" />
          <ReviewSum label="Commits" value={<span className="mono">{student.commits}</span>} sub={isDisc ? '8 auto · 1 manual' : '15 auto · 3 manual'} />
          <div>
            <div style={{ fontSize: 10.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Source composition</div>
            <StackedSourceBar mix={student.mix} height={8} showLegend />
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Declared AI use · Observed AI sources</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, fontSize: 12.5, color: 'var(--vc-ink-2)', lineHeight: 1.45 }}>
                {student.declared
                  ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--vc-accent-lo)', color: 'var(--vc-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}><Icon.Declared /></span>
                      <span style={{ flex: 1 }}>"{student.declared}"</span>
                    </div>
                  )
                  : (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--vc-bg-sunk)', color: 'var(--vc-ink-mute)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}><Icon.NotDeclared /></span>
                      <span style={{ color: 'var(--vc-ink-3)' }}>No declaration submitted by the student.</span>
                    </div>
                  )}
              </div>
              <div style={{ flex: '0 0 auto', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {student.sourcesUsed.filter(s => VC.SOURCES[s].kind === 'ai').map(s => (
                  <SourceChip key={s} src={s} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {tab === 'essay' ? (
          <EssayView student={student} isDisc={isDisc} />
        ) : (
          <ProcessView
            commits={commits}
            selIdx={selIdx}
            setSelIdx={setSelIdx}
            sel={sel}
            diff={diff}
            docFraction={docFraction}
            density={density}
            isDisc={isDisc}
          />
        )}
      </div>

      {/* Bottom marking controls */}
      <footer style={{
        background: 'var(--vc-surface)', borderTop: '1px solid var(--vc-line)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 12, color: 'var(--vc-ink-3)' }}>Grade</label>
          <input className="vc-input" type="text" defaultValue={isDisc ? '' : '74'} placeholder="—"
            style={{ width: 72, height: 32, padding: '0 10px', textAlign: 'center', fontFamily: 'var(--ff-mono)', fontSize: 13 }} />
          <span style={{ fontSize: 12, color: 'var(--vc-ink-mute)' }}>/ 100</span>
        </div>
        <span style={{ width: 1, height: 24, background: 'var(--vc-line)' }} />
        <input className="vc-input" type="text" placeholder="Internal note (not visible to student)"
          style={{ flex: 1, height: 32, padding: '0 12px', fontSize: 13 }} />
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--vc-ink-3)' }}>
            <window.VC_UI.Toggle checked label="" onChange={()=>{}} />
            Send to LMS gradebook
          </label>
          <Button variant="secondary" size="md">Save draft</Button>
          <Button size="md" onClick={() => window.vcNav('lecturer-list')}>Save grade</Button>
        </span>
      </footer>
    </div>
  );
};

function ReviewSum({ label, value, sub }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, color: 'var(--vc-ink)', lineHeight: 1.1, fontWeight: 500, fontFamily: 'var(--ff-serif)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--vc-ink-3)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Essay tab — clean read view with optional source highlights
// ───────────────────────────────────────────────────────────────
function EssayView({ student, isDisc }) {
  const { Icon, FaviconSquare } = window.VC_UI;
  const VC = window.VC_DATA;
  const [showSources, setShowSources] = React.useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 32px', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--vc-bg)' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--vc-ink-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={showSources} onChange={(e) => setShowSources(e.target.checked)} />
          Tint pasted passages by source
        </label>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--vc-ink-mute)' }}>
          Reading view · use the <strong style={{ color: 'var(--vc-ink-3)' }}>Process</strong> tab to time-travel through commits.
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '48px 24px 80px', background: 'var(--vc-bg)' }}>
        <article style={{ maxWidth: 740, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 30, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.015em' }}>{VC.ESSAY_TITLE}</h1>
          <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--vc-ink-3)' }}>{student.name} · ECON1101 · {student.words.toLocaleString()} words</div>
          <div style={{ marginTop: 28, fontFamily: 'var(--ff-serif)', fontSize: 16.5, lineHeight: 1.75, color: 'var(--vc-ink)' }}>
            {VC.ESSAY.map((para, i) => (
              <React.Fragment key={i}>
                <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 21, fontWeight: 500, color: 'var(--vc-ink)', marginTop: i === 0 ? 0 : 28, marginBottom: 12 }}>{para.heading}</h2>
                <p style={{ marginBottom: 16, fontSize: 16.5, lineHeight: 1.75, fontFamily: 'var(--ff-serif)' }}>
                  {para.segments.map((s, j) => {
                    const isAttrib = s.src !== 'typed';
                    const c = VC.SRC_COLOR[(VC.SOURCES[s.src] || VC.SOURCES.unknown).kind];
                    return (
                      <span key={j} style={showSources && isAttrib ? {
                        background: c.bg,
                        borderBottom: `1px solid ${c.ink}`,
                        boxShadow: `inset 0 -1px 0 ${c.ink}`,
                        padding: '0 1px',
                      } : {}} title={isAttrib ? `Pasted from ${VC.SOURCES[s.src].label}` : undefined}>
                        {s.text}
                      </span>
                    );
                  })}
                </p>
              </React.Fragment>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Process tab — three panes + scrubber
// ───────────────────────────────────────────────────────────────
function ProcessView({ commits, selIdx, setSelIdx, sel, diff, docFraction, density, isDisc }) {
  const { Icon, FaviconSquare, CommitCard, SourceChip } = window.VC_UI;
  const VC = window.VC_DATA;

  // Scrubber drag
  const scrubRef = React.useRef(null);
  const onScrub = (e) => {
    const r = scrubRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const idx = Math.min(commits.length - 1, Math.max(0, Math.round(x * (commits.length - 1))));
    setSelIdx(idx);
  };
  const onScrubDown = (e) => {
    onScrub(e);
    const move = (ev) => onScrub(ev);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr 380px', minHeight: 0 }}>
      {/* Left: timeline + scrubber */}
      <aside style={{ borderRight: '1px solid var(--vc-line)', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)', minHeight: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--vc-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Timeline</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--vc-ink-3)' }}>{selIdx + 1} / {commits.length}</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 4 }}>
              <button onClick={() => setSelIdx(i => Math.max(0, i - 1))} style={navBtn}><Icon.Chevron d="up" size={11}/></button>
              <button onClick={() => setSelIdx(i => Math.min(commits.length - 1, i + 1))} style={navBtn}><Icon.Chevron d="down" size={11}/></button>
              <button onClick={() => setSelIdx(commits.length - 1)} style={navBtn} title="Jump to latest"><Icon.Play size={10}/></button>
            </span>
          </div>
          <div ref={scrubRef} onPointerDown={onScrubDown} style={{
            position: 'relative', height: 24, cursor: 'ew-resize', userSelect: 'none',
            display: 'flex', alignItems: 'center',
          }}>
            {/* Track */}
            <div style={{ position: 'absolute', left: 0, right: 0, height: 4, top: 10, background: 'var(--vc-line)', borderRadius: 2 }} />
            {/* Played portion */}
            <div style={{ position: 'absolute', left: 0, width: `${(selIdx / Math.max(1, commits.length - 1)) * 100}%`, height: 4, top: 10, background: 'var(--vc-ink-3)', borderRadius: 2 }} />
            {/* Commit ticks colored by source */}
            {commits.map((c, i) => {
              const col = VC.SRC_COLOR[(VC.SOURCES[c.src] || VC.SOURCES.typed).kind];
              const left = (i / Math.max(1, commits.length - 1)) * 100;
              const isPaste = !!c.paste;
              return (
                <span key={c.id} style={{
                  position: 'absolute', left: `${left}%`, top: isPaste ? 4 : 8,
                  width: isPaste ? 4 : 2, height: isPaste ? 16 : 8, marginLeft: isPaste ? -2 : -1,
                  background: col.ink, borderRadius: isPaste ? 2 : 1, opacity: i <= selIdx ? 1 : .35,
                }} />
              );
            })}
            {/* Playhead */}
            <span style={{
              position: 'absolute',
              left: `${(selIdx / Math.max(1, commits.length - 1)) * 100}%`,
              top: 0, transform: 'translateX(-50%)',
              width: 12, height: 24,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ width: 12, height: 12, background: 'var(--vc-ink)', borderRadius: 2, border: '2px solid var(--vc-surface)', boxShadow: '0 1px 4px rgba(15,26,20,.18)' }} />
            </span>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {commits.map((c, i) => (
            <CommitCard key={c.id} commit={c} selected={i === selIdx} onClick={() => setSelIdx(i)} density={density} />
          ))}
        </div>
      </aside>

      {/* Center: document at selected commit */}
      <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--vc-surface)' }}>
        <div style={{ padding: '10px 24px', borderBottom: '1px solid var(--vc-line)', background: 'var(--vc-bg)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--vc-ink-3)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon.Clock size={11} /> Document at <span className="mono" style={{ color: 'var(--vc-ink-2)' }}>{sel.t}</span>
          </span>
          <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
          <span className="mono">{sel.hash}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--vc-ink-mute)' }}>read-only · this is the essay as it existed at this commit</span>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '40px 32px 80px' }}>
          <article style={{ maxWidth: 720, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 28, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.015em' }}>{VC.ESSAY_TITLE}</h1>
            <div style={{ marginTop: 28, fontFamily: 'var(--ff-serif)', fontSize: 16, lineHeight: 1.75, color: 'var(--vc-ink)' }}>
              {renderEssayUpTo(VC.ESSAY, docFraction, sel.src)}
              {/* Continuation hint */}
              <div style={{ marginTop: 14, fontFamily: 'var(--ff-sans)', fontSize: 11.5, color: 'var(--vc-ink-mute)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                — end of document at <span className="mono">{sel.t}</span>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Right: diff & details */}
      <aside style={{ borderLeft: '1px solid var(--vc-line)', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)', minHeight: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--vc-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Changes</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--vc-ink-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--diff-add-bg)', borderRadius: 2, border: `1px solid var(--diff-add-ink)` }} /> added</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--diff-del-bg)', borderRadius: 2, border: `1px solid var(--diff-del-ink)` }} /> removed</span>
            </span>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {/* Diff block */}
          <div style={{ padding: '16px 18px' }}>
            <window.VC_UI.DiffBlock segments={diff} />
          </div>
          {/* Metadata */}
          <div style={{ borderTop: '1px solid var(--vc-line)', padding: '14px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Commit metadata</div>
            <ReviewMeta k="Timestamp" v={<span className="mono">22 May 2026 · 13:{String(Math.floor(50 + selIdx*1.5)%60).padStart(2,'0')}:{String(Math.floor((selIdx*7)%60)).padStart(2,'0')}</span>} />
            <ReviewMeta k="Hash" v={<span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{sel.hash}<button style={{ background: 'transparent', border: '1px solid var(--vc-line-2)', borderRadius: 3, padding: '1px 4px', fontSize: 10, color: 'var(--vc-ink-3)', cursor: 'pointer', fontFamily: 'inherit' }}>copy</button></span>} />
            <ReviewMeta k="Session" v={<span className="mono">7a39c1e</span>} />
            <ReviewMeta k="Type" v={<span style={{ textTransform: 'capitalize' }}>{sel.type === 'manual' ? 'Manual save' : 'Auto-save'}</span>} />
            <ReviewMeta k="Char delta" v={<span className="mono" style={{ color: sel.delta.startsWith('-') ? 'var(--diff-del-ink)' : 'var(--diff-add-ink)' }}>{sel.delta}</span>} />
            {sel.paste && <>
              <ReviewMeta k="Paste source" v={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FaviconSquare src={sel.paste.src} size={12} />
                  <span>{VC.SOURCES[sel.paste.src].label}</span>
                </span>
              } />
              <ReviewMeta k="Paste size" v={<span className="mono">{sel.paste.chars} chars · {Math.ceil(sel.paste.chars/5)} words</span>} />
            </>}
          </div>
          {/* Discrepancy note (only when applicable) */}
          {sel.paste && (VC.SOURCES[sel.paste.src] || {}).kind === 'ai' && (
            <div style={{ borderTop: '1px solid var(--vc-line)', padding: '14px 18px', background: 'var(--src-ai-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--src-ai)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>i</span>
                <div style={{ fontSize: 12.5, color: 'var(--vc-ink-2)', lineHeight: 1.55 }}>
                  <div style={{ fontWeight: 600, color: 'var(--src-ai)', marginBottom: 4 }}>Observation</div>
                  This commit pastes from a recognised AI tool. The student's declaration {!isDisc ? <em>describes brainstorming structure with ChatGPT</em> : <em>does not mention AI use</em>}. VeriChain reports the observation; how this fits the assignment policy is for you to judge.
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function ReviewMeta({ k, v }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '4px 0', fontSize: 12.5 }}>
      <div style={{ width: 88, color: 'var(--vc-ink-mute)', flexShrink: 0 }}>{k}</div>
      <div style={{ color: 'var(--vc-ink)', flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{v}</div>
    </div>
  );
}

const navBtn = {
  width: 22, height: 22, borderRadius: 4, border: '1px solid var(--vc-line-2)',
  background: 'var(--vc-surface)', color: 'var(--vc-ink-3)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  fontFamily: 'inherit',
};

// ─── Helpers ─────────────────────────────────────────────────────
// Render the essay up to `fraction` of total characters, with the
// last-paste source highlighted.
function renderEssayUpTo(essay, fraction, selSrc) {
  const VC = window.VC_DATA;
  const allText = essay.map(p => p.segments.map(s => s.text).join('')).join('');
  const cap = Math.floor(allText.length * fraction);
  let pos = 0;
  const out = [];
  essay.forEach((para, pi) => {
    const sectionStart = pos;
    if (pos >= cap) return;
    out.push(<h2 key={`h-${pi}`} style={{ fontFamily: 'var(--ff-serif)', fontSize: 20, fontWeight: 500, color: 'var(--vc-ink)', marginTop: pi === 0 ? 0 : 24, marginBottom: 10 }}>{para.heading}</h2>);
    const pSpans = [];
    let pCharsShown = 0;
    para.segments.forEach((seg, si) => {
      if (pos >= cap) return;
      const room = cap - pos;
      const txt = seg.text.slice(0, room);
      pos += txt.length;
      pCharsShown += txt.length;
      const isAttrib = seg.src !== 'typed';
      const c = VC.SRC_COLOR[(VC.SOURCES[seg.src] || VC.SOURCES.unknown).kind];
      const highlight = isAttrib && seg.src === selSrc;
      pSpans.push(
        <span key={si} style={highlight ? {
          background: c.bg,
          padding: '1px 0',
        } : {}}>{txt}</span>
      );
    });
    if (pSpans.length) {
      out.push(<p key={`p-${pi}`} style={{ marginBottom: 14, fontSize: 16, lineHeight: 1.75, fontFamily: 'var(--ff-serif)', color: 'var(--vc-ink)' }}>{pSpans}</p>);
    }
  });
  return out;
}

// Build a diff segment list driven by which commit is selected.
function makeDiffForCommit(c, isDisc) {
  const VC = window.VC_DATA;
  if (c.paste) {
    const k = (VC.SOURCES[c.paste.src] || {}).kind;
    // The pasted block, plus a small bit of typed context around it
    if (c.id === 'c05' || c.id === 'd04') return [
      { kind: 'context', text: 'Public goods are non-excludable and non-rivalrous: one person\'s consumption neither prevents another\'s, nor can a non-payer be kept away. ' },
      { kind: 'paste', src: c.paste.src, text: c.paste.preview },
      { kind: 'context', text: ' The result is that markets, left alone, will supply less of such goods than the sum of citizens\' valuations would justify. ' },
    ];
    if (c.id === 'c08') return [
      { kind: 'context', text: 'A second category concerns costs that a transaction imposes on parties outside it. ' },
      { kind: 'paste', src: 'rba', text: c.paste.preview },
      { kind: 'context', text: ' Where the polluter pays nothing for the harm imposed downstream, the polluting activity is, from society\'s point of view, over-produced. ' },
    ];
    if (c.id === 'c09') return [
      { kind: 'context', text: '…the polluting activity is over-produced. ' },
      { kind: 'paste', src: 'gpt', text: 'A Pigouvian tax internalises the externality by raising the private cost to match the social cost; the resulting equilibrium quantity is lower and corresponds to the socially efficient level of production.' },
      { kind: 'context', text: ' The difficulty in practice is measurement — the regulator must price what the market has refused to.' },
    ];
    if (c.id === 'c12') return [
      { kind: 'context', text: 'A third class of failure arises when one side of a transaction knows materially more than the other. ' },
      { kind: 'paste', src: 'jstor', text: c.paste.preview },
      { kind: 'context', text: ' The mechanism generalises: insurance, credit, professional services and platform marketplaces all exhibit variants of the same problem.' },
    ];
    // discrepancy: large AI paste at intro
    if (c.id === 'd03') return [
      { kind: 'context', text: '— title and headings typed (78 chars) —\n\n' },
      { kind: 'paste', src: 'gpt', text: c.paste.preview },
    ];
    if (c.id === 'd06') return [
      { kind: 'context', text: '…\n' },
      { kind: 'paste', src: 'gpt', text: c.paste.preview },
    ];
    if (c.id === 'd07') return [
      { kind: 'context', text: '…\n' },
      { kind: 'paste', src: 'gpt', text: c.paste.preview },
    ];
    // generic fallback
    return [
      { kind: 'paste', src: c.paste.src, text: c.paste.preview },
    ];
  }
  // Typed commits — show a few sentences as additions / minor edits.
  if (c.id === 'c06') return [
    { kind: 'add', text: 'This is not a failure of the participants but of the structure: rational individuals, acting on the incentives the structure presents, free-ride.' },
    { kind: 'context', text: ' ' },
    { kind: 'del', text: 'It\'s a structural problem, not a moral one. ' },
  ];
  if (c.id === 'c15') return [
    { kind: 'context', text: 'To call these interventions "anti-market" is to mistake the absence of correction for the presence of freedom. ' },
    { kind: 'del', text: 'and not really fair if you think about it long enough. ' },
    { kind: 'add', text: 'The interesting question is no longer whether to intervene but how to do so without introducing failures of a different kind.' },
  ];
  return [
    { kind: 'add', text: c.msg + '.' },
    { kind: 'context', text: ' (Edit recorded — see Essay view for context.)' },
  ];
}

window.VCLecturerReview = VCLecturerReview;
