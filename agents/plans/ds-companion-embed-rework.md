---
name: Embed companion posts in the page library item
overview: Rework PR 519 so a page's design system travels inside the page's own library item instead of as a separate item linked by cloud id.
todos:
  - id: helper
    content: "Add CompanionPostsHelper (collect, encode, read)"
    status: completed
  - id: save
    content: "Embed companions in get_save_data and remove the separate-item upload"
    status: completed
  - id: import
    content: "Import embedded companions, skip on preview, report failures"
    status: completed
  - id: cleanup
    content: "Split import_item args, fix stale comments"
    status: completed
  - id: tests
    content: "Add LibraryItemPostCompanionsTest and import regression tests"
    status: completed
  - id: pr-body
    content: "Rewrite the PR body for the new format"
    status: completed
---

# Embed companion posts in the page library item

**Complexity:** Medium

## Context

PR 519 (issue 518) uploads a page's design system as its own cloud library item and records that item's cloud id on the page item in `_fl_asst_companion_items`. The merge check on 2026-11-19 found that this link does not hold up: the cloud's library duplicate gives items new ids while copying their data verbatim, every save uploads another copy of the design system, a deleted companion item silently breaks every page that points at it, and a preview leaves a published design system behind. Companion upload and import failures were also dropped silently.

The rework stores each companion's post, meta and terms as JSON inside the page item's own meta. The cloud API persists only `post_data.post`, `post_data.meta` and `post_data.terms` (`assistant-cloud-api/app/Traits/LibraryItemPost.php`), so meta is the one channel that needs no API change, and it survives duplicate, move and export because it is part of the item's data. Nothing in the old format has shipped, so there is no migration.

## Decisions

- **Link format**: companions are embedded in the page item under one meta key, `_fl_asst_companions`, holding a single JSON string: a list of `{ post, meta, terms }` objects in the same shape `get_item()` returns under `data`. Decided by Rahul 2026-11-19. `_fl_asst_companion_items` and the separate-item upload are removed.
- **Preview**: `preview_library_post` imports the page only, as before the PR. Decided by Rahul 2026-11-19. A page whose design system is not on the site previews unstyled.
- **Filters (BC)**: `fl_assistant_library_companion_posts` and `fl_assistant_library_companion_exists` keep their names; the platform consumer is already merged (`DesignSystemPostType.php:111-132`). The exists filter still receives an object with `->data->post` and `->data->meta`, built from the embedded entry. The posts filter is called with `( [], $post )`; the PR's third `$library_id` argument is dropped because `get_save_data()` has no library id and the consumer registers two arguments.
- **`get_save_data()` signature (BC)**: the `$with_screenshot` parameter added by the PR is removed, restoring the signature on main.
- **Sync**: embedding happens in `get_save_data()`, so `sync_to_library` refreshes the embedded copy too. This reverses the PR's "sync untouched" note on purpose: otherwise a sync would drop the companion.
- **Never store the blob locally**: `import_post_meta_from_library()` skips `_fl_asst_companions`, which covers import, `sync_from_library` and preview in one place. `get_save_data()` also unsets the key from the meta it read before setting a fresh value, so it can never be re-uploaded stale.
- **Failures**: `import_companions()` returns the `WP_Error`s it hit instead of dropping them. `import_from_library` (the boundary) logs each with `error_log` and adds an additive `companion_errors` list (`name`, `code`) to its response. No UI for it in this PR.
- **Size**: companion collection and decoding move to a new `Helpers/CompanionPostsHelper` (about 70 lines) because the controller is already 888 lines. Post creation stays in the controller's `import_item()`, which owns the meta and terms import.

## Execution Strategy

**Agents needed:** One

One controller, one small helper and one test file; the steps depend on each other and the decisions above are settled.

**Model tiers:** `sonnet`. The scope is well specified; the only judgment call is test design, which follows an existing file.

## Reading List

1. `backend/src/Controllers/Cloud/Libraries/LibraryItemPostController.php`: the whole file at the branch head; this plan rewrites its companion parts.
2. `backend/tests/Unit/Controllers/LibraryItemPostSaveDataTest.php`: the subclass-without-DI pattern the new tests follow.
3. `../bb-ai-design-system/packages/design-system-runtime/backend/DesignSystem/DesignSystemPostType.php` lines 100 to 135: the two filter callbacks and the `$item` shape they read. Read only; do not change that repo.
4. `../assistant-cloud-api/app/Traits/LibraryItemPost.php`: what the cloud keeps from `post_data`, including the restricted meta keys.
5. `backend/src/Helpers/JsonHelper.php`: the static helper style to match.

## Implementation

### Steps

1. **Helper.** Add `backend/src/Helpers/CompanionPostsHelper.php` with `const META_KEY = '_fl_asst_companions'` and three static methods: `collect( $post )` applies `fl_assistant_library_companion_posts` and returns unique `WP_Post` objects (non-posts dropped, deduped by ID); `encode( array $entries )` returns the JSON string; `read( $item )` decodes `$item->data->meta->{META_KEY}[0]` into a list of item-shaped objects (`(object) [ 'data' => $entry ]`), skipping entries without `post`. Malformed JSON returns an empty list.
2. **Save.** In the controller, extract the `post_data` array that `get_save_data()` builds into `get_post_data( $post )`. In `get_save_data()`, unset `META_KEY` from the meta, then, when `collect()` returns posts, set it to `[ encode( array_map( get_post_data ) ) ]`. Delete `save_companions_to_library()`, `COMPANION_ITEMS_META`, the `$with_screenshot` parameter and the companion block in `save_to_library()`, returning that method to its form on main.
3. **Import.** Replace `import_companions_from_library()` and `get_companion_item_ids()` with `import_companions( $item )`: for each `read()` entry, skip when the exists filter returns true, else call `import_item()`; collect and return any `WP_Error`. Move the body of `import_from_library()` into a protected `import_library_post( $request, $with_companions )`; the public method calls it with `true`, and `preview_library_post()` calls it with `false` in place of `import_from_library()`. When companions ran and errors came back, log them and add `companion_errors` to the response.
4. **Meta.** In `import_post_meta_from_library()`, `continue` past `META_KEY` before the delete and insert.
5. **Cleanup.** Extract the `wp_insert_post` argument array from `import_item()` into `get_insert_post_args( $post_data )` so both stay under 30 lines. Cut the comments at the `wp_slash` and `$wpdb->insert` sites to one sentence each and remove the stale meta-cache paragraph. Every new method gets a docblock with typed `@param` and `@return`.
6. **Tests.** See Testing.
7. **PR body.** Rewrite the "How it works" section for the embedded format, state that preview skips companions, and note that the media URL rewrite no longer fires `updated_post_meta`. Follow the summary-pointers format. Do not edit any changelog.

### Files Affected

- `backend/src/Helpers/CompanionPostsHelper.php`: new, about 70 lines.
- `backend/src/Controllers/Cloud/Libraries/LibraryItemPostController.php`: steps 2 to 5; net smaller than the current branch.
- `backend/tests/Unit/Controllers/LibraryItemPostCompanionsTest.php`: new, about 200 lines.

## Testing

Unit tests, written to the `LibraryItemPostSaveDataTest` pattern with a test subclass exposing the protected methods. Run with `composer tests` (needs Local's PHP 7.4 and `vendor` copied into the worktree).

- Save: a companion returned by the filter is embedded with its post, meta and terms; the same post returned twice is embedded once; no key when the filter returns nothing; a stale `_fl_asst_companions` value on the post is not re-uploaded.
- Import: an embedded companion is created with `post_content` containing `\n` JSON escapes intact; a companion the exists filter reports present is not created; a companion with an unregistered post type comes back as an error and the page still imports; with `$with_companions` false nothing is created.
- Meta: `import_post_meta_from_library()` does not store `_fl_asst_companions`, and stores a value containing backslashes and quotes byte for byte.
- Regression: `replace_imported_attachment_urls_in_meta()` leaves the `\"` inside a nested `ds_block_data` JSON string in `_fl_builder_data` intact.

Manual, on the local site with Beaver Builder Platform active: save a page with a design system and confirm one library item; import it on a site without that design system and confirm the page is styled and one design system exists; import again and confirm no second design system; duplicate the library in the cloud and import from the copy; preview the page on a clean site and confirm no design system is created.

## Risks / Open Questions

- **Companion media is not carried.** Images referenced only by the design system are not added to the page item's attachments and their URLs are not rewritten. The current PR has the same gap (companion media was uploaded but never imported). Left out here; file a follow-up if design systems reference media.
- **Directly saved design systems can still duplicate.** A design system saved to a library on its own and imported twice is created twice with the same UUID, because a direct import never asks the exists filter. That predates this PR and is not changed here.
- **Old test items.** Library items saved from the current branch carry `_fl_asst_companion_items`; it now imports as inert stray meta. Re-save test pages after the rework.
- **Older plugin versions** import the embedded blob as a large stray meta value on the page and re-upload it on save. Harmless, but it cannot be cleaned up remotely.

## Implementation Notes (2026-11-19)

- All steps are done: code pushed as 7cc55b15 and the PR body rewritten on 2026-11-19.
- Not tested: the "`$with_companions` false creates nothing" case. `import_library_post()` builds a `CloudClient` and fetches the item over the network, so it has no unit seam; the preview path is covered by the manual check only.
- Added beyond the step list: `get_import_error_data()` and `report_companion_errors()`, split out to keep `import_library_post()` under 30 lines; the unregistered-type and insert errors now carry the post title as `name` in their error data so the report can name the companion.
- Unit suite: the 12 `LibraryItemPost*` tests pass. `TermsControllerTest::test_can_get_terms`, four `PostRepositoryTest` tests and `SearchControllerTest::test_can_search` fail in this worktree and fail the same way on another branch of the main checkout, so they are not from this change.
- `composer lint` cannot find `WordPress-Core` without `--runtime-set installed_paths vendor/wp-coding-standards/wpcs`. With it, the only findings in the changed files are on legacy lines this change does not touch (the `if ($thumbnail)` and two `if (isset($response->success)` lines).
- Manual testing against a cloud library has not been run.

## Review follow-up (2026-11-19)

A second review at ff2be3be1 raised two things, both fixed:

- **File size.** The controller had grown past its size on main. `import_item()`, `get_insert_post_args()`, `import_companions()` and the bodies of the meta, terms and builder cache imports moved to a new `Services/LibraryPostImporter` (about 230 lines); the three public controller methods remain as one-line delegates, so their signatures are unchanged. Error reporting moved to `CompanionPostsHelper::report_errors()`. The controller is 665 lines, down from 707 on main.
- **Companion post types.** A companion is imported only when its post type is library-portable: the list behind the existing `fl_assistant_post_types_library` filter (default `fl-design-system`), now read through `PostsRepository::get_library_post_types()`. Anything else comes back as a `companion_type_not_allowed` error. The embedded data can come from a library another user authored, so it must not choose its own post type.
- The Context claim that the embedded data survives a library duplicate is unverified: the cloud's duplicate appears to copy items without `post_data` at all, companions or not. Removed from the PR body.
- Left open from that review: the UI does not show `companion_errors`; preview and the response key have no unit test (no seam for the cloud fetch); `sync_from_library` does not import companions; a null meta value is now stored as SQL NULL; the stored value has no version wrapper.

