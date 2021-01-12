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
        wp_enqueue_script( "price-estimator-public", plugin_dir_url( __FILE__ ) . 'js/price-estimator-public.js', array( 'jquery' ), $this->version, true );        

    }


//Custom Taxonomy OR Catagory Function


//Slider ShortCode Function
public function price_estimator_shortcode($args) {
 
                   


                    


 $loop = new WP_Query($args);
 if($loop->have_posts()) {
    //echo '<h2 class="terms-title">'.$custom_term->name.'</h2>';
   // echo "<li>".$value->name."</li>";
    echo '<ul class="post-list">';
    while($loop->have_posts()) : $loop->the_post();
        echo '<li><a href="'.get_permalink().'" title="'.get_the_title().'" target="_blank">'.get_the_title().'</a></li>';
    endwhile;
    echo "</ul>";
 }



/*
 $terms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false, ));  ?>
        <div class="category_all">
            <div class="categor">
                <?php 
                echo "<ol>";
                 //get parent category term id $term->term_id            
                foreach ( $terms as $term ) {
                    if ($term->parent == 0 ) {
                     echo "<li>";                       
                     echo $term->name; // Parent Category Name 
                         echo "<ul>";
                         $subterms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false,'parent'=> $term->term_id));

                        //get child category term id $value->term_id
                        foreach ($subterms as $key => $value) 
                        {
                           echo "<li>".$value->name."</li>"; // Child Category Name 
                        }
                        echo "</ul>";                       
                    echo "</li>";
                    }                   

                    }
                    echo "</ol>";
            ?>
        </div>
    </div>


        
 */   ?>
<!-- Pricing Area Start -->
    <section class="pricing">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 pb-5">
                    <h3>Pricing Estimator</h3>
                </div>
                <div class="col-lg-4 col-md-6">
                    <h3>Step 1: Enter zip code</h3>
                </div>

                <div class="col-lg-4 col-md-6">
                    <form>
                      <div class="form-row">
                        <div class="col-auto">
                          <input type="text" name="price_zip_code" class="form-control mb-2" id="inlineFormInput" placeholder="Jane Doe">
                        </div>
                        <div class="col-auto">
                          <button type="submit" class="btn btn-primary mb-2">Go</button>
                        </div>
                      </div>
                    </form> 
                </div>

                <div class="col-lg-4">
                    
                </div>

                <div class="col-lg-10 pt-5 pb-5">
                    <h3>Step 2: Click on your items for a free estimate</h3>
                </div>
                
            </div>

            <div class="row tab-area">
                <div class="col-lg-4 col-md-6">
                    <nav>
                      <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">By List Item</a>
                        <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">By TruckLoad</a>
                      </div>
                    </nav>
                </div>

                <div class="col-lg-4 col-md-3 text-center button-area">
                    <button type="button">Reset</button>
                </div>

                <div class="col-lg-4 col-md-3  text-center button-area">
                    <button type="button" data-toggle="modal" data-target="#exampleModal">Book It</button>

                    <?php 
                    get_the_title();
                    
                    if($_POST['price_zip_code'] == get_the_title()){ ?>
                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            <h4 class="modal-title text-center" id="exampleModalLabel"> BOOK ONLINE & SAVE $20!*</h4>
                            <p>*excludes jobs $99 and under</p>     
                            <form action="">
                              <div class="form-row">
                                <div class="form-group col-md-12">
                                  <input type="text" class="form-control" placeholder="First & Name Name">
                                </div>
                                <div class="form-group col-md-12">
                                  <input type="text" class="form-control" placeholder="Address">
                                </div>
                                <div class="form-group col-md-6">
                                  <input type="number" class="form-control" id="inputEmail4" placeholder="Postal Code">
                                </div>

                                <div class="form-group col-md-6">
                                  <input type="number" class="form-control" id="inputEmail4" placeholder="Phone Number">
                                </div>

                                <div class="form-group col-md-12">
                                  <input type="email" class="form-control" id="inputEmail4" placeholder="Email">
                                </div>
                              </div>
                              <div class="form-group">
                                <input type="date" class="form-control" id="inputAddress" placeholder="1234 Main St">
                              </div>
                              <button type="submit" class="btn">Book IT</button>
                            </form>

                          </div>
                        </div>
                      </div>
                    </div>
                <?php } ?>
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
                              <h5 class="mb-0">
                                <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                  <h4><?php echo $term->name; ?></h4>
                                </button>
                              </h5>
                            </div>
                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                              <div class="card-body">
                                <?php $subterms = get_terms(array('taxonomy'=> 'price_estimator_cat','hide_empty' => false,'parent'=> $term->term_id));
                        foreach ($subterms as $key => $value)
                        {


                        }}?>
                               <p><?php echo $value->name;?></p>
                              </div>
                            </div>
                          </div>
                

                                                  
                        </div>

                      </div>
                      <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
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
    //endwhile;    
    
    wp_reset_query();    
  
}
}
public function register_shortcodes(){
  add_shortcode( 'price_estimator', array( $this, 'price_estimator_shortcode') );
}



