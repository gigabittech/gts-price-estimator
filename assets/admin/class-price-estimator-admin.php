<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/princ-imran
 * @since      1.0.0
 *
 * @package    Price_Estimator
 * @subpackage Price_Estimator/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Price_Estimator
 * @subpackage Price_Estimator/admin
 * @author     Imran Hoshain <princ.imran@gmail.com>
 */
class Price_Estimator_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Price_Estimator_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Price_Estimator_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
        //wp_enqueue_style('jquery-ui', plugins_url('/css/jquery-ui.css', __FILE__));
		//wp_enqueue_style( 'ui', plugin_dir_url( __FILE__ ) . 'css/jquery-ui.css', array(), $this->version, 'aldl' );
        wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/price-estimator-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Price_Estimator_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Price_Estimator_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
        //wp_enqueue_script('jquery-ui-tabs');
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/price-estimator-admin.js', array( 'jquery' ), $this->version, false );        
        

	}


// Register Custom Post Type
public function price_estimator() {

    $labels = array(
        'name'                  => _x( 'Price Estimator', 'Post Type General Name', 'text_domain' ),
        //'singular_name'         => _x( 'Price Estimator', 'Post Type Singular Name', 'text_domain' ),        
		'menu_name'             => __( 'Price Estimator', 'text_domain' ),
       	'name_admin_bar'        => __( 'Price Estimator', 'text_domain' ),       			
        'add_new_item'          => __( 'Add New Item', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Item', 'text_domain' ),        
        'update_item'           => __( 'Update Item', 'text_domain' ),
        'view_item'             => __( 'View Item', 'text_domain' ),
        'view_items'            => __( 'View Items', 'text_domain' ),       
        'search_items'          => __( 'Search Item', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),        
        'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
        'items_list'            => __( 'Items list', 'text_domain' ),
        'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
    );
    $args = array(        
        'labels'                => $labels,		
        'menu_icon'				=> __('dashicons-money-alt', 'text_domain'),
        'taxonomies'         => array( 'price_estimator_cat', 'post_tag' ),
        'supports' => array(
            'title',
            'editor',
            'thumbnail',
            'custom-fields',
            'excerpt'
        ),
		'capabilities' => array(
		'create_posts' => 'do_not_allow',		
	  	),
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => false,        
        'publicly_queryable'    => false,
		'all_items' => false,
        'capability_type'       => 'page',        
    );
    register_post_type( 'price-estimator', $args );

}


function price_estimator_taxonomy() {
  $labels = array(
    'name'              => _x( 'Items & Prices', 'taxonomy general name' ),
    'singular_name'     => _x( 'Item & Price', 'taxonomy singular name' ),
    'search_items'      => __( 'Search Item Categories' ),
    'all_items'         => __( 'All Item Categories' ),
    'parent_item'       => __( 'Parent Item Category' ),
    'parent_item_colon' => __( 'Parent Item Category:' ),
    'edit_item'         => __( 'Edit Item Category' ), 
    'update_item'       => __( 'Update Item Category' ),
    'add_new_item'      => __( 'Add New Item Category' ),
    'new_item_name'     => __( 'New Item Category' ),
    'menu_name'         => __( 'Items & Prices' ),
    
  );
  $args = array(
    'labels' => $labels,
    'hierarchical' => true,   
    'query_var'             => true,
    'show_admin_column'     => true,
    'rewrite'               => array(
                'slug'              => 'price_estimator_cat', 
                'with_front'    	=> true 
                )
  );
  register_taxonomy( 'price_estimator_cat', 'price-estimator', $args );
}

function create_topics_nonhierarchical_taxonomy() {
 
// Labels part for the GUI
  $labels = array(
    'name'              => _x( 'Popup Option', 'taxonomy general name' ),
    'singular_name'     => _x( 'Iteml Category', 'taxonomy singular name' ),
    'search_items'      => __( 'Search lItem Categories' ),
    'all_items'         => __( 'All Item Categories' ),
    'parent_item'       => __( 'Parent Item Category' ),
    'parent_item_colon' => __( 'Parent Item Category:' ),
    'edit_item'         => __( 'Edit Item Category' ), 
    'update_item'       => __( 'Update Item Category' ),
    'add_new_item'      => __( 'Add New Item Category' ),
    'new_item_name'     => __( 'New Item Category' ),
    'menu_name'         => __( 'Item Categories' ),
    
  );
  $args = array(
    'labels' => $labels,
    'hierarchical' => true,
    'query_var'             => true,
    'show_admin_column'     => true,
    'rewrite'               => array(
                'slug'              => 'popup_option', 
                'with_front'        => true 
                )
  );
  register_taxonomy( 'popup_option', 'price-estimator', 'attachment', $args );
}
    private $popup_setting_options;
    public function price_estimat_form_setting() {
        add_submenu_page( 'edit.php?post_type=price-estimator', 'Settings', 'Settings', 'manage_options', 'price-estimator-setting', array(&$this, 'popup_setting_create_admin_page'));
        
    }

    public function popup_setting_create_admin_page() {
        $this->popup_setting_options = get_option( 'popup_setting_option_name' ); ?>

        <div class="wrap">
            <h2>Popup Setting</h2>
            <?php settings_errors(); ?>                        
            <div class="postbox">
                <div class="price-estimator-option">
                    <div class="my-plugin-option">
                        <h4>You can use the shortcode on your post, pages and text widgets.</h4>
                        <textarea class="cmshortcodetextarea" id="cmsctxt" spellcheck="false">[price_estimator]</textarea>
                        
                        <div class="cmshowcase_buttons_area">
                            <span class="howto">You can use the full shortcode above directly on your page, but if you prefer you can save it, giving it an Alias instead, so you have a shorter version of the shortcode that you can load and edit in the future. The Alias name should be short and unique.</span>
                        </div>
                    </div>
                    <div class="other-form-option" style="margin-top: 40px;">
                        <h4>Using Fluent Form Shortcode</h4>
                        <span class="howto">Follw bellow example.</span>
                        <textarea cols="30" rows="8" class="cmshortcodetextarea" id="cmsctxt">[fluentform_modal form_id="1" btn_text="Book It" css_class="custom-class"]</textarea>
                        <form method="post" action="options.php">
                            <?php
                            settings_fields( 'popup_setting_option_group' );
                            do_settings_sections( 'popup-setting-admin' );
                            submit_button();
                            ?>
                        </form>
                    </div>                    
                </div>
            </div>
        </div>
    <?php }
    public function popup_setting_page_init() {
        register_setting(
            'popup_setting_option_group', // option_group
            'popup_setting_option_name', // option_name
            array( $this, 'popup_setting_sanitize' ) // sanitize_callback
        );

        add_settings_section(
            'popup_setting_setting_section', // id
            '', // Section title
            array( $this, 'popup_setting_section_info' ), // callback
            'popup-setting-admin' // page
        );

        add_settings_field(
            'price_estimate_form_class_id', // id
            'Fluent Form Popup Shortcode:', // title
            array( $this, 'price_estimate_form_class_id_callback' ), // callback
            'popup-setting-admin', // page
            'popup_setting_setting_section' // section
        );
    }

    public function popup_setting_sanitize($input) {
        $sanitary_values = array();
        if ( isset( $input['price_estimate_form_class_id'] ) ) {
            $sanitary_values['price_estimate_form_class_id'] = sanitize_text_field( $input['price_estimate_form_class_id'] );
        }

        return $sanitary_values;
    }

    public function popup_setting_section_info() {        
    }

    public function price_estimate_form_class_id_callback() {
        printf(
            '<input class="regular-text" type="text" name="popup_setting_option_name[price_estimate_form_class_id]" id="price_estimate_form_class_id" value="%s">',
            isset( $this->popup_setting_options['price_estimate_form_class_id'] ) ? esc_attr( $this->popup_setting_options['price_estimate_form_class_id']) : ''
        );
    }
 

}