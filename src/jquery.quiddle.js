;(function( $, window, document, undefined ){
    'use strict';
    var pluginName = "quiddle";

    // Plugin constructor
    var Quiddle = function( elem, options ){
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data( "quiddle-options" );
    };

    function pathToElement(elem){
        return $(elem)
            .parentsUntil('body')
            .andSelf()
            .map(function() {
                return this.nodeName + ':eq(' + $(this).index() + ')';
            }).get().join('>');
    }

    function findElementsBySelectorRegisterClick($parentEl, selector, callback){
        var elems = $parentEl.find(selector); 
        var results = [];
        $.each(elems, function( _, ielem ) {
            $(ielem).click(callback);
        });
    }

    function findInputsBySelector($parentEl, selector){
        var elems = $parentEl.find(selector); 
        var results = [];
        $.each(elems, function( _, ielem ) {
            //get type,file,marker
            var $ielem = $(ielem);
            var type = $ielem.data('quiddle-type'); 
            var file = $ielem.data('quiddle-file');
            var marker = $ielem.data('quiddle-marker');
            if(typeof type === 'undefined' ||
                    typeof marker === 'undefned'){
               throw new Error('Input metadata not correctly set (type,marker) for element: '+ pathToElement(ielem));
            }
            results.push({'marker':marker, 'file': file, 'type':type,'elem':ielem}); 
        });     
        return results;
    }


    function findPreviewBySelector($parentEl, selector){
        var $elems = $parentEl.find(selector);
        if($elems.length === 0){
            throw new Error('No preview element found by selector "'+selector+'"');
        }else if($elems.length > 1){
            throw new Error('Multiple preview elements found by selector "'+selector+'"');
        }
        return $elems[0];
    }
    
    // sideeffect: adds editor field to inputsarr entries.
    function initAceEditors(inputsarr, aceconfig){
        $.each(inputsarr, function( _, input ) {
            var editor = ace.edit(input.elem);
            input.editor = editor;
            editor.setTheme(aceconfig.theme);
            editor.getSession().setMode("ace/mode/"+input.type);
            editor.setHighlightActiveLine(true);
            editor.getSession().setUseWorker(false);
           
            //User editor config
            aceconfig.initMethod(editor, input);
        });
    }
    
    function fetchFileContent(file, cb){
        var request = $.ajax({
            url: file,
            dataType: "html",
            cache: false
        });
        request.done(cb);
         
        request.fail(function( jqXHR, textStatus ) {
            throw new Error("Can't find local file: "+file);
        });

    }
    // the plugin prototype
    Quiddle.prototype = {
        defaults: {
            template: null,
            emptyfile: 'empty.html',
            inputSelector: '.quiddle-input',
            previewSelector: '.quiddle-preview',
            runBtnSelector: '.quiddle-run',
            resetBtnSelector: '.quiddle-reset',
            aceconfig: {
                theme: 'ace/theme/monokai',
                initMethod : function(editor,elem){}
            }
        },

        init: function() {
            var that = this;
            // Introduce defaults that can be extended either
            // globally or using an object literal.
            this.config = $.extend(true, {}, this.defaults, this.options,
            this.metadata);

            //Init template
            this.template = "";
            fetchFileContent(this.config.template, function(content){ that.template = content;});
            
            //Get input and preview elements
            this.inputs = findInputsBySelector(this.$elem, this.config.inputSelector);
            this.elemPreview = findPreviewBySelector(this.$elem, this.config.previewSelector);

            //Init Ace Editors and fill input fields
            initAceEditors(this.inputs, this.config.aceconfig);
            this.fillInputs();

            findElementsBySelectorRegisterClick(this.$elem, this.config.runBtnSelector, function(){
                that.renderPreview();    
            });
            findElementsBySelectorRegisterClick(this.$elem, this.config.resetBtnSelector, function(){
               that.fillInputs();
               that.resetIFrame();
            });
            
                
            return this;
        },

        /**
         * Fill inputs with data from file, used for init and reset.
         */
        fillInputs: function(){
            var that = this;
            $.each(this.inputs, function( _, input ) {
                if(input.file){
                    fetchFileContent(input.file, function(content){
                        input.editor.getSession().setValue(content);
                    });
                }else{
                    input.editor.getSession().setValue('');
                }
            });
        },

        /**
         * Resets the complete dom of iframe, otherwise js stack would persist.
         */ 
        resetIFrame: function(callback){
            var that = this;
            $(this.elemPreview).on('load',function(){
                // need to remove onload
                $(this).off('load');
                if(typeof callback != 'undefined'){
                    callback.apply(that);
                }
            });
            $(this.elemPreview).attr('src',this.config.emptyfile);
        },
        
        /**
         * Renders the preview, resets the iframe before.
         */
        renderPreview: function(){
            var template = this.template;
            if(template.length !== 0){
                $.each(this.inputs, function( index, input ) {
                    template = template.replace('%%%'+input.marker.toUpperCase()+'%%%',input.editor.getSession().getValue());
                });     
                this.resetIFrame(function(){
                    var dstFrame = this.elemPreview;
                    var dstDoc = dstFrame.contentDocument || dstFrame.contentWindow.document;
                    dstDoc.write(''); 
                    dstDoc.write(template);
                    dstDoc.close();
                });                

            }else{
                throw new Error("Template not loaded yet");
            }
        }
    };

    Quiddle.defaults = Quiddle.prototype.defaults;

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Quiddle(this, options).init());
                
            }
        });
    };

})( jQuery, window , document );

