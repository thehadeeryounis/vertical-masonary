(function( $ ){
    var methods = {
        init: function() {
            var me = $(this);
            me.vertical_masonary('layout')
            $(window).resize(function() {
                me.vertical_masonary('destory')
                me.vertical_masonary('layout')
            });
        },
        layout: function() {
            var _matrix = []
            var _temp   = []
            var last    = -1;

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

            for( i = 0; i < _matrix[0].length; i++) {
                _matrix[0][i].css({
                    "top" : _matrix[0][i].position().top,
                    "left" : _matrix[0][i].position().left
                }).data("column",i).data("off",_matrix[0][i].position().top).addClass("column-"+i)

                if(_matrix[0][i].height() > this.parent().height())
                    this.parent().height(_matrix[0][i].height())
            }

            for( j = 1; j < _matrix.length; j++) {
                var delta_height = 0;
                for( i = 0; i < _matrix[j].length; i++) {
                    var actual_delta = Number(_matrix[j-1][i].data("off")) + _matrix[j-1][i].outerHeight() + 20
                    _matrix[j][i].css({
                        "top" : actual_delta + "px",
                        "left" : _matrix[j][i].position().left
                    }).data("column",i).data("off",actual_delta).addClass("column-"+i)
                    if(_matrix[j][i].height() > delta_height)
                        delta_height = _matrix[j][i].height()
                }
                
                this.parent().height(delta_height + this.parent().height());
            }
            this.css({
                "position" : "absolute"
            });

            this.parent().removeClass("no-space")
        },
        destory: function() {
            this.each(function(){
                $(this).removeAttr("style").removeClass("column-" + $(this).data("column"))
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