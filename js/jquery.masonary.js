(function( $ ){
    var methods = {
        init: function(options) {
            var me = $(this);
            var settings = $.extend( {
              'spacing' : 20,
            }, options);

            me.data('options', settings);
            me.vertical_masonary('layout')
            $(window).resize(function() {
                me.vertical_masonary('destory')
                me.vertical_masonary('layout')
            });
        },
        layout: function() {
            var _vertical_spacing = this.data('options')['spacing'];
            var _horizontal_spacing = this.data('options')['spacing']
            var _matrix = []
            var _temp   = []
            var last    = -1;
            var width = this.width();
            this.parent().addClass("no-space")

            this.each(function() {
                var delta = $(this).position().top
                if (delta == last || last == -1)
                    _temp.push($(this))
                else {
                    _matrix.push(_temp);
                    _temp = [$(this)];
                }
                last = delta
            });
            _matrix.push(_temp);

            this.parent().width(_matrix[0].length * width + ((_matrix[0].length - 1)*_horizontal_spacing));
            this.parent().height((_vertical_spacing * 2) + this.parent().height());

            for( i = 0; i < _matrix[0].length; i++) {
                var top = _matrix[0][i].position().top + _vertical_spacing
                var left = _matrix[0][i].position().left + _horizontal_spacing * i
                _matrix[0][i].css({
                    "top"   : top,
                    "left"  : left,
                    "width" : width
                }).data("column",i).data("off",top).addClass("column-"+i)
            }

            for( j = 1; j < _matrix.length; j++) {
                for( i = 0; i < _matrix[j].length; i++) {
                    var top = Number(_matrix[j-1][i].data("off")) + _matrix[j-1][i].outerHeight() + _vertical_spacing
                    var left = _matrix[j][i].position().left + _horizontal_spacing * i
                    _matrix[j][i].css({
                        "top"   : top,
                        "left"  : left,
                        "width" : width
                    }).data("column",i).data("off",top).addClass("column-"+i)
                }
            }

            this.css({
                "position" : "absolute"
            });

            this.parent().removeClass("no-space")
        },
        destory: function() {
            this.each(function(){
                $(this).removeAttr("style").removeClass("column-" + $(this).data("column"))
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
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );    
  };

})( jQuery );