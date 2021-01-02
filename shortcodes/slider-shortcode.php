<?php

//Custom Slider Taxonomy OR Catagory
function thenobility_custom_post_taxonomy() {
    register_taxonomy(
        'slide_cat',  
        'thenobility-slide', //Your Post type here                 
        array(
            'hierarchical'          => true,
            'label'                 => 'Slider Category',  
            'query_var'             => true,
            'show_admin_column'     => true,
            'rewrite'               => array(
                'slug'              => 'slide_category', 
                'with_front'    => true 
                )
            )
    );
}
add_action( 'init', 'thenobility_custom_post_taxonomy');


//Custom Taxonomy OR Catagory Function
function thenobility_theme_slider_category(){
    $slide_categories = get_terms('slide_cat'); //Enter category Name
    $slide_category_options = array('' => esc_html__('All Catagory', 'upbuild-toolkit'));
    if($slide_categories){
        foreach ($slide_categories as $slide_category) {
            $slide_category_options[$slide_category->term_id] = $slide_category->name;
        }
    }
    return $slide_category_options;
}

//Slider ShortCode Function
function thenobility_slider_shortcode($atts)
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
            'post_type' => 'thenobility-slide',
            'posts_per_page' => $count,
            'tax_query' => array(
                array(
                    'taxonomy' => 'slide_cat', //Enter Register Taxonomy
                    'field' => 'term_id', //Enter your term name
                    'terms' => $category
                )
            )
        );
    } else {
        $arg = array(
            'post_type' => 'thenobility-slide',
            'posts_per_page' => $count
        );
    }
    
    
    $get_post = new WP_Query($arg);    
    
    $slide_rendom_number = rand(630437, 630438);
    
    $thenobility_slider_markup = '
    <script>
        jQuery(window).load(function ($) {
            jQuery("#thenobility-slide' . $slide_rendom_number . '").owlCarousel({
            items: 1,
            loop: ' . $loop . ',            
            dots: ' . $dots . ',            
            nav: ' . $nav . ',            
            autoplay: ' . $autoplay . ',            
            autoplayTimeout: ' . $autoplayTimeout . ',            
            navText: ["<i class=\'fa fa-angle-left\'></i>", "<i class=\'fa fa-angle-right\'></i>"],
                 
        });
        jQuery(".thenobility-slider-preloder" ).fadeOut( 5000 );

    });
    </script>

    <div class="thenobility-slider-wrapper">
        <div class="thenobility-slider-preloder">
            <span class="preloader-circle-wrapper">
                <i class="fa fa-cog fa-spin"></i>
            </span>
        </div>

    <div id="thenobility-slide' . $slide_rendom_number . '" class="owl-carousel thenobility_slider">';
    while ($get_post->have_posts()):
        $get_post->the_post();
        $post_id = get_the_ID();
        
        //Slider warnning condition solve From theme meta option
        if (get_post_meta($post_id, 'thenobility_slide_meta', true)) {
            $slide_meta = get_post_meta($post_id, 'thenobility_slide_meta', true);
        } else {
            $slide_meta = array();
        }
    
        //Custom color change            
        if (array_key_exists('text_color', $slide_meta)) {
            $text_color = $slide_meta['text_color'];
        } else {
            $text_color = '#333';
        }
        
        //Custom Overlay           
        if (array_key_exists('enable_overlay', $slide_meta)) {
            $enable_overlay = $slide_meta['enable_overlay'];
        } else {
            $enable_overlay = 'false';
        }
        
        //Custom opacity Color          
        if (array_key_exists('overlay_color', $slide_meta)) {
            $overlay_color = $slide_meta['overlay_color'];
        } else {
            $overlay_color = '#333';
        }
        
        //Custom opacity           
        if (array_key_exists('overlay_opacity', $slide_meta)) {
            $overlay_opacity = $slide_meta['overlay_opacity'];
        } else {
            $overlay_opacity = '70';
        }
        
        //Custom SLider text Width           
        if (array_key_exists('slider_width', $slide_meta)) {
            $slider_width = $slide_meta['slider_width'];
        } else {
            $slider_width = 'col-md-6';
        }
        
        //Custom SLider Offset            
        if (array_key_exists('slider_offset', $slide_meta)) {
            $slider_offset = $slide_meta['slider_offset'];
        } else {
            $slider_offset = 'no-offset';
        }
        
        //Custom SLider text align           
        if (array_key_exists('slider_text_align', $slide_meta)) {
            $slider_text_align = $slide_meta['slider_text_align'];
        } else {
            $slider_text_align = 'left';
        }
    
        //Custom SLider text align           
        if (array_key_exists('slider_button_link', $slide_meta)) {
            $slider_button_link = $slide_meta['slider_button_link'];
        } else {
            $slider_button_link = '#';
        }
    
 
        $thenobility_slider_markup .= '
            <div style="background-image:url(' . get_the_post_thumbnail_url($post_id, 'large') . ')" class="thenobility-single-slide">';
        if ($enable_overlay == true) {
            $thenobility_slider_markup .= '<div style="opacity:.' . $overlay_opacity . ';background-color:' . $overlay_color . ' " class="thenobility-slide-overlay"></div>';
        }
        $thenobility_slider_markup .= '<div class="thenobility-single-slide-inner">
                    <div class="container">
                        <div class="row justify-content-end">
                        <div class="viewport-content wow fadeInRight" style="color:' . $text_color . '" class="' . $slider_width . ' ' . $slider_offset . ' text-' . $slider_text_align . '">
                                <h1>' . get_the_title($post_id) . '</h1>
                               ' . wpautop(get_the_content($post_id)) . '                                
                                <a class="viewport-btn" href="'.$slider_button_link.'">Donate Now</a>
                            </div>                            
                        </div>
                    </div>
                </div>                
            </div>';
    endwhile;
    $thenobility_slider_markup .= '</div></div>';
    
    wp_reset_query();
    
    return $thenobility_slider_markup;
    
}
add_shortcode('thenobility_slider', 'thenobility_slider_shortcode');
