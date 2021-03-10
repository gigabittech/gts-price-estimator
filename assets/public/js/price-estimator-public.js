(function($) {
  'use strict';

  $(function() {
    $.shopkart();
  });

  $(function() {
    $("#pe-zip-submit-btn").click(function() {
      var validcode = [92656,92801,92802,92803,92804,92805,92806,92807,92821,92823,90620,90621,92626,92627,92679,90630,90630,92708,92831,92832,92833,92835,92840,92841,92843,92844,92845,92648,92649,92612,92614,92617,92618,92620,92602,92603,92604,92606,90631,90623,92694,92651,92653,92677,92637,92630,92610,90720,92755,92692,92692,92657,92660,92661,92662,92663,92623];
      var code = $('#pe-zip-input').val();
      for (var i = 0; i < validcode.length; i++) {
        if (code == validcode[i]) {
          $(".junk-items").show();
          $(".booking-form").show();
          $(".alert-success-message").show();
          $(".alert-message").hide();
          //$('.zip_code').val(code);
          $('input[name="price_estimate_zip_code"]').val(code)
          break;
        } else if (code != validcode[i]) {
          $(".alert-message").show();          
          $(".junk-items").hide();
          $(".booking-form").hide();
          $(".alert-success-message").hide();
        } else {
          $(".junk-items").hide();          
          $(".booking-form").hide();
          $(".alert-success-message").hide();
          $(".alert-message").hide();
        }
      }
    });

  });
  
  function renderCart(items) {
    const $cart = document.querySelector(".cart")
    const $total = document.querySelector(".total")
    $cart.innerHTML = items.map((item) => `
            Item Name: ${item.name}                        
            `).join("")

  }
  renderCart(cartLS.list())
  cartLS.onChange(renderCart)

})(jQuery);