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
        wp_enqueue_script( 'cart-localstorage', plugin_dir_url( __FILE__ ) . 'js/cart-localstorage.min.js', array( 'jquery' ), $this->version, true );
		wp_enqueue_script( "price-estimator-public", plugin_dir_url( __FILE__ ) . 'js/price-estimator-public.js', array( 'jquery' ), $this->version, true );
        wp_enqueue_script( "new-estimate", plugin_dir_url( __FILE__ ) . 'js/new-estimate.js', array( 'jquery' ), $this->version, true );
	}

//Slider ShortCode Function
public function price_estimator_shortcode($args) {
    $popup_setting_options = get_option( 'popup_setting_option_name' ); // Array of All Options
    $popup_class_id = $popup_setting_options['price_estimate_form_class_id']; //
?>
<!-- Pricing Area Start -->
<section class="pricing">
    <div class="inner-cont pad-b-30 pad-t-30 priceing_calculation">
        <div class="container">
            <div class="load_and_pricing_tabs_row">

                <div class="load_and_pricing_tabs">

                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation"><a class="active" href="#priceing_by_load_content"
                                aria-controls="priceing_by_load_content" role="tab" data-toggle="tab"
                                aria-expanded="true">Price By Items</a></li>
                        <li role="presentation" class=""><a href="#pricing_only" aria-controls="pricing_only" role="tab"
                                data-toggle="tab" aria-expanded="false">Price by Load</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="priceing_by_load_content">
                            <div class="row Price_by_load_Contents">
                                <div class="col-md-8 padding0">

                                    <div class="price-by-load">

                                        <div class="panel-group get_all_qty_text_value accordion" id="accordion"
                                            role="tablist" aria-multiselectable="true">

                                            <?php $terms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false, ));
                                                foreach ( $terms as $term ) {
                                                if ($term->parent == 0 ) {?>
                                            <div class="panel panel-default">
                                                <div class="panel-heading" id="headingOne">
                                                    <h2 class="panel-title">
                                                        <button type="button" data-toggle="collapse"
                                                            data-target="#<?php echo $term->slug;?>" aria-expanded="true"
                                                            aria-controls="<?php echo $term->slug;?>">
                                                            <?php echo $term->name;?>
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="<?php echo $term->slug;?>" class="collapse show" aria-labelledby="headingOne"
                                                    data-parent="#accordion">
                                                    <div class="panel-body">
                                                        <ul class="j-list <?php echo $term->slug; echo '_prices'?> all_price_list">

                                                            <?php $subterms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false,'parent'=> $term->term_id));
                                                                foreach ($subterms as $key => $value)
                                                                {?>            
                                                            <?php $estimate_price = $value->description;

                                                            $start_end_price = (explode("-",$estimate_price));
                                                            ?>
                                                              <li class="<?php echo $value->slug;?> price_list ">
                                                                <!-- <figure><img src="images/couch.png">
                                                                </figure> -->
                                                                <span><?php echo $value->name;?></span>
                                                                <div class="qnt">
                                                                    <a href="javascript:void(0)" class="dec"><i onclick="cartLS.quantity(<?php echo $value->term_id;?>,-1)"
                                                                            class="fa fa-minus" data-start="<?php echo $start_end_price[0];?>" data-end="<?php echo $start_end_price[1];?>" ></i></a>
                                                                    <input type="text" class="product_qty_amount"
                                                                        disabled="" value="0" 
                                                                        data-id="<?php echo $term->slug;?>">
                                                                    <a href="javascript:void(0)" class="inc"><i
                                                                            class="fa fa-plus" data-start="<?php echo $start_end_price[0];?>" data-end="<?php echo $start_end_price[1];?>" onClick="cartLS.add({id: <?php echo $value->term_id;?>, name: '<?php echo $value->name;?>', price: <?php echo $value->description;?>})" id="<?php echo $value->slug;?>"></i></a>

                                                                </div>
                                                            </li>
                                                            <?php }?>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <?php }}?>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4 padding-right0">
                                    <div class="estimated estimate_price set_sidebar_qty_and_estimate_price">
                                        <ul class="price-list cart">
                                            
                                        </ul>
                                        <div class="price custom_price">
                                            <div>Estimated Price</div>
                                            <div style="margin-top:10px;">
                                                <span class="start_price">$0</span>
                                                <span> - </span>
                                                <span class="end_price">$0</span>
                                            </div>

                                        </div>

                                        <small>This is an estimate only and includes the $30 discount. Our truck team
                                            will give you a free, no-obligation price at your location.</small>
                                        <div class="clearfix"></div>
                                        <br>
                                            <div class="booking-form">
                                                    <?php if (!empty($popup_class_id)){?>
                                                    <?php echo do_shortcode($popup_class_id); ?>
                                                    
                                                    <?php } else{?>
                                                    <button class="" type="button" data-toggle="modal" data-target="#price_form">BOOK ONLINE</button>
                                                    <?php }?>
                                            </div>
                                        <br>
                                        <a href="javascript:void(0)" id="reset_data" onClick="cartLS.destroy()" class="reset_data reset_options_data"
                                            style="color:red"><b>Reset Options</b></a>
                                        <div class="clearfix"></div>
                                        or call
                                        <div class="call"><a href="tel:7143090201">(714) 309-0201</a></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div role="tabpanel" class="tab-pane" id="pricing_only">
                            <div class="row price_by_fixed_load_content">

                                <div class="col-sm-12">
                                    <div>
                                       * 1 Grizly Junk Truck = 6 Regular Pickup Truck Loads
                                    </div>
                                </div>

                                <!-- Left Bar -->
                                <div class="col-md-8 col-xs-12 com-sm-12 padding0">
                                    <div class="clearfix"></div>
                                    <div class="box_type_container">
                                        <div>
                                            <ul class="price single_load_pricings">
                                                <li class="active">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="75" data-end="80">Single Item Pickup</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="120" data-end="150">1/8</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="160" data-end="180">1/6</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="195" data-end="230">1/4</div>
                                                            <div class="priceing_content">2 full size pick up trucks
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="235" data-end="250">1/3</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="280" data-end="325">3/8</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="325" data-end="360">1/2</div>
                                                            <div class="priceing_content">4 full size pick up trucks
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="375" data-end="399">5/8</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="450" data-end="500">2/3</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="">
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="500" data-end="560">3/4</div>
                                                            <div class="priceing_content">6 full size pick up trucks
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="580" data-end="650">5/6</div>
                                                            <div class="priceing_content"></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="text-center display_table">
                                                        <div class="vertical_align">
                                                            <div class="priceing_title" data-type="double"
                                                                data-start="680" data-end="760">Full Load</div>
                                                            <div class="priceing_content">11 pickup trucks
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <!-- Left Bar -->

                                <!-- Right Bar -->
                                <div class="col-md-4 padding-right0">
                                    <div class="estimated estimate_price set_single_sidebar_qty_and_estimate_price">

                                        <div class="price custom_price">
                                            <div>Estimated Price</div>
                                            <div style="margin-top: 10px; display: none;" class="range_price">
                                                <span class="start_price" style="display: none;"></span>
                                                <span> - </span>
                                                <span class="end_price" style="display: none;"></span>
                                            </div>
                                            <div style="margin-top: 10px; display: block;" class="single_price">$0
                                            </div>
                                        </div>

                                        <small>This is an estimate only and includes the $30 online discount.Our truck
                                            team will give you a free, no-obligation price at your location.</small>

                                        <div class="clearfix"></div>

                                       <br>
                                            <div class="booking-form">
                                                <?php if (!empty($popup_class_id)){?>
                                                <?php echo do_shortcode($popup_class_id); ?>
                                                
                                                <?php } else{?>
                                                <button class="" type="button" data-toggle="modal" data-target="#price_form">BOOK ONLINE</button>
                                                <?php }?>
                                            </div>
                                        <br>
                                        <a href="javascript:void(0)" id="reset_data" onClick="cartLS.destroy()" class="reset_single_options_data"
                                            style="color:red"><b>Reset Options</b></a>
                                        <div class="clearfix"></div>
                                        or call

                                         <div class="call"><a href="tel:7143090201">(714) 309-0201</a></div>
                                        <small>Prices shown here are a rough estimate and include the $30 discount.Want
                                            to describe your needs in more detail? Get a custom quote.</small>
                                    </div>
                                </div>

                                <!-- Right Bar -->



                                <div class="col-sm-12 pt-5"> 
                                    <div class="tab-2-cont">
                                        <div class="tab-head">Our trucks are <span>25% larger</span> than our
                                            competitors trucks!</div>
                                        <p class="margin20">Our price list is a basic estimate.</p>
                                        <p>In many cases, we will need to come out and see your job in order to give you
                                            an exact price.* <span style="color:#ff7f00"><b><a href="tel:7143090201">(714) 309-0201</a></b></span></p>
                                        <div class="bloks">Excludes bulky item pickups</div>
                                        <div class="bloks">Prices may vary due to weight </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

    <!-- modal -->
    <div class="modal fade" id="price_form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body mb-3">
                    <h4 class="modal-title text-center" id="exampleModalLabel">BOOK ONLINE & SAVE $20!*</h4>
                    <p class="text-center">*excludes jobs $99 and under</p>
                    <form action="<?php echo plugin_dir_url( _DIR_ ).'public/send.php';?>" method="POST"
                        enctype="multipart/form-data">
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <input type="text" name="first_last_name" class="form-control"
                                    placeholder="First & Name Name">
                            </div>
                            <div class="form-group col-md-12">
                                <input type="email" name="email" class="form-control" placeholder="Enter your email">
                            </div>
                            <div class="form-group col-md-6">
                                <input type="number" name="price_estimate_zip_code" class="form-control"
                                    id="price_estimate_zip_code">
                            </div>
                            <div class="form-group col-md-6">
                                <input type="number" name="phone_number" class="form-control" id="phone_number"
                                    placeholder="Phone Number">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-12" data-kart="display">
                                <h5 class="text-left mt-2">Price by list item</h5>
                                <textarea class="form-control" rows="2" data-kart-total-price=""
                                    name="total_price">$0.00</textarea>
                            </div>
                            <div class="form-group col-md-12">
                                <h5 class="text-left mt-2">Price by truck load</h5>
                                <input type="text" name="amountInput" class="form-control textnumber" min="10" max="100"
                                    step="1" value="0" />
                            </div>
                            <div class="form-group col-md-12">
                                <textarea name="price_estimate_item_name" class="cart truck-load-items form-control"
                                    rows="6"></textarea>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Book IT</button>
                    </form>
                </div>
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