import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const one = (re) => html.match(re)[0];
const limit = html.split('<div id="panelLimit">')[1].split('<div id="panelBlock"')[0];
test("band ratios only in block card", () => {
  assert.doesNotMatch(limit, /70%|130%|价格区间|ruleUpper|ruleLower/);
  assert.match(html, /id="rulePanel"[\s\S]*?仅大宗委托适用/);
  assert.match(html, /本区间仅适用于<u>无价格涨跌幅限制股票的大宗交易申报<\/u>/);
  assert.match(one(/function switchTab[\s\S]*?\n  \}/), /\$\("rulePanel"\)\.hidden = isLimit;/);
});
test("only block path validates band", () => {
  assert.doesNotMatch(one(/function submitLimit[\s\S]*?\n  \}/), /evaluateBlockPrice|rule\(\)/);
  assert.match(one(/function submitBlock[\s\S]*?\n  \}/), /evaluateBlockPrice\(px, r\)/);
});
test("build marker binds commit", () => {
  assert.match(html, /<b id="buildId">build-20261116-seg5<\/b>[\s\S]*?<b id="buildCommit" class="mono">(pending|[0-9a-f]{7})<\/b>/);
  const label = new Function(one(/function buildLabel\(build\)[\s\S]*?\n  \}/) + "; return buildLabel;")();
  const sha = "9ae02938aa19ca951a883a4427292aab08f7eff0";
  assert.deepEqual(label({id: "v", commit: sha}), {id: "v", commit: "9ae0293"});
});
test("band math on synthetic data", () => {
  const src = one(/function rule\(\)[\s\S]*?\n  \}/) + one(/function evaluateBlockPrice[\s\S]*?\n  \}/);
  const api = new Function("market", "fmtPx", src + "; return {rule, evaluateBlockPrice};")(
    {high: 1520, low: 680, shares: 8000000, amount: 8000000000}, (c) => (c / 100).toFixed(2));
  const r = api.rule();
  assert.deepEqual([r.upper, r.lower], [1300, 700]);
  assert.equal(api.evaluateBlockPrice(1300, r).ok && !api.evaluateBlockPrice(1301, r).ok, true);
  assert.equal(api.evaluateBlockPrice(700, r).ok && !api.evaluateBlockPrice(699, r).ok, true);
});
