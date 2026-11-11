const trace = document.querySelector("#signature-trace");
const ink = document.querySelector(".signature-ink");
const fallback = document.querySelector(".signature-fallback");
const length = trace.getTotalLength();
const sampleCount = Math.ceil(length / 3);
const timing = [[0, 0], [.26, .35], [.55, .54], [.8, .83], [1, 1]];
const pressure = [[0, 1], [.08, 4.5], [.17, 2], [.28, 4.8], [.35, 2.5],
  [.44, 4.5], [.51, 1.8], [.61, 4.8], [.69, 2.2], [.78, 4.6], [.87, 2.4],
  [.93, 3.5], [1, .7]];

function interpolate(stops, position) {
  const upper = stops.findIndex(([at]) => at >= position);
  if (upper <= 0) return stops[0][1];
  const [start, low] = stops[upper - 1];
  const [end, high] = stops[upper];
  return low + (high - low) * (position - start) / (end - start);
}

function edges(position) {
  const distance = position * length;
  const point = trace.getPointAtLength(distance);
  const before = trace.getPointAtLength(Math.max(0, distance - 1));
  const after = trace.getPointAtLength(Math.min(length, distance + 1));
  const dx = after.x - before.x;
  const dy = after.y - before.y;
  const radius = interpolate(pressure, position);
  const scale = radius / (Math.hypot(dx, dy) || 1);
  return [
    [point.x - dy * scale, point.y + dx * scale],
    [point.x + dy * scale, point.y - dx * scale],
  ];
}

function segment(from, to) {
  return "M" + [from[0], to[0], to[1], from[1]]
    .map(([x, y]) => x.toFixed(2) + "," + y.toFixed(2)).join("L") + "Z";
}

const samples = Array.from({ length: sampleCount + 1 }, (_, i) => edges(i / sampleCount));
const prefixes = [""];
for (let i = 1; i <= sampleCount; i++) {
  prefixes.push(prefixes[i - 1] + segment(samples[i - 1], samples[i]));
}

function draw(progress) {
  const index = Math.floor(progress * sampleCount);
  const tip = index < sampleCount ? segment(samples[index], edges(progress)) : "";
  ink.setAttribute("d", prefixes[index] + tip);
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  draw(1);
  fallback.remove();
} else {
  fallback.remove();
  requestAnimationFrame(function start(now) {
    function animate(time) {
      const elapsed = Math.min((time - now) / 2700, 1);
      draw(interpolate(timing, elapsed));
      if (elapsed < 1) requestAnimationFrame(animate);
    }
    animate(now);
  });
}
