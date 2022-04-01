
;(function (window, document, $, undefined) {
    'use strict';
    if ( !$ ) {
        return;
    }
    if ( $.fn.fancybox ) {

        if ( 'console' in window ) {
            console.log( 'fancyBox already initialized' );
        }

        return;
    }
    var defaults={loop:!1,margin:[44,0],gutter:50,keyboard:!0,arrows:!0,infobar:!0,toolbar:!0,buttons:["slideShow","fullScreen","thumbs","share","close"],idleTime:3,smallBtn:"auto",protect:!1,modal:!1,image:{preload:"auto"},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},defaultType:"image",animationEffect:"zoom",animationDuration:500,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}<p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}"><svg viewBox="0 0 40 40"><path d="M20,23 L20,8 L20,23 L13,16 L20,23 L27,16 L20,23 M26,28 L13,28 L27,28 L14,28" /></svg></a>',zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg viewBox="0 0 40 40"><path d="M 18,17 m-8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M25,23 L31,29 L25,23" /></svg></button>',close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg viewBox="0 0 40 40"><path d="M10,10 L30,30 M30,10 L10,30" /></svg></button>',smallBtn:'<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>',arrowLeft:'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><svg viewBox="0 0 40 40"><path d="M10,20 L30,20 L10,20 L18,28 L10,20 L18,12 L10,20"></path></svg></button>',arrowRight:'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><svg viewBox="0 0 40 40"><path d="M30,20 L10,20 L30,20 L22,28 L30,20 L22,12 L30,20"></path></svg></button>'},parentEl:"body",autoFocus:!1,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:4e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:$.noop,beforeLoad:$.noop,afterLoad:$.noop,beforeShow:$.noop,afterShow:$.noop,beforeClose:$.noop,afterClose:$.noop,onActivate:$.noop,onDeactivate:$.noop,clickContent:function(o,a){return"image"===o.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{idleTime:!1,margin:0,clickContent:function(o,a){return"image"===o.type&&"toggleControls"},clickSlide:function(o,a){return"image"===o.type?"toggleControls":"close"},dblclickContent:function(o,a){return"image"===o.type&&"zoom"},dblclickSlide:function(o,a){return"image"===o.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schliessen",NEXT:"Weiter",PREV:"Zurück",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Maßstab"}}};
    var $W = $(window);
    var $D = $(document);
    var called = 0;
    var isQuery=function(n){return n&&n.hasOwnProperty&&n instanceof $};
    var requestAFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||function(e){return window.setTimeout(e,1e3/60)};
    var transitionEnd=function(){var n,i=document.createElement("fakeelement"),t={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(n in t)if(void 0!==i.style[n])return t[n];return"transitionend"}();
    var forceRedraw=function(e){return e&&e.length&&e[0].offsetHeight};
    var FancyBox=function(t,s,i){this.opts=$.extend(!0,{index:i},$.fancybox.defaults,s||{}),$.fancybox.isMobile&&(this.opts=$.extend(!0,{},this.opts,this.opts.mobile)),s&&$.isArray(s.buttons)&&(this.opts.buttons=s.buttons),this.id=this.opts.id||++called,this.group=[],this.currIndex=parseInt(this.opts.index,10)||0,this.prevIndex=null,this.prevPos=null,this.currPos=0,this.firstRun=null,this.createGroup(t),this.group.length&&(this.$lastFocus=$(document.activeElement).blur(),this.slides={},this.init())};
    $.extend(FancyBox.prototype, {

        init : function() {
            var self = this,
                firstItem      = self.group[ self.currIndex ],
                firstItemOpts  = firstItem.opts,
                scrollbarWidth = $.fancybox.scrollbarWidth,
                $scrollDiv,
                $container,
                buttonStr;
            self.scrollTop  = $D.scrollTop();
            self.scrollLeft = $D.scrollLeft();
            if ( !$.fancybox.getInstance() ) {
                $( 'body' ).addClass( 'fancybox-active' );
                if ( /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ) {
                    if ( firstItem.type !== 'image' ) {
                        $( 'body' ).css( 'top', $( 'body' ).scrollTop() * -1 ).addClass( 'fancybox-iosfix' );
                    }

                } else if ( !$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight ) {

                    if ( scrollbarWidth === undefined ) {
                        $scrollDiv = $('<div style="width:50px;height:50px;overflow:scroll;" />').appendTo( 'body' );

                        scrollbarWidth = $.fancybox.scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;

                        $scrollDiv.remove();
                    }

                    $( 'head' ).append( '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: ' + scrollbarWidth + 'px; }</style>' );
                    $( 'body' ).addClass( 'compensate-for-scrollbar' );
                }
            }
            buttonStr = '';

            $.each( firstItemOpts.buttons, function( index, value ) {
                buttonStr += ( firstItemOpts.btnTpl[ value ] || '' );
            });
            $container = $(
                self.translate( self,
                    firstItemOpts.baseTpl
                        .replace( '\{\{buttons\}\}', buttonStr )
                        .replace( '\{\{arrows\}\}', firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight )
                )
            )
                .attr( 'id', 'fancybox-container-' + self.id )
                .addClass( 'fancybox-is-hidden' )
                .addClass( firstItemOpts.baseClass )
                .data( 'FancyBox', self )
                .appendTo( firstItemOpts.parentEl );
            self.$refs = {
                container : $container
            };

            [ 'bg', 'inner', 'infobar', 'toolbar', 'stage', 'caption', 'navigation' ].forEach(function(item) {
                self.$refs[ item ] = $container.find( '.fancybox-' + item );
            });

            self.trigger( 'onInit' );
            self.activate();
            self.jumpTo( self.currIndex );
        },
        translate : function( obj, str ) {
            var arr = obj.opts.i18n[ obj.opts.lang ];

            return str.replace(/\{\{(\w+)\}\}/g, function(match, n) {
                var value = arr[n];

                if ( value === undefined ) {
                    return match;
                }

                return value;
            });
        },
        createGroup : function ( content ) {
            var self  = this;
            var items = $.makeArray( content );

            $.each(items, function( i, item ) {
                var obj  = {},
                    opts = {},
                    $item,
                    type,
                    found,
                    src,
                    srcParts;
                if ( $.isPlainObject( item ) ) {
                    obj  = item;
                    opts = item.opts || item;

                } else if ( $.type( item ) === 'object' && $( item ).length ) {
                    $item = $( item );

                    opts = $item.data();
                    opts = $.extend( {}, opts, opts.options || {} );
                    opts.$orig = $item;

                    obj.src = opts.src || $item.attr( 'href' );
                    if ( !obj.type && !obj.src ) {
                        obj.type = 'inline';
                        obj.src  = item;
                    }

                } else {
                    obj = {
                        type : 'html',
                        src  : item + ''
                    };

                }
                obj.opts = $.extend( true, {}, self.opts, opts );
                if ( $.isArray( opts.buttons ) ) {
                    obj.opts.buttons = opts.buttons;
                }

                type = obj.type || obj.opts.type;
                src  = obj.src || '';

                if ( !type && src ) {
                    if ( src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ) {
                        type = 'image';

                    } else if ( src.match(/\.(pdf)((\?|#).*)?$/i) ) {
                        type = 'pdf';

                    } else if ( found = src.match(/\.(mp4|mov|ogv)((\?|#).*)?$/i) ) {
                        type = 'video';

                        if ( !obj.opts.videoFormat ) {
                            obj.opts.videoFormat = 'video/' + ( found[1] === 'ogv' ? 'ogg' : found[1] );
                        }

                    } else if ( src.charAt(0) === '#' ) {
                        type = 'inline';
                    }
                }

                if ( type ) {
                    obj.type = type;

                } else {
                    self.trigger( 'objectNeedsType', obj );
                }

                obj.index = self.group.length;

                if ( obj.opts.$orig && !obj.opts.$orig.length ) {
                    delete obj.opts.$orig;
                }

                if ( !obj.opts.$thumb && obj.opts.$orig ) {
                    obj.opts.$thumb = obj.opts.$orig.find( 'img:first' );
                }

                if ( obj.opts.$thumb && !obj.opts.$thumb.length ) {
                    delete obj.opts.$thumb;
                }
                if ( $.type( obj.opts.caption ) === 'function' ) {
                    obj.opts.caption = obj.opts.caption.apply( item, [ self, obj ] );
                }

                if ( $.type( self.opts.caption ) === 'function' ) {
                    obj.opts.caption = self.opts.caption.apply( item, [ self, obj ] );
                }
                if ( !( obj.opts.caption instanceof $ ) ) {
                    obj.opts.caption = obj.opts.caption === undefined ? '' : obj.opts.caption + '';
                }
                if ( type === 'ajax' ) {
                    srcParts = src.split(/\s+/, 2);

                    if ( srcParts.length > 1 ) {
                        obj.src = srcParts.shift();

                        obj.opts.filter = srcParts.shift();
                    }
                }

                if ( obj.opts.smallBtn == 'auto' ) {

                    if ( $.inArray( type, ['html', 'inline', 'ajax'] ) > -1 ) {
                        obj.opts.toolbar  = false;
                        obj.opts.smallBtn = true;

                    } else {
                        obj.opts.smallBtn = false;
                    }

                }
                if ( type === 'pdf' ) {
                    obj.type = 'iframe';

                    obj.opts.iframe.preload = false;
                }
                if ( obj.opts.modal ) {

                    obj.opts = $.extend(true, obj.opts, {
                        infobar : 0,
                        toolbar : 0,
                        smallBtn : 0,
                        keyboard : 0,
                        slideShow  : 0,
                        fullScreen : 0,
                        thumbs     : 0,
                        touch      : 0,
                        clickContent    : false,
                        clickSlide      : false,
                        clickOutside    : false,
                        dblclickContent : false,
                        dblclickSlide   : false,
                        dblclickOutside : false
                    });

                }
                self.group.push( obj );

            });

        },
        addEvents : function() {
            var self = this;

            self.removeEvents();
            self.$refs.container.on('click.fb-close', '[data-fancybox-close]', function(e) {
                e.stopPropagation();
                e.preventDefault();

                self.close( e );

            }).on( 'click.fb-prev touchend.fb-prev', '[data-fancybox-prev]', function(e) {
                e.stopPropagation();
                e.preventDefault();

                self.previous();

            }).on( 'click.fb-next touchend.fb-next', '[data-fancybox-next]', function(e) {
                e.stopPropagation();
                e.preventDefault();

                self.next();

            }).on( 'click.fb', '[data-fancybox-zoom]', function(e) {
                self[ self.isScaledDown() ? 'scaleToActual' : 'scaleToFit' ]();
            });
            $W.on('orientationchange.fb resize.fb', function(e) {

                if ( e && e.originalEvent && e.originalEvent.type === "resize" ) {

                    requestAFrame(function() {
                        self.update();
                    });

                } else {

                    self.$refs.stage.hide();

                    setTimeout(function() {
                        self.$refs.stage.show();

                        self.update();
                    }, 600);

                }

            });
            $D.on('focusin.fb', function(e) {
                var instance = $.fancybox ? $.fancybox.getInstance() : null;

                if ( instance.isClosing || !instance.current || !instance.current.opts.trapFocus || $( e.target ).hasClass( 'fancybox-container' ) || $( e.target ).is( document ) ) {
                    return;
                }

                if ( instance && $( e.target ).css( 'position' ) !== 'fixed' && !instance.$refs.container.has( e.target ).length ) {
                    e.stopPropagation();
                    instance.focus();
                    $W.scrollTop( self.scrollTop ).scrollLeft( self.scrollLeft );
                }
            });
            $D.on('keydown.fb', function (e) {
                var current = self.current,
                    keycode = e.keyCode || e.which;

                if ( !current || !current.opts.keyboard ) {
                    return;
                }

                if ( $(e.target).is('input') || $(e.target).is('textarea') ) {
                    return;
                }
                if ( keycode === 8 || keycode === 27 ) {
                    e.preventDefault();

                    self.close( e );

                    return;
                }
                if ( keycode === 37 || keycode === 38 ) {
                    e.preventDefault();

                    self.previous();

                    return;
                }
                if ( keycode === 39 || keycode === 40 ) {
                    e.preventDefault();

                    self.next();

                    return;
                }

                self.trigger('afterKeydown', e, keycode);
            });
            if ( self.group[ self.currIndex ].opts.idleTime ) {
                self.idleSecondsCounter = 0;

                $D.on('mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle', function(e) {
                    self.idleSecondsCounter = 0;

                    if ( self.isIdle ) {
                        self.showControls();
                    }

                    self.isIdle = false;
                });

                self.idleInterval = window.setInterval(function() {
                    self.idleSecondsCounter++;

                    if ( self.idleSecondsCounter >= self.group[ self.currIndex ].opts.idleTime && !self.isDragging ) {
                        self.isIdle = true;
                        self.idleSecondsCounter = 0;

                        self.hideControls();
                    }

                }, 1000);
            }

        },
        removeEvents : function() {
            var self = this;

            $W.off( 'orientationchange.fb resize.fb' );
            $D.off( 'focusin.fb keydown.fb .fb-idle' );

            this.$refs.container.off( '.fb-close .fb-prev .fb-next' );

            if ( self.idleInterval ) {
                window.clearInterval( self.idleInterval );

                self.idleInterval = null;
            }
        },
        previous : function( duration ) {
            return this.jumpTo( this.currPos - 1, duration );
        },
        next : function( duration ) {
            return this.jumpTo( this.currPos + 1, duration );
        },

        jumpTo : function ( pos, duration, slide ) {
            var self = this,
                firstRun,
                loop,
                current,
                previous,
                canvasWidth,
                currentPos,
                transitionProps;

            var groupLen = self.group.length;

            if ( self.isDragging || self.isClosing || ( self.isAnimating && self.firstRun ) ) {
                return;
            }

            pos  = parseInt( pos, 10 );
            loop = self.current ? self.current.opts.loop : self.opts.loop;

            if ( !loop && ( pos < 0 || pos >= groupLen ) ) {
                return false;
            }

            firstRun = self.firstRun = ( self.firstRun === null );

            if ( groupLen < 2 && !firstRun && !!self.isDragging ) {
                return;
            }

            previous = self.current;

            self.prevIndex = self.currIndex;
            self.prevPos   = self.currPos;
            current = self.createSlide( pos );

            if ( groupLen > 1 ) {
                if ( loop || current.index > 0 ) {
                    self.createSlide( pos - 1 );
                }

                if ( loop || current.index < groupLen - 1 ) {
                    self.createSlide( pos + 1 );
                }
            }

            self.current   = current;
            self.currIndex = current.index;
            self.currPos   = current.pos;

            self.trigger( 'beforeShow', firstRun );

            self.updateControls();

            currentPos = $.fancybox.getTranslate( current.$slide );

            current.isMoved        = ( currentPos.left !== 0 || currentPos.top !== 0 ) && !current.$slide.hasClass( 'fancybox-animated' );
            current.forcedDuration = undefined;

            if ( $.isNumeric( duration ) ) {
                current.forcedDuration = duration;
            } else {
                duration = current.opts[ firstRun ? 'animationDuration' : 'transitionDuration' ];
            }

            duration = parseInt( duration, 10 );
            if ( firstRun ) {

                if ( current.opts.animationEffect && duration ) {
                    self.$refs.container.css( 'transition-duration', duration + 'ms' );
                }
                self.$refs.container.removeClass( 'fancybox-is-hidden' );
                forceRedraw( self.$refs.container );
                self.$refs.container.addClass( 'fancybox-is-open' );
                current.$slide.addClass( 'fancybox-slide--current' );
                self.loadSlide( current );
                self.preload( 'image' );
                return;
            }
            $.each(self.slides, function( index, slide ) {
                $.fancybox.stop( slide.$slide );
            });
            current.$slide.removeClass( 'fancybox-slide--next fancybox-slide--previous' ).addClass( 'fancybox-slide--current' );
            if ( current.isMoved ) {
                canvasWidth = Math.round( current.$slide.width() );

                $.each(self.slides, function( index, slide ) {
                    var pos = slide.pos - current.pos;

                    $.fancybox.animate( slide.$slide, {
                        top  : 0,
                        left : ( pos * canvasWidth ) + ( pos * slide.opts.gutter )
                    }, duration, function() {

                        slide.$slide.removeAttr('style').removeClass( 'fancybox-slide--next fancybox-slide--previous' );

                        if ( slide.pos === self.currPos ) {
                            current.isMoved = false;

                            self.complete();
                        }
                    });
                });

            } else {
                self.$refs.stage.children().removeAttr( 'style' );
            }

            
            

            if ( current.isLoaded ) {
                self.revealContent( current );

            } else {
                self.loadSlide( current );
            }

            self.preload( 'image' );

            if ( previous.pos === current.pos ) {
                return;
            }

            
            

            transitionProps = 'fancybox-slide--' + ( previous.pos > current.pos ? 'next' : 'previous' );

            previous.$slide.removeClass( 'fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous' );

            previous.isComplete = false;

            if ( !duration || ( !current.isMoved && !current.opts.transitionEffect ) ) {
                return;
            }

            if ( current.isMoved ) {
                previous.$slide.addClass( transitionProps );

            } else {

                transitionProps = 'fancybox-animated ' + transitionProps + ' fancybox-fx-' + current.opts.transitionEffect;

                $.fancybox.animate( previous.$slide, transitionProps, duration, function() {
                    previous.$slide.removeClass( transitionProps ).removeAttr( 'style' );
                });

            }

        },
        createSlide : function( pos ) {

            var self = this;
            var $slide;
            var index;

            index = pos % self.group.length;
            index = index < 0 ? self.group.length + index : index;

            if ( !self.slides[ pos ] && self.group[ index ] ) {
                $slide = $('<div class="fancybox-slide"></div>').appendTo( self.$refs.stage );

                self.slides[ pos ] = $.extend( true, {}, self.group[ index ], {
                    pos      : pos,
                    $slide   : $slide,
                    isLoaded : false,
                });

                self.updateSlide( self.slides[ pos ] );
            }

            return self.slides[ pos ];
        },
        scaleToActual : function( x, y, duration ) {

            var self = this;

            var current = self.current;
            var $what   = current.$content;

            var imgPos, posX, posY, scaleX, scaleY;

            var canvasWidth  = parseInt( current.$slide.width(), 10 );
            var canvasHeight = parseInt( current.$slide.height(), 10 );

            var newImgWidth  = current.width;
            var newImgHeight = current.height;

            if ( !( current.type == 'image' && !current.hasError) || !$what || self.isAnimating ) {
                return;
            }

            $.fancybox.stop( $what );

            self.isAnimating = true;

            x = x === undefined ? canvasWidth  * 0.5  : x;
            y = y === undefined ? canvasHeight * 0.5  : y;

            imgPos = $.fancybox.getTranslate( $what );

            scaleX  = newImgWidth  / imgPos.width;
            scaleY  = newImgHeight / imgPos.height;

            
            posX = ( canvasWidth * 0.5  - newImgWidth * 0.5 );
            posY = ( canvasHeight * 0.5 - newImgHeight * 0.5 );

            
            if ( newImgWidth > canvasWidth ) {
                posX = imgPos.left * scaleX - ( ( x * scaleX ) - x );

                if ( posX > 0 ) {
                    posX = 0;
                }

                if ( posX <  canvasWidth - newImgWidth ) {
                    posX = canvasWidth - newImgWidth;
                }
            }

            if ( newImgHeight > canvasHeight) {
                posY = imgPos.top  * scaleY - ( ( y * scaleY ) - y );

                if ( posY > 0 ) {
                    posY = 0;
                }

                if ( posY <  canvasHeight - newImgHeight ) {
                    posY = canvasHeight - newImgHeight;
                }
            }

            self.updateCursor( newImgWidth, newImgHeight );

            $.fancybox.animate( $what, {
                top    : posY,
                left   : posX,
                scaleX : scaleX,
                scaleY : scaleY
            }, duration || 330, function() {
                self.isAnimating = false;
            });

            
            if ( self.SlideShow && self.SlideShow.isActive ) {
                self.SlideShow.stop();
            }
        },
        scaleToFit : function( duration ) {

            var self = this;

            var current = self.current;
            var $what   = current.$content;
            var end;

            if ( !( current.type == 'image' && !current.hasError) || !$what || self.isAnimating ) {
                return;
            }

            $.fancybox.stop( $what );

            self.isAnimating = true;

            end = self.getFitPos( current );

            self.updateCursor( end.width, end.height );

            $.fancybox.animate( $what, {
                top    : end.top,
                left   : end.left,
                scaleX : end.width  / $what.width(),
                scaleY : end.height / $what.height()
            }, duration || 330, function() {
                self.isAnimating = false;
            });

        },
        getFitPos : function( slide ) {
            var self  = this;
            var $what = slide.$content;

            var imgWidth  = slide.width;
            var imgHeight = slide.height;

            var margin = slide.opts.margin;

            var canvasWidth, canvasHeight, minRatio, width, height;

            if ( !$what || !$what.length || ( !imgWidth && !imgHeight) ) {
                return false;
            }

            
            if ( $.type( margin ) === "number" ) {
                margin = [ margin, margin ];
            }

            if ( margin.length == 2 ) {
                margin = [ margin[0], margin[1], margin[0], margin[1] ];
            }

            
            canvasWidth  = parseInt( self.$refs.stage.width(), 10 )  - ( margin[ 1 ] + margin[ 3 ] );
            canvasHeight = parseInt( self.$refs.stage.height(), 10 ) - ( margin[ 0 ] + margin[ 2 ] );

            minRatio = Math.min(1, canvasWidth / imgWidth, canvasHeight / imgHeight );

            width  = Math.floor( minRatio * imgWidth );
            height = Math.floor( minRatio * imgHeight );

            
            return {
                top    : Math.floor( ( canvasHeight - height ) * 0.5 ) + margin[ 0 ],
                left   : Math.floor( ( canvasWidth  - width )  * 0.5 ) + margin[ 3 ],
                width  : width,
                height : height
            };

        },
        update : function() {
            var self = this;

            $.each( self.slides, function( key, slide ) {
                self.updateSlide( slide );
            });
        },
        updateSlide : function( slide, duration ) {
            var self  = this,
                $what = slide && slide.$content;

            if ( $what && ( slide.width || slide.height ) ) {
                self.isAnimating = false;

                $.fancybox.stop( $what );

                $.fancybox.setTranslate( $what, self.getFitPos( slide ) );

                if ( slide.pos === self.currPos ) {
                    self.updateCursor();
                }
            }

            slide.$slide.trigger( 'refresh' );

            self.trigger( 'onUpdate', slide );

        },
        centerSlide : function( slide, duration ) {
            var self  = this, canvasWidth, pos;

            if ( self.current ) {
                canvasWidth = Math.round( slide.$slide.width() );
                pos = slide.pos - self.current.pos;

                $.fancybox.animate( slide.$slide, {
                    top  : 0,
                    left : ( pos * canvasWidth ) + ( pos * slide.opts.gutter ),
                    opacity : 1
                }, duration === undefined ? 0 : duration, null, false);
            }
        },
        updateCursor : function( nextWidth, nextHeight ) {

            var self = this;
            var isScaledDown;

            var $container = self.$refs.container.removeClass( 'fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut' );

            if ( !self.current || self.isClosing ) {
                return;
            }

            if ( self.isZoomable() ) {

                $container.addClass( 'fancybox-is-zoomable' );

                if ( nextWidth !== undefined && nextHeight !== undefined ) {
                    isScaledDown = nextWidth < self.current.width && nextHeight < self.current.height;

                } else {
                    isScaledDown = self.isScaledDown();
                }

                if ( isScaledDown ) {

                    
                    $container.addClass( 'fancybox-can-zoomIn' );

                } else {

                    if ( self.current.opts.touch ) {

                        
                        
                        $container.addClass( 'fancybox-can-drag' );

                    } else {
                        $container.addClass( 'fancybox-can-zoomOut' );
                    }

                }

            } else if ( self.current.opts.touch ) {
                $container.addClass( 'fancybox-can-drag' );
            }

        },
        isZoomable : function() {

            var self = this;

            var current = self.current;
            var fitPos;

            if ( !current || self.isClosing ) {
                return;
            }

            
            
            
            
            if ( current.type === 'image' && current.isLoaded && !current.hasError &&
                ( current.opts.clickContent === 'zoom' || ( $.isFunction( current.opts.clickContent ) && current.opts.clickContent( current ) ===  "zoom" ) )
            ) {

                fitPos = self.getFitPos( current );

                if ( current.width > fitPos.width || current.height > fitPos.height ) {
                    return true;
                }

            }

            return false;

        },
        isScaledDown : function() {

            var self = this;

            var current = self.current;
            var $what   = current.$content;

            var rez = false;

            if ( $what ) {
                rez = $.fancybox.getTranslate( $what );
                rez = rez.width < current.width || rez.height < current.height;
            }

            return rez;

        },
        canPan : function() {

            var self = this;

            var current = self.current;
            var $what   = current.$content;

            var rez = false;

            if ( $what ) {
                rez = self.getFitPos( current );
                rez = Math.abs( $what.width() - rez.width ) > 1  || Math.abs( $what.height() - rez.height ) > 1;
            }

            return rez;

        },
        loadSlide : function( slide ) {

            var self = this, type, $slide;
            var ajaxLoad;

            if ( slide.isLoading ) {
                return;
            }

            if ( slide.isLoaded ) {
                return;
            }

            slide.isLoading = true;

            self.trigger( 'beforeLoad', slide );

            type   = slide.type;
            $slide = slide.$slide;

            $slide
                .off( 'refresh' )
                .trigger( 'onReset' )
                .addClass( 'fancybox-slide--' + ( type || 'unknown' ) )
                .addClass( slide.opts.slideClass );

            

            switch ( type ) {

                case 'image':

                    self.setImage( slide );

                break;

                case 'iframe':

                    self.setIframe( slide );

                break;

                case 'html':

                    self.setContent( slide, slide.src || slide.content );

                break;

                case 'inline':

                    if ( $( slide.src ).length ) {
                        self.setContent( slide, $( slide.src ) );

                    } else {
                        self.setError( slide );
                    }

                break;

                case 'ajax':

                    self.showLoading( slide );

                    ajaxLoad = $.ajax( $.extend( {}, slide.opts.ajax.settings, {
                        url : slide.src,
                        success : function ( data, textStatus ) {

                            if ( textStatus === 'success' ) {
                                self.setContent( slide, data );
                            }

                        },
                        error : function ( jqXHR, textStatus ) {

                            if ( jqXHR && textStatus !== 'abort' ) {
                                self.setError( slide );
                            }

                        }
                    }));

                    $slide.one( 'onReset', function () {
                        ajaxLoad.abort();
                    });

                break;

                case 'video' :

                    self.setContent( slide,
                        '<video controls>' +
                          '<source src="' + slide.src + '" type="' + slide.opts.videoFormat + '">' +
                            'Your browser doesn\'t support HTML5 video' +
                        '</video>'
                    );

                break;

                default:

                    self.setError( slide );

                break;

            }

            return true;

        },
        setImage : function( slide ) {

            var self   = this;
            var srcset = slide.opts.srcset || slide.opts.image.srcset;

            var found, temp, pxRatio, windowWidth;

            
            
            
            if ( srcset ) {
                pxRatio     = window.devicePixelRatio || 1;
                windowWidth = window.innerWidth  * pxRatio;

                temp = srcset.split(',').map(function ( el ) {
            		var ret = {};

            		el.trim().split(/\s+/).forEach(function ( el, i ) {
                        var value = parseInt( el.substring(0, el.length - 1), 10 );

            			if ( i === 0 ) {
            				return ( ret.url = el );
            			}

                        if ( value ) {
                            ret.value   = value;
                            ret.postfix = el[ el.length - 1 ];
                        }

            		});

            		return ret;
            	});

                
                temp.sort(function (a, b) {
                  return a.value - b.value;
                });

                
                for ( var j = 0; j < temp.length; j++ ) {
                    var el = temp[ j ];

                    if ( ( el.postfix === 'w' && el.value >= windowWidth ) || ( el.postfix === 'x' && el.value >= pxRatio ) ) {
                        found = el;
                        break;
                    }
                }

                
                if ( !found && temp.length ) {
                    found = temp[ temp.length - 1 ];
                }

                if ( found ) {
                    slide.src = found.url;

                    
                    if ( slide.width && slide.height && found.postfix == 'w' ) {
                        slide.height = ( slide.width / slide.height ) * found.value;
                        slide.width  = found.value;
                    }
                }
            }

            
            slide.$content = $('<div class="fancybox-image-wrap"></div>')
                .addClass( 'fancybox-is-hidden' )
                .appendTo( slide.$slide );


            
            
            if ( slide.opts.preload !== false && slide.opts.width && slide.opts.height && ( slide.opts.thumb || slide.opts.$thumb ) ) {

                slide.width  = slide.opts.width;
                slide.height = slide.opts.height;

                slide.$ghost = $('<img />')
                    .one('error', function() {

                        $(this).remove();

                        slide.$ghost = null;

                        self.setBigImage( slide );

                    })
                    .one('load', function() {

                        self.afterLoad( slide );

                        self.setBigImage( slide );

                    })
                    .addClass( 'fancybox-image' )
                    .appendTo( slide.$content )
                    .attr( 'src', slide.opts.thumb || slide.opts.$thumb.attr( 'src' ) );

            } else {

                self.setBigImage( slide );

            }

        },
        setBigImage : function ( slide ) {
            var self = this;
            var $img = $('<img />');

            slide.$image = $img
                .one('error', function() {

                    self.setError( slide );

                })
                .one('load', function() {

                    
                    clearTimeout( slide.timouts );

                    slide.timouts = null;

                    if ( self.isClosing ) {
                        return;
                    }

                    slide.width  = slide.opts.width  || this.naturalWidth;
                    slide.height = slide.opts.height || this.naturalHeight;

                    if ( slide.opts.image.srcset ) {
                        $img.attr( 'sizes', '100vw' ).attr( 'srcset', slide.opts.image.srcset );
                    }

                    self.hideLoading( slide );

                    if ( slide.$ghost ) {

                        slide.timouts = setTimeout(function() {
                            slide.timouts = null;

                            slide.$ghost.hide();

                        }, Math.min( 300, Math.max( 1000, slide.height / 1600 ) ) );

                    } else {
                        self.afterLoad( slide );
                    }

                })
                .addClass( 'fancybox-image' )
                .attr('src', slide.src)
                .appendTo( slide.$content );

            if ( ( $img[0].complete || $img[0].readyState == "complete" ) && $img[0].naturalWidth && $img[0].naturalHeight ) {
                  $img.trigger( 'load' );

            } else if( $img[0].error ) {
                 $img.trigger( 'error' );

            } else {

                slide.timouts = setTimeout(function() {
                    if ( !$img[0].complete && !slide.hasError ) {
                        self.showLoading( slide );
                    }

                }, 100);

            }

        },
        setIframe : function( slide ) {
            var self	= this,
                opts    = slide.opts.iframe,
                $slide	= slide.$slide,
                $iframe;

            slide.$content = $('<div class="fancybox-content' + ( opts.preload ? ' fancybox-is-hidden' : '' ) + '"></div>')
                .css( opts.css )
                .appendTo( $slide );

            $iframe = $( opts.tpl.replace(/\{rnd\}/g, new Date().getTime()) )
                .attr( opts.attr )
                .appendTo( slide.$content );

            if ( opts.preload ) {

                self.showLoading( slide );

                
                

                $iframe.on('load.fb error.fb', function(e) {
                    this.isReady = 1;

                    slide.$slide.trigger( 'refresh' );

                    self.afterLoad( slide );
                });

                
                

                $slide.on('refresh.fb', function() {
                    var $wrap = slide.$content,
                        frameWidth  = opts.css.width,
                        frameHeight = opts.css.height,
                        scrollWidth,
                        $contents,
                        $body;

                    if ( $iframe[0].isReady !== 1 ) {
                        return;
                    }

                    
                    

                    try {
                        $contents = $iframe.contents();
                        $body     = $contents.find('body');

                    } catch (ignore) {}

                    
                    if ( $body && $body.length ) {

                        if ( frameWidth === undefined ) {
                            scrollWidth = $iframe[0].contentWindow.document.documentElement.scrollWidth;

                            frameWidth = Math.ceil( $body.outerWidth(true) + ( $wrap.width() - scrollWidth ) );
                            frameWidth += $wrap.outerWidth() - $wrap.innerWidth();
                        }

                        if ( frameHeight === undefined ) {
                            frameHeight = Math.ceil( $body.outerHeight(true) );
                            frameHeight += $wrap.outerHeight() - $wrap.innerHeight();
                        }

                        
                        if ( frameWidth ) {
                            $wrap.width( frameWidth );
                        }

                        if ( frameHeight ) {
                            $wrap.height( frameHeight );
                        }
                    }

                    $wrap.removeClass( 'fancybox-is-hidden' );

                });

            } else {

                this.afterLoad( slide );

            }

            $iframe.attr( 'src', slide.src );

            if ( slide.opts.smallBtn === true ) {
                slide.$content.prepend( self.translate( slide, slide.opts.btnTpl.smallBtn ) );
            }

            
            $slide.one( 'onReset', function () {

                
                try {

                    $( this ).find( 'iframe' ).hide().attr( 'src', '//about:blank' );

                } catch ( ignore ) {}

                $( this ).empty();

                slide.isLoaded = false;

            });

        },
        setContent : function ( slide, content ) {

            var self = this;

            if ( self.isClosing ) {
                return;
            }

            self.hideLoading( slide );

            slide.$slide.empty();

            if ( isQuery( content ) && content.parent().length ) {

                
                
                
                

                
                content.parent( '.fancybox-slide--inline' ).trigger( 'onReset' );

                
                slide.$placeholder = $( '<div></div>' ).hide().insertAfter( content );

                
                content.css('display', 'inline-block');

            } else if ( !slide.hasError ) {

                
                if ( $.type( content ) === 'string' ) {
                    content = $('<div>').append( $.trim( content ) ).contents();

                    
                    if ( content[0].nodeType === 3 ) {
                        content = $('<div>').html( content );
                    }
                }

                
                if ( slide.opts.filter ) {
                    content = $('<div>').html( content ).find( slide.opts.filter );
                }

            }

            slide.$slide.one('onReset', function () {

                
                $( this ).find( 'video,audio' ).trigger( 'pause' );

                
                if ( slide.$placeholder ) {
                    slide.$placeholder.after( content.hide() ).remove();

                    slide.$placeholder = null;
                }

                
                if ( slide.$smallBtn ) {
                    slide.$smallBtn.remove();

                    slide.$smallBtn = null;
                }

                
                if ( !slide.hasError ) {
                    $(this).empty();

                    slide.isLoaded = false;
                }

            });

            slide.$content = $( content ).appendTo( slide.$slide );

            this.afterLoad( slide );
        },
        setError : function ( slide ) {

            slide.hasError = true;

            slide.$slide.removeClass( 'fancybox-slide--' + slide.type );

            this.setContent( slide, this.translate( slide, slide.opts.errorTpl ) );

        },
        showLoading : function( slide ) {

            var self = this;

            slide = slide || self.current;

            if ( slide && !slide.$spinner ) {
                slide.$spinner = $( self.opts.spinnerTpl ).appendTo( slide.$slide );
            }

        },
        hideLoading : function( slide ) {

            var self = this;

            slide = slide || self.current;

            if ( slide && slide.$spinner ) {
                slide.$spinner.remove();

                delete slide.$spinner;
            }

        },
        afterLoad : function( slide ) {

            var self = this;

            if ( self.isClosing ) {
                return;
            }

            slide.isLoading = false;
            slide.isLoaded  = true;

            self.trigger( 'afterLoad', slide );

            self.hideLoading( slide );

            if ( slide.opts.smallBtn && !slide.$smallBtn ) {
                slide.$smallBtn = $( self.translate( slide, slide.opts.btnTpl.smallBtn ) ).appendTo( slide.$content.filter('div,form').first() );
            }

            if ( slide.opts.protect && slide.$content && !slide.hasError ) {

                
                slide.$content.on( 'contextmenu.fb', function( e ) {
                     if ( e.button == 2 ) {
                         e.preventDefault();
                     }

                    return true;
                });

                
                
                if ( slide.type === 'image' ) {
                    $( '<div class="fancybox-spaceball"></div>' ).appendTo( slide.$content );
                }

            }

            self.revealContent( slide );

        },
        revealContent : function( slide ) {

            var self   = this;
            var $slide = slide.$slide;

            var effect, effectClassName, duration, opacity, end, start = false;

            effect   = slide.opts[ self.firstRun ? 'animationEffect'   : 'transitionEffect' ];
            duration = slide.opts[ self.firstRun ? 'animationDuration' : 'transitionDuration' ];

            duration = parseInt( slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10 );

            if ( slide.isMoved || slide.pos !== self.currPos || !duration ) {
                effect = false;
            }

            
            if ( effect === 'zoom' && !( slide.pos === self.currPos && duration && slide.type === 'image' && !slide.hasError && ( start = self.getThumbPos( slide ) ) ) ) {
                effect = 'fade';
            }

            
            

            if ( effect === 'zoom' ) {
                end = self.getFitPos( slide );

                end.scaleX = end.width  / start.width;
                end.scaleY = end.height / start.height;

                delete end.width;
                delete end.height;

                
                opacity = slide.opts.zoomOpacity;

                if ( opacity == 'auto' ) {
                    opacity = Math.abs( slide.width / slide.height - start.width / start.height ) > 0.1;
                }

                if ( opacity ) {
                    start.opacity = 0.1;
                    end.opacity   = 1;
                }

                
                $.fancybox.setTranslate( slide.$content.removeClass( 'fancybox-is-hidden' ), start );

                forceRedraw( slide.$content );

                
                $.fancybox.animate( slide.$content, end, duration, function() {
                    self.complete();
                });

                return;
            }

            self.updateSlide( slide );


            
            

            if ( !effect ) {
                forceRedraw( $slide );

                slide.$content.removeClass( 'fancybox-is-hidden' );

                if ( slide.pos === self.currPos ) {
                    self.complete();
                }

                return;
            }

            $.fancybox.stop( $slide );

            effectClassName = 'fancybox-animated fancybox-slide--' + ( slide.pos >= self.prevPos ? 'next' : 'previous' ) + ' fancybox-fx-' + effect;

            $slide.removeAttr( 'style' ).removeClass( 'fancybox-slide--current fancybox-slide--next fancybox-slide--previous' ).addClass( effectClassName );

            slide.$content.removeClass( 'fancybox-is-hidden' );

            
            forceRedraw( $slide );

            $.fancybox.animate( $slide, 'fancybox-slide--current', duration, function(e) {
                $slide.removeClass( effectClassName ).removeAttr( 'style' );

                if ( slide.pos === self.currPos ) {
                    self.complete();
                }

            }, true);

        },
        getThumbPos : function( slide ) {

            var self = this;
            var rez  = false;

            
            var isElementVisible = function( $el ) {
                var element = $el[0];

                var elementRect = element.getBoundingClientRect();
                var parentRects = [];

                var visibleInAllParents;

                while ( element.parentElement !== null ) {
                    if ( $(element.parentElement).css('overflow') === 'hidden'  || $(element.parentElement).css('overflow') === 'auto' ) {
                        parentRects.push(element.parentElement.getBoundingClientRect());
                    }

                    element = element.parentElement;
                }

                visibleInAllParents = parentRects.every(function(parentRect){
                    var visiblePixelX = Math.min(elementRect.right, parentRect.right) - Math.max(elementRect.left, parentRect.left);
                    var visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom) - Math.max(elementRect.top, parentRect.top);

                    return visiblePixelX > 0 && visiblePixelY > 0;
                });

                return visibleInAllParents &&
                    elementRect.bottom > 0 && elementRect.right > 0 &&
                    elementRect.left < $(window).width() && elementRect.top < $(window).height();
            };

            var $thumb   = slide.opts.$thumb;
            var thumbPos = $thumb ? $thumb.offset() : 0;
            var slidePos;

            if ( thumbPos && $thumb[0].ownerDocument === document && isElementVisible( $thumb ) ) {
                slidePos = self.$refs.stage.offset();

                rez = {
                    top    : thumbPos.top  - slidePos.top  + parseFloat( $thumb.css( "border-top-width" ) || 0 ),
                    left   : thumbPos.left - slidePos.left + parseFloat( $thumb.css( "border-left-width" ) || 0 ),
                    width  : $thumb.width(),
                    height : $thumb.height(),
                    scaleX : 1,
                    scaleY : 1
                };
            }

            return rez;
        },
        complete : function() {
            var self = this,
                current = self.current,
                slides  = {},
                promise;

            if ( current.isMoved || !current.isLoaded || current.isComplete ) {
                return;
            }

            current.isComplete = true;

            current.$slide.siblings().trigger( 'onReset' );

            self.preload( 'inline' );

            
            forceRedraw( current.$slide );

            current.$slide.addClass( 'fancybox-slide--complete' );

            
            $.each( self.slides, function( key, slide ) {
                if ( slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1 ) {
                    slides[ slide.pos ] = slide;

                } else if ( slide ) {
                    $.fancybox.stop( slide.$slide );

                    slide.$slide.off().remove();
                }
            });

            self.slides = slides;

            self.updateCursor();

            self.trigger( 'afterShow' );

            
            current.$slide.find( 'video,audio' ).first().trigger( 'play' );

            
            if ( $( document.activeElement ).is( '[disabled]' ) || ( current.opts.autoFocus && !( current.type == 'image' || current.type === 'iframe' ) ) ) {
                self.focus();
            }

        },
        preload : function( type ) {
            var self = this,
                next = self.slides[ self.currPos + 1 ],
                prev = self.slides[ self.currPos - 1 ];

            if ( next && next.type === type ) {
                self.loadSlide( next );
            }

            if ( prev && prev.type === type ) {
                self.loadSlide( prev );
            }
        },
        focus : function() {
            var current = this.current;
            var $el;

            if ( this.isClosing ) {
                return;
            }

            if ( current && current.isComplete ) {

                
                $el = current.$slide.find('input[autofocus]:enabled:visible:first');

                if ( !$el.length ) {
                    $el = current.$slide.find('button,:input,[tabindex],a').filter(':enabled:visible:first');
                }
            }

            $el = $el && $el.length ? $el : this.$refs.container;

            $el.focus();
        },
        activate : function () {
            var self = this;

            
            $( '.fancybox-container' ).each(function () {
                var instance = $(this).data( 'FancyBox' );

                
                if (instance && instance.id !== self.id && !instance.isClosing) {
                    instance.trigger( 'onDeactivate' );

                    instance.removeEvents();

                    instance.isVisible = false;
                }

            });

            self.isVisible = true;

            if ( self.current || self.isIdle ) {
                self.update();

                self.updateControls();
            }

            self.trigger( 'onActivate' );

            self.addEvents();
        },
        close : function( e, d ) {

            var self    = this;
            var current = self.current;

            var effect, duration;
            var $what, opacity, start, end;

            var done = function() {
                self.cleanUp( e );
            };

            if ( self.isClosing ) {
                return false;
            }

            self.isClosing = true;

            
            if ( self.trigger( 'beforeClose', e ) === false ) {
                self.isClosing = false;

                requestAFrame(function() {
                    self.update();
                });

                return false;
            }

            
            
            self.removeEvents();

            if ( current.timouts ) {
                clearTimeout( current.timouts );
            }

            $what    = current.$content;
            effect   = current.opts.animationEffect;
            duration = $.isNumeric( d ) ? d : ( effect ? current.opts.animationDuration : 0 );

            
            current.$slide.off( transitionEnd ).removeClass( 'fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated' );

            current.$slide.siblings().trigger( 'onReset' ).remove();

            
            if ( duration ) {
                self.$refs.container.removeClass( 'fancybox-is-open' ).addClass( 'fancybox-is-closing' );
            }

            
            self.hideLoading( current );

            self.hideControls();

            self.updateCursor();

            
            if ( effect === 'zoom' && !( e !== true && $what && duration && current.type === 'image' && !current.hasError && ( end = self.getThumbPos( current ) ) ) ) {
                effect = 'fade';
            }

            if ( effect === 'zoom' ) {
                $.fancybox.stop( $what );

                start = $.fancybox.getTranslate( $what );

                start.width  = start.width  * start.scaleX;
                start.height = start.height * start.scaleY;

                
                opacity = current.opts.zoomOpacity;

                if ( opacity == 'auto' ) {
                    opacity = Math.abs( current.width / current.height - end.width / end.height ) > 0.1;
                }

                if ( opacity ) {
                    end.opacity = 0;
                }

                start.scaleX = start.width  / end.width;
                start.scaleY = start.height / end.height;

                start.width  = end.width;
                start.height = end.height;

                $.fancybox.setTranslate( current.$content, start );

                forceRedraw( current.$content );

                $.fancybox.animate( current.$content, end, duration, done );

                return true;
            }

            if ( effect && duration ) {

                
                if ( e === true ) {
                    setTimeout( done, duration );

                } else {
                    $.fancybox.animate( current.$slide.removeClass( 'fancybox-slide--current' ), 'fancybox-animated fancybox-slide--previous fancybox-fx-' + effect, duration, done );
                }

            } else {
                done();
            }

            return true;
        },
        cleanUp : function( e ) {
            var self  = this,
                $body = $( 'body' ),
                instance,
                offset;

            self.current.$slide.trigger( 'onReset' );

            self.$refs.container.empty().remove();

            self.trigger( 'afterClose', e );

            
            if ( self.$lastFocus && !!self.current.opts.backFocus ) {
                self.$lastFocus.focus();
            }

            self.current = null;

            
            instance = $.fancybox.getInstance();

            if ( instance ) {
                instance.activate();

            } else {

                $W.scrollTop( self.scrollTop ).scrollLeft( self.scrollLeft );

                $body.removeClass( 'fancybox-active compensate-for-scrollbar' );

                if ( $body.hasClass( 'fancybox-iosfix' ) ) {
                    offset = parseInt(document.body.style.top, 10);

                    $body.removeClass( 'fancybox-iosfix' ).css( 'top', '' ).scrollTop( offset * -1 );
                }

                $( '#fancybox-style-noscroll' ).remove();

            }

        },
        trigger : function( name, slide ) {
            var args  = Array.prototype.slice.call(arguments, 1),
                self  = this,
                obj   = slide && slide.opts ? slide : self.current,
                rez;

            if ( obj ) {
                args.unshift( obj );

            } else {
                obj = self;
            }

            args.unshift( self );

            if ( $.isFunction( obj.opts[ name ] ) ) {
                rez = obj.opts[ name ].apply( obj, args );
            }

            if ( rez === false ) {
                return rez;
            }

            if ( name === 'afterClose' || !self.$refs ) {
                $D.trigger( name + '.fb', args );

            } else {
                self.$refs.container.trigger( name + '.fb', args );
            }

        },
        updateControls : function ( force ) {

            var self = this;

            var current  = self.current,
                index    = current.index,
                caption  = current.opts.caption,
                $container = self.$refs.container,
                $caption   = self.$refs.caption;

            
            current.$slide.trigger( 'refresh' );

            self.$caption = caption && caption.length ? $caption.html( caption ) : null;

            if ( !self.isHiddenControls && !self.isIdle ) {
                self.showControls();
            }

            
            $container.find('[data-fancybox-count]').html( self.group.length );
            $container.find('[data-fancybox-index]').html( index + 1 );

            $container.find('[data-fancybox-prev]').prop( 'disabled', ( !current.opts.loop && index <= 0 ) );
            $container.find('[data-fancybox-next]').prop( 'disabled', ( !current.opts.loop && index >= self.group.length - 1 ) );

            if ( current.type === 'image' ) {

                
                $container.find('[data-fancybox-download]').attr( 'href', current.opts.image.src || current.src ).show();

            } else {
                $container.find('[data-fancybox-download],[data-fancybox-zoom]').hide();
            }
        },
        hideControls : function () {

            this.isHiddenControls = true;

            this.$refs.container.removeClass( 'fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav' );

        },

        showControls : function() {
            var self = this;
            var opts = self.current ? self.current.opts : self.opts;
            var $container = self.$refs.container;

            self.isHiddenControls   = false;
            self.idleSecondsCounter = 0;

            $container
                .toggleClass( 'fancybox-show-toolbar', !!( opts.toolbar && opts.buttons ) )
                .toggleClass( 'fancybox-show-infobar', !!( opts.infobar && self.group.length > 1 ) )
                .toggleClass( 'fancybox-show-nav',     !!( opts.arrows && self.group.length > 1 ) )
                .toggleClass( 'fancybox-is-modal',     !!opts.modal );

            if ( self.$caption ) {
                $container.addClass( 'fancybox-show-caption ');

            } else {
               $container.removeClass( 'fancybox-show-caption' );
           }

       },
       toggleControls : function() {
           if ( this.isHiddenControls ) {
               this.showControls();

           } else {
               this.hideControls();
           }
       },
    });
    $.fancybox={version:"3.2.10",defaults:defaults,getInstance:function(t){var e=$('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),a=Array.prototype.slice.call(arguments,1);return e instanceof FancyBox&&("string"===$.type(t)?e[t].apply(e,a):"function"===$.type(t)&&t.apply(e,a),e)},open:function(t,e,a){return new FancyBox(t,e,a)},close:function(t){var e=this.getInstance();e&&(e.close(),!0===t&&this.close())},destroy:function(){this.close(!0),$D.off("click.fb-start")},isMobile:void 0!==document.createTouch&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var t=document.createElement("div");return window.getComputedStyle&&window.getComputedStyle(t).getPropertyValue("transform")&&!(document.documentMode&&document.documentMode<11)}(),getTranslate:function(t){var e;if(!t||!t.length)return!1;if((e=(e=t.eq(0).css("transform"))&&-1!==e.indexOf("matrix")?(e=(e=e.split("(")[1]).split(")")[0]).split(","):[]).length)e=(e=e.length>10?[e[13],e[12],e[0],e[5]]:[e[5],e[4],e[0],e[3]]).map(parseFloat);else{e=[0,0,1,1];var a=/\.*translate\((.*)px,(.*)px\)/i.exec(t.eq(0).attr("style"));a&&(e[0]=parseFloat(a[2]),e[1]=parseFloat(a[1]))}return{top:e[0],left:e[1],scaleX:e[2],scaleY:e[3],opacity:parseFloat(t.css("opacity")),width:t.width(),height:t.height()}},setTranslate:function(t,e){var a="",n={};if(t&&e)return void 0===e.left&&void 0===e.top||(a=(void 0===e.left?t.position().left:e.left)+"px, "+(void 0===e.top?t.position().top:e.top)+"px",a=this.use3d?"translate3d("+a+", 0px)":"translate("+a+")"),void 0!==e.scaleX&&void 0!==e.scaleY&&(a=(a.length?a+" ":"")+"scale("+e.scaleX+", "+e.scaleY+")"),a.length&&(n.transform=a),void 0!==e.opacity&&(n.opacity=e.opacity),void 0!==e.width&&(n.width=e.width),void 0!==e.height&&(n.height=e.height),t.css(n)},animate:function(t,e,a,n,i){$.isFunction(a)&&(n=a,a=null),$.isPlainObject(e)||t.removeAttr("style"),t.on(transitionEnd,function(a){(!a||!a.originalEvent||t.is(a.originalEvent.target)&&"z-index"!=a.originalEvent.propertyName)&&($.fancybox.stop(t),$.isPlainObject(e)?(void 0!==e.scaleX&&void 0!==e.scaleY&&(t.css("transition-duration",""),e.width=Math.round(t.width()*e.scaleX),e.height=Math.round(t.height()*e.scaleY),e.scaleX=1,e.scaleY=1,$.fancybox.setTranslate(t,e)),!1===i&&t.removeAttr("style")):!0!==i&&t.removeClass(e),$.isFunction(n)&&n(a))}),$.isNumeric(a)&&t.css("transition-duration",a+"ms"),$.isPlainObject(e)?$.fancybox.setTranslate(t,e):t.addClass(e),e.scaleX&&t.hasClass("fancybox-image-wrap")&&t.parent().addClass("fancybox-is-scaling"),t.data("timer",setTimeout(function(){t.trigger("transitionend")},a+16))},stop:function(t){clearTimeout(t.data("timer")),t.off("transitionend").css("transition-duration",""),t.hasClass("fancybox-image-wrap")&&t.parent().removeClass("fancybox-is-scaling")}};
    function _run(a){var t=$(a.currentTarget),e=a.data?a.data.options:{},n=t.attr("data-fancybox")||"",r=0,o=[];a.isDefaultPrevented()||(a.preventDefault(),n?(r=(o=(o=e.selector?$(e.selector):a.data?a.data.items:[]).length?o.filter('[data-fancybox="'+n+'"]'):$('[data-fancybox="'+n+'"]')).index(t))<0&&(r=0):o=[t],$.fancybox.open(o,e,r))}
    $.fn.fancybox=function(t){var o;return(o=(t=t||{}).selector||!1)?$("body").off("click.fb-start",o).on("click.fb-start",o,{options:t},_run):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},_run),this};
    $D.on( 'click.fb-start', '[data-fancybox]', _run );

}( window, document, window.jQuery || jQuery ));

!function(e){"use strict";var a=function(a,t,o){if(a)return o=o||"","object"===e.type(o)&&(o=e.param(o,!0)),e.each(t,function(e,t){a=a.replace("$"+e,t||"")}),o.length&&(a+=(a.indexOf("?")>0?"&":"?")+o),a},t={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1,api:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},metacafe:{matcher:/metacafe.com\/watch\/(\d+)\/(.*)?/,type:"iframe",url:"//www.metacafe.com/embed/$1/?ap=1"},dailymotion:{matcher:/dailymotion.com\/video\/(.*)\/?(.*)/,params:{additionalInfos:0,autoStart:1},type:"iframe",url:"//www.dailymotion.com/embed/video/$1"},vine:{matcher:/vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,type:"iframe",url:"//vine.co/v/$1/embed/simple"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(e){return"//maps.google."+e[2]+"/?ll="+(e[9]?e[9]+"&z="+Math.floor(e[10])+(e[12]?e[12].replace(/^\//,"&"):""):e[12])+"&output="+(e[12]&&e[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(e){return"//maps.google."+e[2]+"/maps?q="+e[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}};e(document).on("objectNeedsType.fb",function(o,m,r){var i,p,l,c,u,n,s=r.src||"",d=!1;i=e.extend(!0,{},t,r.opts.media),e.each(i,function(t,o){if(l=s.match(o.matcher)){if(d=o.type,n={},o.paramPlace&&l[o.paramPlace]){"?"==(u=l[o.paramPlace])[0]&&(u=u.substring(1)),u=u.split("&");for(var m=0;m<u.length;++m){var i=u[m].split("=",2);2==i.length&&(n[i[0]]=decodeURIComponent(i[1].replace(/\+/g," ")))}}return c=e.extend(!0,{},o.params,r.opts[t],n),s="function"===e.type(o.url)?o.url.call(this,l,c,r):a(o.url,l,c),p="function"===e.type(o.thumb)?o.thumb.call(this,l,c,r):a(o.thumb,l),"vimeo"===t&&(s=s.replace("&%23","#")),!1}}),d?(r.src=s,r.type=d,r.opts.thumb||r.opts.$thumb&&r.opts.$thumb.length||(r.opts.thumb=p),"iframe"===d&&(e.extend(!0,r.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}}),r.contentProvider=void 0,r.opts.slideClass+=" fancybox-slide--video")):s&&(r.type=r.opts.defaultType)})}(window.jQuery||jQuery);
!function(t,i,n){"use strict";var s=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(i){return t.setTimeout(i,1e3/60)},e=t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(i){t.clearTimeout(i)},o=function(i){var n=[];for(var s in i=(i=i.originalEvent||i||t.e).touches&&i.touches.length?i.touches:i.changedTouches&&i.changedTouches.length?i.changedTouches:[i])i[s].pageX?n.push({x:i[s].pageX,y:i[s].pageY}):i[s].clientX&&n.push({x:i[s].clientX,y:i[s].clientY});return n},a=function(t,i,n){return i&&t?"x"===n?t.x-i.x:"y"===n?t.y-i.y:Math.sqrt(Math.pow(t.x-i.x,2)+Math.pow(t.y-i.y,2)):0},c=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var i=0,s=t[0].attributes,e=s.length;i<e;i++)if("data-fancybox-"===s[i].nodeName.substr(0,14))return!0;return!1},h=function(i){for(var n,s,e,o,a,c=!1;n=i.get(0),s=void 0,e=void 0,o=void 0,a=void 0,s=t.getComputedStyle(n)["overflow-y"],e=t.getComputedStyle(n)["overflow-x"],o=("scroll"===s||"auto"===s)&&n.scrollHeight>n.clientHeight,a=("scroll"===e||"auto"===e)&&n.scrollWidth>n.clientWidth,!(c=o||a)&&(i=i.parent()).length&&!i.hasClass("fancybox-stage")&&!i.is("body"););return c},r=function(t){this.instance=t,this.$bg=t.$refs.bg,this.$stage=t.$refs.stage,this.$container=t.$refs.container,this.destroy(),this.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(this,"ontouchstart"))};r.prototype.destroy=function(){this.$container.off(".fb.touch")},r.prototype.ontouchstart=function(s){var e=n(s.target),r=this.instance,l=r.current,p=l.$content,u="touchstart"==s.type;if(u&&this.$container.off("mousedown.fb.touch"),(!s.originalEvent||2!=s.originalEvent.button)&&e.length&&!c(e)&&!c(e.parent())&&(e.is("img")||!(s.originalEvent.clientX>e[0].clientWidth+e.offset().left))){if(!l||this.instance.isAnimating||this.instance.isClosing)return s.stopPropagation(),void s.preventDefault();this.realPoints=this.startPoints=o(s),this.startPoints&&(s.stopPropagation(),this.startEvent=s,this.canTap=!0,this.$target=e,this.$content=p,this.opts=l.opts.touch,this.isPanning=!1,this.isSwiping=!1,this.isZooming=!1,this.isScrolling=!1,this.sliderStartPos=this.sliderLastPos||{top:0,left:0},this.contentStartPos=n.fancybox.getTranslate(this.$content),this.contentLastPos=null,this.startTime=(new Date).getTime(),this.distanceX=this.distanceY=this.distance=0,this.canvasWidth=Math.round(l.$slide[0].clientWidth),this.canvasHeight=Math.round(l.$slide[0].clientHeight),n(i).off(".fb.touch").on(u?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(this,"ontouchend")).on(u?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(this,"ontouchmove")),n.fancybox.isMobile&&i.addEventListener("scroll",this.onscroll,!0),(this.opts||r.canPan())&&(e.is(this.$stage)||this.$stage.find(e).length)?(n.fancybox.isMobile&&(h(e)||h(e.parent()))||s.preventDefault(),1===this.startPoints.length&&("image"===l.type&&(this.contentStartPos.width>this.canvasWidth+1||this.contentStartPos.height>this.canvasHeight+1)?(n.fancybox.stop(this.$content),this.$content.css("transition-duration",""),this.isPanning=!0):this.isSwiping=!0,this.$container.addClass("fancybox-controls--isGrabbing")),2!==this.startPoints.length||r.isAnimating||l.hasError||"image"!==l.type||!l.isLoaded&&!l.$ghost||(this.canTap=!1,this.isSwiping=!1,this.isPanning=!1,this.isZooming=!0,n.fancybox.stop(this.$content),this.$content.css("transition-duration",""),this.centerPointStartX=.5*(this.startPoints[0].x+this.startPoints[1].x)-n(t).scrollLeft(),this.centerPointStartY=.5*(this.startPoints[0].y+this.startPoints[1].y)-n(t).scrollTop(),this.percentageOfImageAtPinchPointX=(this.centerPointStartX-this.contentStartPos.left)/this.contentStartPos.width,this.percentageOfImageAtPinchPointY=(this.centerPointStartY-this.contentStartPos.top)/this.contentStartPos.height,this.startDistanceBetweenFingers=a(this.startPoints[0],this.startPoints[1]))):e.is("img")&&s.preventDefault())}},r.prototype.onscroll=function(t){self.isScrolling=!0},r.prototype.ontouchmove=function(t){var i=n(t.target);this.isScrolling||!i.is(this.$stage)&&!this.$stage.find(i).length?this.canTap=!1:(this.newPoints=o(t),(this.opts||this.instance.canPan())&&this.newPoints&&this.newPoints.length&&(this.isSwiping&&!0===this.isSwiping||t.preventDefault(),this.distanceX=a(this.newPoints[0],this.startPoints[0],"x"),this.distanceY=a(this.newPoints[0],this.startPoints[0],"y"),this.distance=a(this.newPoints[0],this.startPoints[0]),this.distance>0&&(this.isSwiping?this.onSwipe(t):this.isPanning?this.onPan():this.isZooming&&this.onZoom())))},r.prototype.onSwipe=function(i){var o,a=this,c=a.isSwiping,r=a.sliderStartPos.left||0;if(!0!==c)"x"==c&&(a.distanceX>0&&(a.instance.group.length<2||0===a.instance.current.index&&!a.instance.current.opts.loop)?r+=Math.pow(a.distanceX,.8):a.distanceX<0&&(a.instance.group.length<2||a.instance.current.index===a.instance.group.length-1&&!a.instance.current.opts.loop)?r-=Math.pow(-a.distanceX,.8):r+=a.distanceX),a.sliderLastPos={top:"x"==c?0:a.sliderStartPos.top+a.distanceY,left:r},a.requestId&&(e(a.requestId),a.requestId=null),a.requestId=s(function(){a.sliderLastPos&&(n.each(a.instance.slides,function(t,i){var s=i.pos-a.instance.currPos;n.fancybox.setTranslate(i.$slide,{top:a.sliderLastPos.top,left:a.sliderLastPos.left+s*a.canvasWidth+s*i.opts.gutter})}),a.$container.addClass("fancybox-is-sliding"))});else if(Math.abs(a.distance)>10){if(a.canTap=!1,a.instance.group.length<2&&a.opts.vertical?a.isSwiping="y":a.instance.isDragging||!1===a.opts.vertical||"auto"===a.opts.vertical&&n(t).width()>800?a.isSwiping="x":(o=Math.abs(180*Math.atan2(a.distanceY,a.distanceX)/Math.PI),a.isSwiping=o>45&&o<135?"y":"x"),a.canTap=!1,"y"===a.isSwiping&&n.fancybox.isMobile&&(h(a.$target)||h(a.$target.parent())))return void(a.isScrolling=!0);a.instance.isDragging=a.isSwiping,a.startPoints=a.newPoints,n.each(a.instance.slides,function(t,i){n.fancybox.stop(i.$slide),i.$slide.css("transition-duration",""),i.inTransition=!1,i.pos===a.instance.current.pos&&(a.sliderStartPos.left=n.fancybox.getTranslate(i.$slide).left)}),a.instance.SlideShow&&a.instance.SlideShow.isActive&&a.instance.SlideShow.stop()}},r.prototype.onPan=function(){var t=this;a(t.newPoints[0],t.realPoints[0])<(n.fancybox.isMobile?10:5)?t.startPoints=t.newPoints:(t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&(e(t.requestId),t.requestId=null),t.requestId=s(function(){n.fancybox.setTranslate(t.$content,t.contentLastPos)}))},r.prototype.limitMovement=function(){var t,i,n,s,e,o,a=this.canvasWidth,c=this.canvasHeight,h=this.distanceX,r=this.distanceY,l=this.contentStartPos,p=l.left,u=l.top,d=l.width,g=l.height;return e=d>a?p+h:p,o=u+r,t=Math.max(0,.5*a-.5*d),i=Math.max(0,.5*c-.5*g),n=Math.min(a-d,.5*a-.5*d),s=Math.min(c-g,.5*c-.5*g),d>a&&(h>0&&e>t&&(e=t-1+Math.pow(-t+p+h,.8)||0),h<0&&e<n&&(e=n+1-Math.pow(n-p-h,.8)||0)),g>c&&(r>0&&o>i&&(o=i-1+Math.pow(-i+u+r,.8)||0),r<0&&o<s&&(o=s+1-Math.pow(s-u-r,.8)||0)),{top:o,left:e,scaleX:l.scaleX,scaleY:l.scaleY}},r.prototype.limitPosition=function(t,i,n,s){var e=this.canvasWidth,o=this.canvasHeight;return t=n>e?(t=t>0?0:t)<e-n?e-n:t:Math.max(0,e/2-n/2),{top:i=s>o?(i=i>0?0:i)<o-s?o-s:i:Math.max(0,o/2-s/2),left:t}},r.prototype.onZoom=function(){var i=this,o=i.contentStartPos.width,c=i.contentStartPos.height,h=i.contentStartPos.left,r=i.contentStartPos.top,l=a(i.newPoints[0],i.newPoints[1])/i.startDistanceBetweenFingers,p=Math.floor(o*l),u=Math.floor(c*l),d=(o-p)*i.percentageOfImageAtPinchPointX,g=(c-u)*i.percentageOfImageAtPinchPointY,f=(i.newPoints[0].x+i.newPoints[1].x)/2-n(t).scrollLeft(),P=(i.newPoints[0].y+i.newPoints[1].y)/2-n(t).scrollTop(),m=f-i.centerPointStartX,y={top:r+(g+(P-i.centerPointStartY)),left:h+(d+m),scaleX:i.contentStartPos.scaleX*l,scaleY:i.contentStartPos.scaleY*l};i.canTap=!1,i.newWidth=p,i.newHeight=u,i.contentLastPos=y,i.requestId&&(e(i.requestId),i.requestId=null),i.requestId=s(function(){n.fancybox.setTranslate(i.$content,i.contentLastPos)})},r.prototype.ontouchend=function(t){var s=Math.max((new Date).getTime()-this.startTime,1),a=this.isSwiping,c=this.isPanning,h=this.isZooming,r=this.isScrolling;if(this.endPoints=o(t),this.$container.removeClass("fancybox-controls--isGrabbing"),n(i).off(".fb.touch"),i.removeEventListener("scroll",this.onscroll,!0),this.requestId&&(e(this.requestId),this.requestId=null),this.isSwiping=!1,this.isPanning=!1,this.isZooming=!1,this.isScrolling=!1,this.instance.isDragging=!1,this.canTap)return this.onTap(t);this.speed=366,this.velocityX=this.distanceX/s*.5,this.velocityY=this.distanceY/s*.5,this.speedX=Math.max(.5*this.speed,Math.min(1.5*this.speed,1/Math.abs(this.velocityX)*this.speed)),c?this.endPanning():h?this.endZooming():this.endSwiping(a,r)},r.prototype.endSwiping=function(t,i){var s=!1,e=this.instance.group.length;this.sliderLastPos=null,"y"==t&&!i&&Math.abs(this.distanceY)>50?(n.fancybox.animate(this.instance.current.$slide,{top:this.sliderStartPos.top+this.distanceY+150*this.velocityY,opacity:0},150),s=this.instance.close(!0,300)):"x"==t&&this.distanceX>50&&e>1?s=this.instance.previous(this.speedX):"x"==t&&this.distanceX<-50&&e>1&&(s=this.instance.next(this.speedX)),!1!==s||"x"!=t&&"y"!=t||(i||e<2?this.instance.centerSlide(this.instance.current,150):this.instance.jumpTo(this.instance.current.index)),this.$container.removeClass("fancybox-is-sliding")},r.prototype.endPanning=function(){var t,i,s;this.contentLastPos&&(!1===this.opts.momentum?(t=this.contentLastPos.left,i=this.contentLastPos.top):(t=this.contentLastPos.left+this.velocityX*this.speed,i=this.contentLastPos.top+this.velocityY*this.speed),(s=this.limitPosition(t,i,this.contentStartPos.width,this.contentStartPos.height)).width=this.contentStartPos.width,s.height=this.contentStartPos.height,n.fancybox.animate(this.$content,s,330))},r.prototype.endZooming=function(){var t,i,s,e,o=this.instance.current,a=this.newWidth,c=this.newHeight;this.contentLastPos&&(t=this.contentLastPos.left,e={top:i=this.contentLastPos.top,left:t,width:a,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(this.$content,e),a<this.canvasWidth&&c<this.canvasHeight?this.instance.scaleToFit(150):a>o.width||c>o.height?this.instance.scaleToActual(this.centerPointStartX,this.centerPointStartY,150):(s=this.limitPosition(t,i,a,c),n.fancybox.setTranslate(this.content,n.fancybox.getTranslate(this.$content)),n.fancybox.animate(this.$content,s,150)))},r.prototype.onTap=function(t){var i,s=this,e=n(t.target),a=s.instance,c=a.current,h=t&&o(t)||s.startPoints,r=h[0]?h[0].x-s.$stage.offset().left:0,l=h[0]?h[0].y-s.$stage.offset().top:0,p=function(i){var e=c.opts[i];if(n.isFunction(e)&&(e=e.apply(a,[c,t])),e)switch(e){case"close":a.close(s.startEvent);break;case"toggleControls":a.toggleControls(!0);break;case"next":a.next();break;case"nextOrClose":a.group.length>1?a.next():a.close(s.startEvent);break;case"zoom":"image"==c.type&&(c.isLoaded||c.$ghost)&&(a.canPan()?a.scaleToFit():a.isScaledDown()?a.scaleToActual(r,l):a.group.length<2&&a.close(s.startEvent))}};if((!t.originalEvent||2!=t.originalEvent.button)&&(e.is("img")||!(r>e[0].clientWidth+e.offset().left))){if(e.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))i="Outside";else if(e.is(".fancybox-slide"))i="Slide";else{if(!a.current.$content||!a.current.$content.find(e).addBack().filter(e).length)return;i="Content"}if(s.tapped){if(clearTimeout(s.tapped),s.tapped=null,Math.abs(r-s.tapX)>50||Math.abs(l-s.tapY)>50)return this;p("dblclick"+i)}else s.tapX=r,s.tapY=l,c.opts["dblclick"+i]&&c.opts["dblclick"+i]!==c.opts["click"+i]?s.tapped=setTimeout(function(){s.tapped=null,p("click"+i)},500):p("click"+i);return this}},n(i).on("onActivate.fb",function(t,i){i&&!i.Guestures&&(i.Guestures=new r(i))})}(window,document,window.jQuery||jQuery);
!function(t,n){"use strict";n.extend(!0,n.fancybox.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg viewBox="0 0 40 40"><path d="M13,12 L27,20 L13,27 Z" /><path d="M15,10 v19 M23,10 v19" /></svg></button>'},slideShow:{autoStart:!1,speed:3e3}});var e=function(t){this.instance=t,this.init()};n.extend(e.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this;t.$button=t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){t.toggle()}),(t.instance.group.length<2||!t.instance.group[t.instance.currIndex].opts.slideShow)&&t.$button.hide()},set:function(t){var n=this;n.instance&&n.instance.current&&(!0===t||n.instance.current.opts.loop||n.instance.currIndex<n.instance.group.length-1)?n.timer=setTimeout(function(){n.isActive&&n.instance.jumpTo((n.instance.currIndex+1)%n.instance.group.length)},n.instance.current.opts.slideShow.speed):(n.stop(),n.instance.idleSecondsCounter=0,n.instance.showControls())},clear:function(){clearTimeout(this.timer),this.timer=null},start:function(){var t=this.instance.current;t&&(this.isActive=!0,this.$button.attr("title",t.opts.i18n[t.opts.lang].PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"),this.set(!0))},stop:function(){var t=this.instance.current;this.clear(),this.$button.attr("title",t.opts.i18n[t.opts.lang].PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"),this.isActive=!1},toggle:function(){this.isActive?this.stop():this.start()}}),n(t).on({"onInit.fb":function(t,n){n&&!n.SlideShow&&(n.SlideShow=new e(n))},"beforeShow.fb":function(t,n,e,i){var o=n&&n.SlideShow;i?o&&e.opts.slideShow.autoStart&&o.start():o&&o.isActive&&o.clear()},"afterShow.fb":function(t,n,e){var i=n&&n.SlideShow;i&&i.isActive&&i.set()},"afterKeydown.fb":function(e,i,o,s,a){var c=i&&i.SlideShow;!c||!o.opts.slideShow||80!==a&&32!==a||n(t.activeElement).is("button,a,input")||(s.preventDefault(),c.toggle())},"beforeClose.fb onDeactivate.fb":function(t,n){var e=n&&n.SlideShow;e&&e.stop()}}),n(t).on("visibilitychange",function(){var e=n.fancybox.getInstance(),i=e&&e.SlideShow;i&&i.isActive&&(t.hidden?i.clear():i.set())})}(document,window.jQuery||jQuery);
!function(e,n){"use strict";var l=function(){var n,l,r,t=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],u={};for(l=0;l<t.length;l++)if((n=t[l])&&n[1]in e){for(r=0;r<n.length;r++)u[t[0][r]]=n[r];return u}return!1}();if(l){var r={request:function(n){(n=n||e.documentElement)[l.requestFullscreen](n.ALLOW_KEYBOARD_INPUT)},exit:function(){e[l.exitFullscreen]()},toggle:function(n){n=n||e.documentElement,this.isFullscreen()?this.exit():this.request(n)},isFullscreen:function(){return Boolean(e[l.fullscreenElement])},enabled:function(){return Boolean(e[l.fullscreenEnabled])}};n.extend(!0,n.fancybox.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"><svg viewBox="0 0 40 40"><path d="M9,12 h22 v16 h-22 v-16 v16 h22 v-16 Z" /></svg></button>'},fullScreen:{autoStart:!1}}),n(e).on({"onInit.fb":function(e,n){var l;n&&n.group[n.currIndex].opts.fullScreen?((l=n.$refs.container).on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(e){e.stopPropagation(),e.preventDefault(),r.toggle(l[0])}),n.opts.fullScreen&&!0===n.opts.fullScreen.autoStart&&r.request(l[0]),n.FullScreen=r):n&&n.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()},"afterKeydown.fb":function(e,n,l,r,t){n&&n.FullScreen&&70===t&&(r.preventDefault(),n.FullScreen.toggle(n.$refs.container[0]))},"beforeClose.fb":function(e){e&&e.FullScreen&&r.exit()}}),n(e).on(l.fullscreenchange,function(){var e=r.isFullscreen(),l=n.fancybox.getInstance();l&&(l.current&&"image"===l.current.type&&l.isAnimating&&(l.current.$content.css("transition","none"),l.isAnimating=!1,l.update(!0,!0,0)),l.trigger("onFullscreenChange",e),l.$refs.container.toggleClass("fancybox-is-fullscreen",e))})}else n&&n.fancybox&&(n.fancybox.defaults.btnTpl.fullScreen=!1)}(document,window.jQuery||jQuery);
!function(t,i){"use strict";i.fancybox.defaults=i.extend(!0,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg viewBox="0 0 120 120"><path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" /></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"}},i.fancybox.defaults);var s=function(t){this.init(t)};i.extend(s.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var i=this;i.instance=t,t.Thumbs=i;var s=t.group[0],n=t.group[1];i.opts=t.group[t.currIndex].opts.thumbs,i.$button=t.$refs.toolbar.find("[data-fancybox-thumbs]"),i.opts&&s&&n&&("image"==s.type||s.opts.thumb||s.opts.$thumb)&&("image"==n.type||n.opts.thumb||n.opts.$thumb)?(i.$button.show().on("click",function(){i.toggle()}),i.isActive=!0):i.$button.hide()},create:function(){var t,s,n=this.instance,o=this.opts.parentEl;this.$grid=i('<div class="fancybox-thumbs fancybox-thumbs-'+this.opts.axis+'"></div>').appendTo(n.$refs.container.find(o).addBack().filter(o)),t="<ul>",i.each(n.group,function(i,n){(s=n.opts.thumb||(n.opts.$thumb?n.opts.$thumb.attr("src"):null))||"image"!==n.type||(s=n.src),s&&s.length&&(t+='<li data-index="'+i+'"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="'+s+'" /></li>')}),t+="</ul>",this.$list=i(t).appendTo(this.$grid).on("click","li",function(){n.jumpTo(i(this).data("index"))}),this.$list.find("img").hide().one("load",function(){var t,s,n,o,e=i(this).parent().removeClass("fancybox-thumbs-loading"),h=e.outerWidth(),a=e.outerHeight();t=this.naturalWidth||this.width,o=(s=this.naturalHeight||this.height)/a,(n=t/h)>=1&&o>=1&&(n>o?(t/=o,s=a):(t=h,s/=n)),i(this).css({width:Math.floor(t),height:Math.floor(s),"margin-top":s>a?Math.floor(.3*a-.3*s):Math.floor(.5*a-.5*s),"margin-left":Math.floor(.5*h-.5*t)}).show()}).each(function(){this.src=i(this).data("src")}),"x"===this.opts.axis&&this.$list.width(parseInt(this.$grid.css("padding-right"))+n.group.length*this.$list.children().eq(0).outerWidth(!0)+"px")},focus:function(t){var i,s,n=this.$list;this.instance.current&&(s=(i=n.children().removeClass("fancybox-thumbs-active").filter('[data-index="'+this.instance.current.index+'"]').addClass("fancybox-thumbs-active")).position(),"y"===this.opts.axis&&(s.top<0||s.top>n.height()-i.outerHeight())?n.stop().animate({scrollTop:n.scrollTop()+s.top},t):"x"===this.opts.axis&&(s.left<n.parent().scrollLeft()||s.left>n.parent().scrollLeft()+(n.parent().width()-i.outerWidth()))&&n.parent().stop().animate({scrollLeft:s.left},t))},update:function(){this.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible),this.isVisible?(this.$grid||this.create(),this.instance.trigger("onThumbsShow"),this.focus(0)):this.$grid&&this.instance.trigger("onThumbsHide"),this.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),i(t).on({"onInit.fb":function(t,i){var n;i&&!i.Thumbs&&(n=new s(i)).isActive&&!0===n.opts.autoStart&&n.show()},"beforeShow.fb":function(t,i,s,n){var o=i&&i.Thumbs;o&&o.isVisible&&o.focus(n?0:250)},"afterKeydown.fb":function(t,i,s,n,o){var e=i&&i.Thumbs;e&&e.isActive&&71===o&&(n.preventDefault(),e.toggle())},"beforeClose.fb":function(t,i){var s=i&&i.Thumbs;s&&s.isVisible&&!1!==s.opts.hideOnClose&&s.$grid.hide()}})}(document,window.jQuery);
!function(t,e){"use strict";e.extend(!0,e.fancybox.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg viewBox="0 0 40 40"><path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z"></svg></button>'},share:{tpl:'<div class="fancybox-share"><h1>{{SHARE}}</h1><p class="fancybox-share__links"><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p></div>'}}),e(t).on("click","[data-fancybox-share]",function(){var t,a,n,o,r=e.fancybox.getInstance();r&&(t=!1===r.current.opts.hash?r.current.src:window.location,a=r.current.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===r.current.type?encodeURIComponent(r.current.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,(n=t,o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},String(n).replace(/[&<>"'`=\/]/g,function(t){return o[t]}))).replace(/\{\{descr\}\}/g,r.$caption?encodeURIComponent(r.$caption.text()):""),e.fancybox.open({src:r.translate(r,a),type:"html",opts:{animationEffect:"fade",animationDuration:250,afterLoad:function(t,e){e.$content.find(".fancybox-share__links a").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})}}}))})}(document,window.jQuery||jQuery);
;(function (document, window, $) {
	'use strict';

	
	if ( !$.escapeSelector ) {
		$.escapeSelector = function( sel ) {
			var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
			var fcssescape = function( ch, asCodePoint ) {
				if ( asCodePoint ) {
					
					if ( ch === "\0" ) {
						return "\uFFFD";
					}

					
					return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
				}

				
				return "\\" + ch;
			};

			return ( sel + "" ).replace( rcssescape, fcssescape );
		};
	}

	
	var shouldCreateHistory = true;

	
	
    var currentHash = null;

	
	var timerID = null;

	
    function parseUrl() {
        var hash    = window.location.hash.substr( 1 );
        var rez     = hash.split( '-' );
        var index   = rez.length > 1 && /^\+?\d+$/.test( rez[ rez.length - 1 ] ) ? parseInt( rez.pop( -1 ), 10 ) || 1 : 1;
        var gallery = rez.join( '-' );

		
		if ( index < 1 ) {
			index = 1;
		}

        return {
            hash    : hash,
            index   : index,
            gallery : gallery
        };
    }

	
	function triggerFromUrl( url ) {
		var $el;

        if ( url.gallery !== '' ) {

			
			$el = $( "[data-fancybox='" + $.escapeSelector( url.gallery ) + "']" ).eq( url.index - 1 );

            if ( !$el.length ) {
				
				$el = $( "#" + $.escapeSelector( url.gallery ) + "" );
			}

			if ( $el.length ) {
				shouldCreateHistory = false;

				$el.trigger( 'click' );
			}

        }
	}

	
	function getGalleryID( instance ) {
		var opts;

		if ( !instance ) {
			return false;
		}

		opts = instance.current ? instance.current.opts : instance.opts;

		return opts.hash || ( opts.$orig ? opts.$orig.data( 'fancybox' ) : ''  );
	}

	
    $(function() {

		
		if ( $.fancybox.defaults.hash === false ) {
			return;
		}

		
	    $(document).on({
			'onInit.fb' : function( e, instance ) {
				var url, gallery;

				if ( instance.group[ instance.currIndex ].opts.hash === false ) {
					return;
				}

				url     = parseUrl();
				gallery = getGalleryID( instance );

				
				if ( gallery && url.gallery && gallery == url.gallery ) {
					instance.currIndex = url.index - 1;
				}
			},

			'beforeShow.fb' : function( e, instance, current ) {
				var gallery;

				if ( !current || current.opts.hash === false ) {
					return;
				}

	            gallery = getGalleryID( instance );

	            
	            if ( gallery && gallery !== '' ) {

					if ( window.location.hash.indexOf( gallery ) < 0 ) {
		                instance.opts.origHash = window.location.hash;
		            }

					currentHash = gallery + ( instance.group.length > 1 ? '-' + ( current.index + 1 ) : '' );

					if ( 'replaceState' in window.history ) {
						if ( timerID ) {
							clearTimeout( timerID );
						}

						timerID = setTimeout(function() {
							window.history[ shouldCreateHistory ? 'pushState' : 'replaceState' ]( {} , document.title, window.location.pathname + window.location.search + '#' +  currentHash );

							timerID = null;

							shouldCreateHistory = false;

						}, 300);

					} else {
						window.location.hash = currentHash;
					}

	            }

	        },

			'beforeClose.fb' : function( e, instance, current ) {
				var gallery, origHash;

				if ( timerID ) {
					clearTimeout( timerID );
				}

				if ( current.opts.hash === false ) {
					return;
				}

				gallery  = getGalleryID( instance );
				origHash = instance && instance.opts.origHash ? instance.opts.origHash : '';

	            
	            if ( gallery && gallery !== '' ) {

	                if ( 'replaceState' in history ) {
						window.history.replaceState( {} , document.title, window.location.pathname + window.location.search + origHash );

	                } else {
						window.location.hash = origHash;

						
						$( window ).scrollTop( instance.scrollTop ).scrollLeft( instance.scrollLeft );
	                }
	            }

				currentHash = null;
	        }
	    });

		
		$(window).on('hashchange.fb', function() {
			var url = parseUrl();

			if ( $.fancybox.getInstance() ) {
				if ( currentHash && currentHash !== url.gallery + '-' + url.index && !( url.index === 1 && currentHash == url.gallery ) ) {
					currentHash = null;

					$.fancybox.close();
				}

			} else if ( url.gallery !== '' ) {
				triggerFromUrl( url );
			}
		});

		
		setTimeout(function() {
			triggerFromUrl( parseUrl() );
		}, 50);
    });

}( document, window, window.jQuery || jQuery ));

!function(e,t){"use strict";var o=(new Date).getTime();t(e).on({"onInit.fb":function(e,t,n){t.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(e){var n=t.current,a=(new Date).getTime();t.group.length<1||!1===n.opts.wheel||"auto"===n.opts.wheel&&"image"!==n.type||(e.preventDefault(),e.stopPropagation(),n.$slide.hasClass("fancybox-animated")||(e=e.originalEvent||e,a-o<250||(o=a,t[(-e.deltaY||-e.deltaX||e.wheelDelta||-e.detail)<0?"next":"previous"]())))})}})}(document,window.jQuery||jQuery);
