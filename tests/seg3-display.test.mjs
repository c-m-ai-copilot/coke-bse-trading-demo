import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const limitPanel = html.match(/<div id="panelLimit">([\s\S]*?)<div id="panelBlock"/)?.[1];

test("effective date is explicitly unconfirmed", () => {
  assert.match(html, /生效日待官方公告确认（unknown）/);
  assert.doesNotMatch(html, /2026-10-26/);
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
  assert.match(html, /class="env-tag">版本 <b>build-20261116-seg3<\/b>/);
});
