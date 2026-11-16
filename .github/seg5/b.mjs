import { readFile, writeFile } from "node:fs/promises";

const P = "index.html";
let s = await readFile(P, "utf8");

const R = [
  [
    '    $("panelBlock").hidden = isLimit;',
    '    $("panelBlock").hidden = isLimit;\n' +
    '    // 3.6.5(2)(3) 价格区间只在大宗委托界面展示：限价委托页签下隐藏该说明卡片。\n' +
    '    $("rulePanel").hidden = isLimit;'
  ],
  [
    '  const pad = n => String(n).padStart(2, "0");',
    '  const pad = n => String(n).padStart(2, "0");\n\n' +
    '  // 构建标识：BUILD.id 标识页面内容版本；BUILD.commit 为包含该版本内容的提交短 SHA。\n' +
    '  const BUILD = {id: "build-20261116-seg5", commit: "pending"};\n\n' +
    '  function buildLabel(build) {\n' +
    '    const src = build || BUILD;\n' +
    '    const commit = String(src.commit);\n' +
    '    const short = /^[0-9a-f]{7,40}$/i.test(commit) ? commit.slice(0, 7) : "pending";\n' +
    '    return {id: String(src.id), commit: short};\n' +
    '  }\n\n' +
    '  function renderBuild() {\n' +
    '    const b = buildLabel();\n' +
    '    $("buildId").textContent = b.id;\n' +
    '    $("buildCommit").textContent = b.commit;\n' +
    '    $("buildCommit").title = String(BUILD.commit);\n' +
    '  }'
  ],
  [
    '  renderAll();\n  updateClock();',
    '  renderBuild();\n  renderAll();\n  updateClock();'
  ]
];

for (const [find, repl] of R) {
  const n = s.split(find).length - 1;
  if (n !== 1) throw new Error("anchor count " + n + ": " + find.slice(0, 60));
  s = s.replace(find, repl);
}
await writeFile(P, s);
console.log("part b ok", s.length);
