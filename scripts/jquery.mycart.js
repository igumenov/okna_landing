/*!
 * jQuery jqCart Plugin v1.1.2
 * requires jQuery v1.9 or later
 *
 * http://incode.pro/
 *
 * Date: Date: 2016-05-18 19:15
 */
;(function($) {
  'use strict';
  var cartData,
    itemData,
    orderPreview = '',
    totalCnt = 0,
    visibleLabel = false,
    // label = $('<div class="jqcart-cart-label"><span class="jqcart-title">Оформить заказ</span><span class="jqcart-total-cnt">0</span></div>'),
    label = $('<a id="open_cart"> <span class="count jqcart-total-cnt">1</span> <span class="name">Корзина</span> <span class="items"><b class="jqcart-total-cnt2">2</b> товара</span> </a>'),
    modal = '<div id="cart" class="jqcart-layout"><div class="jqcart-checkout">123</div></div>',
    orderform = '<p class="jqcart-cart-title">Оформление заказа:</p><p class="text">Заполните поля ниже и мы свяжемся с вами для точнения деталей заказа</p><form class="jqcart-orderform"><input type="text" name="name" placeholder="Имя" class="name"><input type="text" name="tell" placeholder="Телефон" class="tel"><input type="submit" class="btn" value="Оформить заказ"></form>';
  var opts = {
		buttons: '.add_item',
		cartLabel: 'body',
		visibleLabel: false,
		openByAdding: false,
    handler: '/',
		currency: '$'
  };
  var actions = {
    init: function(o) {
      opts = $.extend(opts, o);
      cartData = actions.getStorage();
      if (cartData !== null && Object.keys(cartData).length) {
        for (var key in cartData) {
          if (cartData.hasOwnProperty(key)) {
            totalCnt += cartData[key].count;
          }
        }
        visibleLabel = true;
      }
      label.prependTo(opts.cartLabel)[visibleLabel || opts.visibleLabel ? 'show' : 'hide']()
        .on('click', actions.openCart)
        .find('.jqcart-total-cnt').text(totalCnt);
        $('.jqcart-total-cnt2').text(totalCnt);
        
      if (totalCnt <= 0) {
        $('header .menu ul li.cart').hide();
      }else{
        $('header .menu ul li.cart').show();
      }
      $(document)
        .on('click', opts.buttons, actions.addToCart)
        .on('click', '.jqcart-layout', function(e) {
          if (e.target === this) {
            actions.hideCart();
          }
        })
        .on('click', '.jqcart-incr', actions.changeAmount)
				.on('input keyup', '.jqcart-amount', actions.changeAmount)
        .on('click', '.jqcart-del-item', actions.delFromCart)
        .on('submit', '.jqcart-orderform', actions.sendOrder)
        .on('reset', '.jqcart-orderform', actions.hideCart)
				.on('click', '.jqcart-print-order', actions.printOrder);
      return false;
    },
    addToCart: function(e) {
      e.preventDefault();
      itemData = $(this).data();
      var counts = +$(this).attr('data-counts');
      var animatetype = +$(this).attr('data-animatetype');
			if(typeof itemData.id === 'undefined') {
				console.log('Отсутствует ID товара');
				return false;
			}
      cartData = actions.getStorage() || {};


      if (cartData.hasOwnProperty(itemData.id)) {
        cartData[itemData.id].count = +cartData[itemData.id].count+counts;
      } else {
        itemData.count = counts;
        cartData[itemData.id] = itemData;
      }
      actions.setStorage(cartData);
      actions.changeTotalCnt(counts);
      label.show();
      $('header .menu ul li.cart').show();
			if(opts.openByAdding) {
				actions.openCart();
      }
      // анимация корзины
      if(animatetype == 1){
        $(this).closest('.item').find('img')
        .clone()
        .css({'position' : 'absolute', 'z-index' : '110', top: $(this).offset().top-165, left:$(this).offset().left+10})
        .appendTo("body")
        .animate({opacity: 0.05,
            left: $("#open_cart").offset()['left'],
            top: $("#open_cart").offset()['top'],
            width: 20}, 800, function() {
            $(this).remove();
        });

      }else{
        $(this).closest('.item').find('img')
        .clone()
        .css({'position' : 'absolute', 'z-index' : '110', top: $(this).offset().top-355, left:$(this).offset().left+50})
        .appendTo("body")
        .animate({opacity: 0.05,
            left: $("#open_cart").offset()['left'],
            top: $("#open_cart").offset()['top'],
            width: 20}, 800, function() {
            $(this).remove();
        });
      }

      return false;
    },
    delFromCart: function() {
      var $that = $(this),
        line = $that.closest('.jqcart-tr'),
        itemId = line.data('id');
      cartData = actions.getStorage();
      actions.changeTotalCnt(-cartData[itemId].count);
      delete cartData[itemId];
      actions.setStorage(cartData);
      line.remove();
      actions.recalcSum();
      return false;
    },
    changeAmount: function() {
      var $that = $(this),
				manually = $that.hasClass('jqcart-amount'),
        amount = +(manually ? $that.val() : $that.data('incr')),
        itemId = $that.closest('.jqcart-tr').data('id');
      cartData = actions.getStorage();
			if(manually) {
      	cartData[itemId].count = isNaN(amount) || amount < 1 ? 1 : amount;
			} else {
				cartData[itemId].count += amount;
			}
      if (cartData[itemId].count < 1) {
        cartData[itemId].count = 1;
      }
			if(manually) {
				$that.val(cartData[itemId].count);
			} else {
      	$that.siblings('input').val(cartData[itemId].count);
			}
      actions.setStorage(cartData);
      actions.recalcSum();
      return false;
    },
    recalcSum: function() {
      var subtotal = 0,
        amount,
        sum = 0,
        totalCnt = 0,
        prices = 0;
      $('.jqcart-tr').each(function() {
        //amount = +$('.jqcart-amount', this).val();
        amount = +$('.count', this).attr('data-count');
        prices = +$('.count', this).attr('data-price');
        sum = Math.ceil((amount * prices) * 100) / 100;
        $('.jqcart-sum', this).html(sum + ' ' + opts.currency+'<span>Стоимость</span>');
				subtotal = Math.ceil((subtotal + sum) * 100) / 100;
        totalCnt += amount;
        console.log(totalCnt);
      });
      $('.jqcart-subtotal strong').text(subtotal);
      $('.jqcart-total-cnt').text(totalCnt);
      $('.jqcart-total-cnt2').text(totalCnt);

      if (totalCnt <= 0) {
        actions.hideCart();
        $.fancybox.close();
        $('header .menu ul li.cart').hide();
				if(!opts.visibleLabel) {
        	label.hide();
				}
      }
      return false;
    },
    changeTotalCnt: function(n) {
      var cntOutput = $('.jqcart-total-cnt');
      cntOutput.text((+cntOutput.text() + n));
      var cntOutput2 = $('.jqcart-total-cnt2');
      cntOutput2.text((+cntOutput2.text() + n));
      return false;
    },
    openCart: function() {
      var subtotal = 0,
			cartHtml = '';
      cartData = actions.getStorage();
      orderPreview = '<p class="jqcart-cart-title">Корзина <span class="jqcart-print-order"></span></p><div class="jqcart-table-wrapper"><div class="jqcart-manage-order">';
      var key, sum = 0;
      for (key in cartData) {
        if (cartData.hasOwnProperty(key)) {
					sum = Math.ceil((cartData[key].count * cartData[key].price) * 100) / 100;
					subtotal = Math.ceil((subtotal + sum) * 100) / 100;
					
          orderPreview += '<div class="jqcart-tr" data-id="' + cartData[key].id + '">';
					//orderPreview += '<div class="jqcart-small-td">' + cartData[key].id + '</div>';
					orderPreview += '<div class="jqcart-small-td jqcart-item-img"><img src="' + cartData[key].img + '" alt=""></div>';
          orderPreview += '<div>' + cartData[key].title;
          if(cartData[key].desc){
            orderPreview += '<span>' + cartData[key].desc + '</span>';
          }
          orderPreview += '</div>';
          //orderPreview += '<div><span class="jqcart-incr" data-incr="-1">&#8211;</span><input type="text" class="jqcart-amount" value="' + cartData[key].count + '"><span class="jqcart-incr" data-incr="1">+</span></div>';
          orderPreview += '<div class="count" data-count="' + cartData[key].count + '"  data-price="' + cartData[key].price + '">'+ cartData[key].count +' шт. <span>Кол-во</span></div>';
          //orderPreview += '<div class="jqcart-price">' + cartData[key].price + '₽ <span>Стоимость</span></div>';
          orderPreview += '<div class="jqcart-sum">' + sum + '₽ <span>Стоимость</span></div>';
					orderPreview += '<div class="jqcart-small-td"><span class="jqcart-del-item"><svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 70"><title>noun_712753_cc</title><path d="M45.2,63.4A1.67,1.67,0,0,1,43.5,65h-32a1.73,1.73,0,0,1-1.7-1.6L8,19.4a2.5,2.5,0,1,0-5,.2l1.8,44A6.71,6.71,0,0,0,11.5,70h32a6.78,6.78,0,0,0,6.7-6.4l1.8-44a2.5,2.5,0,0,0-5-.2ZM25.5,57.5a2,2,0,0,0,4,0v-34a2,2,0,0,0-4,0Zm-10,.1a2,2,0,1,0,4-.2l-1-34a2,2,0,0,0-4,.2Zm20-.2a2,2,0,1,0,4,.2l1-34a2,2,0,0,0-4-.2ZM39.8,8.5l-1-3.3A7.42,7.42,0,0,0,31.9,0h-9A7.48,7.48,0,0,0,16,5.2L15,8.5H2.5a2.5,2.5,0,0,0,0,5h50a2.5,2.5,0,0,0,0-5ZM32,5H23a2.44,2.44,0,0,0-2,1.5l-.6,2H34.6l-.6-2A2.44,2.44,0,0,0,32,5Z"/></svg></span><span>Удалить</span></div>';
          orderPreview += '</div>';
        }
      }
      orderPreview += '</div></div>';
      //orderPreview += '<div class="jqcart-subtotal">Итого: <strong>'+ subtotal +'</strong>'+opts.currency + '</div>';
			
      cartHtml = subtotal ? ('<div id="cart"><div class="cols"><div class="col list">'+orderPreview+'</div><div class="col order">' + orderform+'<br/><div class="jqcart-subtotal">Итого: <strong>'+ subtotal +'</strong>'+opts.currency + '</div></div></div></div>') : '<h2 class="jqcart-empty-cart">Корзина пуста</h2>';
      
      $.fancybox.open({
        src  : cartHtml,
        type: 'inline',  
        touch :false,
        afterShow : function( instance, current ) {
            $("input.tel").mask("+7(999)999-99-99");
            console.log(1);
        },

      });
    },
    hideCart: function() {
      $('.jqcart-layout').fadeOut('fast', function() {
        $(this).remove();
      });
      return false;
    },
    sendOrder: function(e) {
      e.preventDefault();
      var $that = $(this);
      if ($('#cart input[name=name]').val() === '') {
        $('#cart input[name=name]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
        setTimeout(
          function() {
            $('#cart input[name=name]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
          }, 2000
        );
      }
      if ($('#cart input[name=tell]').val() === '') {
        $('#cart input[name=tell]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
        setTimeout(
          function() {
            $('#cart input[name=tell]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
          }, 2000
        );
      }
      if($('#cart input[name=name]').val() != '' && $('#cart input[name=tell]').val() != ''){
        $.ajax({
          url: opts.handler,
          type: 'POST',
          dataType: 'json',
          data: {
            orderlist: $.param(actions.getStorage()),
            userdata: $that.serialize()
          },
          error: function() {},
          success: function(resp) {
            $.fancybox.close();
            $.fancybox.open('<div class="sended"><div class="row"> <div class="img"></div> <div class="text">Спасибо<span>Ваша заявка отправлена</span></div></div> </div>');
            if(!resp.errors) {
              setTimeout(methods.clearCart, 2000);
            }
          }
        });

      }
    },
		printOrder: function (){
			var data = $(this).closest('.jqcart-checkout').prop('outerHTML');
			if(!data) {
				return false;
			}
			var win = window.open('', 'Печать заказа', 'width='+screen.width+',height='+screen.height),
			cssHref = $(win.opener.document).find('link[href$="jqcart.css"]').attr('href'),
			d = new Date(),
			curDate = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
			
			
			win.document.write('<html><head><title>Заказ ' + curDate + '</title>');
			win.document.write('<link rel="stylesheet" href="' + cssHref + '" type="text/css" />');
			win.document.write('</head><body >');
			win.document.write(data);
			win.document.write('</body></html>');
			
			setTimeout(function(){
				win.document.close(); // нужно для IE >= 10
				win.focus(); // нужно для IE >= 10			
				win.print();
				win.close();
			}, 100);
			
			return true;
		},
    setStorage: function(o) {
      localStorage.setItem('jqcart', JSON.stringify(o));
      return false;
    },
    getStorage: function() {
      return JSON.parse(localStorage.getItem('jqcart'));
    }
  };
  var methods = {
		clearCart: function(){
			localStorage.removeItem('jqcart');
			label[opts.visibleLabel ? 'show' : 'hide']().find('.jqcart-total-cnt').text(0);
			label[opts.visibleLabel ? 'show' : 'hide']().find('.jqcart-total-cnt2').text(0);
			actions.hideCart();
		},
		closeCart: function(){
			actions.hideCart();
		},
		openCart: actions.openCart,
		printOrder: actions.printOrder,
		test: function(){
			actions.getStorage();
		}
	};
  $.jqCart = function(opts) {
    if (methods[opts]) {
      return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof opts === 'object' || !opts) {
      return actions.init.apply(this, arguments);
    } else {
      $.error('Метод с именем "' + opts + '" не существует!');
    }
  };
})(jQuery);

