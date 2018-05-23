$(document).ready(function() {
/*прилипание меню к верху*/
    // if($( window ).width()>767){
        $("header .menu").sticky({
            zIndex:22,
        });
    // }
/* слайдер*/
    $("#slider .items").owlCarousel({
        items: 1,
        nav:false,
        loop: true,
		navText: [,],
		dots: true,
        autoplay:true,
        autoplayTimeout:4000,
        animateOut: 'fadeOut',
    });
/*модальные окна*/
	$("[data-fancybox]").fancybox({
        autoFocus : false,
        touch :false,
    });

/*табы*/
    $('.tabs').multitabs();

/*видео на фоне*/
    $('.jquery-background-video').bgVideo({
        fadeIn: 0,
    });

/*корзина*/
    $(function() {
        'use strict';
        $.jqCart({
            buttons: '.add_item',
            handler: 'cart.php', // путь к обработчику
            visibleLabel: false,
            openByAdding: false,         // автоматически открывать корзину при добавлении товара (по умолчанию: false)
            currency: '₽', 
            cartLabel: '.label-place'
        });
    });
/*кнопки плюс минус*/
    $('[data-quantity="plus"]').click(function(e){
        e.preventDefault();
        fieldName = $(this).closest('.count').find('input');
        var currentVal = parseInt(fieldName.val());
        if (!isNaN(currentVal)) {
            $(fieldName).val(currentVal + 1);
        } else {
            $(fieldName).val(0);
        }
        $(this).closest('.item').find('.button').attr('data-counts', currentVal+1);

    });
    $('[data-quantity="minus"]').click(function(e) {
        e.preventDefault();
        fieldName = $(this).closest('.count').find('input');
        var currentVal = parseInt(fieldName.val());
        if (!isNaN(currentVal) && currentVal > 1) {
            $(fieldName).val(currentVal - 1);
            $(this).closest('.item').find('.button').attr('data-count', currentVal-1);
        } else {
            $(fieldName).val(1);
            $(this).closest('.item').find('.button').attr('data-count', 1);
        }
    });






/*параллакс*/
	var scene = document.getElementById('scene');
	var parallax = new Parallax(scene, {
		limitY : 0,
		originX : 0,
	});
	var scene2 = document.getElementById('scene2');
	var parallax2 = new Parallax(scene2, {
		limitY : 0,
		originX : 0,
    });
    
/* кнопка вверх*/
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 500) { 
        $('.scrollup').fadeIn(); 
        } else { 
        $('.scrollup').fadeOut(); 
        } 
    }); 
    $('.scrollup').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 


/* маска телефона*/
    $("input.tel").mask("+7(999)999-99-99");

/* выравнивание блоков по высоте*/
    $('#catalog .tab__content .tovars .item .name').matchHeight();

/* адаптив кнопок показать еще*/
    if($( window ).width()>=768 && $( window ).width()<989){
        $('#commands .centered .btn.more').attr('data-count',2);
        $('#vigoda .sert .centered .btn.more').attr('data-count',3);
        $('#partners .centered .btn.more').attr('data-count',4);
        $('#sertificate .centered .btn.more').attr('data-count',3);
    }
    if($( window ).width()<=767){
        $('#partners .centered .btn.more').attr('data-count',4);
    }

/* мобильное меню*/
    $("header .menu ul li.mmenu a").click(function (event) {
        event.preventDefault();
        if($('#mobile_menu').is(':hidden')){
            $('html, body').css('overflow', 'hidden');
            $('#mobile_menu').fadeIn();
            $('#mobile_menu').addClass('active');
        }else{
            $('html, body').css('overflow', 'auto');
            $('html, body').css('overflow-x', 'hidden');
            $('#mobile_menu').fadeOut();
            $('#mobile_menu').removeClass('active');
        }
    });

/*стилизация input type file*/
    var inputs = document.querySelectorAll( '.inputfile' );
    Array.prototype.forEach.call( inputs, function( input )
    {
        var label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener( 'change', function( e )
        {
            var fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
                label.querySelector( 'span' ).innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });
    });

/*кнопки смотреть еще*/
    var listsCount = $('.btn_more').length;    
    var moreItems = function(id){
        var button = $(id + " .btn_more");
        var list = button.closest(".container").find('.items .item');
        var numToShow = +button.attr('data-count');
        var numInList = list.length;
        list.hide();
        if (numInList <= numToShow) {
            button.hide();
        }
        if (numInList > numToShow) {
            button.show();
        }
        list.slice(0, numToShow).show();

        button.click(function(e){
            e.preventDefault();
            var showing = list.filter(':visible').length;
            list.slice(showing - 1, showing + numToShow).fadeIn();
            var nowShowing = list.filter(':visible').length;
            if (nowShowing >= numInList) {
                button.hide();
            }
        });
    };
    for (var i = 1; i <= listsCount; i++) {
        moreItems("#gal" + i);
    }

/*плавный скролл к id*/
    $(".link").click(function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top-68;
        $('body,html').animate({scrollTop: top}, 1500);
        if($( window ).width()<767){
            $('#mobile_menu').fadeOut();
            $('html, body').css('overflow', 'auto');
            $('html, body').css('overflow-x', 'hidden');

        }
    });

/*Заказать звонок со счетчиком*/
    $("#callback .btn").click(function (event) {
        event.preventDefault();
        if($('#callback input[type=text]').val()==''){
            $('#callback input[type=text]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
            setTimeout(
                function() {
                    $('#callback input[type=text]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
                }, 2000
            );
        }else{
            //action отправки заявки
            $('.simple-timer').simpletimer({
                day: 0,
                dayDom: '.timer-day',
                hour: 0,
                hourDom: '.timer-hour',
                minute: 0,
                minuteDom: '.timer-minute',
                second: 5,
                secondDom: '.timer-second',
                millisecond: 0,
                millisecondDom: '.timer-millisecond',
                blank: 100,
                pause: '#pause_btn',
                endFun: function(){
                    //действие по окончанию счетчика
                }
            });
        }
    });

/*фильтр товаров*/
    var filterActive;

    function filterCategory(category) {
        if (filterActive != category) {
            $('.tovars .item').removeClass('active');
            $('.tovars .item')
                .filter('[data-cat="' + category + '"]')
                .addClass('active');
            filterActive = category;
            $('.row_filters a').removeClass('active');
        }
    }
    $('.tovars .item').addClass('active');
    $('.row_filters a').click(function() {
        event.preventDefault();
        if ($(this).hasClass('cat-all')) {
            $('.tovars .item').addClass('active');
            filterActive = 'cat-all';
            $('.row_filters a').removeClass('active');
        } else {
            filterCategory($(this).attr('data-cat'));
        }
        $(this).addClass('active');
    });
    $('#catalog .tab__header.level2>div').click(function() {
        $('.tovars .item').addClass('active');
        $('.tab__content--active .cat-all').addClass('active');
        /* выравнивание блоков по высоте*/
        $('#catalog .tab__content .tovars .item .name').matchHeight();
    });

    $('#commands .items .item .desc .button').click(function() {
        var text = $(this).closest('.desc').find('.name').text();
        $('#get_command .command_name').html(text);
        $('#get_command #get_command_name').val(text);
    });


    if($( window ).width()<=767){
        $('#catalog .tab__header.level2').prepend('<div class="head">Производитель</div>');
        
        $('#catalog .tab__header.level2').click(function(e) {
        $(this).toggleClass('active');
        });
        $('#catalog .tab__header.level2>div').click(function(e) {        
            $(this).closest('.level2').find('.head').text($(this).find('span').text());
        $(this).toggleClass('active');
        });


        $('#catalog .tab__content .row_filters').prepend('<div class="col head">Категория</div>');

        $('#catalog .tab__content .row_filters').click(function(e) {
        $(this).toggleClass('active');
        });
        $('#catalog .tab__content .row_filters .col').click(function(e) {        
            $(this).closest('.row_filters').find('.head').text($(this).find('a').text());
        $(this).toggleClass('active');
        });
    }

    // $('select.new').selectric();

    /*
    $('#calc .block').on('scrollSpy:enter', function() {
		$(this).find('.border:eq(0)').addClass('animate');
		$(this).find('.border:eq(1)').delay(5000).addClass('animate');
		$(this).find('.border:eq(2)').delay(1000).addClass('animate');
    });
    $('#calc .block').scrollSpy();
*/
    /*
    $("#otdel .items .item .btn").click(function (event) {
        event.preventDefault();
        var title = $(this).attr('data-title');
        $('.modal_otdel .title').html(title);
        $('#mail_to_otdel').val(title);
    });
*/


});