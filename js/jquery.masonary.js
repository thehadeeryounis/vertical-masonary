(function( $ ){
    var index = -1;
    var height = 0;
    var max_height = 0;
    var methods = {
        init: function(options) {
            var me = $(this);
            var settings = $.extend( {
              'spacing' : 20,
              'columns' : 3,
              'selector' : '.grid_4'
            }, options);

            me.data('options', settings);
            me.vertical_masonary('append')
        },
        reposition: function(options) {
            this.vertical_masonary('destroy')
            this.vertical_masonary('init', options)
        },
        append: function() {
            var _vertical_spacing   = this.data('options')['spacing'];
            var selector   = this.data('options')['selector']
            var columns    = this.data('options')['columns']
            var parent     = $(this).parent()
            var me = this 
            index  = (columns == 1)? 0 : -1
            height = max_height = 0

            $('[data-column]').hide()         
            setTimeout(function(){
                me.vertical_masonary('appendOne',selector,parent,columns,_vertical_spacing);
            },1)
        },
        appendOne: function(selector,parent,columns,_vertical_spacing) {
            var last = $(selector + '.finished:last')
            var last_column = (last.length == 1)? Number(last.data('column')) : columns - 1
            var next_column = (last_column == (columns - 1))? 0 : (last_column + 1);
            var me = $(selector + ':not(.finished):not([data-column]):first')
            var override = $('[data-column="' + (next_column - columns) + '"][data-index="' + index + '"]')

            if(override.length == 1) {
                me.before(override)
                me = override
                me.show();
            }
            
            if(me.length == 0) {
                parent.height(height + 50)
                return;
            }
            
            var above = $(selector + '.column-' + next_column + ':last')
            var prev = $(selector + '.column-' + last_column + ':last')
            var top = (above.length == 1)? Number(above.data("off")) + above.outerHeight() + _vertical_spacing : me.position().top
            var left = (next_column == 0)? 0 : prev.position().left + prev.outerWidth() + _vertical_spacing

            me.css({
                "top"   : top,
                "left"  : left,
                "position": 'absolute',
                "margin" : "0px !important"
            }).data("column", next_column).data("off",top).addClass("finished column-" + next_column)

            max_height = (me.outerHeight() > max_height)? me.outerHeight() : max_height;

            if(next_column == 0 ) {
                height += (max_height + _vertical_spacing)
                index++;
            }
            
            this.vertical_masonary('appendOne',selector,parent,columns,_vertical_spacing);
        },
        destroy: function() {
            this.each(function(){
                $(this).removeAttr("style").removeClass("finished column-" + $(this).data("column"))
                $(this).parent().removeAttr("style")
            })
        }
    }

  $.fn.vertical_masonary  = function( method ) {
    if ( methods[method] )
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    else if ( typeof method === 'object' || ! method || method == undefined)
      return methods.init.apply( this, arguments );
    else
      $.error( 'Method ' +  method + ' does not exist on jQuery.vertical_masonary' );    
  };

})( jQuery );