var heights, counts, pins, all_pins, stickies , skip;
var styleQueue = [];

(function( $ ){
    var settings = {
      'spacing' : 20,
      'columns' : 3,
      'selector' : '.box',
      'width': 0,
      'parent': 'body',
      'gutter': 113,
      'binded' : false
    }   
    var methods = {
        init: function(options) {
            skip             = false;
            counts           = []
            heights          = []
            settings         = $.extend(settings, options);
            settings.parent  = this
            all_pins         = $(settings.selector + ':not(.stuck)', settings.parent)
            settings.width   = (settings.width)? settings.width : all_pins.first().width()
            settings.columns = i = methods.columns()

            if(!all_pins.length) return;

            while (i--) {
                heights[i] = 0;
                counts[i] = 0;
            }

            if(!settings.binded) {
                $(window).resize(methods.reposition)
                settings.binded = true;
            }

            methods.placement()
        },
        tearDown: function(){
            settings.parent.height(methods.height() + settings.gutter)
            all_pins.addClass("finished")
            for (i = 0, len = styleQueue.length; i < len; i++) {
                pin = styleQueue[i];
                pin.element['css']( pin.style );
            }
            return false;
        },
        columns: function() {
            return parseInt(settings.parent.width()/settings.width)
        },
        reposition: function(force) {
            force = (force == true)? true : false
            if(skip || (!force && methods.columns() == settings.columns && settings.width == parseInt(all_pins.first().width())))       
               return
            else if(methods.columns() == 1) 
               methods.destroy()
            else {
                skip = true;
                setTimeout(function(){
                    methods.destroy();
                    methods.init();
                    skip = false;
                },200);
            }
        },
        layout: function() {
            all_pins = $(settings.selector + ":not(.stuck):not(.finished)", settings.parent)
            methods.placement()
        },
        sort: function() {
            i = stickies.length;
            while(i--) {
                obj = stickies.splice(0,1)
                sticky     = $(obj);
                var column = Number(sticky.data('column'));
                var row    = Number(sticky.data('index'));
                var index  = (row * settings.columns) + column;
                all_pins.splice(index, 0, obj);
                stickies.data('index', row + 1);
            }          
        },
        placement: function() {

            styleQueue = []
            stickies   = $('.stuck', settings.parent)
            
            if(!all_pins.length && !stickies.length) return;
            
            methods.sort();

            for(i = 0; i < all_pins.length; i++)
                methods.pin($(all_pins[i]))

            methods.tearDown();
        },
        shortest: function() {
            return heights.indexOf(Math.min.apply(null, heights))
        },
        height: function() {
            return Math.max.apply(null, heights)
        },
        pin: function(curr_pin) {
            var c      = methods.shortest();
            var top    = heights[c] + settings.spacing
            heights[c] = top + curr_pin.outerHeight(true)
            counts[c]  = counts[c] + 1

            styleQueue.push({
                element: curr_pin,
                style: {
                    "top"   : top,
                    "left"  : (settings.width * c) + (c * settings.spacing),
                    "position": 'absolute'
                }
            })
        },
        destroy: function() {
            all_pins.removeClass("finished").removeAttr("style")
        },
        inited: function(selector) {
            return all_pins.length
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
