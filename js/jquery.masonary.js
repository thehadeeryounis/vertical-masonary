var heights, counts, skip, styleQueue, all_pins;

(function( $ ){
    var settings = {};
    var binded = false
    var original_overrides = undefined
    var methods = {
        original_settings : function() {
            return {
              'spacing' : 10,
              'columns' : 3,
              'selector' : '.masonary-item',
              'width': 0,
              'parent': $('.masonary-holder'),
              'gutter': 0
            } 
        },
        original_overrides : function(options) {
            if(original_overrides == undefined && options == undefined) return methods.original_settings()
            else if(options != undefined) original_overrides = options

            return original_overrides
        },
        init: function(options) {
            skip             = false;
            counts           = []
            heights          = []
            styleQueue       = []
            settings         = $.extend(methods.original_settings(), methods.original_overrides(options));
            settings.parent  = $(settings.parent)
            all_pins         = $(settings.selector, settings.parent)

            if(!all_pins.length) return;

            settings.width   = (settings.width)? settings.width : all_pins.first().width()
            settings.columns = i = methods.columns()

            while (i--) {
                heights[i] = 0;
                counts[i] = 0;
            }

            if(!binded) {
                $(window).resize(methods.reposition)
                binded = true;
            }

            methods.layout(all_pins, [])

        },
        tearDown: function(){
            settings.parent.height(methods.height() + settings.gutter)

            for (i = 0, len = styleQueue.length; i < len; i++) {
                pin = styleQueue[i];
                pin.element['css']( pin.style );
            }
            e = new Date()
            time.text('Masonarized ' + $('.item').length + ' elements in ' + (e - s) + ' ms')
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
                },10);
            }
        },
        layout: function(pins, stickies) {
            if(!methods.inited()) return methods.init();
            if(!pins.length) return;
            styleQueue = []

            length = pins.length + 1
            
            for(i = 0; i < length; i++)
                methods.pin($(pins[i]), methods.shortest())

            methods.tearDown();
        },
        shortest: function() {
            return heights.indexOf(Math.min.apply(null, heights))
        },
        height: function() {
            return Math.max.apply(null, heights)
        },
        pin: function(curr_pin, c) {
            var top    = (heights[c])? heights[c] + settings.spacing : 0
            heights[c] = top + curr_pin.outerHeight()
            counts[c]  = counts[c] + 1

            styleQueue.push({
                element: curr_pin,
                style: {
                    "top"   : top,
                    "left"  : (settings.width * c) + (c * settings.spacing)
                }
            })
        },
        destroy: function() {
            settings.parent.removeAttr('style').height(0)
            $(settings.selector, settings.parent).removeAttr('style')
            skip             = false;
            counts           = []
            heights          = []
            styleQueue       = []
            binded           = false
            settings         = methods.original_settings();
        },
        inited: function(selector) {
            return binded
        }
    }

  $.vertical_masonary  = function( method ) {
    s = new Date();
    if ( methods[method] )
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    else if ( typeof method === 'object' || ! method || method == undefined)
      return methods.init.apply( this, arguments );
    else
      $.error( 'method ' +  method + ' does not exist on jQuery.vertical_masonary' );    
  };

})( jQuery );