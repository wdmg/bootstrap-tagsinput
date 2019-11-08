/**
 * Tags input for Bootstrap 3
 *
 * @category        jQuery Plugin
 * @version         1.0.0
 * @author          Alexsander Vyshnyvetskyy <alex.vyshnyvetskyy@gmail.com>
 * @link            https://github.com/wdmg/bootstrap-tagsinput
 * @copyright       Copyright (c) 2019 W.D.M.Group, Ukraine
 * @license         https://opensource.org/licenses/MIT Massachusetts Institute of Technology (MIT) License
 *
 */

+function($) {

    "use strict";
    var _createClass = (function() {
        function defineProperties(target, props) {
            for (var key in props) {
                var prop = props[key];
                prop.configurable = true;
                if (prop.value) prop.writable = true;
            }
            Object.defineProperties(target, props);
        };
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var TagsInput = (function($) {

        var className = "tagsinput";
        var _jQueryNoConflict = $.fn[className];

        // Public options and methods
        var defaults = {
            delimiter: ',', // Delimiter for split tags
            inputClass: '.tagsinput', // input class
            labelClass: '.label .label-info', // tag label class
            onChange: function onChange() { }, // The function that is called when select option change
            onShow: function onShow() { }, // The function that is called when dropdown is ready to be displayed
            onShown: function onShown() { }, // The function that is called when dropdown is displayed
            onHide: function onHide() { }, // The function that is called when dropdown to prepare for hiding
            onHidden: function onHidden() { }, // The function that is called when dropdown is hidden
            debug: false
        };

        var TagsInput = (function() {

            function TagsInput($element, config) {

                var _this = this;
                _classCallCheck(_this, TagsInput);

                // Prepare class names
                config.inputClass = config.inputClass.replace(/\./g, '');
                config.labelClass = config.labelClass.replace(/\./g, '');

                // Merge default and custom options
                _this._config = $.extend({}, defaults, $element.data(), config);

                _this._$element = $element instanceof jQuery ? $element : $($element);
                _this._tagsListId = 'tagsinput-' + Date.now().toString().substr(6);

                _this.$tagsInputTemplate = $('<input type="text" />');
                _this.$tagsInputWrapperTemplate = $('<div class="bootstrap-tagsinput" />');
                _this.$tagsItemTemplate = $('<span class="tag" />');
                _this.$tagsItemRemoveTemplate = $('<a href="#" class="remove" data-dismiss="tag" aria-hidden="true">[x]</a>');

                _this._$element.each(function() {

                    _this.tags = [];
                    _this.$input = $(this);
                    var $body = $('body');

                    // Hide original input
                    _this.$tagsInputWrapperTemplate.attr('id', _this._tagsListId);
                    _this.$input.css('display', 'none').removeAttr('class');
                    _this.$input.attr('data-rel', _this._tagsListId);

                    // Prepare tags input filed
                    _this.$tagsInput = _this.$tagsInputTemplate;
                    _this.$input.before(_this.$tagsInput);
                    _this.$tagsInput.addClass(_this._config.inputClass);
                    _this.$tagsInput.wrap(_this.$tagsInputWrapperTemplate);

                    // Create tags input wrapper
                    var $tagsInputWrapper = $('#'+_this._tagsListId);
                    $tagsInputWrapper.on('click', function(event) {
                        _this.$tagsInput.focus();
                    });

                    // Get values from original input and add them
                    var tagsList = _this.$input.val().split(_this._config.delimiter);
                    tagsList.forEach(function(item, i, arr) {
                        _this.addTag(item.trim());
                    });

                    // Add tag by press enter
                    _this.$tagsInput.on('keydown', function(event) {
                        var code = event.keyCode || event.which;
                        if (code === 13 || code === 43) {
                            var value = event.target.value.trim();
                            _this.addTag(value);
                            event.target.value = '';
                        }
                    });

                    // Add tag on lose focus from input
                    _this.$tagsInput.on('focusout', function(event) {
                        var value = event.target.value.trim();
                        if (value.length > 0) {
                            _this.addTag(value);
                            event.target.value = '';
                        }
                    });


                    // Remove tag
                    $body.delegate('#' + _this._tagsListId + ' [data-dismiss="tag"]', 'click', function(event) {
                        var $target = $(event.target);
                        var value = $target.data('value');
                        if (_this.removeTag(value)) {
                            $target.parent('.label').remove();
                            _this.updateValues();
                        }
                    });

                });
            }

            _createClass(TagsInput, {
                element: {
                    value: function element() {
                        var _this = this;
                        return _this._$element;
                    }
                },
                updateValues: {
                    value: function updateValues() {

                        if (this.tags.length > 0) {

                            // Write tags to original input for access via input.data('tags')
                            this.$input.data('tags', this.tags);

                            // Write values to original input for access via input.val()
                            this.$input.val(this.tags.join(this._config.delimiter));

                        } else {

                            // Clear tags in original input
                            this.$input.data('tags', []);
                            this.$input.val('');

                        }
                    }
                },
                removeTag: {
                    value: function removeTag(value) {
                        if (value.length > 0) {
                            var index = $.inArray(value, this.tags);
                            if (parseInt(index) >= 0) {
                                if (this.tags.splice(index, 1)) {
                                    
                                    // Callback on change input
                                    if (!this.$input.hasClass('disabled')) {

                                        if(this._config.debug)
                                            console.log('Call `onChange` method', _this);

                                        this._config.onChange.call(_this);
                                    }

                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                },
                addTag: {
                    value: function addTag(value) {

                        // Clear from start/end spaces
                        value = value.trim();

                        // If value not empty try to add them
                        if (value.length > 0) {

                            // If value not present in tags collection
                            if ($.inArray(value, this.tags) == -1) {

                                // Push tag to tags collection
                                if (this.tags.push(value)) {

                                    var $tag = this.$tagsItemTemplate.clone();
                                    var $removeLink = this.$tagsItemRemoveTemplate.clone();
                                    $removeLink.data('value', value);

                                    // Composite and add tag label to wrapper
                                    $tag.addClass(this._config.labelClass);
                                    $tag.append(value).append($removeLink);
                                    this.$tagsInput.before($tag);

                                    // Write tags to original input for access via input.data('tags')
                                    this.$input.data('tags', this.tags);

                                    // Write values to original input for access via input.val()
                                    this.$input.val(this.tags.join(this._config.delimiter));

                                    // Callback on change input
                                    if (!this.$input.hasClass('disabled')) {

                                        if(this._config.debug)
                                            console.log('Call `onChange` method', _this);

                                        this._config.onChange.call(_this);
                                    }

                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                },
            }, {
                Default: {
                    get: function() {
                        return defaults;
                    }
                },
                _jQueryInterface: {
                    value: function _jQueryInterface(config) {
                        var _this = this;
                        if (typeof config === "string") {
                            if (config == "items") {
                                var $this = $(_this);
                                return JSON.stringify($this.data('tags'));
                            }
                            return null;
                        } else {
                            config = config || {};
                            return _this.each(function() {
                                var $this = $(_this);
                                var _config = $.extend({}, TagsInput.Default, $this.data(), typeof config === "object" && config);
                                new TagsInput(_this, _config);
                            });
                        }
                    }
                }
            });

            return TagsInput;

        })();

        $.fn[className] = TagsInput._jQueryInterface;
        $.fn[className].Constructor = TagsInput;
        $.fn[className].noConflict = function() {
            $.fn[className] = _jQueryNoConflict;
            return TagsInput._jQueryInterface;
        };

        return TagsInput;

    })(jQuery);
}(jQuery);