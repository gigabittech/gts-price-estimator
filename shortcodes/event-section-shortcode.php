<?php

//Event Section ShortCode
function thenobility_event_section_shortcode($atts)
{
    extract(shortcode_atts(array(        
        'id' => '',        
        'event_section_title' => '',               
        'event_location_icon' => '',               
        'event_section_location_detail' => '',               
        'event_date_icon' => '',               
        'event_date_detail' => '',               
        'event_section_description' => '',               
        'event_section_link' => '',               
    ), $atts));
    

    $thenobility_event_section_markup = '<div class="event-content">' ;
    
    $thenobility_event_section_markup .= '<h3>'.$event_section_title.'</h3>';
    $thenobility_event_section_markup .= '<h6>'.'<i class="'.$event_location_icon.'"></i>'.$event_section_location_detail. '<i class="'.$event_date_icon.'"></i>'.$event_date_detail.'</h6>';

    $thenobility_event_section_markup .= '<p>'.$event_section_description.'</p>';

    $thenobility_event_section_markup .= '<a class="savechild-btn event-btn" href="'.$event_section_link.'">'.'Read More'. '<i class="fa fa-angle-right" aria-hidden="true"></i></a>';
    

    $thenobility_event_section_markup .= '</div>'; 

    
    return $thenobility_event_section_markup;
}
add_shortcode('thenobility_event_section', 'thenobility_event_section_shortcode');

?>