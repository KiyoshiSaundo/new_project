var vw = window.innerWidth;
var vh = window.innerHeight;
var sw = screen.width;
var sh = screen.height;
var pageScroll = window.pageYOffset || document.documentElement.scrollTop;

jQuery(document).ready(function ($) {

	/* PARAMS */

	$(window).resize(function () {
		vw = window.innerWidth;
		vh = window.innerHeight;
		sw = screen.width;
		sh = screen.height;
	});

	$(document).scroll(function () {
		pageScroll = window.pageYOffset || document.documentElement.scrollTop;
	});

	initInput();

	/* ACTIONS */

	// плавный скрол до элемента и отключение действий для ссылок "#"
	$('[href^="#"]').click(function (e) {
		e.preventDefault();
		if ($(this).attr('href').length > 1) {
			scroll2element(
				$($(this).attr('href')),
				1000,
				0,
				false
			);
		}
	});

	// placeholders
	var placeholder = '';
	$(document).on('focusin', 'input, textarea', function () {
		placeholder = $(this).attr('placeholder');
		$(this).attr('placeholder', '');
	});
	$(document).on('focusout', 'input, textarea', function () {
		$(this).attr('placeholder', placeholder);
	});
	// end - placeholders

	// ajax forms
	$(document).on('submit', '[data-form-ajax]', function (e) {
		e.preventDefault();
		sendForm($(this));
	});

});

/* FUNCTIONS */

function sendForm($el) {
	var $form = $el,
		$btn = $form.find('button'),
		fd = new FormData($form[0]);

	if ($btn.hasClass('is-disabled')) return;

	$.ajax({
		url: $form.attr('action'),
		type: $form.attr('method'),
		data: fd,
		processData: false,
		contentType: false,
		dataType: 'json',
		// dataType: 'html',
		beforeSend: function () {
			hideErrorFields($form);
			showBtnLoaded($btn);
		},
		success: function (data) {
			// console.log('form success', data);
			setTimeout(function () {
				hideBtnLoaded($btn);
				initInput();

				if (data.messages) {
					console.log(data.messages);
				}
				if (data.errors) {
					showErrorFields($form, data.errors);
				}
				if (data.result) {
					$form[0].reset();
				}
			}, 500);
		},
		error: function (data) {
			// console.log('form error:', data);
			setTimeout(function () {
				hideErrorFields($form);
				hideBtnLoaded($btn);
			}, 500);
		}
	});

	function showErrorFields($form, errors) {
		$.each(errors, function (i, val) {
			$el = $form.find("[name='" + val + "']");
			if ($el.length) $el.addClass('is-error');
		});
	}
	function hideErrorFields($form) {
		$form.find('.error').removeClass('is-error');
	}

	function showBtnLoaded($btn) {
		$btn.addClass('is-disabled');
	}
	function hideBtnLoaded($btn) {
		$btn.removeClass('is-disabled');
	}
}

function initInput() {
	if ($().datepicker) {
		$('input.date').datepicker({
			autoClose: true,
			toggleSelected: false,
			keyboardNav: false,
			minDate: new Date()
		});
	}
	if ($().mask) {
		$(".phone").mask("+7 (999) 999 99 99", { placeholder: "+7 (   )          " });
	}
	if ($().styler) {
		setTimeout(function () {
			$("select:not(.nostyle), input[type='checkbox'], input[type='radio']").styler({
				singleSelectzIndex: 10
			});
		}, 100);
	}
}

/**
 * Прокрутка страницы до определенного элемента, если он не в поле видимости
 *
 * @param  {jQuery} $el ссылка на объект
 * @param  {string | number} speed скорость прокрутки
 * @param  {number} offset смещение от начала страницы
 * @param  {boolean} edges нужно ли учитывать видимость объекта
 */
function scroll2element($el, speed, offset, edges) {
	if (speed == undefined) speed = 'slow';
	if (offset == undefined) offset = 50;
	if (edges == undefined) edges = true;

	var scroll = $el.offset().top - offset,
		topEdge = window.pageYOffset,
		bottomEdge = window.pageYOffset + document.documentElement.clientHeight
		bNeedScroll = edges ? (scroll < topEdge || scroll > bottomEdge) : true;

	if (bNeedScroll) {
		$('html, body').animate({
			scrollTop: scroll+'px'
		}, speed);
	}
}