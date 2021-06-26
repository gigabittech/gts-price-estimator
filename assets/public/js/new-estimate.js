jQuery(function($){
	
	var total_volume=0;
	var all_options_obj={};
	var all_qty=0;

	var single_price_load_options={};
	var single_price_data={};
	
	var calculate_price = {	
		/* Price Return by Index*/
		get_price_object : function(price_index){
			/* 90001
			 * var price_obj={
				0: { End: 99, Start: 75},
				1: { End: 168, Start: 99},
				2: { End: 218, Start: 168},
				3: { End: 288, Start: 218},
				4: { End: 348, Start: 288},
				5: { End: 398, Start: 348},
				6: { End: 438, Start: 398},
				7: { End: 478, Start: 438},
				8: { End: 508, Start: 478},
				9: { End: 548, Start: 508},
				10:{ End: 568, Start: 548},
				11:{ End: 598, Start: 568},
				12:{ End: 638, Start: 598},
			}*/
			
			/* 92620 */
			var price_obj={
				//0: { End: 99, Start: 79 },
				/*0: { End: 20, Start: 10 },
				1: { End: 20, Start: 10},
				2: { End: 80, Start: 60},
				3: { End: 75, Start: 65},
				4: { End: 80, Start: 65},
				5: { End: 90, Start: 65},
				6: { End: 99, Start: 65},
				7: { End: 90, Start: 70},
				8: { End: 90, Start: 75},
				9: { End: 90, Start: 80},
				10:{ End: 99, Start: 80},
				11:{ End: 140, Start: 80},
				12:{ End: 130, Start: 85},
				13:{ End: 140, Start: 85},
				14:{ End: 135, Start: 89},
				15:{ End: 120, Start: 90},
				16:{ End: 150, Start: 90},
				17:{ End: 120, Start: 95},
				18:{ End: 165, Start: 240},*/
				0: { End: 115, Start: 85 },
				1: { End: 168, Start: 99},
				2: { End: 228, Start: 168},
				3: { End: 278, Start: 228},
				4: { End: 328, Start: 278},
				5: { End: 368, Start: 328},
				6: { End: 398, Start: 368},
				7: { End: 438, Start: 398},
				8: { End: 468, Start: 438},
				9: { End: 498, Start: 468},
				10:{ End: 538, Start: 498},
				11:{ End: 558, Start: 538},
				12:{ End: 588, Start: 558},				
				
			}
			price_obj[price_index]['Start'] -= 0;
			price_obj[price_index]['End'] -= 0;
			return price_obj[price_index];
		},
		
		/* class by volume*/
		class_by_volume : function(class_index){
			var volume_rates={
				0:0.1,
				1:0.082,
				2:0.041,
				3:0.0864,
				4:0.063,
				5:0.0189,
				6:0.0432,
				7:0.0153,
				8:0.0288,
				9:0.0126,
				10:0.0164,
				11:0.0225,
				12:0.249,
				13:0.0276,
				14:0.0166,
				15:0.0136
			};
			return volume_rates[class_index];
		},
		
		/* calculate total volume */
		calculate_volume : function(volume){
			return parseFloat(volume) * 18;
		},
		
		
		/* check volume limitation*/
		volume_limitation : function(volume){
			/* return process OR not */
			if(calculate_price.calculate_volume(volume) > 18){
				
				return "false";
			}
			else
			{
				return "true";
			}
		},
		
		/* calculate quantity wise volume */
		quantity_wise_volume : function(base_volume,qty){
			return parseFloat(base_volume * qty)
		},
		
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
	
	
	/* increament decrament qty and procees */
	$(document).on("click",".priceing_calculation a .fa-minus,.priceing_calculation a .fa-plus",function(e){
		e.preventDefault();
				
		var parent_li=$(this).closest('li');
		var text_box=parent_li.find('input[type="text"]');
		var data_class=text_box.data('id');
		
		if(text_box.val()!=0 && $(this).hasClass('fa-minus')){
			text_box.val(parseInt(text_box.val()) - 1);
			all_qty--;
		}
		if($(this).hasClass('fa-plus') && total_volume <= 18){
			text_box.val(parseInt(text_box.val()) + 1);
			all_qty++;
		}
		
		/* closet pricelist */
		total_volume=0;
		var all_textbox_price_calculation_container=$(".priceing_calculation .price-by-load");
		all_textbox_price_calculation_container.find('.product_qty_amount').each(function(){
			if($(this).val() > 0 && calculate_price.volume_limitation(total_volume)=="true"){
				var volume=calculate_price.class_by_volume($(this).data('volume-index'));
				var single_total_volume=parseFloat(volume) * parseInt($(this).val());
				total_volume = parseFloat(total_volume) + parseFloat(single_total_volume);
			}
		});
		
		/* Check limitation */
		if(calculate_price.volume_limitation(total_volume)=="false"){
				total_volume=calculate_price.volume_limitation(total_volume);
				text_box.val(parseInt(text_box.val()) - 1);
				all_qty--;
				calculate_price.limitation_popup(total_volume);
		}else{
				/*  set sidebar qty */
				calculate_price.sidebar_totals(data_class+'_prices', data_class);
			
				/* Calculate Volume */
				
				console.log(total_volume);
				
				var calc_volumed_devided_twelve = calculate_price.calculate_volume(total_volume);
				
				
				
				/* calculated price */
				var price_object=calculate_price.get_price_object(parseInt(calc_volumed_devided_twelve));
				
				  
				
				
				if(parseInt(calc_volumed_devided_twelve) > 1){
					price_object.Start=price_object.Start - 0;
					price_object.End=price_object.End - 0;
				}
				
				
				
				if(all_qty > 0){
					all_textbox_price_calculation_container.find('.price_by_load_total_start_price').val(price_object.Start);
					all_textbox_price_calculation_container.find('.price_by_load_total_end_price').val(price_object.End);
					
					$(".set_sidebar_qty_and_estimate_price .price .start_price").text('$'+price_object.Start);
					$(".set_sidebar_qty_and_estimate_price .price .end_price").text('$'+price_object.End);
				}else{
					total_volume=0;
					all_options_obj={};
					all_qty=0;
					$(".set_sidebar_qty_and_estimate_price .price .start_price").text('$0');
					$(".set_sidebar_qty_and_estimate_price .price .end_price").text('$0');
				}
				
		}
		
	});
	
	
	/* Insert Only numeric */
	$('.product_qty_amount,.phone_number').keydown(function(event) {
		// Allow special chars + arrows 
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 
			|| event.keyCode == 27 || event.keyCode == 13 
			|| (event.keyCode == 65 && event.ctrlKey === true) 
			|| (event.keyCode >= 35 && event.keyCode <= 39)){
				return;
		}else {
			// If it's not a number stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault(); 
			}   
		}
	});
	
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
		if(parseInt(calc_volumed_devided_twelve) > 1){
			price_object.Start=price_object.Start - 30;
			price_object.End=price_object.End - 30;
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

});
