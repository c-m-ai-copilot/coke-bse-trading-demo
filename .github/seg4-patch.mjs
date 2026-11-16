import fs from 'node:fs';
const OLD = '生效日待官方公告确认（unknown）';
const D = '自2026-10-26起实施';
const L = '<a href="https://www.bse.cn/jygl_list/200029608.html" target="_blank" rel="noopener">北证公告〔2026〕43号</a>';
let h = fs.readFileSync('index.html', 'utf8');
const subs = [
  [`<span class="eff">${OLD}</span>`, `<span class="eff">${D} · ${L}</span>`],
  [`）：${OLD}。</p>`, `）：${D}，详见${L}。</p>`]
];
for (const [from, to] of subs) {
  const n = h.split(from).length - 1;
  if (n !== 1) { console.error('count ' + n + ' for ' + from); process.exit(1); }
  h = h.split(from).join(to);
}
fs.writeFileSync('index.html', h);
const tf = 'tests/seg3-display.test.mjs';
let t = fs.readFileSync(tf, 'utf8');
const oldTest = [
  'test("effective date is explicitly unconfirmed", () => {',
  '  assert.match(html, /' + OLD + '/);',
  '  assert.doesNotMatch(html, /2026-10-26/);',
  '});'
].join('\n');
const newTest = [
  'test("effective date cites 2026-10-26 and BSE announcement 43", () => {',
  '  assert.match(html, /' + D + '/);',
  '  assert.doesNotMatch(html, /unknown/);',
  '  assert.match(html, /https:\\/\\/www\\.bse\\.cn\\/jygl_list\\/200029608\\.html/);',
  '});'
].join('\n');
const n2 = t.split(oldTest).length - 1;
if (n2 !== 1) { console.error('test blocks ' + n2); process.exit(1); }
fs.writeFileSync(tf, t.split(oldTest).join(newTest));
console.log('patched');
