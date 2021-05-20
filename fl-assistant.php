<?php
/*
 * Plugin Name: Assistant
 * Author: The Beaver Builder Team
 * Author URI: https://www.wpbeaverbuilder.com/?utm_medium=assistant&utm_source=plugins-admin-page&utm_campaign=plugins-admin-author
 * Version: 0.7.0
 * Description: A tool for navigating a site and accomplishing quick tasks without needing the WordPress admin.
 * License: GNU General Public License v2.0
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fl-assistant
 * Copyright: (c) 2021 Beaver Builder
*/

defined( 'ABSPATH' ) || die();

define( 'FL_ASSISTANT_VERSION', '0.7.0' );
define( 'FL_ASSISTANT_FILE', trailingslashit( __FILE__ ) );
define( 'FL_ASSISTANT_DIR', plugin_dir_path( FL_ASSISTANT_FILE ) );
define( 'FL_ASSISTANT_URL', plugins_url( '/', FL_ASSISTANT_FILE ) );
define( 'FL_ASST_SUPPORTS_BB', true );

require_once( __DIR__ . '/backend/autoloader.php' );

new FL\Assistant\System\Plugin( __FILE__ );
