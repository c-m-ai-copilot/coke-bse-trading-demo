import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const limitPanel = html.match(/<div id="panelLimit">([\s\S]*?)<div id="panelBlock"/)?.[1];

test("effective date cites 2026-10-26 and BSE announcement 43", () => {
  assert.match(html, /自2026-10-26起实施/);
  assert.doesNotMatch(html, /unknown/);
  assert.match(html, /https:\/\/www\.bse\.cn\/jygl_list\/200029608\.html/);
});

test("3.6.5 interval card is scoped to block trade", () => {
  assert.match(html, /body:not\(:has\(#tabBlock\.active\)\)\s*\.right-col section:has\(\.rule-hero\)\s*\{\s*display:\s*none\s*\}/);
  assert.match(html, /<button class="tab" id="tabBlock"/);
});

test("limit-order form does not include bulk interval ratios", () => {
  assert.ok(limitPanel, "limit-order panel exists");
  assert.doesNotMatch(limitPanel, /70%|130%/);
});

test("a visible build identifier is present", () => {
  assert.match(html, /<b id="buildId">build-20261116-seg5<\/b>/);
  assert.match(html, /<b id="buildCommit" class="mono">(pending|[0-9a-f]{7})<\/b>/);
});
