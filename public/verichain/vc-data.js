// VeriChain shared data — realistic essay + commit history + sources
// Used by both student workspace (mid-session) and lecturer review screens.

// ─── Source registry ────────────────────────────────────────────
// kind: 'typed' | 'research' | 'ai' | 'unknown'
const VC_SOURCES = {
  typed:      { id: 'typed', kind: 'typed', label: 'Typed in session', domain: null, fav: { letter: 'T', bg: '#475569' } },
  rba:        { id: 'rba',   kind: 'research', label: 'rba.gov.au',        domain: 'rba.gov.au',           fav: { letter: 'R', bg: '#0E3A82' } },
  jstor:      { id: 'jstor', kind: 'research', label: 'jstor.org',         domain: 'jstor.org',            fav: { letter: 'J', bg: '#9A2A2A' } },
  oecd:       { id: 'oecd',  kind: 'research', label: 'oecd.org',          domain: 'oecd-ilibrary.org',    fav: { letter: 'O', bg: '#0B6BB8' } },
  econ_lib:   { id: 'econ_lib', kind: 'research', label: 'econlib.org',    domain: 'econlib.org',          fav: { letter: 'E', bg: '#34655E' } },
  treasury:   { id: 'treasury', kind: 'research', label: 'treasury.gov.au',domain: 'treasury.gov.au',      fav: { letter: 'A', bg: '#0E2F66' } },
  gpt:        { id: 'gpt',   kind: 'ai',    label: 'chat.openai.com',      domain: 'chat.openai.com',      fav: { letter: 'G', bg: '#0F6E4F' } },
  claude:     { id: 'claude',kind: 'ai',    label: 'claude.ai',            domain: 'claude.ai',            fav: { letter: 'C', bg: '#C96442' } },
  perplexity: { id: 'perplexity', kind: 'ai', label: 'perplexity.ai',      domain: 'perplexity.ai',        fav: { letter: 'P', bg: '#1E5F73' } },
  grammarly:  { id: 'grammarly', kind: 'ai', label: 'grammarly.com',       domain: 'grammarly.com',        fav: { letter: 'G', bg: '#15A86C' } },
  unknown:    { id: 'unknown',kind: 'unknown',label: 'External paste',     domain: null,                    fav: { letter: '?', bg: '#6B7280' } },
};

const VC_SRC_COLOR = {
  typed:    { ink: 'var(--src-typed)',    bg: 'var(--src-typed-bg)' },
  research: { ink: 'var(--src-research)', bg: 'var(--src-research-bg)' },
  ai:       { ink: 'var(--src-ai)',       bg: 'var(--src-ai-bg)' },
  unknown:  { ink: 'var(--src-unknown)',  bg: 'var(--src-unknown-bg)' },
};

// ─── Realistic essay content ────────────────────────────────────
// A real, plausible undergraduate essay on Market Failure. Each paragraph
// has segments tagged with their source so the diff view can colour them.

const VC_ESSAY_TITLE = 'When Markets Fail: Public Goods, Externalities and the Limits of Self-Correction';

// Paragraphs as arrays of { src, text } segments.
const VC_ESSAY = [
  {
    heading: 'Introduction',
    segments: [
      { src: 'typed', text: 'A free market is often defended on the basis that decentralised exchange between self-interested parties produces, almost as a by-product, an efficient allocation of resources. ' },
      { src: 'typed', text: 'This essay examines three situations in which that claim breaks down: the provision of public goods, the presence of negative externalities, and information asymmetries between buyers and sellers. ' },
      { src: 'typed', text: 'In each case I argue that intervention is not a violation of market logic but a precondition for it.' },
    ],
  },
  {
    heading: 'Public goods and the free-rider problem',
    segments: [
      { src: 'typed', text: 'Public goods are non-excludable and non-rivalrous: one person\'s consumption neither prevents another\'s, nor can a non-payer be kept away. ' },
      { src: 'econ_lib', text: 'The classical illustration is national defence — a service whose benefits accrue equally to those who contribute and those who do not, leaving private providers unable to recoup their costs through voluntary subscription. ' },
      { src: 'typed', text: 'The result is that markets, left alone, will supply less of such goods than the sum of citizens\' valuations would justify. ' },
      { src: 'typed', text: 'This is not a failure of the participants but of the structure: rational individuals, acting on the incentives the structure presents, free-ride.' },
    ],
  },
  {
    heading: 'Negative externalities',
    segments: [
      { src: 'typed', text: 'A second category concerns costs that a transaction imposes on parties outside it. ' },
      { src: 'rba', text: 'Reserve Bank analysis of Australian emissions-intensive industries finds that the social cost of a tonne of CO₂ exceeded the private price faced by producers by a factor of three to five over the decade to 2023. ' },
      { src: 'typed', text: 'Where the polluter pays nothing for the harm imposed downstream, the polluting activity is, from society\'s point of view, over-produced. ' },
      { src: 'gpt', text: 'A Pigouvian tax internalises the externality by raising the private cost to match the social cost; the resulting equilibrium quantity is lower and corresponds to the socially efficient level of production. ' },
      { src: 'typed', text: 'The difficulty in practice is measurement — the regulator must price what the market has refused to.' },
    ],
  },
  {
    heading: 'Information asymmetry',
    segments: [
      { src: 'typed', text: 'A third class of failure arises when one side of a transaction knows materially more than the other. ' },
      { src: 'jstor', text: 'Akerlof\'s 1970 analysis of the used-car market showed that, when buyers cannot distinguish high-quality from low-quality vehicles, sellers of good cars withdraw and the market unravels toward the worst offerings. ' },
      { src: 'typed', text: 'The mechanism generalises: insurance, credit, professional services and platform marketplaces all exhibit variants of the same problem. ' },
      { src: 'typed', text: 'Mandatory disclosure, professional licensing and third-party rating systems are, in effect, attempts to restore the symmetry on which the market\'s efficiency claim depends.' },
    ],
  },
  {
    heading: 'Conclusion',
    segments: [
      { src: 'typed', text: 'In each of the three cases the corrective is not an alternative to market exchange but a scaffold for it. ' },
      { src: 'typed', text: 'To call these interventions "anti-market" is to mistake the absence of correction for the presence of freedom. ' },
      { src: 'typed', text: 'The interesting question is no longer whether to intervene but how to do so without introducing failures of a different kind.' },
    ],
  },
];

// Plain text view (joined) — used by the read view
function vcEssayText() {
  return VC_ESSAY.map((p) => p.heading + '\n\n' + p.segments.map(s => s.text).join('')).join('\n\n');
}

function vcEssayWordCount() {
  return vcEssayText().split(/\s+/).filter(Boolean).length;
}

// ─── Commit history (chronological, oldest → newest) ────────────
// Each commit: id, hash, t (mm:ss into session), type ('auto'|'manual'),
// src (dominant), chars (+/-), msg, paste? {src, chars, preview}
const VC_COMMITS_CLEAN = [
  { id: 'c01', hash: 'a1f3e0', t: '00:00', type: 'auto', src: 'typed', delta: '+0',    msg: 'Session opened' },
  { id: 'c02', hash: '7d2a14', t: '03:42', type: 'auto', src: 'typed', delta: '+184',  msg: 'Draft outline — five sections' },
  { id: 'c03', hash: '92b7c1', t: '11:08', type: 'manual',src: 'typed', delta: '+346', msg: 'Intro paragraph: thesis statement' },
  { id: 'c04', hash: 'f5009d', t: '18:55', type: 'auto', src: 'typed', delta: '+278',  msg: 'Public goods — definition' },
  { id: 'c05', hash: 'ce4811', t: '22:31', type: 'auto', src: 'research', delta: '+241', msg: 'Pasted from econlib.org', paste: { src: 'econ_lib', chars: 241, preview: 'The classical illustration is national defence — a service whose benefits accrue equally to…' } },
  { id: 'c06', hash: '3a90fe', t: '27:14', type: 'manual',src: 'typed', delta: '+162', msg: 'Rephrased the free-rider point in own words' },
  { id: 'c07', hash: '88c225', t: '34:02', type: 'auto', src: 'typed', delta: '+201',  msg: 'Externalities — intro and CO₂ figures' },
  { id: 'c08', hash: 'd1f4b7', t: '38:47', type: 'auto', src: 'research', delta: '+218', msg: 'Pasted from rba.gov.au', paste: { src: 'rba', chars: 218, preview: 'Reserve Bank analysis of Australian emissions-intensive industries finds that the social cost…' } },
  { id: 'c09', hash: '2e7c08', t: '46:30', type: 'manual',src: 'ai', delta: '+199',    msg: 'Pasted GPT explanation of Pigouvian taxes', paste: { src: 'gpt', chars: 199, preview: 'A Pigouvian tax internalises the externality by raising the private cost to match the social…' } },
  { id: 'c10', hash: 'b4a019', t: '52:18', type: 'auto', src: 'typed', delta: '+88',   msg: 'Edited GPT paste — restructured sentence' },
  { id: 'c11', hash: '70de93', t: '58:01', type: 'auto', src: 'typed', delta: '+212',  msg: 'Information asymmetry — opening' },
  { id: 'c12', hash: 'a93311', t: '63:44', type: 'auto', src: 'research', delta: '+264', msg: 'Pasted Akerlof summary from JSTOR', paste: { src: 'jstor', chars: 264, preview: 'Akerlof\'s 1970 analysis of the used-car market showed that, when buyers cannot distinguish…' } },
  { id: 'c13', hash: '15f80e', t: '71:09', type: 'manual',src: 'typed', delta: '+190', msg: 'Generalised the asymmetry mechanism' },
  { id: 'c14', hash: 'cc3a72', t: '79:55', type: 'auto', src: 'typed', delta: '+247',  msg: 'Conclusion drafted' },
  { id: 'c15', hash: 'e2017a', t: '84:12', type: 'manual',src: 'typed', delta: '-34',  msg: 'Tightened conclusion — removed redundant clause' },
  { id: 'c16', hash: '40bb91', t: '87:30', type: 'manual',src: 'typed', delta: '+12',  msg: 'Final read-through — small edits' },
];

const VC_COMMITS_DISCREPANCY = [
  { id: 'd01', hash: '08aa10', t: '00:00', type: 'auto', src: 'typed', delta: '+0',    msg: 'Session opened' },
  { id: 'd02', hash: '21c4e8', t: '02:11', type: 'auto', src: 'typed', delta: '+62',   msg: 'Title and headings typed' },
  { id: 'd03', hash: 'b78f0a', t: '04:48', type: 'auto', src: 'ai', delta: '+780',     msg: 'Pasted from chat.openai.com', paste: { src: 'gpt', chars: 780, preview: 'A free market is often defended on the basis that decentralised exchange between self-interested parties produces, almost as a by-product, an efficient allocation of resources…' } },
  { id: 'd04', hash: '4e2d99', t: '07:02', type: 'auto', src: 'ai', delta: '+612',     msg: 'Pasted from claude.ai', paste: { src: 'claude', chars: 612, preview: 'The classical illustration is national defence — a service whose benefits accrue equally to those who contribute…' } },
  { id: 'd05', hash: '9c1772', t: '09:31', type: 'auto', src: 'typed', delta: '+24',   msg: 'Edit — transitional phrase' },
  { id: 'd06', hash: 'aa5b03', t: '12:14', type: 'auto', src: 'ai', delta: '+544',     msg: 'Pasted from chat.openai.com', paste: { src: 'gpt', chars: 544, preview: 'A second category concerns costs that a transaction imposes on parties outside it. A Pigouvian tax internalises the externality…' } },
  { id: 'd07', hash: '6f08e1', t: '14:50', type: 'auto', src: 'ai', delta: '+498',     msg: 'Pasted from chat.openai.com', paste: { src: 'gpt', chars: 498, preview: 'A third class of failure arises when one side of a transaction knows materially more than the other. Akerlof\'s 1970 analysis…' } },
  { id: 'd08', hash: '03ff45', t: '17:22', type: 'auto', src: 'typed', delta: '+38',   msg: 'Light edits — joining phrases' },
  { id: 'd09', hash: 'b22a18', t: '19:48', type: 'auto', src: 'ai', delta: '+286',     msg: 'Pasted from claude.ai', paste: { src: 'claude', chars: 286, preview: 'In each of the three cases the corrective is not an alternative to market exchange but a scaffold for it…' } },
  { id: 'd10', hash: 'e8770c', t: '21:09', type: 'manual',src: 'typed', delta: '+18',  msg: 'Submitted' },
];

// ─── Source mix per submission for the lecturer list ────────────
const VC_SUBMISSIONS = [
  { id: 'olu',  name: 'Olukunle Adesanya',  time: '14:22',  date: 'Today',     words: 1487, dur: '01:32:14', mix: { typed: 71, research: 21, ai: 6,  unknown: 2 }, declared: true,  status: 'on-time', commits: 18 },
  { id: 'ana',  name: 'Ana Petrović',         time: '13:48',  date: 'Today',     words: 1532, dur: '02:14:08', mix: { typed: 78, research: 19, ai: 3,  unknown: 0 }, declared: true,  status: 'on-time', commits: 22 },
  { id: 'ren',  name: 'Ren Tanaka',           time: '12:09',  date: 'Today',     words: 1399, dur: '01:48:51', mix: { typed: 64, research: 28, ai: 5,  unknown: 3 }, declared: true,  status: 'on-time', commits: 16 },
  { id: 'maw',  name: 'Maeve Walsh',          time: '11:54',  date: 'Today',     words: 1612, dur: '02:46:21', mix: { typed: 82, research: 17, ai: 1,  unknown: 0 }, declared: false, status: 'on-time', commits: 28 },
  { id: 'kai',  name: 'Kai Mahmood',          time: '11:30',  date: 'Today',     words: 1453, dur: '01:55:02', mix: { typed: 22, research: 11, ai: 64, unknown: 3 }, declared: false, status: 'on-time', commits: 9, alert: 'discrepancy' },
  { id: 'fre',  name: 'Frederik Larsen',      time: '10:48',  date: 'Today',     words: 1521, dur: '02:08:44', mix: { typed: 69, research: 24, ai: 7,  unknown: 0 }, declared: true,  status: 'on-time', commits: 19 },
  { id: 'aru',  name: 'Aruna Iyer',           time: '10:32',  date: 'Today',     words: 1496, dur: '02:21:18', mix: { typed: 75, research: 22, ai: 3,  unknown: 0 }, declared: true,  status: 'on-time', commits: 24 },
  { id: 'sof',  name: 'Sofia Marchetti',      time: '09:21',  date: 'Today',     words: 1444, dur: '01:39:00', mix: { typed: 70, research: 25, ai: 4,  unknown: 1 }, declared: false, status: 'on-time', commits: 17 },
  { id: 'hen',  name: 'Henry Okafor',         time: '08:55',  date: 'Today',     words: 1508, dur: '02:02:39', mix: { typed: 73, research: 20, ai: 6,  unknown: 1 }, declared: true,  status: 'on-time', commits: 20 },
  { id: 'mir',  name: 'Mira Khoury',          time: '08:14',  date: 'Today',     words: 1571, dur: '02:33:55', mix: { typed: 81, research: 16, ai: 2,  unknown: 1 }, declared: false, status: 'on-time', commits: 26 },
  { id: 'cha',  name: 'Chao Lin',             time: '23:58',  date: 'Yesterday', words: 1402, dur: '01:51:12', mix: { typed: 67, research: 22, ai: 9,  unknown: 2 }, declared: true,  status: 'late',    commits: 15 },
  { id: 'eli',  name: 'Eliza Vance',          time: '23:42',  date: 'Yesterday', words: 1488, dur: '02:19:48', mix: { typed: 76, research: 20, ai: 4,  unknown: 0 }, declared: true,  status: 'late',    commits: 21 },
  { id: 'bal',  name: 'Bal Singh-Brar',       time: '22:11',  date: 'Yesterday', words: 1519, dur: '02:04:32', mix: { typed: 74, research: 19, ai: 6,  unknown: 1 }, declared: true,  status: 'on-time', commits: 18 },
  { id: 'syl',  name: 'Sylvie Chen',          time: '20:58',  date: 'Yesterday', words: 1467, dur: '02:11:24', mix: { typed: 71, research: 23, ai: 5,  unknown: 1 }, declared: true,  status: 'on-time', commits: 19 },
  { id: 'tom',  name: 'Tomás Aguilar',        time: '19:34',  date: 'Yesterday', words: 1383, dur: '01:42:09', mix: { typed: 58, research: 18, ai: 22, unknown: 2 }, declared: true,  status: 'on-time', commits: 14 },
  { id: 'idr',  name: 'Idris Mwangi',         time: '18:47',  date: 'Yesterday', words: 1556, dur: '02:28:01', mix: { typed: 79, research: 18, ai: 3,  unknown: 0 }, declared: false, status: 'on-time', commits: 23 },
  { id: 'noo',  name: 'Noor Al-Sayed',        time: '17:22',  date: 'Yesterday', words: 1428, dur: '01:56:43', mix: { typed: 72, research: 22, ai: 5,  unknown: 1 }, declared: true,  status: 'on-time', commits: 18 },
  { id: 'jas',  name: 'Jasper Nilsen',        time: '16:18',  date: 'Yesterday', words: 1502, dur: '02:13:17', mix: { typed: 75, research: 21, ai: 4,  unknown: 0 }, declared: true,  status: 'on-time', commits: 20 },
  { id: 'pri',  name: 'Priya Raman',          time: '15:48',  date: 'Yesterday', words: 1601, dur: '02:42:08', mix: { typed: 83, research: 15, ai: 2,  unknown: 0 }, declared: false, status: 'on-time', commits: 27 },
  { id: 'lar',  name: 'Larisa Volkov',        time: '14:33',  date: 'Yesterday', words: 1472, dur: '02:07:56', mix: { typed: 73, research: 20, ai: 6,  unknown: 1 }, declared: true,  status: 'on-time', commits: 19 },
  { id: 'cal',  name: 'Callum Doyle',         time: '13:14',  date: 'Yesterday', words: 1391, dur: '01:48:22', mix: { typed: 69, research: 22, ai: 8,  unknown: 1 }, declared: false, status: 'on-time', commits: 16 },
  { id: 'zar',  name: 'Zara Hassanali',       time: '12:01',  date: 'Yesterday', words: 1534, dur: '02:19:48', mix: { typed: 76, research: 20, ai: 4,  unknown: 0 }, declared: true,  status: 'on-time', commits: 21 },
  { id: 'eth',  name: 'Etienne Roussel',      time: '11:22',  date: 'Yesterday', words: 1413, dur: '01:51:39', mix: { typed: 68, research: 24, ai: 7,  unknown: 1 }, declared: true,  status: 'on-time', commits: 17 },
  { id: 'shi',  name: 'Shira Goldberg',       time: '10:14',  date: 'Yesterday', words: 1582, dur: '02:34:11', mix: { typed: 81, research: 17, ai: 2,  unknown: 0 }, declared: false, status: 'on-time', commits: 25 },
  { id: 'oma',  name: 'Omar Karimov',         time: '08:48',  date: 'Yesterday', words: 1454, dur: '02:01:34', mix: { typed: 72, research: 22, ai: 5,  unknown: 1 }, declared: true,  status: 'on-time', commits: 18 },
  { id: 'mar',  name: 'Marcellin Boucher',    time: '—',      date: '—',         words: 0,    dur: '—',         mix: null, declared: false, status: 'not-submitted', commits: 0 },
  { id: 'inb',  name: 'Inbal Schwartz',       time: '—',      date: '—',         words: 0,    dur: '—',         mix: null, declared: false, status: 'not-submitted', commits: 0 },
];

// ─── Live sources sidebar (mid-session student view) ───────────
const VC_LIVE_SOURCES = [
  { id: 'ls01', src: 'gpt',    t: '00:14',    focus: '6m 22s',  pastes: 1, paste_chars: 199, note: 'used for brainstorming only' },
  { id: 'ls02', src: 'rba',    t: '00:33',    focus: '11m 04s', pastes: 1, paste_chars: 218 },
  { id: 'ls03', src: 'jstor',  t: '00:58',    focus: '14m 41s', pastes: 1, paste_chars: 264 },
  { id: 'ls04', src: 'econ_lib',t: '00:21',   focus: '8m 12s',  pastes: 1, paste_chars: 241 },
  { id: 'ls05', src: 'oecd',   t: '01:09',    focus: '3m 48s',  pastes: 0, paste_chars: 0 },
  { id: 'ls06', src: 'treasury',t: '00:48',   focus: '2m 11s',  pastes: 0, paste_chars: 0 },
];

window.VC_DATA = {
  SOURCES: VC_SOURCES,
  SRC_COLOR: VC_SRC_COLOR,
  ESSAY_TITLE: VC_ESSAY_TITLE,
  ESSAY: VC_ESSAY,
  essayText: vcEssayText,
  essayWordCount: vcEssayWordCount,
  COMMITS_CLEAN: VC_COMMITS_CLEAN,
  COMMITS_DISCREPANCY: VC_COMMITS_DISCREPANCY,
  SUBMISSIONS: VC_SUBMISSIONS,
  LIVE_SOURCES: VC_LIVE_SOURCES,
};
