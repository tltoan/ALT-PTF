// VeriChain — Student workspace screen
// State: 'empty' (just opened) | 'mid' (mid-session with sources)

const VCStudentWorkspace = ({ state = 'mid', density = 'comfortable', height = 900 }) => {
  const { Button, BrandMark, Icon, FaviconSquare, Toast } = window.VC_UI;
  const VC = window.VC_DATA;

  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);
  const [showToast, setShowToast] = React.useState(state === 'mid');
  const [dismissed, setDismissed] = React.useState(new Set());

  // Reset toast when state changes
  React.useEffect(() => { setShowToast(state === 'mid'); }, [state]);

  const isMid = state === 'mid';
  const sources = isMid ? VC.LIVE_SOURCES : [];
  const liveSources = sources.filter(s => !dismissed.has(s.id));

  // What's in the editor for each state
  const essayShown = isMid ? VC.ESSAY.slice(0, 3) : null; // intro + 2 sections
  const wordsSoFar = isMid ? 612 : 0;

  // Density values
  const D = density === 'compact'
    ? { rowPad: '10px 12px', gap: 10, sidebarPad: 14 }
    : { rowPad: '14px 14px', gap: 14, sidebarPad: 18 };

  return (
    <div className="vc" style={{ minHeight: height, width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--vc-bg)' }}>
      {/* App header */}
      <header style={{
        height: 48, padding: '0 14px', background: 'var(--vc-surface)',
        borderBottom: '1px solid var(--vc-line)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <BrandMark size={18} />
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 15, fontWeight: 500 }}>VeriChain</span>
        <span style={{ width: 1, height: 14, background: 'var(--vc-line)' }} />
        <span style={{ fontSize: 12.5, color: 'var(--vc-ink-3)' }}>ECON1101 / Essay 2</span>
        <span style={{ marginLeft: 16, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--vc-ink-mute)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vc-accent)', boxShadow: '0 0 0 3px var(--vc-accent-ring)' }} />
          <span>Recording</span>
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--vc-ink-3)' }}>
            {isMid ? '01:14:32' : '00:00:00'} <span style={{ color: 'var(--vc-ink-mute)' }}>session</span>
          </span>
          <Button variant="secondary" size="sm" onClick={() => window.vcNav('privacy')}>Privacy</Button>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--vc-ink-2)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>OA</span>
        </span>
      </header>

      {/* Three-pane body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left: brief */}
        {leftOpen ? (
          <aside style={{ width: 240, borderRight: '1px solid var(--vc-line)', background: 'var(--vc-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '18px 18px 16px', borderBottom: '1px solid var(--vc-line)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Brief</div>
              <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 16, lineHeight: 1.3, color: 'var(--vc-ink)' }}>
                When markets fail: public goods, externalities and the limits of self-correction
              </div>
              <button onClick={() => setLeftOpen(false)} style={{
                position: 'absolute', top: 64, right: 0, transform: 'translate(50%, 0)',
                width: 18, height: 28, borderRadius: 4, border: '1px solid var(--vc-line)',
                background: 'var(--vc-surface)', cursor: 'pointer', color: 'var(--vc-ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon.Chevron d="left" size={11} /></button>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <WSBriefStat label="Due" value={<>Fri 24 May<br/><span className="mono" style={{ fontSize: 11.5, color: 'var(--vc-accent-hi)' }}>2 days, 9 hours</span></>} />
              <WSBriefStat label="Word target" value={<span className="mono">1,500</span>} />
              <WSBriefStat label="Words written" value={
                <div>
                  <div className="mono" style={{ fontSize: 18, color: 'var(--vc-ink)', fontWeight: 500 }}>{wordsSoFar.toLocaleString()}</div>
                  <div style={{ marginTop: 6, height: 4, background: 'var(--vc-line)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (wordsSoFar / 1500) * 100)}%`, height: '100%', background: 'var(--vc-accent)' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', marginTop: 4 }} className="mono">{Math.round((wordsSoFar / 1500) * 100)}% of target</div>
                </div>
              } />
              <WSBriefStat label="Worth" value="25%" />
            </div>
            <div style={{ marginTop: 'auto', padding: 18, borderTop: '1px solid var(--vc-line)' }}>
              <a href="#brief" style={{ fontSize: 12, color: 'var(--vc-ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Read full brief <Icon.Chevron d="right" size={10} />
              </a>
            </div>
          </aside>
        ) : (
          <aside style={{ width: 40, borderRight: '1px solid var(--vc-line)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14, gap: 14, flexShrink: 0 }}>
            <button onClick={() => setLeftOpen(true)} style={{ width: 28, height: 28, borderRadius: 4, border: '1px solid var(--vc-line)', background: 'var(--vc-surface)', cursor: 'pointer', color: 'var(--vc-ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Chevron d="right" size={12} />
            </button>
            <Icon.Doc size={14} />
            <div className="mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11, color: 'var(--vc-ink-3)', letterSpacing: '.08em', marginTop: 4 }}>Brief</div>
          </aside>
        )}

        {/* Center: editor */}
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '56px 80px 80px', display: 'flex', justifyContent: 'center' }}>
            <article style={{ width: '100%', maxWidth: 720 }}>
              {!isMid ? (
                <div>
                  <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 36, lineHeight: 1.15, color: 'var(--vc-ink-mute)', letterSpacing: '-0.015em', fontStyle: 'italic' }}>
                    Untitled essay
                  </div>
                  <div style={{ marginTop: 28, fontFamily: 'var(--ff-serif)', fontSize: 17, lineHeight: 1.75, color: 'var(--vc-ink-mute)' }}>
                    Begin writing here. VeriChain saves a snapshot of your document every few minutes, and whenever you press <kbd style={{ fontFamily: 'var(--ff-mono)', fontSize: 12.5, background: 'var(--vc-bg-sunk)', border: '1px solid var(--vc-line-2)', borderRadius: 3, padding: '0 5px' }}>⌘S</kbd> to mark a milestone.
                  </div>
                  {/* Floating cursor placeholder */}
                  <div style={{ marginTop: 28, height: 22, position: 'relative' }}>
                    <span style={{ display: 'inline-block', width: 2, height: 22, background: 'var(--vc-ink-2)', animation: 'vcBlink 1.05s infinite step-end' }} />
                  </div>
                  <style>{`@keyframes vcBlink { 50% { opacity: 0; } }`}</style>
                </div>
              ) : (
                <div>
                  <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 34, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.015em', color: 'var(--vc-ink)' }}>
                    {VC.ESSAY_TITLE}
                  </h1>
                  <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--vc-ink-3)', display: 'flex', gap: 14 }}>
                    <span>Olukunle Adesanya · ECON1101</span>
                    <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
                    <span className="mono">draft · revision 4</span>
                  </div>
                  <div style={{ marginTop: 32, fontFamily: 'var(--ff-serif)', fontSize: 17, lineHeight: 1.75, color: 'var(--vc-ink)' }}>
                    {essayShown.map((para, i) => (
                      <React.Fragment key={i}>
                        <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 22, fontWeight: 500, color: 'var(--vc-ink)', marginTop: i === 0 ? 0 : 36, marginBottom: 14, letterSpacing: '-0.01em' }}>{para.heading}</h2>
                        <p style={{ marginBottom: 18, fontSize: 17, lineHeight: 1.75, color: 'var(--vc-ink)', fontFamily: 'var(--ff-serif)' }}>
                          {para.segments.map((s, j) => <span key={j}>{s.text}</span>)}
                        </p>
                      </React.Fragment>
                    ))}
                    <p style={{ color: 'var(--vc-ink-mute)', fontStyle: 'italic', fontSize: 16, marginTop: 8 }}>
                      Information asymmetry — opening paragraph in progress…<span style={{ display: 'inline-block', width: 2, height: '0.95em', verticalAlign: '-0.1em', marginLeft: 2, background: 'var(--vc-ink-2)', animation: 'vcBlink 1.05s infinite step-end' }} />
                    </p>
                    <style>{`@keyframes vcBlink { 50% { opacity: 0; } }`}</style>
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Bottom status bar (editor pane) */}
          <div style={{
            height: 32, padding: '0 18px', background: 'var(--vc-surface)',
            borderTop: '1px solid var(--vc-line)',
            display: 'flex', alignItems: 'center', gap: 16, fontSize: 11.5, color: 'var(--vc-ink-3)',
            flexShrink: 0,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon.Check size={11} />
              <span>Auto-saved {isMid ? '4s ago' : '—'}</span>
              {isMid && <span className="mono" style={{ color: 'var(--vc-ink-mute)' }}>· 88c225</span>}
            </span>
            <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
            <span className="mono">{isMid ? '16 commits' : '0 commits'}</span>
            <span style={{ color: 'var(--vc-ink-mute)' }}>·</span>
            <span className="mono">{isMid ? '612 words' : '0 words'} / 1,500 target</span>
            <span style={{ marginLeft: 'auto' }} />
            <Button size="sm" disabled={!isMid} onClick={() => window.vcNav('submitted')}>Submit</Button>
          </div>

          {/* Toast (mid-session) */}
          {isMid && showToast && (
            <div style={{ position: 'absolute', right: rightOpen ? 24 : 60, bottom: 60, zIndex: 10 }}>
              <Toast onClose={() => setShowToast(false)} action={{ label: 'Add note', onClick: () => setShowToast(false) }}>
                Paste from <FaviconSquare src="gpt" size={11} /> <strong style={{ fontWeight: 600, color: '#fff', marginLeft: 4 }}>chat.openai.com</strong> — <span className="mono" style={{ color: '#fff' }}>199</span> characters recorded.
              </Toast>
            </div>
          )}

          {/* Empty-state hint pinned bottom-left */}
          {!isMid && (
            <div style={{ position: 'absolute', left: 80, bottom: 56, fontSize: 12.5, color: 'var(--vc-ink-mute)', maxWidth: 320, lineHeight: 1.5 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'var(--vc-ink-3)', marginBottom: 4 }}>
                <Icon.Quote /> No sources yet
              </div>
              As you open tabs and paste content, sources will appear on the right.
            </div>
          )}
        </main>

        {/* Right: live sources */}
        {rightOpen ? (
          <aside style={{ width: 320, borderLeft: '1px solid var(--vc-line)', background: 'var(--vc-surface)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>
            <button onClick={() => setRightOpen(false)} style={{
              position: 'absolute', top: 64, left: 0, transform: 'translate(-50%, 0)',
              width: 18, height: 28, borderRadius: 4, border: '1px solid var(--vc-line)',
              background: 'var(--vc-surface)', cursor: 'pointer', color: 'var(--vc-ink-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}><Icon.Chevron d="right" size={11} /></button>

            <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--vc-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Your sources</div>
                <div style={{ fontSize: 13.5, color: 'var(--vc-ink)', fontWeight: 500, marginTop: 2 }}>
                  {liveSources.length === 0 ? 'Nothing recorded yet' : `${liveSources.length} observed this session`}
                </div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--vc-ink-mute)', display: 'inline-flex', alignItems: 'center', gap: 6 }} className="mono">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vc-accent)' }} />
                live
              </span>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: liveSources.length === 0 ? 0 : 0 }}>
              {liveSources.length === 0 && (
                <div style={{ paddingTop: 32 }}>
                  <window.VC_UI.EmptyState
                    title="No sources observed yet"
                    body="Tabs you open in this browser window will appear here. Pasting from a tab attaches that paste to the source."
                  />
                </div>
              )}
              {liveSources.map((row) => (
                <WSSourceCard key={row.id} row={row} density={density}
                  onDismiss={() => setDismissed(s => new Set([...s, row.id]))} />
              ))}
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--vc-line)', fontSize: 11.5, color: 'var(--vc-ink-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon.Eye size={11} />
              <span>Domains only. Tab contents are never read.</span>
            </div>
          </aside>
        ) : (
          <aside style={{ width: 40, borderLeft: '1px solid var(--vc-line)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14, gap: 14, flexShrink: 0 }}>
            <button onClick={() => setRightOpen(true)} style={{ width: 28, height: 28, borderRadius: 4, border: '1px solid var(--vc-line)', background: 'var(--vc-surface)', cursor: 'pointer', color: 'var(--vc-ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Chevron d="left" size={12} />
            </button>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--vc-accent-lo)', color: 'var(--vc-accent-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }} className="mono">{liveSources.length}</div>
            <div className="mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11, color: 'var(--vc-ink-3)', letterSpacing: '.08em', marginTop: 4 }}>Sources</div>
          </aside>
        )}
      </div>
    </div>
  );
};

function WSBriefStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--vc-ink-2)' }}>{value}</div>
    </div>
  );
}

function WSSourceCard({ row, onDismiss, density }) {
  const { Icon, FaviconSquare } = window.VC_UI;
  const VC = window.VC_DATA;
  const s = VC.SOURCES[row.src];
  const c = VC.SRC_COLOR[s.kind];
  const pad = density === 'compact' ? '10px 14px' : '14px 16px';
  return (
    <div style={{
      padding: pad,
      borderBottom: '1px solid var(--vc-line)',
      borderLeft: `3px solid ${c.ink}`,
      position: 'relative',
      transition: 'background .12s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'var(--vc-overlay)';
      e.currentTarget.querySelector('.vc-src-actions').style.opacity = '1';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.querySelector('.vc-src-actions').style.opacity = '0';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <FaviconSquare src={row.src} size={14} />
        <span style={{ fontSize: 13, color: 'var(--vc-ink)', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
        <span style={{ fontSize: 10.5, color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.kind}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, color: 'var(--vc-ink-3)' }} className="mono">
        <span><span style={{ color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.06em', fontSize: 10 }}>first</span> {row.t}</span>
        <span><span style={{ color: 'var(--vc-ink-mute)', textTransform: 'uppercase', letterSpacing: '.06em', fontSize: 10 }}>focus</span> {row.focus}</span>
      </div>
      {row.pastes > 0 && (
        <div style={{ marginTop: 8, padding: '6px 8px', background: c.bg, borderRadius: 4, fontSize: 12, color: c.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Quote size={11} />
          <span><span className="mono" style={{ fontWeight: 600 }}>{row.pastes}</span> paste{row.pastes !== 1 ? 's' : ''} · <span className="mono">{row.paste_chars.toLocaleString()}</span> chars</span>
        </div>
      )}
      {row.note && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--vc-ink-3)', fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Icon.Pencil size={11} /> {row.note}
        </div>
      )}
      <div className="vc-src-actions" style={{
        position: 'absolute', top: 12, right: 12, opacity: 0, transition: 'opacity .12s',
        display: 'flex', gap: 4,
      }}>
        <button title="Annotate" style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid var(--vc-line)', background: 'var(--vc-surface)', cursor: 'pointer', color: 'var(--vc-ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <Icon.Pencil size={11} />
        </button>
        <button onClick={onDismiss} title="Dismiss" style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid var(--vc-line)', background: 'var(--vc-surface)', cursor: 'pointer', color: 'var(--vc-ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <Icon.X size={11} />
        </button>
      </div>
    </div>
  );
}

window.VCStudentWorkspace = VCStudentWorkspace;
