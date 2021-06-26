jQuery(function($){
	
	var total_volume=0;
	var all_options_obj={};
	var all_qty=0;
	var single_price_load_options={};
	var single_price_data={};	
	var calculate_price = {	
		
		/* Update sidebar totals */
		sidebar_totals : function(calc_class_name,set_class_name){
			var total_amount=0;
			$(".price-by-load ."+calc_class_name).find('.product_qty_amount').each(function(){
				if(isNaN($(this).val())==false){
					total_amount+=parseInt($(this).val());
				}
			});
			$(".set_sidebar_qty_and_estimate_price ."+set_class_name).text(total_amount);
		},
		limitation_popup : function(current_volume){
			alert('Volume Limit Over');
			return false;
		},
		reset_booking:function(){
			total_volume=0;
			all_options_obj={};
			all_qty=0;
			$(".load_and_pricing_tabs_row .product_qty_amount").each(function(){
				$(this).val('0');
			});
			$(".set_sidebar_qty_and_estimate_price li span").each(function(){
				$(this).text('0');
			});
			$(".set_sidebar_qty_and_estimate_price .price .start_price").text('$0');
			$(".set_sidebar_qty_and_estimate_price .price .end_price").text('$0');
		}
	};
	
	
	function validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	
	/* Save booking Data */
	$(document).on("click",".save_volume_data_on_db",function(){
         
        var all_textbox_price_calculation_container=$(".priceing_calculation .price-by-load");
        var product_detail={};
		
		total_volume=0;
		
		all_textbox_price_calculation_container.find('.get_all_qty_text_value .panel').each(function(){
			var single_product_detail={};
			$(this).find('.product_qty_amount').each(function(){
				if($(this).val() > 0 && calculate_price.volume_limitation(total_volume)=="true"){
					var volume=calculate_price.class_by_volume($(this).data('volume-index'));
					var single_total_volume=parseFloat(volume) * parseInt($(this).val());
					total_volume = parseFloat(total_volume) + parseFloat(single_total_volume);
					
					var parent_label=$(this).closest('.panel');
					
					product_detail={ 
						'parent_label' : parent_label.find('.panel-title a').text(),
						'current_label' : $(this).closest('li').find('span').text(),
						'qty' : $(this).val(),
						'volume' : calculate_price.class_by_volume($(this).data('volume-index')),
						'class_name' : $(this).data('id'),
						'ul_class_name' : $(this).data('id')+"_prices" 
					};
					single_product_detail[$(this).closest('li').find('span').text()]=product_detail;
				
				}
			});
			
			var element_name=$(this).find('ul li:first input').data('id');
			if(Object.keys(single_product_detail).length > 0){
				all_options_obj[element_name]=single_product_detail;
			}
		});
	
		/* Calculate Volume */
		var calc_volumed_devided_twelve = calculate_price.calculate_volume(total_volume);
		
		/* calculated price */
		if(calculate_price.volume_limitation(total_volume)=="true"){
			var price_object=calculate_price.get_price_object(parseInt(calc_volumed_devided_twelve));
		}else{
			var price_object=1.1;
		}	
		
		if(total_volume!=0)
		{
			all_options_obj['prices']=price_object;
			all_options_obj['all_qty']=all_qty;
		}
		
		//console.log(all_options_obj);
		if(Object.keys(all_options_obj).length > 0){
			//$(".book_now_modal_popup").modal('show');

			$.magnificPopup.open({
			    items: {
			        src: '.book_now_modal_popup',
			        type:'inline'
			    },
			    modal: false,
			    closeOnBgClick:true
			});

			$(".book_now_modal_popup .submit_bokking").addClass('group_booking').removeClass('single_booking');
			$(".all_filed_value_details").val(all_options_obj);
				
				/* $('.load_and_pricing_tabs').
				$('.load_and_pricing_tabs').unblock();*/
			
		}else{
				alert("Please add items before calculating the price range.");
		}
		
	});
	
	$(document).on("click",".submit_bokking.group_booking",function(){
		var popup = $(this).closest('.book_now_modal_popup');
		popup.find('.has-error').removeClass('has-error');
		popup.find('.form-group span').text('');
		$(".book_date_margin .input-group-addon").html(' <span class="glyphicon glyphicon-calendar"></span>');
		var return_status='true';
		/* Errors */
		popup.find('form .required input[type="text"],form .required input[type="email"],form .required textarea').each(function(){
			var form_group=$(this).closest('.form-group');
			if($(this).val()=="" && $(this).attr('name')!="book_date"){
				form_group.find('span').text(form_group.find('label').text()+' is required.');
				form_group.addClass('has-error');
				return_status='false';
			}
			if($(this).val()=="" && $(this).attr('name')=="book_date"){
				form_group.find('span.cal_error').text(form_group.find('label').text()+' is required.');
				form_group.addClass('has-error');
				return_status='false';
			}
		});
		
		if(return_status=='true'){
			if(validateEmail(popup.find('.email_valid').val())==false){
				var form_group=popup.find('.email_valid').closest('.form-group');
				if(form_group.find('span').text()==""){
					form_group.find('span').text('Please Enter vaild '+form_group.find('label').text());
					form_group.addClass('has-error');
				}
				return_status='false';
			}
		}
		console.log(all_options_obj);
		if(return_status=='true'){
			popup.block({ 
				message: '<i class="fa fa-circle-o-notch fa-spin fa-3x"></i>', 
				css: { background:'none',border:'0',color:'#fff' } 
			});
			
			var data={
				'action' : 'save_booking_data',
				'first_name_last_name' : popup.find('input[name="first_name_last_name"]').val(),
				'email' : popup.find('input[name="email"]').val(),
				'phone' : popup.find('input[name="phone"]').val(),
				'city' : popup.find('input[name="city"]').val(),
				'postal_code' : popup.find('input[name="postal_code"]').val(),
				'book_date' : popup.find('input[name="book_date"]').val(),
				'address' : popup.find('textarea[name="address"]').val(),
				'all_filed_value_details' : all_options_obj,
			};
			//console.log(all_options_obj);
			$.ajax({
				type:"POST",
				url:ajax_url,
				data:data,
				dataType:'json',
				success:function(res){
					if(res.success){
						popup.unblock();
						calculate_price.reset_booking();
						popup.find('.modal-body').html('<div class=""><h3 style="color: green; font-size: 20px;margin: 0;padding: 0;">Your booking option saved, check your email</h3></div>');
						popup.find('.submit_bokking').remove();
						setTimeout(function(){ $.magnificPopup.close(); window.location.href=thankyou_url; },500)
					}else{
						alert("error on insert your booking");
					}
				}	
			});
			
		}
	});
	
	$(document).on("click",".reset_options_data",function(){
		calculate_price.reset_booking();
	});


	/* Single Weight based Truck second tab */
	//var single_price_load_options={};
	//var single_price_data= {};
	var single_price_calculate={
		reset_option : function(){
			single_price_data={};
			$(".set_single_sidebar_qty_and_estimate_price .start_price,.set_single_sidebar_qty_and_estimate_price .end_price,.set_single_sidebar_qty_and_estimate_price .single_price").text('$0');
			$(".price.single_load_pricings li").removeClass('active');
		},
		pricing_set : function(title_and_price){
			$(".price.single_load_pricings li").removeClass('active');
			title_and_price.closest('li').addClass('active');
			if(title_and_price.data('type')=="single"){
				console.log(title_and_price.data('price'));
				single_price_data['prices']= title_and_price.data('price');
				$(".set_single_sidebar_qty_and_estimate_price .start_price,.set_single_sidebar_qty_and_estimate_price .end_price").text('').hide();
				$(".range_price").hide();
				$(".set_single_sidebar_qty_and_estimate_price .single_price").text('$'+single_price_data.prices).show();
			}else{
				single_price_data['prices']= 
					{
						'Start' : title_and_price.data('start'),
						'End' : title_and_price.data('end')
					};
				$(".range_price").show();
				$(".set_single_sidebar_qty_and_estimate_price .start_price").text('$'+single_price_data.prices.Start).show();
				$(".set_single_sidebar_qty_and_estimate_price .end_price").text('$'+single_price_data.prices.End).show();
				$(".set_single_sidebar_qty_and_estimate_price .single_price").text('').hide();
			}

			/* Price by Loadt*/
			var set_qty="";
			if(title_and_price.next('.priceing_content').text()=="")
				set_qty="1";
			else
				set_qty=title_and_price.next('.priceing_content').text();

			single_price_data['Price_by_Load']={};
			single_price_data.Price_by_Load[title_and_price.text()] = { 'qty' : set_qty };

			single_price_data['all_qty']=1;
		}
	};

	/* Li Click Options */
	$(document).on("click",".single_load_pricings li",function(){
		var title_and_price=$(this).find('.priceing_title');
		single_price_calculate.pricing_set(title_and_price);

	});

	/* reser Options */
	$(document).on("click",".reset_single_options_data",function(){
		single_price_calculate.reset_option();
	});

	/* Save Single Options */
	$(document).on("click",".save_fixed_volume_data",function(){
		if(Object.keys(single_price_data).length > 0){
			//$(".book_now_modal_popup").modal('show');
			$.magnificPopup.open({
			    items: {
			        src: '.book_now_modal_popup',
			        type:'inline'
			    },
			    modal: false,
			    closeOnBgClick:true
			});

			$(".book_now_modal_popup .submit_bokking").addClass('single_booking').removeClass('group_booking');
		}else{
			alert("Please select any one service");
		}
	});

	/* save single options data */
	$(document).on("click",".submit_bokking.single_booking",function(){
		var popup = $(this).closest('.book_now_modal_popup');
		popup.find('.has-error').removeClass('has-error');
		popup.find('.form-group span').text('');
		$(".book_date_margin .input-group-addon").html(' <span class="glyphicon glyphicon-calendar"></span>');
		var return_status='true';
		/* Errors */
		popup.find('form .required input[type="text"],form .required input[type="email"],form .required textarea').each(function(){
			var form_group=$(this).closest('.form-group');
			if($(this).val()=="" && $(this).attr('name')!="book_date"){
				form_group.find('span').text(form_group.find('label').text()+' is required.');
				form_group.addClass('has-error');
				return_status='false';
			}

			if($(this).val()=="" && $(this).attr('name')=="book_date"){
				form_group.find('span.cal_error').text(form_group.find('label').text()+' is required.');
				form_group.addClass('has-error');
				return_status='false';
			}

		});
		
		if(return_status=='true'){
			if(validateEmail(popup.find('.email_valid').val())==false){
				var form_group=popup.find('.email_valid').closest('.form-group');
				if(form_group.find('span').text()==""){
					form_group.find('span').text('Please Enter vaild '+form_group.find('label').text());
					form_group.addClass('has-error');
				}
				return_status='false';
			}
		}
		
		console.log(single_price_data);
		if(return_status=='true'){
			popup.block({ 
				message: '<i class="fa fa-circle-o-notch fa-spin fa-3x"></i>', 
				css: { background:'none',border:'0',color:'#fff' } 
			});
			
			var data={
				'action' : 'save_booking_data',
				'first_name_last_name' : popup.find('input[name="first_name_last_name"]').val(),
				'email' : popup.find('input[name="email"]').val(),
				'phone' : popup.find('input[name="phone"]').val(),
				'city' : popup.find('input[name="city"]').val(),
				'postal_code' : popup.find('input[name="postal_code"]').val(),
				'book_date' : popup.find('input[name="book_date"]').val(),
				'address' : popup.find('textarea[name="address"]').val(),
				'all_filed_value_details' : single_price_data,
				'form_submit_type':'grouped'
			};
			
			//console.log(single_price_data);
			$.ajax({
				type:"POST",
				url:ajax_url,
				data:data,
				dataType:'json',
				success:function(res){
					if(res.success){
						popup.unblock();
						single_price_calculate.reset_option();
						popup.find('.modal-body').html('<div class=""><h3 style="color: green; font-size: 20px;margin: 0;padding: 0;">Your booking option saved, check your email</h3></div>');
						popup.find('.submit_bokking').remove();
						setTimeout(function(){ $.magnificPopup.close(); window.location.href=thankyou_url; },1000)
					}else{
						alert("error on insert your booking");
					}
				}	
			});
			
		}
	});

	/* Close Popup */
	$(document).on('click','.mfp-custom-close',function(){
		$.magnificPopup.close();
	});

	var mintotal = 0;
    var maxtotal = 0;
        // Increament
        $(".inc").click(function(){
            var minPrice = Number($(this).children('i').attr('data-start'));
            var maxPrice = Number($(this).children('i').attr('data-end'));
            var qty =  Number($(this).parent().children('input').val());
            
                ++qty;
                $(this).parent().children('input').val(qty);
                   mintotal += minPrice;
                   maxtotal += maxPrice;
                $(".start_price").text('$' +mintotal);
                $(".end_price").text('$' +maxtotal);

                // Updating Right Side Labels
                $(".Couch").text($("#inputCouch").val());
                $(".Loveseat").text($("#inputLoveseat").val());
                $(".Armchair").text($("#inputArmchair").val());
                $(".Coffee_Table").text($("#inputCoffeeTable").val());
                $(".Ent_Center").text($("#inputEntCenter").val());
                $(".TV").text($("#inputTV").val());
            
           
        });

         // Decreament
        $(".dec").click(function(){
            var minPrice = Number($(this).children('i').attr('data-start'));
            var maxPrice = Number($(this).children('i').attr('data-end'));
            var qty =  Number($(this).parent().children('input').val());
            if(qty > 0){
                --qty;
               $(this).parent().children('input').val(qty);
                   mintotal -= minPrice;
                   maxtotal -= maxPrice;             
                $(".start_price").text('$' + mintotal);
                $(".end_price").text('$' + maxtotal);
                 // Updating Right Side Labels
                $(".Couch").text($("#inputCouch").val());
                $(".Loveseat").text($("#inputLoveseat").val());
                $(".Armchair").text($("#inputArmchair").val());
                $(".Coffee_Table").text($("#inputCoffeeTable").val());
                $(".Ent_Center").text($("#inputEntCenter").val());
                $(".TV").text($("#inputTV").val());

            }else{
                alert("Quantity is Already Zero");
            }
        });

});
