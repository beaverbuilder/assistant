<?php
/**
 * PHPUnit bootstrap file
 *
 * @package FL\Assistant
 */

$plugin_dir = dirname(dirname(__DIR__));

putenv("WP_PHPUNIT_DIR={$plugin_dir}/vendor/wp-phpunit/wp-phpunit");

// Composer autoloader must be loaded before WP_PHPUNIT__DIR will be available
require_once $plugin_dir . '/vendor/autoload.php';

// Give access to tests_add_filter() function.
require_once getenv( 'WP_PHPUNIT__DIR' ) . '/includes/functions.php';
tests_add_filter( 'muplugins_loaded', function() use ($plugin_dir) {
	// test set up, plugin activation, etc.
	require $plugin_dir . '/fl-assistant.php';
} );
// Start up the WP testing environment.
require getenv( 'WP_PHPUNIT__DIR' ) . '/includes/bootstrap.php';
