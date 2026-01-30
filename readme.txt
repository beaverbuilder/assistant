=== Assistant - Every Day Productivity Apps ===
Contributors: justinbusa, RobbyMcCullough, billyyoung, brentjettgmailcom, pross, shahidajmeri22, codente
Tags: Assistant Pro, Beaver Builder, Page Builder, Gutenberg, Blocks
Requires at least: 5.2
Tested up to: 6.9
Requires PHP: 5.6
Stable tag: 1.5.3.2
License: GPL2+
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Assistant is a plugin that allows you to work more efficiently. It provides you shortcuts to common admin tasks on the front-end of your website.

== Description ==
Assistant is a free plugin that allows you to work more efficiently in WordPress. It’s a huge time saver and fun to use!
Assistant is a stand-alone tool that provides shortcuts to common tasks, and will help you work more freely without needing to go to the WordPress admin as much.

== Features ==

*   Access the front-end UI from anywhere (posts, pages, archives, etc...)
*   Get a glance of your recently edited posts on the home screen.
*   Search WordPress directly from the frontend.
*   Quickly find posts, pages, and custom post types with the content app.
*   Upload media to WordPress media library by dropping files on the Media app.
*   Keep an eye on comments and updates for themes and plugins
*   Add custom labels to posts or pages to help organize your site while you work.

The plugin also connects your sites to [Assistant Pro](https://assistant.pro/) - a cloud storage platform designed specifically for WordPress assets. Use the cloud to enhance staging/production workflow, streamline your design processes, and facilitate team collaboration. Assistant Pro is not just an awesome cloud storage platform, perfect for organizing and finding your favorite WordPress assets, it’s a better way of working across all your WordPress sites.

*   Store page builder and block editor templates you've created in the cloud. Works with the Block Editor and most popular WordPress page builders
*   Organize your site’s assets (media, posts, pages, page builder templates and WooCommerce products/coupons/orders) into libraries you can access from anywhere.
*   Works with a variety of common WordPress page builders (Gutenberg, Beaver Builder, Elementor, Divi and Visual Composer)
*   Delight your team with seamless staging to production workflows
*   It’s made by the Beaver Builder Team, which means awesome support!

You can also try Assistant on a [demo site here](http://demo.wpbeaverbuilder.com/?new=assistant).

== Installation ==

1. Install Assistant via the WordPress plugin directory or by uploading the files to your server at wp-content/plugins.

2. After activating Assistant on the Plugins screen, navigate to the front end of your website.

3. Assistant will be open. You can dismiss it using the x icon in the top right corner.

4. A small pencil icon will appear in the bottom right corner. Clicking it will show Assistant.

5. Use the icons across the top of the panel to navigate between the different apps.


== Screenshots ==

1. Do More With Less Clicks. The Home App gives you shortcuts to edit the page you’re currently viewing to perform common tasks from the frontend of your site. You can also take a bird’s eye view of your entire site from the Home App.

2. Libraries keep your WordPress assets organized and empower your team with carefree staging to production workflows.

3. The Community Marketplace is where you can monetize your design work and find free and for sale design packages.

4. Posts/Pages, WooCommerce Products, Page Templates and More! With Assistant, all of your site’s content can be accessed and edited from the frontend of WordPress.

5. Organize Your Media Library. Tag, sort and filter your WordPress media.

6. Manage Comments and Updates conveniently on the frontend.

7. Store Your WordPress Assets in The Cloud. Cloud storage can be accessed from both the WordPress Plugin and also a companion dashboard.


== Frequently Asked Questions ==

= Is Assistant Free? =

Yes! All of the core Assistant features are free and will remain so. For moving templates and assets between sites, we also offer Assistant Pro via a subscription.

= Does Assistant require Beaver Builder to work? =

No! Assistant is a standalone plugin and can be used with any WordPress 5.0+ installation. Assistant does complement Beaver Builder and integrates with it nicely.


== Changelog ==

= 1.5.3.2 ( 2026-01-28 ) =
* Fixed PHP warning for undefined array key when updating profile
* Fixed PHP warning for constants already defined

= 1.5.3.1 ( 2025-10-29 ) =
* Fixed implicitly nullable parameter declaration deprecated notice in PHP 8.4
* Fixed redirection to libraries after connecting to Assistant Pro

= 1.5.3 ( 2025-09-08 ) =
* Changes to support the integration of Assistant in Beaver Builder version 2.10
* Fixed dark mode issues on the Home app and sidebar.
* Security: Fixed a potential XSS vulnerability in the image proxy

= 1.5.2 ( 2025-05-12 ) =
* Change library limit for Free accounts from unlimited to 1. Existing free accounts will retain all of their libraries but new libraries will not be able to be created.
* Fix removing last collection on a library item in Assistant Pro
* Show error message when uploading library items that exceed the file size limit
* Minor UI fixes and notification rewording for clarity

= 1.5.1.1 ( 2025-02-19 ) =
* Fixed a potential PHP object vulnerability in the Create Post API.
* Fixed an issue with XML import on the same site when exported posts were unavailable.
* Fixed the code editor not loading in the Code App.
* Fixed a PHP warning that occurred during XML import.

= 1.5.1 ( 2025-02-05 ) =
* Add search when viewing a single library
* Fix error message when adding theme settings to a library
* Fix conflict with Search and Filter select field preventing a post/page being added to a library in the cloud

= 1.5.0.1 ( 2024-10-07 ) =
* Fix import message when importing a single item or entire library.

= 1.5.0 ( 2024-08-22 ) =
* Add Code App that enables you to create and edit CSS and JS code snippets, which you can assign to different sections of your website.
* Libraries App: Add selection mode to allow for bulk managing of library items including importing and deleting.
* Libraries App: Add ability to download zip of the library.
* Fix issue with Libraries app filter not always working correctly.
* Fix dark mode when importing.

= 1.4.9.2 ( 2024-04-03 ) =
* Fixed stored XML file security issue with exporting posts potentially exposing author information.

= 1.4.9.1 ( 2024-03-06 ) =
* Fix an issue with code snippets.

= 1.4.9 ( 2024-03-04 ) =
* Added ordering/re-ordering option for items in a library.
* Fixed Assistant not working with the SG Optimizer plugin.

= 1.4.8 ( 2023-12-13 ) =
* Fixed an error that occurred when accessing libraries containing items with no thumbnails.

= 1.4.7 ( 2023-12-07 ) =
* Fixed SVG post thumbnails causing an error in Assistant Pro.

= 1.4.6 ( 2023-11-27 ) =
* Fixed webp images not exporting to Assistant Pro.
* Fixed images with filenames ending in an underscore not exporting to Assistant Pro.
* Fixed a PHP warning in the WordPress Playground.

= 1.4.5 ( 2023-10-30 ) =
* Fixed alt tags for images exported to Assistant Pro.
* Fixed saving images to a library from the media app.
* Fixed translation slugs for wp.org.
* Fixed library search so it finds case insensitive matches.
* Fixed collapsing library sections.

= 1.4.4 ( 2023-07-26 ) =
* Added the ability to save all posts of a type to a library.
* Added the ability to save posts to a library by uploading an XML export file.
* Fixed selecting library items when the page has been scrolled.
* Fixed Assistant not working with the SG Optimizer plugin.
* Fixed connecting to the cloud from within Elementor.
* Fixed potential SSRF vulnerability with taking library item screenshots.

= 1.4.3 ( 2023-05-17 ) =
* Minor fixes and improvements to the Assistant Pro community.
* Fixed importing Kadence theme settings causing a fatal error.
* Fixed user profile options not staying saved.

= 1.4.2 ( 2023-04-18 ) =
* Minor fixes and improvements to the Assistant Pro community.

= 1.4.1 ( 2023-04-05 ) =
* Added new libraries view to the community app.
* Added uploader warning about public libraries for free account users.
* Fixed community purchase button for users not connected to Assistant Pro.

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
