(function( $ ){
    var heights = []
    var settings = {
      'spacing' : 20,
      'columns' : 3,
      'selector' : '.grid_4',
      'width': 0,
      'parent': null,
      'gutter': 113,
      'skip' : true
    };
    var methods = {
        init: function(options) {
            settings        = $.extend(settings, options);
            settings.width  = $(settings.selector).first().width();
            settings.parent = $(settings.selector).parent();
            while (heights.length < settings.columns)
                heights.push(0)
            methods.layout()
        },
        reposition: function(options) {
            heights = []
            this.vertical_masonary('destroy')
            this.vertical_masonary('init', options)
        },
        layout: function() {
            $(settings.selector + ':not(.finished)').css('opacity',0)
            settings.skip = ($('[data-column][data-index]:not(.finished)').length == 0)? true : false
            setTimeout(function(){
                methods.pin()
            },0)
        },
        shortest: function() {
            return heights.indexOf(Math.min.apply(null, heights))
        },
        tallest: function() {
            return Math.max.apply(null, heights)
        },
        nextPin: function(c,r) {
            var pin  = $(settings.selector + ':not(.finished):not([data-column]):first')

            if(settings.skip) return pin;

            var stuck    = $('[data-column="' + c + '"][data-index="' + r + '"]:not(.finished):first')
            var stuckies = $('[data-column][data-index="' + r + '"]:not(.finished):first') 
            var stickies = $('[data-column][data-index]:not(.finished):first') 

            if(stickies.length == 0) settings.skip = true;

            if(stuck.length > 0) return stuck
            else if((c == settings.columns - 1) && stuck.length == 0 && stuckies.length > 0)
                return stuckies
            else if(stickies.length > 0 && pin.length == 0 && stuck.length == 0)
                return stickies 
            else return pin
        },
        pin: function() {
            var c    = methods.shortest();
            var r    = $('.column-' + c).length
            var pin  = methods.nextPin(c,r)
            var prev = $(settings.selector+'.finished:last');

            if(pin.length == 0) { 
                settings.parent.height(methods.tallest() + settings.gutter)
                $(settings.selector).css('opacity',1)
                return;
            } 

            if(prev.length == 1 && prev.next() != pin) prev.after(pin);

            var above  = $(settings.selector + '.column-' + c + '.finished:last')
            var top    = (above.length == 1)? Number(above.data("off")) + above.outerHeight() + settings.spacing : settings.spacing
            heights[c] = top + pin.height();

            pin.css({
                "top"   : top,
                "left"  : (c == 0)? 0 : (settings.width * c) + (c * settings.spacing),
                "position": 'absolute'
            }).data("column", c).data("off",top).addClass("finished column-" + c)

            methods.pin()
        },
        destroy: function() {
            this.each(function(){
                $(this).removeAttr("style").removeClass("finished column-" + $(this).data("column"))
            });
        }
    }

  $.fn.vertical_masonary  = function( method ) {
    if ( methods[method] )
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    else if ( typeof method === 'object' || ! method || method == undefined)
      return methods.init.apply( this, arguments );
    else
      $.error( 'method ' +  method + ' does not exist on jQuery.vertical_masonary' );    
  };

})( jQuery );

