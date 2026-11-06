---
name: Library screenshot hang (#530)
overview: Stop library uploads hanging when the html2canvas screenshot fails, and upgrade html2canvas-pro to 2.x so calc() background positions render.
todos:
  - id: phase-1-cloud-ui
    content: "bb-packages: reject + clean up in screenshotUrl, fall back to no screenshot in library.js, allow html2canvas-pro 2.x, bump cloud-ui"
    status: completed
  - id: phase-2-assistant
    content: "assistant: fall back in post.js, bump cloud-ui and html2canvas-pro to 2.x, rebuild"
    status: in_progress
---

# Library screenshot hang (#530)

**Complexity:** Medium

## Context

Issue: https://github.com/beaverbuilder/assistant/issues/530. Adding a page to an Assistant library hangs forever when the page has a background image offset from both the right and bottom edges (computed as `calc(100% + 43px) calc(100% + 53px)`). Reproduced on `http://localhost:10003/hi-bg-image/`: html2canvas-pro 1.5.11 (what assistant ships) rejects asynchronously with `TypeError: Cannot read properties of undefined (reading 'type')`; 2.6.3 renders the page and places the image correctly.

Two bugs combine. (1) `screenshotUrl()` only catches synchronous throws, so an async rejection leaves its promise pending forever, and none of the callers have a `.catch` that continues the upload, so the request is never sent. The same failure mode caused #491 (`color()`), and will recur for the next CSS html2canvas can't parse. (2) html2canvas-pro 1.x drops `calc()` tokens in `background-position`. Fix (1) everywhere so a failed screenshot degrades to "upload without a screenshot", and fix (2) by upgrading to 2.x.

## Decisions

- **Plan lives in assistant**: the issue is filed there; most of the code change is in bb-packages (cloud-ui). Both repos get a branch `issues/530-library-screenshot-hang`.
- **Failure behavior: upload without a screenshot, log with `console.error`**: matches the issue's "added with or without a screenshot". Revised during phase 2: with no client screenshot the plugin used to send page HTML, which the cloud cannot screenshot (no Browsershot) and which clears the item's thumb. `get_save_data()` now omits `screenshot` when the client sent none, and the cloud then skips screenshots.
- **Catch at the callers, not inside `screenshotUrl()`**: `screenshotUrl()` stays core logic and rejects; each caller is a UI boundary that logs and falls back. A "resolve `''` on failure" helper would be the catch-and-return-default pattern CLAUDE.md rules out. Cost: five small `.catch` blocks.
- **Use `skipValidation: true` for html2canvas 2.x**: 2.x validates `proxy` with `new URL()`. Our relative `index.php?fl_asst_image_proxy=` fails that ("Invalid URL format"), and with an absolute URL, localhost and private-IP sites are rejected by default. Every screenshot would fail. The proxy is our own fixed endpoint, so validation adds nothing. A plain option is also ignored by 1.x, unlike importing `createDefaultValidator` (2.x-only export), which would break any consumer still on 1.x.
- **cloud-ui peer range becomes `^1.5.8 || ^2.6.3`, not `^2.6.3`**: `assistant-cloud-ui` (the SaaS) also depends on cloud-ui and pins html2canvas-pro `^1.5.8`; a 2.x-only peer would break its next install with ERESOLVE. Upgrading the SaaS is out of scope (its screenshot path is plugin-only per the note in `screenshot.js`).
- **Upgrade happens in assistant's own dependency**: html2canvas-pro is a *peer* of cloud-ui, so the copy bundled into `build/apps.js` is assistant's. Bumping assistant to `^2.6.3` is what ships the parser fix; the cloud-ui peer change just permits it.
- **BC**: no public surface changes. `screenshotUrl()` keeps its signature; it now rejects where it used to hang, and every caller handles that. `Uploader.screenshotUrl` is exported from cloud-ui; no other consumer calls it (searched `assistant`, `bb-packages`, `assistant-cloud-ui`).

## Execution Strategy

**Agents needed:** One. Small, well-specified edits in two repos, but Phase 2 depends on Phase 1 being linked or published, and the publish is a human step.

**Model tiers:** `sonnet` for both phases: fully specified edits, no design judgment left.

## Reading List

1. https://github.com/beaverbuilder/assistant/issues/530: cause, repro, suggested fix
2. `bb-packages/CLAUDE.md`: code style (no semicolons, spaces in parens), publish flow, no unit tests
3. `bb-packages/packages/cloud-ui/src/uploader/utils/screenshot.js`: the promise that never settles
4. `bb-packages/packages/cloud-ui/src/uploader/hooks/library.js`: `exportPost` (line ~30) and `importPosts` (lines ~129, 154, 169) callers
5. `assistant/src/apps/libraries/ui/library-item/form/config/post.js` (line ~123): "Update library item" caller
6. `assistant/CLAUDE.md`: `npm run link:packages`, build and lint commands
7. `assistant/webpack.config.js`: shows `html2canvas-pro` is not externalized (only `html2canvas` is), so it bundles into `apps.js`

## Implementation

### Phase 1: cloud-ui (bb-packages) (Complexity: M)

**Objective:** a failed screenshot never stalls an upload, and cloud-ui works with html2canvas-pro 2.x.

**Steps:**
1. `screenshot.js`: chain the html2canvas promise as `.then( canvas => resolve( ... ) ).catch( reject ).finally( removeFrame )`. Keep the `try/catch` for synchronous throws, and remove the iframe there too, so the hidden 1500px iframe never leaks. Add `skipValidation: true` to the options with a one-line comment on why.
2. `library.js` `exportPost` (the add-to-library path from the issue): add `.catch( error => { console.error( ... ); doRequest() } )` to the `screenshotUrl()` call.
3. `library.js` `importPosts`, three sites: on failure, log and call `doRequest( postId, postItemCount )` so the import counter still reaches the last item and resolves. Keep each site's existing post-delete `.then` (the two `postsApi.create` branches delete the temp post after the request). Replace the two log-only catches; add one to the site that has none.
4. `cloud-ui/package.json`: peer `html2canvas-pro` to `^1.5.8 || ^2.6.3`; bump `version` to `0.8.74`.
5. `npm run test` (eslint) and `npm run build`.

**Files:**
- `packages/cloud-ui/src/uploader/utils/screenshot.js`: reject on async failure, clean up iframe, `skipValidation`
- `packages/cloud-ui/src/uploader/hooks/library.js`: four `.catch` fallbacks
- `packages/cloud-ui/package.json`: peer range, version

**Implementation notes (2026-11-06):** branch `issues/530-library-screenshot-hang` off `origin/master` 057d044. The three `importPosts` sites share a local `doRequestWithScreenshot()` instead of three copies of the fallback; iframe setup moved into `createFrame()` to keep `screenshotUrl()` under 30 lines. Root `package-lock.json` mirrors the version and peer range (as prior publish commits do). Lint: no new findings in the two files (pre-existing ones untouched). `rollup` build of cloud-ui passes; dist has `skipValidation` and still imports `html2canvas-pro` externally. Deps were installed with `npm ci --ignore-scripts` to skip the global `npm link` postinstall. Not yet link-tested in assistant.

**Verification:** linked into assistant (`npm run link:packages` there), the Phase 2 manual tests pass. Publishing (`npm run publish:packages`) is a human step after the bb-packages PR merges; ask before running it.

### Phase 2: assistant (Complexity: L)

**Objective:** ship the fallback in the update path and the 2.x parser.

**Steps:**
1. `post.js` ~line 123: add `.catch( error => { console.error( ... ); doRequest() } )` to `screenshotUrl()`. Also add a `.catch` on `postsApi.findById()` that calls `setUpdating( false )`, shows the existing error notice and calls `closeDialog()` (mirroring `doRequest`'s `finally`), since a failure there hangs the dialog the same way.
2. `package.json`: `@beaverbuilder/cloud-ui` to `^0.8.74` (after publish), `html2canvas-pro` to `^2.6.3`. `npm install`, commit the lockfile.
3. `npm test` and `npm run build`. Confirm `build/apps.js` contains the 2.x parser (search for `parseOptionalCalcOrLength` or `_calcPercentage`).

**Files:**
- `src/apps/libraries/ui/library-item/form/config/post.js`: `.catch` fallbacks
- `package.json`, `package-lock.json`: dependency bumps
- `backend/src/Controllers/Cloud/Libraries/LibraryItemPostController.php`: omit `screenshot` from `get_save_data()` when the request has none (added in phase 2)
- `backend/tests/Unit/Controllers/LibraryItemPostSaveDataTest.php`: covers base64 / absent / empty screenshot

**Verification:** manual tests below. Do not edit `changelog.txt`.

**Implementation notes (2026-11-06):** branch `issues/530-library-screenshot-hang` off `origin/main` 34701944. `post.js` fallback + `findById` catch done; html2canvas-pro `^2.6.3` installed (lockfile drops 1.x's four deps). cloud-ui `^0.8.74` bump waits on publish; tested by copying the local cloud-ui `dist` into `node_modules` (backup of 0.8.73 dist in the session scratchpad), because `link:packages` points at a stale 2022 checkout and would resolve bb-packages' html2canvas-pro 1.5.8. Live results on the bb site: add-to-library on `/hi-bg-image/` succeeds with a correct 1500x586 screenshot (stored as media 7, then 8 after one update). Forced failure on Update: the fallback logs and sends the request, but the UI shows "Error updating library item."

**Finding: "upload without a screenshot" is not what the server does.** With no `screenshot` param, `ScreenshotHelper::get_for_url()` sends the page HTML (`type: html`); the cloud API (`CreateLibraryItemScreenshot`) clears the item's thumb, then calls Browsershot, which isn't in its `composer.json`, so it 500s after the content is saved. The cloud skips screenshots entirely when the key is absent. The Decisions line "server already accepts an empty screenshot, so no PHP change" was wrong.

**Resolved (2026-11-06):** `get_save_data()` omits `screenshot` without a client one. Live retest with a forced failure: "Library item updated!", fallback logged, no new cloud error. A normal update afterwards restored item 13's thumb (media 9, 1500x586). The PHP test is written but not run: no `vendor/`, and the suite pins PHPUnit 7.5 (incompatible with PHP 8.4) plus a WP test DB. PHPCS not run (WPCS not installed). Not live-tested: add-to-library with a forced failure (same cloud trait, now skipped on create too). `CustomizerService` still uses the HTML fallback via `get_for_post_request()`; out of scope. Remaining: publish cloud-ui 0.8.74, bump assistant to `^0.8.74` with a normal `npm install` (restores real `node_modules`).

## Testing

No JS unit tests exist in either repo (eslint only), so verification is manual on the bb Local site (`localhost:10003`), logged in, Assistant connected, built with the linked cloud-ui:

1. **Repro fixed:** add `/hi-bg-image/` to a library. It is added; the thumbnail shows the waterfall anchored bottom-right like the live page.
2. **Fallback works:** temporarily build with html2canvas-pro 1.5.11 (or force a rejection), add the same page. It is added without a screenshot, `console.error` shows the TypeError, the spinner stops.
3. **Update path:** "Update" an existing library item for that page (`post.js`); same two outcomes.
4. **Import path:** import an export containing a post with that background; the import finishes and the last item resolves.
5. **Regression:** add an ordinary page with a cross-origin image (exercises the `proxy` path under 2.x) and confirm the thumbnail renders normally.

## Risks / Open Questions

- **2.x is a major bump.** html2canvas-pro 2.6.3 declares `engines.node >=24` (npm warns only; it's a browser library) and ships ES2020+ syntax (`?.`, `??`) that assistant's webpack 5 parses fine but likely won't transpile (node_modules). Fine for browsers WordPress supports; worth a check in the oldest browser you care about.
- **Second bundle also moves to 2.x.** `build/vendor-html2canvas.js` (registered in `OnEnqueueScripts.php` as a dependency of `fl-assistant-apps`, exposes `window.HTML2Canvas`) is built from the same package. Nothing in our code reads that global; it upgrades along for free (+~10KB minified). Removing the duplicate is out of scope.
- **SaaS stays on 1.x** (`assistant-cloud-ui`), so the parser fix doesn't reach it. Its screenshot path is noted as plugin-only, so likely moot; confirm if you want it tracked.
- **Publishing cloud-ui** is a human step; Phase 2's `package.json` bump waits on it.

**Tests (2026-11-07):** `LibraryItemPostSaveDataTest` passes (3/3) and fails 2/3 against the pre-fix controller. Full unit suite: no regressions; the 12 remaining failures exist without this change (6 from the untracked #518 `LibraryItemPostControllerTest.php`, 6 legacy: `PostRepositoryTest`, `SearchControllerTest`, `TermsControllerTest`). PHPCS on the controller: no new findings (16 vs 17 before); test file clean. Live: add-to-library with a forced screenshot failure shows "Added", logs the fallback, cloud logs no error. Local test setup: Local's PHP 7.4 (Homebrew php@7.3 is broken), `composer install --no-plugins --ignore-platform-req=composer-plugin-api` (lock pins a Composer 1 plugin), DB `wp_phpunit_tests` on the bb site's MySQL, gitignored `backend/tests/wp-config.php` pointing at bb's WP core.
