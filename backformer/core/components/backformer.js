/**
 * Backformer - Simple, flexible ajax webform.
 *
 * @author Rugoals <rugoals@gmail.com>
 * @license Apache 2.0
 * @link https://github.com/Rugoals/backformer/
 * @version 2.5
 */

//jQuery.noConflict();

(function($) {
    $(function() {
        "use strict";

        var bf_path = '/backformer';

        var bf = {
            init: function() {

                bf.bind_event_capcha();
                bf.bind_event_popup();
                bf.init_form();

            },
            bind_event_popup: function() {
                $('[data-bf-config]').on("click", function(e) {
                    e.preventDefault();

                    var config = $(this).data("bf-config");

                    if (typeof config == 'undefined' || config.length < 1) {
                        config = 'default';
                    }

                    var button = $(this);

                    $.ajax({
                        url: bf_path + '/init.php',
                        data: {
                            'bf-config': config,
                            'type': "form"
                        },
                        method: "post",
                        dataType: "html",
                        beforeSend: function(xhr) {
                            $('body').append('<div class="bf-loading"></div>');
                        },
                        success: function(xhr) {

                            $('body').append(xhr);
                            $('.bf-loading').remove();
                            $('.bf-fixed-overlay').show();

                            //set custom param in form
                            var attributes = bf.bind_custom_popup_params(button);

                            if (typeof attributes == 'undefined' || attributes.length < 1) {

                            } else {
                                $.each(attributes, function(i, val) {
                                    $('.'+i).html(val);
                                });
                            }

                            //set add param 
                            var field_h1 = $('h1').html();

                            if (typeof field_h1 == 'undefined' || field_h1.length < 1) {

                            } else { 
                                 $('.bf-page-h1').html(field_h1);
                            }
                            $('.bf-page-link').html(document.location.href); 

                            $(".bf-img-capcha").off();
                            bf.bind_event_capcha(); //set refresh for click image
                            bf.update_capcha();

                            $("form[data-bf-config]").off();

                            bf.init_form(config, attributes);
                            bf.bind_close_popup();
                        }
                    })
                });

                $('form[data-bf-config]').off();
            },
            bind_custom_popup_params: function(button) {

                var attributes = {};
                var attr_el = '';

                if (button.length) {
                    $.each(button[0].attributes, function(index, attr) {
                        attr_el = attr.name;
                        if (/data\-bf\-field/.test(attr_el)) {
                            attr_el = attr_el.replace('data-', '');
                            attributes[attr_el] = attr.value;
                        }
                    });
                }
                return attributes;

            },
            bind_close_popup: function() {
                $(".bf-modal-close, .bf-fixed-overlay").on("click", function() {
                    $(".bf-fixed-overlay").remove();
                });

                $(".bf-modal").on("click", function(e) {
                    e.stopImmediatePropagation();
                });
            },
            bind_event_capcha: function() {
                $("[src*='captcha.php']").on("click", function() {
                    bf.update_capcha();
                });
            },
            update_capcha: function() {
                $("[src*='captcha.php']").attr('src', bf_path + '/captcha.php?' + Math.random())
            },
            init_form: function(config_popup, attributes) {

                $('form[data-bf-config]').on('submit', function(e) {
                    e.preventDefault();

                    var options = {
                        success: bf.showResponse, // post-submit callback  
                        url: bf_path + '/init.php',
                        type: 'post',
                        dataType: 'json'
                    };

                    var form = $(this);

                    var config = form.data("bf-config");

                    if (typeof config_popup == 'undefined' || config_popup.length < 1) {
                        if (typeof config == 'undefined' || config.length < 1) {
                            config = 'default';
                        }
                    } else {
                        config = config_popup;
                    }
 
                    $.post(
                        bf_path + "/init.php", {
                            'type': 'token',
                            'bf-config': config
                        },
                        function(data) {
                            $('[name="bf-config"]').remove();
                            $('[name="bf-token"]').remove();

                            //add custom field
                            if (typeof attributes == 'undefined' || attributes.length < 1) {

                            } else {
                                $.each(attributes, function(i, val) {
                                    i = i.replace(/\-/g,'_');
                                    form.append('<input name="' + i + '" type="hidden" value="' + val + '" />');
                                });
                            }

                            //add page info
                            var field_h1 = $('h1').html();
                            if (typeof field_h1 == 'undefined' || field_h1.length < 1) {

                            } else {
                                form.append('<input name="bf_page_h1" type="hidden" value="' + field_h1 + '" />');
                            }
                            form.append('<input name="bf_page_link" type="hidden" value="' + document.location.href + '" />');

                            //set config
                            form.append('<input name="bf-config" type="hidden" value="' + config + '" />');
                            //set spam protection
                            form.append('<input name="bf-token" type="hidden" value="' + data['token'] + '" />');
                            //set submit form
                            form.ajaxSubmit(options);
                        }
                    );
                });
            },
            showResponse: function(responseText, statusText, xhr, $form) {

                $('.bf-status ').remove();
                //$form.before('<div class="bf-status bf-status-' + responseText['status'] + '">' + responseText['value'] + '</div>');
				var form_config = $form.find('input[name=bf-config]');
				if (responseText['status'] == 0) {
					//default - форма калькулятора
					// ниже валидация для default конфига
					if(form_config.val()=='default'){
						if($('#calc .block .cols .col input[type=text].name').val()==''){
							$('#calc .block .cols .col input[type=text].name').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#calc .block .cols .col input[type=text].name').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#calc .block .cols .col input[type=text].tel').val()==''){
							$('#calc .block .cols .col input[type=text].tel').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#calc .block .cols .col input[type=text].tel').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#calc .block .cols .col .checkbox input[name=rules]:checked').length == 0){
							$('#calc .block .cols.nospace .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#calc .block .cols.nospace .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					// ниже валидация to_command
					if(form_config.val()=='to_command'){
						if($('#to_command input[name=name]').val()==''){
							$('#to_command input[name=name]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#to_command input[name=name]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#to_command input[name=tel]').val()==''){
							$('#to_command input[name=tel]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#to_command input[name=tel]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#to_command .checkbox input[name=rules]:checked').length == 0){
							$('#to_command .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#to_command .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					// ниже валидация get_command
					if(form_config.val()=='get_command'){
						if($('#get_command input[name=name]').val()==''){
							$('#get_command input[name=name]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#get_command input[name=name]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#get_command input[name=tel]').val()==''){
							$('#get_command input[name=tel]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#get_command input[name=tel]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#get_command .checkbox input[name=rules]:checked').length == 0){
							$('#get_command .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#get_command .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					// ниже валидация для СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ ДЛЯ КОММЕРЧЕСКИХ ОРГАНИЗАЦИЙ конфига
					if(form_config.val()=='special'){
						if($('#special .container .block form input[type=text]').val()==''){
							$('#special .container .block form input[type=text]').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#special .container .block form input[type=text]').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#special .container .block form .checkbox input[name=rules]:checked').length == 0){
							$('#special .container .block form .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#special .container .block form .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					// ниже валидация для ОСТАЛИСЬ ВОПРОСЫ? конфига
					if(form_config.val()=='ask'){
						if($('#have_ask .block form .col input[type=text].name').val()==''){
							$('#have_ask .block form .col input[type=text].name').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#have_ask .block form .col input[type=text].name').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#have_ask .block form .col input[type=text].tel').val()==''){
							$('#have_ask .block form .col input[type=text].tel').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#have_ask .block form .col input[type=text].tel').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#have_ask .block form .col .checkbox input[name=rules]:checked').length == 0){
							$('#have_ask .block form .col .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#have_ask .block form .col .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					// ниже валидация для предложить сотрудничество конфига
					if(form_config.val()=='partner'){
						if($('#partner_modal input[type=text].name').val()==''){
							$('#partner_modal input[type=text].name').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#partner_modal input[type=text].name').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#partner_modal input[type=text].tel').val()==''){
							$('#partner_modal input[type=text].tel').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#partner_modal input[type=text].tel').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#partner_modal .checkbox input[name=rules]:checked').length == 0){
							$('#partner_modal .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#partner_modal .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					// ниже валидация для калькуоятор штукатурки конфига
					if(form_config.val()=='calc2'){
						if($('#calc .block .cols .col input[type=text].name').val()==''){
							$('#calc .block .cols .col input[type=text].name').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#calc .block .cols .col input[type=text].name').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#calc .block .cols .col input[type=text].tel').val()==''){
							$('#calc .block .cols .col input[type=text].tel').css({'border': '1px solid #f00', 'box-shadow' : 'rgba(247, 57, 0, 0.72) 0px 0px 10px'});
							setTimeout(
								function() {
									$('#calc .block .cols .col input[type=text].tel').css({'border': '1px solid #d7d7d7', 'box-shadow' : 'initial'});
								}, 2000
							);
						}
						if($('#calc .block .cols .col .checkbox input[name=rules]:checked').length == 0){
							$('#calc .block .cols.nospace .checkbox').addClass('shake');
							setTimeout(
								function() {
									$('#calc .block .cols.nospace .checkbox').removeClass('shake');
								}, 500
							);
						}
					}
					
				}
                if (responseText['status'] > 0) {
                    //$form.hide();
                    bf.update_capcha();
                    $.fancybox.close();
					$.fancybox.open('<div class="sended"><div class="row"> <div class="img"></div> <div class="text">Спасибо<span>Ваша заявка отправлена</span></div></div> </div>');
                    setTimeout(
                        function() {
                            $('.bf-modal-close').click(); //if popup
							$.fancybox.close();
                            $form.clearForm();
                            //$('.bf-status').remove();
                        }, 4000
                    );

                }
            }
        }

        bf.init();

    });

})(jQuery);
