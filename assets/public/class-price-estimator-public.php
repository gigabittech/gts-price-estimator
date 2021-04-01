<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://github.com/princ-imran
 * @since      1.0.0
 *
 * @package    Price_Estimator
 * @subpackage Price_Estimator/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Price_Estimator
 * @subpackage Price_Estimator/public
 * @author     Imran Hoshain <princ.imran@gmail.com>
 */
define('VERSION', time());

class Price_Estimator_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = time();

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( 'bootstrap-min', plugin_dir_url( __FILE__ ) . 'css/bootstrap.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/price-estimator-public.css', array(), $this->version, 'all' );				

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( 'bootstrap-min', plugin_dir_url( __FILE__ ) . 'js/bootstrap.min.js', array( 'jquery' ), $this->version, true );
		wp_enqueue_script( 'shopkart', plugin_dir_url( __FILE__ ) . 'js/shopkart.js', array( 'jquery' ), $this->version, true );
        wp_enqueue_script( 'cart-localstorage', plugin_dir_url( __FILE__ ) . 'js/cart-localstorage.min.js', array( 'jquery' ), $this->version, true );
		wp_enqueue_script( "price-estimator-public", plugin_dir_url( __FILE__ ) . 'js/price-estimator-public.js', array( 'jquery' ), $this->version, true );
	}

//Slider ShortCode Function
public function price_estimator_shortcode($args) {
    $popup_setting_options = get_option( 'popup_setting_option_name' ); // Array of All Options
    $popup_class_id = $popup_setting_options['price_estimate_form_class_id']; //
?>
<!-- Pricing Area Start -->
<section class="pricing">
    <div class="container">

        <div class="row">
            <div class="col-lg-4 col-md-4">
                <h3 class="step-1">Step 1: Enter zip code</h3>
            </div>
            <div class="col-lg-4 col-md-6">                              
                <form>
                    <div class="form-row">
                        <form method="post" id="myForm">
                            <div class="col-auto">
                                <input id="pe-zip-input" class="form-control mb-2 zipcode_1 postal-code" type="text" value="" maxlength="7" placeholder="92656">
                            </div>
                            <div class="col-auto">
                                <button id="pe-zip-submit-btn" type="button" name="submit" class="btn btn-primary mb-2" value="Go">Go</button>
                            </div>
                        </form>
                    </div>
                </form>
            </div>
            <div class="col-lg-4 col-md-4">
                <div class="alert-message" style="display: none;">
                    <h4>Sorry, we don't serve in your area!
                    </h4>
                </div>
                <div class="alert-success-message" style="display: none;">
                    <h4>Yay, we serve in your area!
                    </h4>
                </div>
            </div>
        </div>                
        <div class="row">
            <div class="col-lg-8 pt-5 pb-5">
                <h3 class="step-2">Step 2: Click on your items for a free estimate</h3>
            </div>
            <div class="col-lg-4 pt-5 pb-5">
                <div class="show-price" data-kart="display">
                    <span data-kart-total-price="0"></span>
                </div>
            </div>
        </div>

        <div class="row tab-area" id="disabled-div">
            <div class="col-lg-4 col-md-6">
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">By List Item</a>                        
                        <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">By TruckLoad</a>                        
                    </div>
                </nav>
            </div>
            <div class="col-lg-4 col-md-3 text-center button-area">
                <button type="button" class="reset_data" id="reset_data" onClick="cartLS.destroy()">Reset</button>
            </div>
            <div class="col-lg-4 col-md-3  text-center button-area">
                <div class="booking-form" style="display:none;">
                    <?php if (!empty($popup_class_id)){?>
                    <?php echo do_shortcode($popup_class_id); ?>
                    
                    <?php } else{?>
                    <button class="" type="button" data-toggle="modal" data-target="#price_form">Book It</button>
                    <?php }?>
                </div>
                <div class="modal fade" id="price_form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h4 class="modal-title text-center" id="exampleModalLabel">BOOK ONLINE & SAVE $20!*</h4>
                                <p>*excludes jobs $99 and under</p>
                                <form action="<?php echo plugin_dir_url( __DIR__ ).'public/send.php';?>" method="POST" enctype="multipart/form-data">
                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <input type="text" name="first_last_name" class="form-control" placeholder="First & Name Name">
                                        </div>
                                        <div class="form-group col-md-12">
                                            <input type="email" name="email" class="form-control" placeholder="Enter your email">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <input type="number" name="price_estimate_zip_code" class="form-control" id="price_estimate_zip_code">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <input type="number" name="phone_number" class="form-control" id="phone_number" placeholder="Phone Number">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-12" data-kart="display">
                                        <h5 class="text-left mt-2 text-white">Price by list item</h5>
                                        <textarea rows="2" data-kart-total-price="" name="total_price">$0.00</textarea>
                                        </div>
                                        <div class="form-group col-md-12">
                                            <h5 class="text-left mt-2 text-white">Price by truck load</h5>
                                            <input type="text" name="amountInput" class="form-control textnumber" min="10" max="100" step="1" value="0"/>
                                        </div>
                                        <div class="form-group col-md-12">
                                            <textarea name="price_estimate_item_name" class="cart truck-load-items" cols="30" rows="6"></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn">Book IT</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Modals End -->
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        <div id="accordion">
                            <?php $terms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false, ));                            
                            foreach ( $terms as $term ) {
                            if ($term->parent == 0 ) {?>
                            <div class="card">
                                <div class="card-header" id="headingOne">
                                    <button class="btn btn-link" data-toggle="collapse" data-target="#<?php echo $term->slug;?>" aria-expanded="true" aria-controls="collapseOne">
                                    <h4><?php echo $term->name;?></h4>
                                    </button>
                                </div>
                                <div id="<?php echo $term->slug;?>" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                    <div class="card-body">
                                        <?php $subterms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false,'parent'=> $term->term_id));
                                        foreach ($subterms as $key => $value)
                                        {?>
                                        
                                        <li value="<?php echo $value->name;?>" class="junk-items reset_data" style="display:none;"><span><?php echo $value->name;?></span>
                                        <button class="junk-item-btn" data-kart="item-button" data-kart-item-status="add-item" data-kart-item='{"id": <?php echo $value->term_id;?>, "price": <?php echo $value->description;?>}' onClick="cartLS.add({id: <?php echo $value->term_id;?>, name: '<?php echo $value->name;?>', price: <?php echo $value->description;?>})" id="<?php echo $value->slug;?>">Add this item</button><?php }?>
                                        </li>
                                    </div>
                                </div>
                            </div>
                        <?php }}?>
                        </div>
                    </div>              
            
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                        <div class="truck-load-section booking-form" style="display: none;">
                            <div class="row" style="background: #fff;">
                                <div class="col-md-12 text-center">
                                    <h6>
                                    <span>*</span>
                                    <span class="jk-red">1</span>
                                    <span>&nbsp;Grizly Junk Truck =&nbsp;</span>
                                    <span class="jk-red">6&nbsp;</span>
                                    <span>Regular Pickup Truck Loads</span>
                                    </h6>
                                </div>
                            </div>
                            <div class="row" id="row-pickup-trucks">
                                <div class="col-md-6 col-xs-6 truckload" id="pickups-full-counter">
                                    <div class="add-full-truck">
                                        <img src="<?php echo plugin_dir_url( __FILE__ ) . 'images/pickup-truck-full.png'?>">
                                    </div>
                                    <div class="btn-group" role="group">
                                        <a class="btn btn-xs minus-btn" class="remove-full" id="remove-full" role="button">
                                            <img value="-" onclick="truckLS.quantity(1,-1)"src="<?php echo plugin_dir_url( __FILE__ ) . 'images/ico-btn-minus.svg'?>">
                                        </a>
                                        <a class="btn btn-xs plus-btn" id="">
                                            <img class="junk-item-btn" onClick="truckLS.add({id: 1, name: 'Add Full Track', price: '0'})" value="+" id="add-full" src="<?php echo plugin_dir_url( __FILE__ ) . 'images/ico-btn-solid-plus.svg'?>">
                                        </a>
                                    </div>
                                </div>
                                <div class="col-md-6 col-xs-6 truckload" id="pickups-half-counter">
                                    <div class="add-half-truck">
                                        <img src="<?php echo plugin_dir_url( __FILE__ ) . 'images/pickup-truck-half.png'?>">
                                    </div>
                                    <div class="btn-group" role="group">
                                        <a class="btn btn-xs minus-btn" id="remove-half" role="button">
                                            <img id="" onclick="truckLS.quantity(2,-1)" value="-" src="<?php echo plugin_dir_url( __FILE__ ) . 'images/ico-btn-minus.svg'?>">
                                        </a>
                                        <a class="btn btn-xs plus-btn" role="button">
                                            <img id="add-half" value="+"  src="<?php echo plugin_dir_url( __FILE__ ) . 'images/ico-btn-solid-plus.svg'?>" onClick="truckLS.add({id: 2, name: 'Add Half Truck', price: '0'})">
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="row inner-shadow">
                                <div class="col-md-12 jk-truck-bg">
                                    <div id="jk-truck-container">
                                        <div class="jk-truck-image text-center">
                                            <img class="main-truck" src="<?php echo plugin_dir_url( __FILE__ ) . 'images/junk-king-truck.png'?>">
                                            <div id="truckload">
                                                <input class="truck-ball" type="range" name="amountRange" id="points" value="0" min="10" max="100" step="1"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="estimate-price-show">
                                        <h3>Your Estimate: <span>$</span><input type="text" name="amountInput" class="textnumber" min="10" max="100" step="1" value="0"/></h3>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>    
        <div class="row">        
            <div class="col-lg-12 step-3">            
                <p>This pricing estimator provides an online estimate. The final price will be determined onsite by our staff. The price for heavy material, such as dirt, gravel, roofing material, and concrete, cannot be estimated with this tool as this material is charged by the bed load.</p>
                <h3>Step 3: BOOK ONLINE & Save $20 or Call <a href="tel: 18888885865"> 1-888-888-JUNK (5865)</a></h3>
            </div>
        </div>
    </div>
</section>
<!-- Pricing Area End -->
<?php
    wp_reset_query();
}

public function register_shortcodes(){
  add_shortcode( 'price_estimator', array( $this, 'price_estimator_shortcode') );
}

}