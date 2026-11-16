import { readFile, writeFile } from "node:fs/promises";

const P = "index.html";
let s = await readFile(P, "utf8");

const R = [
  [
    '  <div class="env-tag">版本 <b>build-20261116-seg3</b></div>  <div class="env-tag">网络 <b>0 请求</b></div>',
    '  <div class="env-tag">版本 <b id="buildId">build-20261116-seg5</b></div>\n' +
    '  <div class="env-tag">提交 <b id="buildCommit" class="mono">pending</b></div>\n' +
    '  <div class="env-tag">网络 <b>0 请求</b></div>'
  ],
  [
    '    <section class="panel">\n      <div class="panel-hd"><h2>大宗申报价格区间</h2><span class="hint">仅大宗交易适用</span></div>',
    '    <section class="panel" id="rulePanel">\n      <div class="panel-hd"><h2>大宗申报价格区间</h2><span class="hint">仅大宗委托适用</span></div>'
  ],
  [
    '<b>边界含本数。</b>价格等于上限或下限可通过；高于上限 0.01 元、或低于下限 0.01 元，拒绝。计算基于当日已成交金额、已成交股数、已成交最高价与最低价。</div>',
    '<b>边界含本数。</b>价格等于上限或下限可通过；高于上限 0.01 元、或低于下限 0.01 元，拒绝。计算基于当日已成交金额、已成交股数、已成交最高价与最低价。<br><b>适用范围：</b>本区间仅适用于<u>无价格涨跌幅限制股票的大宗交易申报</u>；限价委托不显示该区间，也不做该校验。</div>'
  ]
];

for (const [find, repl] of R) {
  const n = s.split(find).length - 1;
  if (n !== 1) throw new Error("anchor count " + n + ": " + find.slice(0, 60));
  s = s.replace(find, repl);
}
await writeFile(P, s);
console.log("part a ok", s.length);
