<?php

//Gallery Section ShortCode
function thenobility_gallery_section_shortcode($atts)
{
    extract(shortcode_atts(array(        
        'id' => '',        
        'gallery_image' => '',               
        'gallery_columns' => '',               
    ), $atts));
    

    $thenobility_gallery_section_markup = '<div class="row">' ;
    
    foreach ( $gallery_image as $image ) {      
 
    $thenobility_gallery_section_markup .= '<div class="col-md-'.$gallery_columns.'"><div class="single-gallery"><img src="' . $image['url'] . '" alt="image"></div></div>'; 
         
    }

   $thenobility_gallery_section_markup .= '</div>'; 

    
    return $thenobility_gallery_section_markup;
}
add_shortcode('thenobility_gallery_section', 'thenobility_gallery_section_shortcode');

?>