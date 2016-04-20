/**
 * jQuery Angle View v1.3
 *
 * @author Dymyw <dymayongwei@163.com>
 * @since 2013-12-23
 * @version 2014-09-03
 */

(function($) {
    // plugin definition
    $.fn.angle = function(configs) {
        if ('object' === typeof configs) {
            return this.each(function() {
                new $.angle(this, configs);
            });
        } else {
            var $angle = this.data('angle');
            switch (configs) {
                case 'resize':
                    $angle.init(); break;
            }
        }
    };

    /**
     * plugin defaults - added as a property on our plugin function
     *
     * @param float speed       show speed, default: 2
     * @param boolean drag      mouse drag or mouse over
     * @param selector previous click to display the previous
     * @param selector next     click to display the next
	 * @param integer current	set the display one
     * @param get_image         get image: js array object
     * @param after         	after: exec after every angle slide
     */
    $.fn.angle.defaults = {
        speed: 2,
        drag: false,
        previous: '',
        next: '',
        current: 0,
        get_image: function() {},
        after: function() {}
    };

    // object instance
    $.angle = function(container, configs) {
        var options = $.extend({}, $.fn.angle.defaults, configs);
        // store a reference to the slider object
        var $angle = $(container);
        $.data(container, 'angle', $angle);

        var width, firstImage, imageLeft, allImage, imageCount, changeWidth;

        var step = 0;
        var currentStep = 0;
        var currentImage;
        $angle.attr('data-current', options.current);

        var start = false;
        var startDrag = false;
        var startTouch = false;
        var isScrolling;
        var load = true;

        var init = function() {
            // get the parentNode width
            width = $(container.parentNode).css('width');
            if (!width || width.indexOf('%') !== -1) {
                width = container.parentNode.getBoundingClientRect().width || container.parentNode.offsetWidth;
            }
            width = parseInt(width);
            //$angle.width(width);

            firstImage = $angle.find('img:first');
            imageLeft = firstImage.offset().left;
            allImage = $angle.find('img');
            allImage.each(function(i) {
//                $(this).width(width);
                $(this).attr('data-id', i);
            });
            imageCount = allImage.size();
            changeWidth = parseInt(width / imageCount / options.speed);
            allImage.toggle();
            currentImage = $angle.data('current');
            allImage.eq(currentImage).toggle();
        };

        var loading = function() {
            load = false;
            var images = options.get_image();
            if ('object' === typeof images) {
                var ulString = '';
                for (var i in images) {
                    ulString += '<li><img src="' + images[i] + '" /></li>';
                }
                $(container).children('ul').html(ulString);
                init();
                mouseEvent();
            }
        };

        if (options.previous) {
            $(options.previous).click(function() {
                if (load) { loading(); }
                prev();
            });
        }
        if (options.next) {
            $(options.next).click(function() {
                if (load) { loading(); }
                next();
            });
        }

        var prev = function() {
            allImage.eq(currentImage).toggle();
            currentImage = circle(currentImage - 1);
            allImage.eq(currentImage).toggle();
            $angle.attr('data-current', currentImage);
            // callback function after
            _loadFn(options.after());
        };

        var next = function() {
            allImage.eq(currentImage).toggle();
            currentImage = circle(currentImage + 1);
            allImage.eq(currentImage).toggle();
            $angle.attr('data-current', currentImage);
            // callback function after
            _loadFn(options.after());
        };

        var circle = function(index) {
            return (imageCount + (index % imageCount)) % imageCount;
        };

        // touch event
        var bindTouchEvent = {
            handleEvent: function(event) {
                switch (event.type) {
                    case 'touchstart':
                        this.start(event);
                        break;
                    case 'touchmove':
                        this.move(event);
                        break;
                    case 'touchend':
                        this.end();
                        break;
                }
            },

            start: function(event) {
                startTouch = true;

                if (startTouch) {
                    var touchs = event.touches[0];
                    startPos = {
                        x: touchs.pageX,
                        y: touchs.pageY
                    };

                    if (load) { loading(); }
                    step = currentStep = parseInt((startPos.x - imageLeft) / changeWidth);

                    // used for testing first move event
                    isScrolling = undefined;

                    // reset delta and end measurements
                    delta = {};

                    // attach touchmove and touchend listeners
                    container.addEventListener('touchmove', this, false);
                    container.addEventListener('touchend', this, false);
                }
            },

            move: function(event) {
                if (startTouch) {
                    var touchs = event.touches[0];
                    delta = {
                        x: touchs.pageX - startPos.x,
                        y: touchs.pageY - startPos.y
                    };

                    // determine if scrolling test has run - one time test
                    if ('undefined' === typeof isScrolling) {
                        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                    }

                    if (!isScrolling) {
                        event.preventDefault();

                        currentStep = parseInt((touchs.pageX - imageLeft) / changeWidth);
                        if (currentStep !== step) {
                            currentStep > step ? next() : prev();
                            step = currentStep;
                        }
                    }
                }
            },

            end: function() {
                startTouch = false;

                // kill touchmove and touchend event listeners until touchstart called again
                container.removeEventListener('touchmove', this, false);
                container.removeEventListener('touchend', this, false);
            }
        };

        // bind mouse event
        var mouseEvent = function() {
            if (options.drag) {
                var dragX = null;
                // all images are forbidden to drag
                for (i in document.images)
                    document.images[i].ondragstart = function() {return false;};

                $(container).mousedown(function(event) {
                    startDrag = true;

                    if (startDrag) {
                        dragX = event.screenX;

                        if (load) { loading(); }
                        step = currentStep = parseInt((dragX - imageLeft) / changeWidth);
                    }
                });

                $(container).mousemove(function(event) {
                    if (startDrag && dragX) {
                        event.preventDefault();

                        currentStep = parseInt((event.screenX - imageLeft) / changeWidth);
                        if (currentStep !== step) {
                            currentStep > step ? next() : prev();
                            step = currentStep;
                        }
                    }
                });

                $(container).mouseup(function() {
                    start = false;
                    dragX = null;
                });
            } else {
                $(container).mouseover(function(event) {
                    start = true;

                    if (start) {
                        if (load) { loading(); }
                        step = currentStep = parseInt((event.screenX - imageLeft) / changeWidth);
                    }
                });

                $(container).mousemove(function(event) {
                    if (start) {
                        currentStep = parseInt((event.screenX - imageLeft) / changeWidth);
                        if (currentStep !== step) {
                            currentStep > step ? next() : prev();
                            step = currentStep;
                        }
                    }
                });

                $(container).mouseout(function() {
                    start = false;
                });
            }
        };

        // bind touch event
        if ('ontouchstart' in window) {
            container.addEventListener('touchstart', bindTouchEvent, false);
        }

        $angle.setPosition = function(i) {
            this.find("img[data-id='" + i + "']").css('display', 'inline');
            this.find("img[data-id!='" + i + "']").css('display', 'none');
            $angle.attr('data-current', i);
            currentImage = i;
        };

        var _loadFn = function(fn) {
            setTimeout(function() {
                fn;
            }, 0);
        };

        init();
        mouseEvent();
    };

    // private function - debugging
    function debug(obj) {
        if (window.console && window.console.log)
            window.console.log(obj);
    }
})(jQuery);
