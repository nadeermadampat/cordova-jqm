/*
	Common and useful functions
	@author nadeermadampat@gmail.com
	@release 10/01/2015
	
*/

$.mobile.changePage.defaults.allowSamePageTransition = true;
$.mobile.defaultPageTransition = 'fade';

function scrollerH() {
	var winH = $(window).outerHeight();
	var todayTopH = 0;

	var headerH = $(".ui-page-active .mheader").outerHeight();
	
	if($(".ui-page-active .todayTop").is(":visible")) {
		todayTopH = $(".ui-page-active .todayTop").outerHeight();
	}
	
	var footerH = $(".ui-page-active .mfooter").outerHeight();
	var totoalH = winH - (headerH + todayTopH + footerH - 2);
	$(".ui-page-active .todayScroll").height(totoalH);
}

function modalScrollH() {
	if($(".ui-page-active .nav_slide_manu").length) {
		var winH1 = $(window).height();
		
		var navslide = $(".ui-page-active .nav_slide_manu");
		var headerH1 = $(navslide).find(".headgrp").outerHeight();
		var footerH1 = $(navslide).find(".nav_slide_footer").outerHeight();
		var totoalH1 = winH1 - (headerH1 + footerH1);
		$(navslide).find(".modalScroll").height(totoalH1);
	}
}

function calWhiteArea() {
	if($(".ui-page-active .bgwhiteArea").length) {
		var winH2 = $(window).height();
		var headerH2 = $(".ui-page-active .mheader").height();
		//console.log(headerH2);
		var contentHeader =  $(".ui-page-active .contentHeader").outerHeight() || 0;
		//console.log(contentHeader);
			//$(".ui-page-active .ui-content")
		var totalH2 = winH2 - (headerH2 + contentHeader);
		$(".ui-page-active .bgwhiteArea").css("min-height",totalH2);
	}
}

function calPageAreaH() {
	if($(".ui-page-active .bgcalAreaH").length) {
		var mainactive = $(".ui-page-active");
		var winH3 = $(window).height();
		var headerH3 = mainactive.find(".mheader").outerHeight();
		//console.log(headerH3);
		var contentHeader =  mainactive.find(".contentHeader").outerHeight() || 0;
		//console.log(contentHeader);
		//var conTopPad = parseInt(mainactive.find(".ui-content").css("padding-top"));
		//var con_btm_pad = parseInt(mainactive.find(".ui-content").css("padding-bottom"));
		//console.log(conTopPad);
		//console.log(con_btm_pad);
		var totalH3 = winH3 - (headerH3 + contentHeader);
		mainactive.find(".ui-content").css("min-height",totalH3);
	}
}

function logout() {
	fh.logout();	
}


$(document).on('pagebeforeshow', function(){
	//if($(".txtint1").length) $(".txtint1").parent().addClass("ptxtint1");
	/*
	if($(".nav_slide_manu").length) {
		 ScrollLiAnim1(1);
	}
	*/
	
	$(window).on("orientationchange",function(){
	    if(window.orientation == 0) 
	    {
		$("[data-role='page']").removeClass("o_landscape");
		$("[data-role='page']").addClass("o_portrait");
	    }
	    else
	    {
		 $("[data-role='page']").removeClass("o_portrait");
		 $("[data-role='page']").addClass("o_landscape");
	    }
	});
	
	$(".toggle_nav-panel").on("click", function(event) {
		event.preventDefault();
		var _this = $(this);
		$("body").addClass("nav_open_body");
		$("html").addClass("nav_open_html");				
		_this.closest(".mpage").find(".nav_slide_manu")
			.addClass("anim")
			.addClass("open");
			
		
		//ScrollLiAnim1(0);
	});
	
	$(".nav_slide_close, .nav_slide_manu li a").on("click", function() {
		
		$("body").removeClass("nav_open_body");
		$("html").removeClass("nav_open_html");
		var _this = $(this);
		_this.closest(".nav_slide_manu")
			.removeClass("anim")
			.removeClass("open");    
		//ScrollLiAnim1(1);
	});
	
	$(".nav_slide_manu_shadow").on("click", function() {
		var _this = $(this);
		$(".nav_slide_manu .nav_slide_manu_in").css({"left":"-80%"});
		$(".nav_slide_manu .nav_slide_manu_shadow").css({"background":"none"});
		 
	     setTimeout( function() {
		$("body").removeClass("nav_open_body");
		$("html").removeClass("nav_open_html");
		_this.closest(".nav_slide_manu")
			.removeClass("anim")
			.removeClass("open");     
		$(".nav_slide_manu .nav_slide_manu_in").css({"left":""});
		$(".nav_slide_manu .nav_slide_manu_shadow").css({"background":""});	
	     },1000);	
		//ScrollLiAnim1(1);
	});
	
	
	function ScrollLiAnim1(val1) {
		
	   $(".nav_slide_manu").each(function(index, element) {
		     var x = 10;
		     var _this1 = $(this);
		     _this1.find(".modalScroll ul li").each(function(index, element) {
				if(val1 == 1) {
					var trans2 = "translate3d(0,-"+x+"px,0)";
				}else {
					var trans2 = "translate3d(0,0,0)";	
				}
				$(this).css({"-webkit-transform":trans2,"-moz-transform":trans2,"-ms-transform":trans2,"transform":trans2});
				x = x + 10;	
				
			});	 
         });	
		
	}
});


$(document).ajaxError(function(evt, xhr, settings) {
		
		fh.info(fh.ERR.NET.GENERIC, 3500);
});


$(document).on('pagecreate', '[data-role="page"]', function(){

	///// AUTH USER
	var _p = fh.curPageName();
	if(_p != 'login.html' && _p != 'register.html' && _p != 'forgot.html'  && _p != 'terms.html')
	{
		fh.auth();
	}

	///// APPLY PROFILE PIC
	if(fh.getLocal('image') && $('.profile_pic span.pic').length)
	{
		$('.profile_pic span.pic').css('background-image', 'url(' + fh.getLocal('image') + ')');
	}


	///// MENU NAME APPLY
	if(fh.getLocal('name'))
	{
		$('.menu_user_name').text(fh.getLocal('name'));
	}


});


$(document).on('pageshow', function(){
	
	calWhiteArea(); 
	
	modalScrollH();
	$(window).resize(function(e) {
		calWhiteArea(); 
		modalScrollH();
	});

});



 $(document).ready(function() {
 	
	 document.addEventListener("backbutton", onBackButton, false);
	// document.addEventListener("menubutton", onMenuButton, false);
 });


function onBackButton()
{
	if($('.nav_slide_manu').hasClass('open'))
	{
		$("body").removeClass("nav_open_body");
		$("html").removeClass("nav_open_html");
		$(".nav_slide_manu")
			.removeClass("anim")
			.removeClass("open");
	}
	else
	{
		switch(fh.curPageName())
		{
			case 'home.html': fh.exit(); break;
			case 'login.html': fh.exit(); break;
			case 'register.html': fh.changePage('login.html'); break;
			case 'forgot.html': fh.changePage('login.html'); break;
			default: fh.changePage('home.html'); break;
		}
	}


}



//// Encryption / Decryption starts
function _ee(_o)
{
	//// pack the encrypted & return http data var
	var key = CryptoJS.enc.Hex.parse("6DF24C98D6372EB0E6979665794795C0701D2D06392FEB642F2C9DFF3C4E60BE");
	var iv =  CryptoJS.enc.Hex.parse("dbcdff9977543111eeefdef9996543222");
	if(typeof _o == 'object') _o = JSON.stringify(_o);
	var encrypted = CryptoJS.AES.encrypt(_o, key, {iv:iv});
	var base64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	var param = {_d : base64};
	return param;
}


function _dd(_o)
{
	var key = CryptoJS.enc.Hex.parse("6DF24C98D6372EB0E6979665794795C0701D2D06392FEB642F2C9DFF3C4E60BE");
	var iv =  CryptoJS.enc.Hex.parse("dbcdff9977543111eeefdef9996543222");
	if(typeof _o == 'object') _o = JSON.stringify(_o);
	var decrypted = CryptoJS.AES.decrypt(_o, key, {'iv': iv});
	data = decrypted.toString(CryptoJS.enc.Utf8);
	data = data.substring(0, data.lastIndexOf('}') + 1);
	return JSON.parse(data);
}


Array.prototype.inArray = function(comparer) {
	for(var i=0; i < this.length; i++) {
		if(comparer(this[i])) return true;
	}
	return false;
};

Array.prototype.pushIfNotExist = function(element, comparer) {
	if (!this.inArray(comparer)) {
		this.push(element);
	}
};


Array.prototype.cleanPush = function(elem, key) {
	for(var i=0; i < this.length; i++) {
		if(typeof this[i]['qid'] != 'undefined' && this[i]['qid'] == key)
		{
			this.splice(i, 1);
		}
	}
	this.push(elem);  
};
