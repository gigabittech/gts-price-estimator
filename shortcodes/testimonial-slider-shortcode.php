<?php

//Custom Slider Taxonomy OR Catagory
function thenobility_testi_slide_taxonomy() {
    register_taxonomy(
        'testi_slide_cat',  
        'testi-slider', //Your Post type here                 
        array(
            'hierarchical'          => true,
            'label'                 => 'Testi Slider Category',  
            'query_var'             => true,
            'show_admin_column'     => true,
            'rewrite'               => array(
                'slug'              => 'testi_slide_category', 
                'with_front'    => true 
                )
            )
    );
}
add_action( 'init', 'thenobility_testi_slide_taxonomy');


//Custom Taxonomy OR Catagory Function
function thenobility_testi_slider_category(){
    $slide_categories = get_terms('testi_slide_cat'); //Enter category Name
    $slide_category_options = array('' => esc_html__('All Catagory', 'thenobility-toolkit'));
    if($slide_categories){
        foreach ($slide_categories as $slide_category) {
            $slide_category_options[$slide_category->term_id] = $slide_category->name;
        }
    }
    return $slide_category_options;
}

//Slider ShortCode Function
function thenobility_testi_slider_shortcode($atts)
{
    extract(shortcode_atts(array(
        'count' => '',
        'category' => '',
        'loop' => 'true',
        'dots' => 'true',
        'nav' => 'true',
        'autoplay' => 'true',
        'autoplayTimeout' => 5000
        
    ), $atts));
    
    if (!empty($category)) {
        $arg = array(
            'post_type' => 'testi-slider',
            'posts_per_page' => $count,
            'tax_query' => array(
                array(
                    'taxonomy' => 'testi_slide_cat', //Enter Register Taxonomy
                    'field' => 'term_id', //Enter your term name
                    'terms' => $category
                )
            )
        );
    } else {
        $arg = array(
            'post_type' => 'testi-slider',
            'posts_per_page' => $count
        );
    }
    
    
    $get_post = new WP_Query($arg);    
    
    $slide_rendom_number = rand(630441, 630442);
    
    $thenobility_testi_slider_markup = '
    <script>
        jQuery(window).load(function ($) {
            jQuery("#thenobility-testi-slide' . $slide_rendom_number . '").owlCarousel({
            items: 1,
            loop: ' . $loop . ',            
            dots: ' . $dots . ',            
            nav: ' . $nav . ',            
            autoplay: ' . $autoplay . ',            
            autoplayTimeout: ' . $autoplayTimeout . ',            
            navText: ["<i class=\'fa fa-angle-left\'></i>", "<i class=\'fa fa-angle-right\'></i>"],
                 
        });   

    });
    </script>    

    <div id="thenobility-testi-slide' . $slide_rendom_number . '" class="owl-carousel thenobility_testi_slider">';
    while ($get_post->have_posts()):
        $get_post->the_post();
        $post_id = get_the_ID();
            
 
        $thenobility_testi_slider_markup .= '           
            
            <div class="justify-content-center">
                <div class="text-center">
                    <div class="testimonial-content">
                        <img src="'.get_the_post_thumbnail_url(get_the_ID(),'thumbnail').'" alt="image">
                        <p>' . wpautop(get_the_content($post_id)) . '</p>
                        <h5>' . get_the_title($post_id) . '</h5>
                        <h6>'.get_the_excerpt($post_id).'</h6>
                    </div>
                </div>
            </div>
        
        ';
    
    
       
    endwhile;
    $thenobility_testi_slider_markup .= '</div>';
    
    wp_reset_query();
    
    return $thenobility_testi_slider_markup;
    
}
add_shortcode('thenobility_testi_slider', 'thenobility_testi_slider_shortcode');