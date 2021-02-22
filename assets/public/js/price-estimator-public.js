(function( $ ) {
	'use strict';
	
/*	 $(document).ready(function () {

		$('.r-1').click(function () {
	        // $('.roller_blind').removeClass('sclaes');
	        $('.roll-one').addClass('sclaes');
	    });

	}
*/

$(function () {
    $.shopkart();
});

 $(function () {
    $("#pe-zip-submit-btn").click(function () {
    	var validcode = [ 60003, 60004, 60005 ];
        var code = $('#pe-zip-input').val(); 
        for (var i = 0; i < validcode.length; i++) {                       
        if (code == validcode[i]) {        	
            $(".junk-items").show();
            $(".booking-form").show();
            $(".alert-message").hide();
            break;
        } 
        else if(code != validcode[i]){
        	$(".alert-message").show();
        	$(".junk-items").hide(); 
            $(".booking-form").hide();
        }
        else {
            $(".junk-items").hide(); 
            $(".booking-form").hide();
            $(".alert-message").hide();
        }}
    });

  });



})( jQuery );
