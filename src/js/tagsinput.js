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
            inputClass: '.tagsinput', // data-dropdown-class
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

                // Prepare class name to remove dots (.) from selector
                config.inputClass = config.inputClass.replace(/\./g, '');

                // Merge default and custom options
                _this._config = $.extend({}, defaults, $element.data(), config);

                _this._$element = $element instanceof jQuery ? $element : $($element);
                _this._tagsListId = 'tagsinput-' + Date.now().toString().substr(6);

                _this.$tagsInputTemplate = $('<input type="text" />');
                _this.$tagsInputWrapperTemplate = $('<div class="bootstrap-tagsinput" />');
                _this.$tagsItemTemplate = $('<span class="tag label label-default" />');
                _this.$tagsItemRemoveTemplate = $('<a href="#" class="remove" data-dismiss="tag" aria-hidden="true">[x]</a>');

                _this._$element.each(function() {

                    _this.tags = [];
                    var $input = $(this);
                    var $body = $('body');

                    // Hide original input
                    _this.$tagsInputWrapperTemplate.attr('id', _this._tagsListId);
                    $input.css('display', 'none').removeAttr('class');
                    $input.attr('data-rel', _this._tagsListId);

                    // Prepare tags input filed
                    var $tagsInput = _this.$tagsInputTemplate;
                    $input.before($tagsInput);
                    $tagsInput.addClass(_this._config.inputClass);
                    $tagsInput.wrap(_this.$tagsInputWrapperTemplate);

                    // Create tags input wrapper
                    var $tagsInputWrapper = $('#'+_this._tagsListId);
                    $tagsInputWrapper.on('click', function(event) {
                        $tagsInput.focus();
                    });

                    // Get values from original input
                    _this.tags = $input.val().split(_this._config.delimiter);
                    _this.tags.forEach(function(item, i, arr) {
                        var $tag = _this.$tagsItemTemplate.clone();
                        var $removeLink = _this.$tagsItemRemoveTemplate.clone();
                        var value = item.trim();
                        if (value.length > 0) {
                            $removeLink.data('value', value);
                            $tag.append(value).append($removeLink);
                            $tagsInput.before($tag)
                        }
                    });

                    // Add tag
                    $tagsInput.on('keydown', function(event) {
                        var code = event.keyCode || event.which;
                        if (parseInt(code) == 13) {
                            var $tag = _this.$tagsItemTemplate.clone();
                            var $removeLink = _this.$tagsItemRemoveTemplate.clone();
                            var value = event.target.value.trim();
                            if (value.length > 0) {
                                if ($.inArray(value, _this.tags) == -1) {
                                    $removeLink.data('value', value);
                                    $tag.append(value).append($removeLink);
                                    if ($tagsInput.before($tag)) {

                                        // Push tag to tags collection
                                        _this.tags.push(value);

                                        // Write values to original input
                                        $input.val(_this.tags.join(_this._config.delimiter));
                                    }
                                }
                                event.target.value = '';
                            }
                        }
                    });


                    // Remove tag
                    $body.delegate('#' + _this._tagsListId + ' [data-dismiss="tag"]', 'click', function(event) {
                        var $target = $(event.target);
                        var value = $target.data('value');
                        if (value.length > 0) {
                            var index = $.inArray(value, _this.tags);
                            if (parseInt(index) >= 0) {
                                if (_this.tags.splice(index, 1)) {
                                    $target.parent('.label').remove();
                                }
                            }
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
                }
            }, {
                Default: {
                    get: function() {
                        return defaults;
                    }
                },
                _jQueryInterface: {
                    value: function _jQueryInterface(config) {
                        var _this = this;
                        config = config || {};
                        return _this.each(function() {
                            var $this = $(_this);
                            var _config = $.extend({}, TagsInput.Default, $this.data(), typeof config === "object" && config);
                            new TagsInput(_this, _config);
                        });
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