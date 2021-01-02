<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://github.com/princ-imran
 * @since             1.0.0
 * @package           price-estimator
 *
 * @wordpress-plugin
 * Plugin Name:       Price Estimator
 * Plugin URI:        https://github.com/princ-imran/price-estimator
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Imran Hoshain
 * Author URI:        https://github.com/princ-imran
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       price-estimator
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'PRICE_ESTIMATOR_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-price-estimator-activator.php
 */
function activate_price_estimator() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-price-estimator-activator.php';
	Price_Estimator_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-price-estimator-deactivator.php
 */
function deactivate_price_estimator() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-price-estimator-deactivator.php';
	Price_Estimator_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_price_estimator' );
register_deactivation_hook( __FILE__, 'deactivate_price_estimator' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-price-estimator.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_price_estimator() {

	$plugin = new price_estimator();
	$plugin->run();

}
run_price_estimator();