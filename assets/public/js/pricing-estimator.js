var isZipValidated = false;
function InitPricingEstimatorDialogPopup() {

	$('#pricing-tabs').show();

	if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
	    $.ajaxSetup({ cache: false });
	}

	//ZipCodeDialogPopUp();

    /* Zip Code Pop Up Start Estimate button Click Event*/
    $(document).on("keyup", '#pe-zip-input', function (e) {
        if (e.keyCode == 13) { $("#pe-zip-submit-btn").trigger("click"); }
	});
	$(document).on("click", "#disabled-div", function(e) {
		if($('#pe-zip-input').val() == "") {
			$("#ezd-message").text("Please enter a zip/postal code before using the pricing estimator.");
			$('html, body').animate({ scrollTop: $("#page-content-new").offset().top }, 1000);
			$("#enter-zip-dialog").modal("show");
		} else if (!isZipValidated) {
		    $("#ezd-message").text("Please enter a valid zip/postal code before using the pricing estimator.");
		    $('html, body').animate({ scrollTop: $("#page-content-new").offset().top }, 1000);
		    $("#enter-zip-dialog").modal("show");
		}
		else if (isZipValidated) {
		    $("#ezd-message").text("We're sorry but it looks like we do not yet service your location.");
		    $('html, body').animate({ scrollTop: $("#page-content-new").offset().top }, 1000);
		    $("#enter-zip-dialog").modal("show");
		}
    });
	$(document).on("click", "#enter-zip-dialog .btn-primary", function(e) {
		$('#pe-zip-input').focus();
	});	
	$("#pe-zip-submit-btn").click(function () {
	    resetView();
	    isZipValidated = true;
	    if ($('#pe-zip-input').val() == "") { isZipValidated = false; $('#zip-validation-msg').text('Please enter a zip/postal code.'); return; }
	    if (!IsValidZipPostalCode($("#pe-zip-input"))) { isZipValidated = false; $('#zip-validation-msg').text('Please enter a valid zip/postal code.'); return; }
		GetPricing();
    });

    $(document).on("click", "#re-submit-btn", function () {
        try {
            $('#estimate-request-msg').text("");
            var email = $('#re-email-tb').val();
            var phone = $('#re-phone-tb').val();
            if (email == "" && phone == "") {
                $('#estimate-request-msg').text("Please enter an email address or phone number.");
                return;
            }
            if (email != "" && !email.match(/\S+@\S+\.\S+/)) {
                $('#estimate-request-msg').text("Please enter a valid email address.");
                return;
            }
            if (phone != "" && !phone.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
                $('#estimate-request-msg').text("Please enter a valid phone number.");
                return;
            }
            var zip = $("#pe-zip-input").val();
            var details = $("#re-details-tb").val();
            $("#email-estimate-msg").text("");
            var d = $("#BONotesHF").val();
            var ci = (email != "") ? email : "";
            if (phone != "") ci += (ci != "" ? ", " : "") + phone;
            LogEvent("PricingEstimator: RequestQuote", ci);

            $.ajax({
                cache: false,
                type: "POST",
                data: JSON.stringify({ email: email, phone: phone, details: details, zip: zip, estimateInfo: d, userAgent: navigator.userAgent }),
                dataType: "json",
                contentType: "application/json",
                url: "/system/services/pricing-estimator.asmx/RequestQuote2",
                success: function (data, status, jqXHR) {
                    if (data.d == "Success") {
                        $("#estimate-request-dialog").modal("hide");
                        alert("Your request has been submitted and we will reply promptly with your quote.");
                    }
                    else {
                        $("#estimate-request-msg").text("An error occurred sending request.");
                    }
                },
                error: function (jqXHR, status, emsg) {
                    HandleJSError(jqXHR, "RequestQuote:error");
                    alert('An error occurred submitting ajax request.');
                }
            });

        } catch (ex) {
            HandleJSError(ex, "#re-submit-btn:click");
        }
    });
    try {
        var zip = GetQSParameterByName("zip");
        if (zip && zip != "") {
            $("#zip-input-hidden").val(zip);
            $('#pe-zip-input').val($("#zip-input-hidden").val());
            GetPricing();
        }
    } catch (ex) {
        HandleJSError(ex, "InitPE");
    }
}

/*  Function To Get the Estimated Price For Truckload */
function InitPricingEstimatorPickUpTruck() {
	$("#full_pickup_counter .max").click(function () {
        // Get its current value
        var currentVal = parseInt($('#full_pickup_counter span.total-full-pickup').html());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
        	$TotalCount = getTotalTruckloadsCount();
        	$TotalCount = $TotalCount+1;
        	if($TotalCount <= 6){
        		$('#full_pickup_counter span.total-full-pickup').html(currentVal + 1);
				$('#pickup_counter').append('<div class="btn btn-default full"><span class="min close">×</span> <span class="fullPickupIocnBg"></span></div>');
        	}
        	else {
        	    ShowLargeVolumeDialog();
	    	}
        } else {
            $('#full_pickup_counter span.total-full-pickup').html(0);
        }
        updateTruckloadsCount();
        GetPricePickUP(); // Function To Show Total Pick Up Price
	});
	$("#half_pickup_counter .max").click(function () {
        // Get its current value
        var currentVal = parseInt($('#half_pickup_counter span.total-small-pickup').html());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
        	$TotalCount = getTotalTruckloadsCount();
        	$TotalCount = $TotalCount + 0.5;
        	if($TotalCount <= 6){
        		$('#half_pickup_counter span.total-small-pickup').html(currentVal + 1);
				$('#pickup_counter').append('<div class="btn btn-default half"><span class="min close">×</span> <span class="halfPickupIocnBg"></span></div>');
        	}
        	else {
        	    ShowLargeVolumeDialog();
        	}
        } else {
            // Otherwise put a 0 there
            $('#half_pickup_counter span.total-small-pickup').html(0);
        }
        updateTruckloadsCount();
        GetPricePickUP(); // Function To Show Total Pick Up Price
	});
	$("#pickup_counter").on("click", ".full", function() {
		var current = $(this);
		var currentVal = parseInt($('#full_pickup_counter span.total-full-pickup').html());
		var full_pick_currentVal = currentVal;
		if (isNaN(full_pick_currentVal)){
			full_pick_currentVal = 0;
		}
        // If it isn't undefined or its greater than 0
        if ( (!isNaN(currentVal)) && (getTotalTruckloadsCount() > 0) && (full_pick_currentVal > 0) ) {
            // Decrement one
            $('#full_pickup_counter span.total-full-pickup').html(currentVal - 1);
			current.remove();
        } else {
            // Otherwise put a 0 there
            $('#full_pickup_counter span.total-full-pickup').html(0);
        }
        updateTruckloadsCount();
        GetPricePickUP(); // Function To Show Total Pick Up Price
	});
	$("#pickup_counter").on("click", ".half", function() {
		var current = $(this);
		var currentVal = parseInt($('#half_pickup_counter span.total-small-pickup').html());
		var half_pick_currentVal = currentVal;
		if (isNaN(half_pick_currentVal)){
			half_pick_currentVal = 0;
		}
        if ( (!isNaN(currentVal)) && (getTotalTruckloadsCount() > 0) && (half_pick_currentVal > 0) ) {
            // Decrement one
            $('#half_pickup_counter span.total-small-pickup').html(currentVal - 1);
			current.remove();
        } else {
            // Otherwise put a 0 there
            $('#half_pickup_counter span.total-small-pickup').html(0);
        }
        updateTruckloadsCount();
        GetPricePickUP(); // Function To Show Total Pick Up Price
	});

	function getTotalTruckloadsCount(){
		var half_pick_up_val = parseInt($('#half_pickup_counter span.total-small-pickup').html());
		var full_pick_up_val = parseInt($('#full_pickup_counter span.total-full-pickup').html());
		if (isNaN(half_pick_up_val)){
			half_pick_up_val = 0;
		}
		if (isNaN(full_pick_up_val)){
			full_pick_up_val = 0;
		}
		var totalTruckloadsCount = full_pick_up_val + (half_pick_up_val/2);
		return totalTruckloadsCount;
	}
	function updateTruckloadsCount(){
		var total = getTotalTruckloadsCount();
		$('.pickup').html(total);
		FillupjunkKingTruck(total.toString());
		/*if (parseFloat(total) > 0 && $("#pe-truck").hasClass("pe-truck")) $("#pe-truck").removeClass("pe-truck").addClass("pe-truck-empty");
		else if (parseFloat(total) == 0 && $("#pe-truck").hasClass("pe-truck-empty")) $("#pe-truck").removeClass("pe-truck-empty").addClass("pe-truck");*/
		$("#truck-cont").empty();
		for (var i = 0; i < parseInt(total) ; i++) {
		    $("#truck-cont").append('<img src="/images/pricing-estimator/full-pickup.png" />');
		}
		if(parseFloat(total) % 1 == .5) {
		    $("#truck-cont").append('<img src="/images/pricing-estimator/half-pickup.png" />');
		}
	}

	 $(document).on("click", "#book_online_trucks", function (e) {
		 var volume = parseFloat($(".pickup").html());
		 if (volume > 0) {
             var pricing = $("#pricing-data").data("pd").Pricing;
             var pIdx = Math.floor(volume / .5);
             var startingPrice = Math.floor(pricing[pIdx].StartingPrice).toFixed(2);
             var endingPrice = Math.floor(pricing[pIdx].EndingPrice).toFixed(2);
             //if ($("#zip-input-hidden").val() == "") {
             //    if (pIdx == 1) {
             //        endingPrice -= 30.00;
             //    } else if (pIdx > 1) {
             //        startingPrice -= 30.00;
             //        endingPrice -= 30.00;
             //    }
             //}
         }
		 if($(".pickup").html() == 0){
		 	alert("Please add at least one half pick up truck to book online.");
		 }
		 else{
			if ($("#zip-input-hidden").val() == "") {
				var disclaimer = $(".disclaimer");
				disclaimer.show();
				//var top = Math.max($(window).scrollTop() + 80 - parseInt($(".disclaimer").offset().top), 0);
				var top = $(window).scrollTop() - disclaimer.parent().offset().top + 20;
				$(".disclaimer").css("top", top + "px");
				$(".modal-form-overlay").show();

				if ($("#zip-input-hidden").val() == "") {
                    GATrackEvent('PricingEstimator', 'PriceByTruck', volume + '|' + pricing[pIdx].StartingPrice.toFixed(2) + '|' + pricing[pIdx].EndingPrice.toFixed(2));
		            LogEvent("PricingEstimator: GetPickupPrice", GetPIState());
		        }
			}
			e.preventDefault();
          }
	 });

	 $(".reset-link-volume").bind("click", function (e) {
	     e.preventDefault();
		 $('.pickupTruckProgessBg').css('width', '0');
		 $('.pickupTruckProgessBg div').text("");
         $(".endRangeValue1, #pickup_counter").html("");
         $(".pickup, .total-full-pickup, .total-small-pickup").html("0");
         $(".discount-disclaimer, .disclaimerTooltip").hide();
		 $('.truckload .value span').css('visibility', 'hidden');
		 $('.startRangeValue1').text('$0').css('visibility', 'visible');
		 $("#truck-cont").empty();
	 });
}

/*  Function To Get the Estimated Price For Items */
function InitPricingEstimatorItems(){

	  //household-items.js
    var items = [];
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: "/system/services/pricing-estimator.asmx/GetItemsJSON2",
        success: function (data, status, jqXHR) {
            items = $.parseJSON(data.d);
        },
        error: function (jqXHR, status, emsg) {
            HandleJSError(jqXHR, "GetItemsJSON:error");
            alert('An error occurred submitting ajax request.');
        }
    });
    try {
        var id = 0;
        var step = 0;
        var incVal = 3;
        $.each(items.categories, function (key, val) {
            if (items[val.categoryName]) {
                var categoryText = val.categoryName;
                var catWithoutUnderscore = categoryText.replace("_", "");
                var catWithSpace = categoryText.replace(/_/g, ' ').replace('and', '&');
				var str = '';
				str += '<div class="panel panel-default">';
				str += '<div class="panel-heading" role="tab" id="heading' + catWithoutUnderscore + '"><h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + catWithoutUnderscore + '" aria-expanded="false';
				//if(key === 0) { str += 'true'; } else { str += 'false'; }
				str += '" aria-controls="collapse' + catWithoutUnderscore + '"><span class="header' + catWithoutUnderscore + ' product_name">'+ catWithSpace + '</span> <span class ="' +catWithoutUnderscore+'CountInputTotal rightAccordionValueSpan"></span></a></h4></div>';
				str += '<div id="collapse' + catWithoutUnderscore + '" class="panel-collapse collapse';
				//if(key === 0) { str += ' in'; }
				str += '" role="tabpanel" aria-labelledby="heading' + catWithoutUnderscore + '"><div class="panel-body">';
				str += '<div class="row"><div class="col-sm-6 col-sm-push-6"><div id="' + catWithoutUnderscore + 'Counter"></div></div><div class="col-sm-6 col-sm-pull-6 ' + catWithoutUnderscore + '"></div></div>';
				str += '</div></div></div>';

				$("#accordion").append(str);

                incVal++;
                var className = "." + catWithoutUnderscore;
                var subtotalId = "Total" + catWithoutUnderscore;
                var countId = "Count" + catWithoutUnderscore;

                // add input tag to show no. of select items count of each category
                $('.header' + catWithoutUnderscore).append('<input id="' + countId + '" class="subitems" type="hidden" value="0" />');
                // add input tag to show volume of each category
                $('.header' + catWithoutUnderscore).append('<input id="' + subtotalId + '" class="subtotal" type="hidden" value="0" />');

                var summaryInputClass = catWithoutUnderscore + "SummaryInput";
                var countInputClass = catWithoutUnderscore + "CountInput";
                var parameterSummary = summaryInputClass + "-" + subtotalId + "-" + countInputClass + "-" + countId;

                // loop to create show each item of individual categories.
                $.each(items[val.categoryName], function (key1, val1) {
                    var commId = id++;
					var str = '<div class="innerContainer"><div class="common-container"><input id="' + commId + '" class="hidden inputText ' + step + ' ' + parameterSummary + '" type="text" value="0"></input> <input id="' + (id++) + '" class="hidden" type="text" value="' + val1.volume + '"></input> <input id="' + (id++) + '" class="' + summaryInputClass + ' hidden item-volume-input" type="text" value="0"></input> <span id="' + (id++) + '" class="hidden item-count-input ' + countInputClass + '">0</span> <a class="up ' + step + ' ' + parameterSummary + '" data-parent="' + catWithSpace + '" data-category="' + catWithoutUnderscore + 'Counter"><span class="btn btn-default">' + val1.name + '</span></a> </div><div class="clear"></div> </div>';

					$(className).append(str);

                    step = id;
                });
            }
        });
    } catch (ex) {
        HandleJSError(ex, "InitItems");
    }

    $(document).on("click", ".up", function () {
        try {
			var item = $(this).children().text();
			var cat = $(this).attr('data-category');
			var parent = $(this).attr('data-parent');
            var classes = $(this).attr("class");
            classes = classes.replace(/\-/g, ' ');
            var splitValues = classes.split(" ");
            var sequenceStart = parseInt(splitValues[1]);

            incId = "#" + sequenceStart;
            amountId = "#" + (sequenceStart + 1);
            volumeId = "#" + (sequenceStart + 2);
            countId = "#" + (sequenceStart + 3);

            countValue = parseInt($(incId).val());
            countValue += 1;
            amount = parseFloat($(amountId).val());
            volume = countValue * amount;

            var calculatedVolume = parseFloat($(".totalAmount").html());
            calculatedVolume = calculatedVolume - ((countValue - 1) * amount) + volume;
            if (calculatedVolume > 1) {
                ShowLargeVolumeDialog();
                return;
            }

            var commClass = ".right" + sequenceStart;
            $(commClass).html(countValue);
            $(incId).val(countValue);
            $(volumeId).val(volume);
            $(countId).html(countValue);

            calculateVolume(splitValues[2], splitValues[3], splitValues[4], splitValues[5]);

			$('#' + cat).append('<div class="btn btn-default btn-down"><div class="' + $(this).attr("class").replace('up','down') + '" data-parent="' + parent + '" data-item="' + item + '"><span class="min close">×</span> ' + item + '</div></div>');

			if($('#pe-summary-items ul').text().indexOf(parent) != -1) {
				if($('#pe-summary-items .item').text().indexOf(item) != -1) {
					if($('#pe-summary-items .item[data-item="' + item + '"] .counter').contents().length == 0) {
						$('#pe-summary-items .item[data-item="' + item + '"] .counter').text(' (2)');
					} else {
						var count = $('#pe-summary-items .item[data-item="' + item + '"] .counter').text();
						count = parseInt(count.replace ( /[^\d.]/g, '' )) + 1;
						$('#pe-summary-items .item[data-item="' + item + '"] .counter').text(' (' + count + ')');
					}
				} else {
					$('#pe-summary-items ul li[data-parent="' + parent + '"]').append('<div class="item" data-item="' + item + '">' + item + '<span class="counter"></span></div>');
				}
			} else {
				$('#pe-summary-items ul').append('<li data-parent="' + parent + '"><strong>' + parent + ':</strong> <div class="item" data-item="' + item + '">' + item + '<span class="counter"></span></div></li>');
			}


            GetPriceRange();  // function to get total items price range

        } catch (ex) {
            HandleJSError(ex, ".up:click");
        }
    });
    $(document).on("click", ".down", function () {
        try {
			var item = $(this).attr("data-item");
			var parent = $(this).attr("data-parent");
			var classes = $(this).attr("class");
            classes = classes.replace(/\-/g, ' ');
            var splitValues = classes.split(" ");
            var sequenceStart = parseInt(splitValues[1]);

            incId = "#" + sequenceStart;
            amountId = "#" + (sequenceStart + 1);
            volumeId = "#" + (sequenceStart + 2);
            countId = "#" + (sequenceStart + 3);

            countValue = parseInt($(incId).val());
            if (countValue > 0) {
                countValue -= 1;
                amount = parseFloat($(amountId).val());
                volume = countValue * amount;

                var commClass = ".right" + sequenceStart;

                $(commClass).html(countValue);
                $(incId).val(countValue);
                $(volumeId).val(volume);
                $(countId).html(countValue);
                $(countId+"Right").html(countValue);
            }

            calculateVolume(splitValues[2], splitValues[3], splitValues[4], splitValues[5]);

			$(this).parent().remove();

			if($('#pe-summary-items .item[data-item="' + item + '"] .counter').contents().length == 0) {
				$('#pe-summary-items .item[data-item="' + item + '"]').remove();
			} else {
				var count = $('#pe-summary-items .item[data-item="' + item + '"] .counter').text();

				if(count) {
					count = parseInt(count.replace ( /[^\d.]/g, '' )) - 1;
					if(count == 1) {
						$('#pe-summary-items .item[data-item="' + item + '"] .counter').text('');
					} else {
						$('#pe-summary-items .item[data-item="' + item + '"] .counter').text(' (' + count + ')');
					}
				} else {
					$('#pe-summary-items .item[data-item="' + item + '"]').remove();
				}

			}

			if($('#pe-summary-items li[data-parent="' + parent + '"] .item').length == 0) {
				$('#pe-summary-items li[data-parent="' + parent + '"]').remove();
			}

			GetPriceRange();  // function to get total items price range

        } catch (ex) {
            HandleJSError(ex, ".down:click");
        }
    });
    $(document).on("click", "#book_online_items", function (e) {
        try {
            var calculatedVolume = parseFloat($(".totalAmount").html());
            var itemCount = parseInt($("#total-items-span").text());
            var pIdx = -1;
            if (itemCount > 0) {
                var pricing = $("#pricing-data").data("pd").Pricing;
                pIdx = Math.floor(calculatedVolume * 12);
                var startingPrice = Math.floor(pricing[pIdx].StartingPrice).toFixed(2);
                var endingPrice = Math.floor(pricing[pIdx].EndingPrice).toFixed(2);

                if ($("#zip-input-hidden").val() == "") {
                    var disclaimer = $(".disclaimer");
                    disclaimer.show();
                    var top = $(window).scrollTop() - disclaimer.parent().offset().top + 20;
                    $(".disclaimer").css("top", top + "px");
                    $(".modal-form-overlay").show();
                    GATrackEvent('PricingEstimator', 'PriceByVolume', calculatedVolume + '|' + pricing[pIdx].StartingPrice.toFixed(2) + '|' + pricing[pIdx].EndingPrice.toFixed(2));
                    LogEvent("PricingEstimator: GetPriceRange", GetPIState());
                }
                e.preventDefault();
            }
            else {
                alert("Please add items before calculating the price range.");
                return;
            }

        } catch (ex) {
            var s = "\r\ncalculatedVolume1: " + calculatedVolume1 + "\r\n";
            s += "calculatedVolume: " + calculatedVolume + "\r\n";
            s += "itemCount: " + itemCount + "\r\n";
            s += "pIdx: " + pIdx + "\r\n";
            s += "\r\n" + GetPIState();
            HandleJSError(ex, ".getPriceRange:click", s);
        }
    });

    $(document).on("click", ".removeDisclaimer", function (e) {
        e.preventDefault();
        $('.disclaimer').hide();
        $(".modal-form-overlay").hide();
    });

    $(".reset-link-items").bind("click", function (e) {
        e.preventDefault();
        resetView();
    });
}

function resetView() {
	$(".totalItems, .item-count-input").html("0");
    $(".totalAmount, .subtotal").html("0.00");
    $(".inputText, .subitems, .item-volume-input, .subtotal").val("0");
    $(".disclaimerTooltip").attr("style", "display:none");
    $(".endRangeValue, .rightAccordionValueSpan").html("");
    $(".discount-disclaimer").hide();
	$('.btn-down').remove();
	$('.listitem .value span').css('visibility', 'hidden');
	$('.startRangeValue').text('$0').css('visibility', 'visible');
	$('#pe-summary-items ul').text('');
}

function ShowLargeVolumeDialog() {
    $('#estimate-request-intro').text("It appears that your job is fairly large and you will most likely benefit from a custom quote.  Enter your email address and/or phone number and any additional details that might be helpful and we will reply promptly with your quote.");
    $("#estimate-request-dialog").modal("show");
}

/* Function To Validate Zip Code Start */
function GetPricing() {
	$('#disabled-div').show();
	$('#zip-validation-msg').text('');
    try {
        var zipCode = $('#pe-zip-input').val();
        zipCode = zipCode.replace(/([a-z]\d[a-z])(\d[a-z]\d)/gi,'$1 $2').toUpperCase();
        $('.zipCodeValue').html(zipCode);
        $("#zip-validation-msg").text("");
        if ($("#zip-input-hidden").val() == "") {
            GATrackEvent('PricingEstimator', 'Start', zipCode);
            LogEvent("PricingEstimator: Start", zipCode);
        }
        $.ajax({
            cache: false,
            type: "POST",
            data: JSON.stringify({ zip: zipCode }),
            dataType: "json",
            contentType: "application/json",
            url: "/system/services/pricing-estimator.asmx/GetPricing",
            success: function (data, status, jqXHR) {
                var results = eval("(" + data.d + ")");
                if (results.ServiceProviderId) {
                    $("#pricing-data").data("pd", results);
                    $("#zipcode-dialog").modal("hide");
                    $('#bf-zip').val(zipCode);
                    $("#bf-zip").trigger("blur");
                    $.cookie("confirmzip", zipCode);
                    if (results.ServiceProviderId == "142") {
                        $(".additional-disclaimer").html("** Due to recycling/disposal costs and regulations in Colorado, we must charge an additional $.50 per pound for televisions and monitors.  We keep scales on our truck to provide accurate costs.");
                    }
                    else $(".additional-disclaimer").html("");
                    $("#items-btn").click();
					//$('#page-content-new').append("<div id='pe-summary' class='row hidden-xs'><div class='col-md-2 col-md-push-10'><div class='book-it'><strong>when you're ready click BOOK IT!</strong><br/><img src='/images/ico_red_arrow.svg' alt='arrow' align='right'/></div></div><div class='col-md-10 col-md-pull-2'><div class='box price'><div class='listitem'><div class='row'><div class='col-sm-6'><h5>Estimate Summary</h5></div><div class='col-sm-6'><div class='value'>Your Price<span class='startRangeValue'>$0</span><span> - </span><span class='endRangeValue'></span></div></div></div><div id='pe-summary-items'><ul></ul></div></div><div class='truckload' style='display: none;'><div class='value row'><div class='col-sm-5 col-md-6'>Your Price</div><div class='col-sm-6 text-right'><span class='startRangeValue1'>$0</span><span> - </span><span class='endRangeValue1'></span></div></div></div></div></div></div>");
					/*$('#page-content-new').append("<div id='pe-summary' class='row hidden-xs'><div class='col-md-2 col-md-push-10'><div class='book-it'><strong>when you're ready click BOOK IT!</strong><br/><img src='/images/ico_red_arrow.svg' alt='arrow' align='right'/></div></div><div class='col-md-10 col-md-pull-2'><div class='box price'><div class='listitem'><div class='row'><div class='col-sm-6 col-md-5'><h5>Estimate Summary</h5></div><div class='col-sm-6 col-md-7 text-right'><div class='value'>Your Price<span class='startRangeValue'>$0</span><span> - </span><span class='endRangeValue'></span></div></div></div><div id='pe-summary-items'><ul></ul></div></div><div class='truckload' style='display: none;'><div class='row'><div class='col-sm-6 col-md-5'><h5>Estimate Summary</h5></div><div class='col-sm-6 col-md-7 text-right'><div class='value'>Your Price<span class='startRangeValue1'>$0</span><span> - </span><span class='endRangeValue1'></span></div></div></div><div><strong># of Pick Up Trucks:</strong> <span class='pickup'>0</span></div></div></div></div></div>");*/

					/*$('#pricing-tabs').show();
					if($(window).width() > 767) {
						$('html, body').animate({scrollTop: $('#booking-form-cont').offset().top}, 1000);
					} else {
						$('html, body').animate({scrollTop: $('.online-book').offset().top - 65}, 1000);
					}*/
					//$('#pricing-estimator-cont').removeClass('disabled');
					$("#disabled-div").hide();
					$('#mobile-reset-link-cont').show();
					$('#zip-validation-msg').text('Good news, we service your zip/postal code. Go to Step 2.');
                }
                else {
                    $(".how-much-junk_text-cont").hide();
                    var emsg = "Sorry, we do not service your area yet.";
                    if ($("#zip-input-hidden").val() == "") {
                        GATrackEvent('PricingEstimator', 'ZipNotServiced', zipCode);
                        LogEvent("PricingEstimator: ZipNotServiced", zipCode);
                    }
                    /*if ($("#zipcode-dialog").is(":visible")) $("#zip-validation-msg").text(emsg);
                    else alert(emsg);*/
					$('#zip-validation-msg').text(emsg);
                }
            },
            error: function (jqXHR, status, emsg) {
                HandleJSError(jqXHR, "GetPricing:error");
                alert('An error occurred submitting ajax request.');
            }
        });
    } catch (ex) {
        HandleJSError(ex, "GetPricing");
    }
}
/* Function To Validate Zip Code End */

/* Show Dialog Pop Up Start */
/*function ZipCodeDialogPopUp() {
    try {
        var zip = GetQSParameterByName("zip");
        if (zip != null) {
            $("#zip-input-hidden").val(zip);
        }
        if ($("#zip-input-hidden").val() == "") {
            $("#zipcode-dialog").modal("show");
        } else {
            $('#pe-zip-input').val($("#zip-input-hidden").val());
            GetPricing();
        }
    } catch (ex) {
        HandleJSError(ex, ".price-estimator-btn:click");
    }
}*/
/* Show Dialog Pop Up End */

/* Function To Fill Junk For Pick Up Trucks */
function FillupjunkKingTruck(pickup){
	var width = parseInt((pickup/6) * 100);
	$('.pickupTruckProgessBg').css('width', width.toString() + '%');
	$('.pickupTruckProgessBg div').text(width.toString() + '% full');
}
/* Function To Fill  Junk For Pick Up Trucks End */

/* Function To Get Estimated Pick Up Price Start */
function GetPricePickUP(){
	 try {
         var volume = parseFloat($(".pickup").html());
         if (volume > 0) {
             var pricing = $("#pricing-data").data("pd").Pricing;
             var pIdx = Math.floor(volume / .5);
             var startingPrice = Math.floor(pricing[pIdx].StartingPrice);
             var endingPrice = Math.floor(pricing[pIdx].EndingPrice);
             //if ($("#zip-input-hidden").val() == "") {
             //    if (pIdx == 1) {
             //        endingPrice -= 30;
             //        $(".discount-disclaimer").show();
             //    } else if (pIdx > 1) {
             //        startingPrice -= 30;
             //        endingPrice -= 30;
             //        $(".discount-disclaimer").show();
             //    } else {
             //        $(".discount-disclaimer").hide();
             //    }
             //}
             $(".startRangeValue1").html("$"+startingPrice);
             $(".endRangeValue1").html("$"+endingPrice);
             $('.truckload .value span').css('visibility', 'visible');
         }
         else {
             $(".startRangeValue1").html("$0");
             $(".endRangeValue1").html("0");
             $(".discount-disclaimer").hide();
			 $('.truckload .value span').css('visibility', 'hidden');
         }
         GetPIInfo();
     } catch (ex) {
         HandleJSError(ex, ".getPricePickup:click");
     }
}
/* Function To Get Estimated Pick Up Price End */

/* Function to Calulate Items Volume Start */
function calculateVolume(summaryInputClass, subtotalId, countInputClass, countId) {
    try {
        var subTotalClass = $.trim("." + summaryInputClass);
        var subTotalId = $.trim("#" + subtotalId);
        var countClass = $.trim("." + countInputClass);
        var subCountId = $.trim("#" + countId);

        // calculate sub-volume
        var sum = 0;
        $(subTotalClass).each(function () {
            sum += parseFloat($(this).val());
        });
        $(subTotalId).val(sum);

        // calculate no. of items selected
        var count = 0;
        $(countClass).each(function () {
            count += parseInt($(this).html());
        });
        $(subCountId).val(count);
        $(countClass+"Total").html("(" + count + ")");

        // calculate total items
        var items = 0;
        $(".subitems").each(function () {
            items += parseInt($(this).val());
        });
        $(".totalItems").html(items);

        // calculate total volume
        var total = 0;
        $(".subtotal").each(function () {
            total += parseFloat($(this).val());
        });
        $(".totalAmount").html(total);
    } catch (ex) {
        HandleJSError(ex, "calculateVolume");
    }
}
/* Function to Calulate Items Volume End */

/* Function to Show Toatl  Items Price Start */
function GetPriceRange(){

    try {
        var calculatedVolume = parseFloat($(".totalAmount").html());
        var itemCount = parseInt($("#total-items-span").text());
        var pIdx = -1;
        if (itemCount > 0) {
            var pricing = $("#pricing-data").data("pd").Pricing;
            console.log(calculatedVolume);
            pIdx = Math.floor((calculatedVolume * 12).toFixed(2));
            if (itemCount == 1 && 1 / calculatedVolume > 6.99) pIdx = 0;
            var startingPrice = Math.floor(pricing[pIdx].StartingPrice);
            var endingPrice = Math.floor(pricing[pIdx].EndingPrice);
            if (itemCount == 1 && 1 / calculatedVolume > 6.99) endingPrice = startingPrice + 20;
            //if ($("#zip-input-hidden").val() == "") {
            //    if (pIdx > 1) {
            //        startingPrice -= 30;
            //        endingPrice -= 30;
            //        $(".discount-disclaimer").show();
            //    } else $(".discount-disclaimer").hide();
            //}

            $(".startRangeValue").html("$"+startingPrice);
            $(".endRangeValue").html("$"+endingPrice);
			$('.listitem .value span').css('visibility', 'visible');
        }
        else {
            $(".startRangeValue").html("$0");
            $(".endRangeValue").html("0");
            $('.listitem .value span').css('visibility', 'hidden');
            return;
        }
        GetPIInfo();
        $(".estimatedPriceBg").show();
        //$(".emailBtnHouseHold").show();
        $(".estimatedPriceBg").effect("shake");

    } catch (ex) {
        var s = "\r\ncalculatedVolume1: " + calculatedVolume1 + "\r\n";
        s += "calculatedVolume: " + calculatedVolume + "\r\n";
        s += "itemCount: " + itemCount + "\r\n";
        s += "pIdx: " + pIdx + "\r\n";
        s += "\r\n" + GetPIState();
        HandleJSError(ex, ".getPriceRange:click", s);
    }
}
/* Function to Show Toatl  Items Price End */

function InitBookingForm(appendTo) {
    try {
        $("#booking-form-cont").appendTo(appendTo);
    } catch (ex) {
        HandleJSError(ex, "InitBookingForm");
    }
}

function GetPIInfo() {
    try {
        var piInfo = "";
        if ($(".price .truckload").is(":visible")) {
            var tc = $(".truckload .pickup:first").text();
            if (tc != "") piInfo += tc + " truck(s)";
            var pr = "";
            var sp = $(".truckload .startRangeValue1:first").text();
            if (sp != "") pr += sp;
            var ep = $(".truckload .endRangeValue1:first").text();
            if (ep != "") pr += (pr != "" ? " - " : "") + ep;
            if (pr != "") piInfo += (piInfo != "" ? ", " : "") + "price: " + pr;
        } else {
            var items = [];
            var item = {};
            $(".btn-down [data-item]").each(function () {
                var found = false;
                var cname = $(this).attr("data-item");
                for (var i = 0; i < items.length; i++) {
                    if (items[i].Name == cname) { items[i].Count++; found = true; break; }
                }
                if (!found) { item = {}; item.Name = cname; item.Count = 1; items.push(item); }
            });
            for (var i = 0; i < items.length; i++) {
                piInfo += (piInfo != "" ? ", " : "") + items[i].Name + "(" + items[i].Count + ")";
            }
            var pr = "";
            var sp = $(".listitem .startRangeValue:first").text();
            if (sp != "") pr += sp;
            var ep = $(".listitem .endRangeValue:first").text();
            if (ep != "") pr += (pr != "" ? " - " : "") + ep;
            if (pr != "") piInfo += (piInfo != "" ? ", " : "") + "price: " + pr;
			piInfo += " - Online Pricing Estimator";
        }
        $("#BONotesHF").val(piInfo);
    } catch (ex) {
        HandleJSError(ex, "GetPIInfo");
    }
}

function GetPIState() {
    try {
        var s = "Zip: " + $("#pe-zip-input").val() + "\r\n";
        s += "Email: " + $('#pe-email-input').val() + "\r\n";
        s += "Active Tab: " + $(".item-truck-tab .active").children("a").text() + "\r\n";
        s += "Volume: \tItems: " + $(".totalAmount").html() + "\t\tTruck: " + $(".pickup").html() + "\r\n";
        s += "StartPrice: \tItems: " + $("#pe-tabs-1 .startRangeValue").text() + "\t\tTruck: " + $("#pe-tabs-2 .startRangeValue1").text() + "\r\n";
        s += "EndPrice: \tItems: " + $("#pe-tabs-1 .endRangeValue").text() + "\t\tTruck: " + $("#pe-tabs-2 .endRangeValue1").text() + "\r\n";
        s += "Pricing Data: \r\n\r\n" + JSON.stringify($("#pricing-data").data("pd")) + "\r\n\r\n";
        var d = {};
        d.Items = [];
        $(".leftAccordionHeader").each(function () {
            var cat = $(this).text();
            var classes = $(this).attr("class");
            var itemsDivSel = "." + classes.split(" ")[0].replace("header", "");
            $(itemsDivSel + " .innerContainer").each(function () {
                var itemName = $(".nameValue", $(this)).text();
                var itemCount = parseInt($(itemsDivSel+"CountInput", $(this)).text());
                if (itemCount > 0) {
                    var di = {};
                    di.CategoryName = cat;
                    di.ItemName = itemName;
                    di.ItemCount = itemCount;
                    d.Items.push(di);
                }
            });
        });
        s += "Items: \r\n\r\n" + JSON.stringify(d.Items) + "\r\n";
        return s;
    } catch (ex) {
        HandleJSError(ex, "GetPIState");
    }
}

/*  Call For Zip Dialog PopUp Functionalities */
$(function () {
	InitPricingEstimatorDialogPopup();
});

/*  Call For Pick Up Trucks Functionalities */
$(function () {
	InitPricingEstimatorPickUpTruck();
});

/*  Call For Items Functionalities */
$(function () {
	InitPricingEstimatorItems();
});