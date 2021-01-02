<?php


//Find me ShortCode
function thenobility_find_location_shortcode($atts, $content = null)
{
    
    $location_find_array = cs_get_option('footer_location_find_array');
    
    
    if (!empty($location_find_array)) {
        $thenobility_location_find_markup = '<ul>';
        
        foreach ($location_find_array as $location_find) {
            $thenobility_location_find_markup .=  '<li>'.'<i class="'.esc_html($location_find['footer_location_icon']).'" ></i> '.$location_find['footer_location_detail'] .'</li>'; 
        }
        
        $thenobility_location_find_markup .= '</ul>';
    } else {
        $thenobility_location_find_markup .= '';
    }
    
    return $thenobility_location_find_markup;
}
add_shortcode('find_location', 'thenobility_find_location_shortcode');

?>
