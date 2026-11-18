---
name: Harden the Code app and create_post (GHSA-cjjx-c59g-8xgf + related)
overview: Gate fl_code writes and rendering on unfiltered_html, block object injection and add a post-type authorization check in create_post, and fix the status typo that renders drafts.
todos:
  - id: write-paths
    content: "Require unfiltered_html on the fl_code create, update/enable, and cloud-import REST paths"
    status: completed
  - id: render-gate
    content: "Render only snippets whose author holds unfiltered_html; fix published->publish status"
    status: completed
  - id: object-injection
    content: "Block object injection: safe meta write in create_post + allowed_classes=false on location unserialize"
    status: completed
  - id: authz
    content: "Add a post-type-appropriate capability check to create_post"
    status: completed
  - id: ui-gate
    content: "Hide the Code app from users without unfiltered_html"
    status: completed
  - id: tests
    content: "Regression tests for each gated path, the render gate, injection, and authz"
    status: completed
---

# Harden the Code app and create_post (GHSA-cjjx-c59g-8xgf + related)

**Complexity:** Medium

> **Scope note.** Only GHSA-cjjx-c59g-8xgf (the stored XSS) exists as a repo advisory; its "Related" section names two more that the reporter asked to fix together — object injection and missing authorization, both in `create_post()`. Those two GHSA IDs (GHSA-2f5g-vqj6-h5rw, GHSA-f9jj-x367-cvww) **return 404** from the repo API, so their fixes below are planned from the code and the one-line references, not from the reporters' full write-ups. Confirm against the actual PoCs before merge if they become available.

## Context

The Code app stores JS/CSS snippets as `fl_code` posts and echoes them unescaped in `wp_head` for every visitor, gated only by `edit_others_posts` — nothing consults `unfiltered_html`, so an Editor can plant site-wide script that runs in an Administrator's session (reproduced on the local site at 1.5.5.1). The same `create_post()` handler carries two adjacent weaknesses: it inserts `meta_input` through a raw `$wpdb->query()` string, and the stored `_fl_asst_code_locations` is `maybe_unserialize()`d at render with no class restriction (PHP object injection); and it authorizes every create with the single coarse `edit_others_posts` cap, never the capability appropriate to the requested `post_type`.

The XSS fix mirrors how WordPress core treats raw-markup features (Custom HTML widget, theme/plugin editors): snippet bodies stay raw by design, but authoring and rendering are gated on `unfiltered_html`. We do **not** escape snippet bodies (that breaks legitimate code) and do **not** gate by code type (the CSS path breaks out of `<style>` as readily as JS) — the gate is the `fl_code` post itself.

## Decisions

- **XSS: gate on `unfiltered_html`, by post type, at both write and render** — `user_can( $author, 'unfiltered_html' )` at render is the keystone: it covers snippets saved before this fix and authors later demoted, which write-path checks alone cannot.
- **Status typo: `'published'` → `'publish'`, and drop `perm => 'editable'`** in `CodeRepository::query()`. The invalid status made core skip the status clause *and* the `perm` author restriction nested inside it, so today every enabled snippet renders. Fixing only the status re-activates `perm => 'editable'`, which returns **nothing** for a logged-out visitor (verified empirically: `publish`+`editable` as user 0 → `[]`) — that would break the feature for all anonymous front-end traffic. So the render query must drop `perm` too; author trust is enforced by the `unfiltered_html` check at render instead. `OnWPHead` is the sole consumer of this query chain (confirmed), so both changes only affect render.
- **Object injection: fix the write side — the read side cannot be the keystone.** `get_post_meta()` auto-unserializes (`wp-includes/meta.php:686`), so the object is instantiated inside `get_post_meta()`, *before* the explicit `maybe_unserialize( $locations )` in `evalute_code_rules()` ever runs — adding `allowed_classes => false` there would be dead code. The real fix: in `create_post()`, never store an attacker-controlled serialized string. Replace the raw `$wpdb->query()` meta INSERT with `add_post_meta( $id, $meta_key, wp_slash( $meta_value ) )`, and **skip any string value where `is_serialized( $meta_value )` is true** — that is what plants an `O:`/`C:` payload (or an array wrapping one) for `get_post_meta` to open. Confirmed safe for every known caller: legit `fl_code` create sends only `_fl_asst_code_type` (scalar), notation create sends scalars, and all structured data (code, enable, locations) is written through the *update* path as arrays that core serializes itself. **Hazard:** core meta functions `wp_unslash()` the value, so `wp_slash()` it before writing to preserve snippet bodies containing backslashes exactly — the raw-SQL path's `addslashes` was there to avoid this corruption.
- **Authorization: check the requested post type's create cap** — before insert, resolve `get_post_type_object( $params['post_type'] )` and require `current_user_can( $pto->cap->create_posts )`, rejecting on a missing type or a missing cap. Both known callers pass: `fl_code` and `fl_asst_notation` register with default `post` caps, so `create_posts` resolves to `edit_posts`, which Editors hold. This composes with the `fl_code` → `unfiltered_html` gate.
- **UI gate is defense-in-depth** — `currentUserCan( 'unfiltered_html' )` works because `UsersRepository` already ships `allcaps` to the frontend; the REST gate stays the real boundary.
- **BC:** REST endpoint shapes are unchanged — every new guard returns the existing `{ error: true }` failure shape. The behavior changes (capless Editors lose Code authoring; creating a post type you lack the cap for is rejected) are the intended fixes.

## Execution Strategy

**Agents needed:** One. Single repo (`assistant`), ~6 files, one coherent hardening of one handler plus its render path; splitting would fragment it across PRs. Land as one PR.

**Model tier:** `sonnet` — contained, well-contracted edits with a clear reproduction and test target; the one judgment call (slash preservation) is spelled out above.

## Reading List

Read in order before starting:

1. `https://github.com/beaverbuilder/assistant/security/advisories/GHSA-cjjx-c59g-8xgf` — the advisory, its Related section, and suggested fix.
2. `backend/src/Controllers/PostsController.php` — `create_post()` (~L266: raw meta INSERT, no type cap check) and `update_post()` (~L344).
3. `backend/src/Controllers/Cloud/Libraries/LibraryItemCodeController.php` — `import()`; third fl_code write path.
4. `backend/src/Data/Repository/CodeRepository.php` — `query()` (status typo), `evalute_code_rules()` (render selection + the `maybe_unserialize` to replace, and where the author gate goes).
5. `backend/src/Hooks/Actions/OnWPHead.php` — the unescaped sink.
6. `backend/src/PostTypes/CodePostType.php`, `NotationsPostType.php` — confirm neither sets custom caps (so the authz check won't break them).
7. `src/apps/fl-code/index.js` — app registration; `src/apps/fl-comments/index.js` for the `enabled: currentUserCan(...)` pattern.
8. `backend/tests/Unit/Controllers/PostsControllerTest.php`, `backend/tests/Unit/ControllerTestCase.php` — test harness and style.

## Implementation

### Steps

1. **fl_code write-path gating (XSS).**
   - `create_post()`: if `'fl_code' === ( $params['post_type'] ?? '' )` and `! current_user_can( 'unfiltered_html' )`, return `{ error: true }`. Comment citing the advisory at this primary site.
   - `update_post()`: after the `edit_post` guard, if `'fl_code' === get_post_type( $id )` and `! current_user_can( 'unfiltered_html' )`, return `{ error: true }`. Covers `action=meta` and `action=data` (the enable path writes `_fl_asst_enable`).
   - `LibraryItemCodeController::import()`: require `unfiltered_html` at the top (the route always creates `fl_code`), returning the existing error shape.

2. **Render-path gating (XSS + status).**
   - `CodeRepository::evalute_code_rules()`: skip any `$post` where `! user_can( $post->post_author, 'unfiltered_html' )` before reading its meta.
   - `CodeRepository::query()`: `'post_status' => 'published'` → `'publish'`.

3. **Object injection — write side is the fix.**
   - In `create_post()`, replace the raw `$wpdb->query( "INSERT ..." )` loop with the core API: keep `sanitize_key( $meta_key )`, then for each value `if ( is_string( $meta_value ) && is_serialized( $meta_value ) ) { continue; }` (drop the payload), else `add_post_meta( $id, $meta_key, wp_slash( $meta_value ) )`. This stops any serialized-object string from reaching the DB, so `get_post_meta()`'s auto-unserialize has nothing to instantiate. Removes the interpolated SQL and preserves snippet content exactly.
   - `evalute_code_rules()`: the explicit `maybe_unserialize( $locations )` now runs on an already-unserialized array (redundant) — leave it; it is harmless and not the sink. Keep `extract( $rule )` guarded to array rules.

4. **Authorization (create_post).**
   - Before `wp_insert_post()`, resolve `$pto = get_post_type_object( $params['post_type'] ?? '' )`; if `! $pto || ! current_user_can( $pto->cap->create_posts )`, return `{ error: true }`. Place this ahead of the `fl_code` cap check so order reads general → specific.

5. **UI gate.** In `src/apps/fl-code/index.js`, add `enabled: currentUserCan( 'unfiltered_html' )` to `registerApp` (import `currentUserCan` as `fl-comments`/`fl-updates` do). Rebuild JS.

6. **No changelog edits** (Non-Negotiables). Note the three fixes for release notes in the PR body.

### Files Affected

- `backend/src/Controllers/PostsController.php` — cap guard + authz check + safe meta write in `create_post()`; cap guard in `update_post()`.
- `backend/src/Controllers/Cloud/Libraries/LibraryItemCodeController.php` — cap guard in `import()`.
- `backend/src/Data/Repository/CodeRepository.php` — author gate + `allowed_classes=false` in `evalute_code_rules()`; `publish` status fix.
- `src/apps/fl-code/index.js` — `enabled` gate.
- `backend/tests/Unit/Controllers/PostsControllerTest.php` (+ a CodeRepository render test).

## Testing

New/updated PHPUnit tests (`cd backend && composer tests`), `ControllerTestCase` style. Create an Editor and revoke the cap under test with `$user->remove_cap( 'unfiltered_html' )` (the test site defines no `DISALLOW_UNFILTERED_HTML`; removing the cap is the equivalent gate).

- **XSS writes:** capless Editor gets the error shape and no post/meta change for `POST /posts` (`post_type=fl_code`), `POST /posts/<id>` `action=meta` setting `_fl_asst_enable`, and `POST /library-items/import/code`. Admin (has cap) still succeeds.
- **Render gate:** a published, enabled `entire_site` snippet by a capless author is omitted from `evalute_code_rules()`; the same by an admin is included.
- **Status fix:** a draft enabled snippet is omitted.
- **Object injection:** `POST /posts` with a `meta_input` value that is a serialized-object string stores no such meta (the value is dropped), so a later `get_post_meta()` returns empty and instantiates nothing; a snippet body containing backslashes round-trips through `create_post()` unchanged; a scalar meta value (e.g. `_fl_asst_code_type`) still stores normally.
- **Authz:** an Editor creating a post type whose `create_posts` cap they lack gets the error shape; creating `fl_code`/`fl_asst_notation` (as admin, resp. editor with cap) still succeeds.

Manual confirmation on localhost:10003: re-run the reproduction (no markers reach the front page), and confirm the Code app no longer lists for a capless Editor.

## Risks / Open Questions

- **Related-advisory text unavailable.** As noted at top, the two related GHSAs 404. The object-injection and authz fixes are planned from the code; confirm scope against the reporters' PoCs if published, in case either weakness has a facet not visible here (e.g. a specific gadget chain or a second unauthorized action).
- **Authz check breadth.** The `create_posts` check is the minimal bounded fix. If `create_post()` is a general content-creation endpoint used for more post types than `fl_code`/`fl_asst_notation`, re-confirm each still passes before merge (grep `posts().create(` in `src/`). None beyond those two were found.
- **Backport.** 1.5.5.1 is the shipped line; confirm whether this needs a backport PR to the release branch after `main`.
- **Reporter credit/reply.** The advisory notes Luca Jungnickel (Fraunhofer FOKUS) has no GitHub handle yet and needs a reply with the fix version — a release task.
