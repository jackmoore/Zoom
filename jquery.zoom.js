/*!
	Zoom v1.7.8 - 2013-07-30
	Enlarge images on click or mouseover.
	(c) 2013 Jack Moore - http://www.jacklmoore.com/zoom
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {
	var defaults = {
		url: false,
		callback: false,
		target: false,
		duration: 120,
		on: 'mouseover', // other options: 'grab', 'click', 'toggle'
		onZoomIn: false,
		onZoomOut: false
	};

	// Core Zoom Logic, independent of event listeners.
	$.zoom = function(target, source, img) {
		var outerWidth,
			outerHeight,
			xRatio,
			yRatio,
			offset,
			position = $(target).css('position');

		// The parent element needs positioning so that the zoomed element can be correctly positioned within.
		$(target).css({
			position: /(absolute|fixed)/.test(position) ? position : 'relative',
			overflow: 'hidden'
		});

		img.style.width = img.style.height = '';

		$(img)
			.addClass('zoomImg')
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				opacity: 0,
				width: img.width,
				height: img.height,
				border: 'none',
				maxWidth: 'none'
			})
			.appendTo(target);

		return {
			init: function() {
				outerWidth = $(target).outerWidth();
				outerHeight = $(target).outerHeight();
				xRatio = (img.width - outerWidth) / $(source).outerWidth();
				yRatio = (img.height - outerHeight) / $(source).outerHeight();
				offset = $(source).offset();
			},
			move: function (e) {
				var left = (e.pageX - offset.left),
					top = (e.pageY - offset.top);

				top = Math.max(Math.min(top, outerHeight), 0);
				left = Math.max(Math.min(left, outerWidth), 0);

				img.style.left = (left * -xRatio) + 'px';
				img.style.top = (top * -yRatio) + 'px';
			}
		};
	};

	$.fn.zoom = function (options) {
		return this.each(function () {
			var
			settings = $.extend({}, defaults, options || {}),
			//target will display the zoomed image
			target = settings.target || this,
			//source will provide zoom location info (thumbnail)
			source = this,
			img = document.createElement('img'),
			$img = $(img),
			mousemove = 'mousemove.zoom',
			clicked = false,
			$urlElement;

			// If a url wasn't specified, look for an image element.
			if (!settings.url) {
				$urlElement = $(source).find('img');
				if ($urlElement[0]) {
					settings.url = $urlElement.data('src') || $urlElement.attr('src');
				}
				if (!settings.url) {
					return;
				}
			}

			img.onload = function () {
				var zoom = $.zoom(target, source, img);

				function start(e) {
					zoom.init();
					zoom.move(e);

					// Skip the fade-in for IE8 and lower since it chokes on fading-in
					// and changing position based on mousemovement at the same time.
					$img.stop()
					.fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn) ? settings.onZoomIn.call(img) : false);
				}

				function stop() {
					$img.stop()
					.fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false);
				}

				if (settings.on === 'grab') {
					$(source)
						.on('mousedown.zoom',
							function (e) {
								if (e.which === 1) {
									$(document).one('mouseup.zoom',
										function () {
											stop();

											$(document).off(mousemove, zoom.move);
										}
									);

									start(e);

									$(document).on(mousemove, zoom.move);

									e.preventDefault();
								}
							}
						)
						.on('touchstart.zoom', function (e) { 
							e.preventDefault();
							start( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
						})
						.on('touchmove.zoom', function (e) { 
							e.preventDefault();
							zoom.move( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
						})
						.on('touchend.zoom', stop);

				} else if (settings.on === 'click') {
					$(source).on('click.zoom',
						function (e) {
							if (clicked) {
								// bubble the event up to the document to trigger the unbind.
								return;
							} else {
								clicked = true;
								start(e);
								$(document)
									.on(mousemove, zoom.move)
									.on('touchstart.zoom', function (e) { 
										// no e.preventDefault() cause it will be impossible to turn off with a click
										start( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
									})
									.on('touchmove.zoom', function (e) { 
										e.preventDefault();
										zoom.move( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
									});
								$(document).one('click.zoom',
									function () {
										stop();
										clicked = false;
										$(document)
											.off(mousemove, zoom.move)
											.off('touchstart.zoom')
											.off('touchmove.zoom');
									}
								);
								return false;
							}
						}
					);
				} else if (settings.on === 'toggle') {
					$(source).on('click.zoom',
						function (e) {
							if (clicked) {
								stop();
							} else {
								start(e);
							}
							clicked = !clicked;
						}
					);
				} else {
					zoom.init(); // Preemptively call init because IE7 will fire the mousemove handler before the hover handler.

					$(source)
						.on('mouseenter.zoom', start)
						.on('mouseleave.zoom', stop)
						.on(mousemove, zoom.move)
						.on('touchstart.zoom', function (e) { 
							e.preventDefault();
							start( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
						})
						.on('touchmove.zoom', function (e) { 
							e.preventDefault();
							zoom.move( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
						})
						.on('touchend.zoom', stop);
				}

				if ($.isFunction(settings.callback)) {
					settings.callback.call(img);
				}
			};

			img.src = settings.url;

			$(source).one('zoom.destroy', function(){
				$(source).off(".zoom");
				$img.remove();
			});
		});
	};

	$.fn.zoom.defaults = defaults;
}(window.jQuery));
