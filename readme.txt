=== Assistant - Every Day Productivity Apps ===
Contributors: justinbusa, RobbyMcCullough, billyyoung, brentjettgmailcom, pross, shahidajmeri22, codente
Tags: Front-End, Frontend, Productivity, Quick Admin, Content Management, Media, Upload, Beaver Builder
Requires at least: 5.2
Tested up to: 6.2
Requires PHP: 5.6
Stable tag: 1.4.0
License: GPL2+
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Assistant is a new way to work with WordPress. It's an every-day productivity tool that lets you navigate your WordPress site and handle quick tasks without needing to go to the WordPress Admin area. For example, you can quickly find a page or post and update its title or featured image. You can upload media and navigate to attachment pages. You can moderate comments. You can even run plugin and theme updates. Assistant is organized as a collection of "Apps" for different kinds of tasks. You'll see more apps coming to Assistant in the future.

Assistant is an open source project from the same team that makes Beaver Builder. It's free and being developed in public. Try it and come join us in helping make it!

= Assistant Features =

*   Access the Assistant UI from any frontend page (post, archive, term, etc...)
*   Get a glance of your recently edited posts on the home screen.
*   Search WordPress directly from the frontend.
*   Quickly find posts, pages, and custom post types with the content app.
*   Upload media to WordPress media library by dropping files on the Media app.
*   The Comments app lets you quick reply, approve, mark as spam and trash comments.
*   Keep an eye on plugin and theme updates with the Updates app.
*   Add custom labels to posts or pages to help organize your site while you work.

You can also try Assistant on a [demo site here](http://demo.wpbeaverbuilder.com/?new=assistant).

== Installation ==

1. Install Assistant via the WordPress plugin directory or by uploading the files to your server at wp-content/plugins.

2. After activating Assistant on the Plugins screen, navigate to the front end of your website.

3. Assistant will be open. You can dismiss it using the x icon in the top right corner.

4. A small pencil icon will appear in the bottom right corner. Clicking it will show Assistant.

5. Use the icons across the top of the panel to navigate between the different apps.


== Screenshots ==

1. Home App - Get a quick info about the current screen and recent posts. Quickly jump into search, the WP Admin or other Assistant apps.

2. Content App - The Content app can help you find posts and pages and quickly navigate to them.

3. Post Details - Get more details on a page or quickly change metadata like Title or Featured Image.

4. Media App - Find media fast, get more details, or drop new files to upload.

5. Attachment Details - update metadata like Title and Alt Text. Navigate to attachment pages.

6. Comments App - Sort through comments, reply, approve, mark as spam, and trash.

7. Pin the panel to whatever edge or corner of the screen you prefer for quick access. Collapse it to a slim toolbar or hide it entirely.


== Frequently Asked Questions ==

= Is Assistant Free? =

Yes! All of the core Assistant features are free and will remain so.

= Does Assistant require Beaver Builder to work? =

No! Assistant is a standalone plugin and can be used with any WordPress 5.0+ installation. Assistant does compliment Beaver Builder and integrates with it nicely.

= Does Assistant provide a public API for developers to create new apps? =

Coming Soon! Our API for creating new apps and extending the existing ones is in development and we'll be talking more about it as we near v1.0. We'll be sharing more details about that as we get closer to that milestone.


== Changelog ==

= 1.4.0 ( 2023-03-20 ) =
* The Assistant Pro community is here! See it in action at: [https://app.assistant.pro/community](https://app.assistant.pro/community)
* Browse templates and website assets from directly within WordPress with the new community app.
* Share, sell, and purchase libraries of templates and website assets.

= 1.3.9 ( 2023-03-07 ) =
* Fixed library item screenshots not working correctly when updating an item.
* Various minor fixes and enhancements.

= 1.3.8 ( 2023-02-09 ) =
* Fixed library item screenshots not working correctly.

= 1.3.7 ( 2023-02-07 ) =
* Allow access to library settings for importing all items in a community library.
* Fixed post media not uploading to libraries for posts with more media than defined in max_file_uploads.
* Fixed SEO Press causing header and footer images to upload to libraries for posts.
* Fixed various UI bugs and inconsistencies.

= 1.3.6 ( 2023-01-17 ) =
* Allow access to library settings for importing all items in a shared library.

= 1.3.5 ( 2022-12-06 ) =
* Added library support for Astra theme customizer settings.

= 1.3.4 ( 2022-11-28 ) =
* Fixed importing to override a post in wp-admin.
* Fixed thumb styling for code items in wp-admin.
* Fixed large code items slowing down the browser.

= 1.3.3 ( 2022-11-21 ) =
* Fixed downloading items from private libraries.

= 1.3.2 ( 2022-11-03 ) =
* Fixes for the upcoming Assistant Pro community and marketplace.

= 1.3.1 ( 2022-10-31 ) =
* Fixed creating private libraries.

= 1.3 ( 2022-10-24 ) =
* Changes to support the upcoming Assistant Pro community and marketplace. Details coming soon!

= 1.2.2 ( 2022-09-01 ) =
* Fixed remote images not showing in screenshots when exporting library items locally.
* Fixed importing a library item and overriding the current page showing the old draft when editing in BB.

= 1.2.1 ( 2022-08-24 ) =
* Added the ability to create JSON and plain text code snippets in libraries.
* Added support for loading Beaver Builder in an iframe.
* Improved the file size of WordPress export files when exporting from the content app.

= 1.2.0 ( 2022-07-20 ) =
* Added the ability to upload PDF and rich text documents to libraries.

= 1.1.0 ( 2022-06-28 ) =
* Added the ability to download image and svg library items.
* Fixed library sorting not working in the libraries app.
* Fixed customizer settings not importing for parent themes.
* Fixed a fatal error with PHP 8 when updating an author profile.

= 1.0.10 ( 2022-06-21 ) =
* Added the ability to [update library items](https://docs.wpbeaverbuilder.com/assistant/plugin/apps/libraries/#update) with content from the current post or page.
* Added the ability to [import library items](https://docs.wpbeaverbuilder.com/assistant/plugin/apps/libraries/#import-content-1) to override the content of the current post or page.
* Fixed categories and tags not always importing correctly from a library.

= 1.0.9 ( 2022-06-09 ) =
* Fixed intermittent logout issues with Assistant Pro.
* Fixed PHP notice when importing templates.
* Fixed PHP 5.6 error with labels.
* Show "Added" when a template has finished being added to a library.
* Renamed core "Templates" post type to "Block Templates" to prevent confusion with other template post types.
* Removed favorite button from the content app.

= 1.0.8 ( 2022-05-16 ) =
* Minor improvements and fixes for library code snippets.
* Creating a new library now defaults to private for paid accounts.

= 1.0.7 ( 2022-04-19 ) =
* Added the ability to save code snippets to Assistant Pro libraries.

= 1.0.6 ( 2022-03-15 ) =
* Added content app and library support for full-site editing templates.

= 1.0.5 ( 2022-02-22 ) =
* Added a description field to library items.
* Changed library description field to a textarea.
* Misc CSS fixes.

= 1.0.4 ( 2022-02-02 ) =
* Fixed issues with using Assistant within Divi.
* Fixed Visual Composer and Elementor system post types showing in the Content app.

= 1.0.3 ( 2022-01-12 ) =
* Added fl_assistant_should_enqueue filter.
* Fixed cloud logging out on connected sites installed on the same domain.
* Fixed 'View' action showing in the content app for post types that aren't public on the frontend.
* Fixed filenames when exporting a post.

= 1.0.2 ( 2021-11-08 ) =
* Private libraries are now the default for paid accounts.
* Fixed customizer settings not importing for child themes with different directory names.
* Fixed broken admin URLs when WordPress is installed in a subdirectory.
* Fixed issues with single post XML export.
* Fixed issues with Oxygen.

= 1.0.1 ( 2021-11-01 ) =
* Allow private libraries for unpaid accounts to be viewed in read-only mode.

= 1.0.0 ( 2021-10-26 ) =
* Assistant Pro is here! You can now organize your templates, images, svg artwork and colors into libraries that you can then access from all your WordPress sites.
* Added profile menu to the libraries app.
* Added profile menu item for disconnecting from the Assistant Pro cloud.
* Reworked cloud connection to only work for the original WordPress user that made the connection.
* Fixed cloud disconnecting when refreshing right after connecting.

= 0.7.1 ( 2021-10-19 ) =
* Fixed caching issues when updating the plugin to a new version.

= 0.7.0.9 ( 2021-09-30 ) =
* Fixed SVG in posts not importing.
* Fixed post media not importing when importing an entire library.
* Fixed Beaver Builder rows importing as layout templates.

= 0.7.0.8 ( 2021-09-28 ) =
* Added save to library functionality within the content app.
* Set posts imported from the cloud to published instead of draft.
* Prevent post screenshots being imported as featured images.
* Fixed server timeout when importing posts with a lot of media.
* Fixed errors with exporting Customizer settings.
* Fixed issues with connecting to the cloud.
* Fixed miscellaneous React errors.

= 0.7.0.7 ( 2021-09-01 ) =
* Updated Assistant Pro cloud URLs to production.

= 0.7.0.6 ( 2021-08-16 ) =
* Fixed fatal error on user profile page with PHP 8.
* Fixed fatal error when exporting theme settings to Assistant Pro.

= 0.7.0.5 ( 2021-07-28 ) =
* Fixed fatal error with PHP 7.0.33 and below.

= 0.7.0.4 ( 2021-07-27 ) =
* Fixed various PHP warnings.

= 0.7.0.3 ( 2021-06-23 ) =
* Fixed conflict with jQuery AJAX requests.

= 0.7.0.2 ( 2021-06-08 ) =
* Fixed fatal error when updating user profile settings.

= 0.7.0.1 ( 2021-05-26 ) =
* Fixed error in the content app.

= 0.7.0 ( 2021-05-20 ) =
* Panel Size - The panel can now resize to give you more space!
* New Home App - Things are more easily glanceable on the new home screen.
* You can now drop media directly on the "Media" home screen section to upload.
* Labels App - Labels is no longer a separate app. You can now manage your labels from the Settings app.
* Fixed issue where screen goes blank after disabling an app
* Libraries App (beta) - Coming Soon: Assistant Pro will let you create libraries to share templates and assets across all your WordPress sites. Contact us if you're interested in beta testing Assistant Pro!

= 0.6.0 ( 2021-01-28 ) =
* Enhance media uploading UI
* Improve drag performance of the UI frame.
* Refine overall visual appearance
* Style hardening against Twenty Twenty-One theme
* Add ground work for upcoming Assistant Pro features
* Various bug fixes

= 0.5.1 ( 2020-06-05 ) =
* Fix issue where sidebar shows incorrect number of app icons
* Add item marks & actions to recent content widgets
* Add link to "View All" from recent content widgets
* Fix issue with home tooltip

= 0.5.0 ( 2020-06-02 ) =
* All New Home + Search app
* All new comments app - reply to comments right in the list
* Apps now load their UI on-demand
* Drag the apps to reorder them
* Apps now remain hidden or visible between page refreshes instead of auto-hiding
* Numerous performance enhancements

= 0.4.2 ( 2020-05-15 ) =
* Fixed Beaver Builder edit links not showing in the content app.

= 0.4.1 ( 2020-05-12 ) =
* Fixed Assistant not loading on hosts with heartbeat disabled (such as WP Engine).
* Fixed media library scripts loading while logged out.

= 0.4.0 ( 2020-04-17 ) =
* Added access to all public post types inside content app
* Refined post detail screen layout
* Added ability to query posts by label
* Added ability to query attachments by label
* Fix showing publish bar when favoriting a post
* Added notice bar and removed confirmation alerts
* Added ability to export post from post detail screen
* Refined labels picker control
* Added calendar control to edit publish date

= 0.3.1 (2020-03-27) =
* Harden form control styles
* Remove Assistant button from Beaver Builder toolbar (too soon!)
* Fix updates list not loading correctly in some situations
* Enhancement - Made publish bar more prominent
* Fix attachment alt text field displaying title

= 0.3.0 (2020-03-25) =
* Complete ground-up rebuild
* All new apps for working with Content, Media, Comments & Updates
* Add custom labels to posts and pages to help you organize your site

= 0.2.2 (2019-04-16) =

* Fix "Show Dashboard App" button not working
* Edit actions on dashboard now open in same tab

= 0.2.1 (2019-04-15) =

* Dramatically reduce js bundle size
* Style Hardening
* Improve Error Handling
* Fix date archives showing "Untitled" in Dashboard app
* Fix first time experience for Dashboard app
* Fix user list for multisite admins

= 0.2.0 (2019-04-12) =

* Overall design iteration
* Added ability to stub new posts, pages, categories and tags.
* Added Update detail screen.

= 0.1.0 =

* Initial Public Build
