var heights, counts, skip;
var styleQueue = [];
var to_stick = [];
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
            styleQueue       = [];
            settings         = $.extend(settings, options);
            settings.parent  = this
            all_pins         = $(settings.selector, settings.parent)
            stickies         = $('.stuck', settings.parent)
            settings.width   = (settings.width)? settings.width : (all_pins.length)? all_pins.first().width() : stickies.first().width()
            settings.columns = i = methods.columns()

            if(!all_pins.length && !stickies) return;

            while (i--) {
                heights[i] = 0;
                counts[i] = 0;
            }

            if(!settings.binded) {
                $(window).resize(methods.reposition)
                settings.binded = true;
            }

            methods.layout(all_pins, stickies)
        },
        tearDown: function(){
            settings.parent.height(methods.height() + settings.gutter)
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
        sort: function(stickies) {
            for(i = 0; i < stickies.length; i++) {
                obj = stickies[i]
                sticky     = $(obj);
                var column = Number(sticky.data('column'));
                var row    = Number(sticky.data('index'));
                var index  = (row * settings.columns) + column;
                to_stick[i] = index;
                stickies.filter('[data-column="' + column + '"][data-index="' + row + '"]').attr('data-index', row + 1);
            }          
        },
        layout: function(pins, stickies) {

            to_stick = []
            styleQueue = []

            if(!pins.length && !stickies.length) return;
            

            methods.sort(stickies);
            
            length = pins.length
            
            j = 0;
            
            for(i = 0; i < length + 1; i++) {
                var c      = methods.shortest();
                var index  = (counts[c] * settings.columns) + c;
                var pin;

                if(index == to_stick[j]) {
                    pin = $(stickies[j])
                    i--;
                    j++;
                }
                else 
                    pin = $(pins[i])

                if(pin.length) methods.pin(pin, c)
            }

            for(j; j < to_stick.length; j ++)
                methods.pin($(stickies[j]), methods.shortest())

            methods.tearDown();
        },
        shortest: function() {
            return heights.indexOf(Math.min.apply(null, heights))
        },
        height: function() {
            return Math.max.apply(null, heights)
        },
        pin: function(curr_pin, c) {
            var top    = heights[c] + settings.spacing
            heights[c] = top + curr_pin.outerHeight(true)
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
            all_pins.removeAttr("style")
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
