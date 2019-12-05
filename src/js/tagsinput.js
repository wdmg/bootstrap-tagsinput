/**
 * Tags input for Bootstrap 3
 *
 * @category        jQuery Plugin
 * @version         1.0.3
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
            id: null, // Widget ID if need
            delimiter: ',', // Delimiter for split tags
            inputClass: '.tagsinput', // Input class
            labelClass: '.label .label-info', // Tag label class
            autocomplete: false, // Autocomplete URL
            format: "string", // Input/output format
            minInput: 2, // Min input lenght
            maxTags: 10, // Max tags count
            templates: {
                inputWrapper: '<div class="bootstrap-tagsinput" />',
                inputField: '<input type="text" autocomplete="false" />',
                tagItem: '<span class="tag" />',
                tagRemoveLink: '<a href="#" class="remove" data-dismiss="tag" aria-hidden="true">[x]</a>',
                autocompleteList: '<div class="autocomplete dropdown-menu" />',
                autocompleteItem: '<li><a class="item" href="#" /></li>'
            },
            onChange: function onChange() { }, // The function that is called when input change
            onShow: function onShow() { }, // The function that is called when widget is ready to be displayed
            onShown: function onShown() { }, // The function that is called when widget is displayed
            onHide: function onHide() { }, // The function that is called when widget to prepare for hiding
            onHidden: function onHidden() { }, // The function that is called when widget is hidden
            onAddTag: function onAddTag() { }, // The function is called when a new tag is added to the collection
            onRemoveTag: function onRemoveTag() { }, // The function is called when the tag is removed from the collection
            onAutocompleteSuccess: function onAutocompleteSuccess() { }, // The function is called when autocomplete successfully called an ajax request.
            onAutocompleteError: function onAutocompleteError() { }, // The function is called when autocomplete caused an ajax error
            onAutocompleteShow: function onAutocompleteShow() { }, // The function that is called when autocomplete is ready to be displayed
            onAutocompleteShown: function onAutocompleteShown() { }, // The function that is called when autocomplete is displayed
            onAutocompleteHide: function onAutocompleteHide() { }, // The function that is called when autocomplete to prepare for hiding
            onAutocompleteHidden: function onAutocompleteHidden() { }, // The function that is called when autocomplete is hidden
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

                // Configure widget id
                if (!_this._config.id)
                    _this._tagsListId = 'tagsinput-' + Date.now().toString().substr(6);
                else
                    _this._tagsListId = 'tagsinput-' + _this._config.id;

                // This will store the autocomplete ajax response
                _this.response = [];

                _this._$element.each(function() {

                    _this.tags = [];
                    _this.$input = $(this);
                    _this._callbackInProcess = false;

                    // Build tags input widget
                    if (typeof _this.$input !== "undefined")
                        _this.buildTagsInput();

                    // Get values from original input and add them
                    var inputVal = _this.$input.val();

                    // Get original value
                    if (_this._config.format == "json") {

                        // Try to parsing original value as object
                        try {

                            _this.tags = {};

                            var tagsList = JSON.parse(inputVal.split(_this._config.delimiter));
                            $.each(tagsList, function(i, tag) {
                                _this.addTag(i, tag);
                            });

                        } catch(e) {
                            if (_this._config.debug)
                                console.log('Error parsing original value in json', e);
                        }
                    }

                    if (_this._config.format == "string") {

                        _this.tags = [];

                        var tagsList = inputVal.split(_this._config.delimiter);
                        if (tagsList.length > 0) {
                            $.each(tagsList, function(i, tag) {
                                _this.addTag(tag);
                            });
                        }
                    }

                    // Update input value
                    _this.updateValues();

                    // Add tag by press enter
                    _this.$tagsInput.on('keydown', function(event) {
                        var code = event.keyCode || event.which;
                        if (code === 13 || code === 43) {
                            event.preventDefault();
                            var value = event.target.value.trim();

                            var pattern = /([_a-z]\w*):\s*([^;]*)/gi;
                            var match = pattern.exec(value);
                            if (match !== null) {
                                _this.addTag(match[1], match[2]);
                            } else {
                                _this.addTag(value);
                            }
                            _this.updateValues();

                            event.target.value = '';
                        }

                    });

                    // Build autocomplete widget
                    if (_this._config.autocomplete != false) {
                        _this.buildAutocomplete();
                    }

                    // Add tag on lose focus from input
                    _this.$tagsInput.on('blur', function(event) {

                        if (_this._config.autocomplete != false && _this.$autocomplete.hasClass('show'))
                            return;

                        var value = event.target.value.trim();
                        if (value.length > 0) {

                            var pattern = /([_a-z]\w*):\s*([^;]*)/gi;
                            var match = pattern.exec(value);
                            if (match !== null) {
                                _this.addTag(match[1], match[2]);
                            } else {
                                _this.addTag(value);
                            }
                            _this.updateValues();

                            event.target.value = '';
                        }
                    });

                    // Remove tag
                    $('body').delegate('#' + _this._tagsListId + ' [data-dismiss="tag"]', 'click', function(event) {
                        event.preventDefault();
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
                value: {
                    value: function value() {
                        var _this = this;
                        return _this.$input.val();
                    }
                },
                buildTagsInput: {
                    value: function buildTagsInput() {

                        // Hide original input
                        var $wrapper = $(this._config.templates.inputWrapper);
                        $wrapper.attr('id', this._tagsListId);

                        this.$input.css('display', 'none').removeAttr('class');
                        this.$input.attr('data-rel', this._tagsListId);

                        // Prepare tags input filed
                        this.$tagsInput = $(this._config.templates.inputField);
                        this.$input.before(this.$tagsInput);
                        this.$tagsInput.css('display', 'none');
                        this.$tagsInput.addClass(this._config.inputClass);

                        // If the original item had a placeholder
                        var placeholder = this.$input.attr('placeholder');
                        this.$tagsInput.prop('placeholder', placeholder);

                        // Wrap tag input
                        this.$tagsInput.wrap($wrapper);

                        // Prepare autocomplate widget
                        if (this._config.autocomplete != false) {
                            this.$autocomplete = $(this._config.templates.autocompleteList);
                            this.$autocomplete.attr('id', 'autocomplete-' + this._tagsListId);
                            this.$tagsInput.after(this.$autocomplete);
                        }

                        // If the input field is not active - hide tag input
                        if (this.$input.prop('disabled')) {
                            $wrapper.addClass('disabled');
                            this.$tagsInput.fadeOut();
                        } else {
                            $wrapper.removeClass('disabled');
                            this.$tagsInput.fadeIn();
                        }

                        // Listen to click events outside and focus on input
                        $('body').delegate('#'+this._tagsListId, 'click', function(event) {
                            var $target = $(event.target);
                            $target.find('input').focus();
                        });
                        
                    }
                },
                clearValues: {
                    value: function clearValues() {
                        // Clear tags in original input
                        this.$input.data('tags', []);
                        this.$input.val('');
                    }
                },
                updateValues: {
                    value: function updateValues() {

                        // Write tags to original input for access via input.data('tags')
                        this.$input.data('tags', this.tags);

                        // Write values to original input for access via input.val()
                        if (this._config.format == "json")
                            this.$input.val(JSON.stringify(this.tags));
                        else
                            this.$input.val(this.tags.join(this._config.delimiter));

                        // If the number of tags is less than the maximum allowable - show input
                        if ((this._config.maxTags > Object.keys(this.tags).length) && !(this.$input.prop('disabled')))
                            this.$tagsInput.fadeIn();

                        if (this._config.onChange instanceof Object && this._config.onChange instanceof Function) {
                            if (this._config.debug)
                                console.log('Call `onChange` method', this);

                            this._config.onChange.call(this);
                        }

                    }
                },
                removeTag: {
                    value: function removeTag(value) {

                        var _this = this;
                        var status = false;
                        if (value.length > 0) {
                            if (_this._config.format == "json") {
                                $.each(this.tags, function(i, tag) {
                                    if (tag == value)
                                        delete _this.tags[i];

                                });
                                _this.updateValues();
                                status = true;
                            } else {
                                var index = $.inArray(value, _this.tags);
                                if (parseInt(index) >= 0) {
                                    if (_this.tags.splice(index, 1)) {
                                        _this.updateValues();
                                        status = true;
                                    }
                                }
                            }
                        }

                        if (this._config.onRemoveTag instanceof Object && this._config.onRemoveTag instanceof Function) {
                            if (this._config.debug)
                                console.log('Call `onRemoveTag` method', this);

                            this._config.onRemoveTag.call(this);
                        }

                        return status;
                    }
                },
                pushLabel: {
                    value: function pushLabel(index, value) {

                        var _this = this;
                        if (_this._config.autocomplete != false && _this.$autocomplete.hasClass('show')) {

                            if (_this._config.onAutocompleteHide instanceof Object && _this._config.onAutocompleteHide instanceof Function) {
                                if (_this._config.debug)
                                    console.log('Call `onAutocompleteHide` method', this);

                                _this._config.onAutocompleteHide.call(this);
                            }

                            _this.autocompleteHide();
                        }

                        var $tag = $(_this._config.templates.tagItem);
                        var $removeLink = $(_this._config.templates.tagRemoveLink);

                        // Add tag meta data
                        $removeLink.data('index', index);
                        $removeLink.data('value', value);

                        // Composite and add tag label to wrapper
                        $tag.addClass(_this._config.labelClass);
                        $tag.append(value);

                        if (!(_this.$input.prop('disabled')))
                            $tag.append($removeLink);

                        this.$tagsInput.before($tag);
                        this.$tagsInput.focus();
                    }
                },
                addTag: {
                    value: function addTag(index, value) {

                        var status = false;

                        // Do not add the tag if the maximum number is reached
                        if (!(this._config.maxTags > Object.keys(this.tags).length)) {
                            this.$tagsInput.fadeOut();
                            return false;
                        }

                        // If the second parameter has not been passed (in the case of objects)
                        if (typeof value == "undefined") {
                            value = index.trim();
                            index = '__#' + index.trim();
                        }

                        // Clear from start/end spaces
                        value = value.trim();

                        // If value not empty try to add them
                        if (value.length >= parseInt(this._config.minInput)) {
                            if (this._config.format == "json") {

                                // If value not present in tags collection
                                if (typeof this.tags[index.toString()] == "undefined") {

                                    // Push tag to tags collection
                                    if (this.tags[index.toString()] = value) {
                                        this.pushLabel(index, value);
                                        status = index;
                                    }
                                }

                            } else {

                                // If value not present in tags collection
                                if ($.inArray(value, this.tags) == -1) {

                                    // Push tag to tags collection
                                    if (index = this.tags.push(value)) {
                                        this.pushLabel(index, value);
                                        status = index;
                                    }
                                }
                            }
                        }

                        if (this._config.autocomplete != false && this.$autocomplete.hasClass('show')) {

                            if (this._config.onAutocompleteHide instanceof Object && this._config.onAutocompleteHide instanceof Function) {
                                if (this._config.debug)
                                    console.log('Call `onAutocompleteHide` method', this);

                                this._config.onAutocompleteHide().call(this);
                            }
                            this.autocompleteHide();

                        }

                        if (this._config.onAddTag instanceof Object && this._config.onAddTag instanceof Function) {
                            if (this._config.debug)
                                console.log('Call `onAddTag` method', this);

                            this._config.onAddTag.call(this);
                        }

                        return status;
                    }
                },
                parseURL: {
                    value: function parseURL(url) {
                        var pattern = new RegExp(/[?&]\w+=/);
                        if (pattern.test(url)) {
                            return JSON.parse('{"' + decodeURIComponent(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                        } else {
                            return JSON.parse('{"' + decodeURIComponent(url) + '":""}');
                        }
                    }
                },
                encodeURL: {
                    value: function encodeURL(object) {

                        var url = "";
                        var pattern = new RegExp(/[?&]\w+=/);
                        for (var key in object) {

                            if (pattern.test(url)) {
                                if (url != "")
                                    url += "&";
                            } else {
                                if (url != "")
                                    url += "?";
                            }

                            if (key != "" && encodeURIComponent(object[key]) == "")
                                url = key;
                            else if (key != "" && encodeURIComponent(object[key]) != "")
                                url += key + "=" + encodeURIComponent(object[key]);

                        }

                        return url;
                    }
                },
                buildAutocomplete: {
                    value: function buildAutocomplete() {
                        var _this = this;
                        _this._callbackInProcess = false;
                        _this.$tagsInput.on('input', function (event) {
                            var value = event.target.value.trim();
                            if (value.length >= parseInt(_this._config.minInput) && !_this._callbackInProcess) {
                                _this._callbackInProcess = true;

                                // Prepare URL for aJax and add value string
                                var url = _this.parseURL(_this._config.autocomplete);
                                url['value'] = value;
                                url['_t'] = Date.now();

                                $.ajax({
                                    url: _this.encodeURL(url),
                                    success: function(response, status, jqXHR) {

                                        if (_this._config.format == "json" && !(typeof response == "object"))
                                            response = JSON.parse(response);

                                        if (_this._config.onAutocompleteSuccess instanceof Object && _this._config.onAutocompleteSuccess instanceof Function) {
                                            if (_this._config.debug)
                                                console.log('Call `onAutocompleteSuccess` method', this);

                                            _this._config.onAutocompleteSuccess.call(this);
                                        }

                                        if (_this._config.format == "json" && Object.keys(response).length > 0) {

                                            if (_this._config.onAutocompleteShow instanceof Object && _this._config.onAutocompleteShow instanceof Function) {
                                                if (_this._config.debug)
                                                    console.log('Call `onAutocompleteShow` method', this);

                                                _this._config.onAutocompleteShow.call(this);
                                            }

                                            _this.$autocomplete.empty();
                                            $.each(response, function(index, tag) {

                                                if (typeof tag == "object") {
                                                    $.each(tag, function(index, item) {
                                                        tag = item;
                                                    });
                                                }

                                                if (tag.substr(0, value.length).toUpperCase() == value.toUpperCase()) {

                                                    // If response tag not present in collection
                                                    if (typeof _this.tags[index.toString()] == "undefined") {
                                                        var $autocompleteItem = $(_this._config.templates.autocompleteItem);
                                                        var $autocompleteLink = $autocompleteItem.find('a');
                                                        $autocompleteLink.html("<b>" + tag.substr(0, value.length) + "</b>" + tag.substr(value.length));
                                                        $autocompleteLink.data('index', index).data('value', tag);
                                                        $autocompleteLink.attr('href', '#'+index);
                                                        _this.$autocomplete.append($autocompleteItem);
                                                    }

                                                }

                                            });
                                            _this.autocompleteShow();
                                        } else if (response.length > 0) {

                                            _this.$autocomplete.empty();

                                            if (_this._config.onAutocompleteShow instanceof Object && _this._config.onAutocompleteShow instanceof Function) {
                                                if (_this._config.debug)
                                                    console.log('Call `onAutocompleteShow` method', this);

                                                _this._config.onAutocompleteShow.call(this);
                                            }

                                            for (var i = 0; i < response.length; i++) {

                                                // If response tag not present in collection
                                                if (response[i].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
                                                    if ($.inArray(value, _this.tags) == -1) {
                                                        var $autocompleteItem = $(_this._config.templates.autocompleteItem);
                                                        var $autocompleteLink = $autocompleteItem.find('a');
                                                        $autocompleteLink.html("<b>" + response[i].substr(0, value.length) + "</b>" + response[i].substr(value.length));
                                                        $autocompleteLink.data('value', response[i]);
                                                        _this.$autocomplete.append($autocompleteItem);

                                                    }
                                                }

                                            }
                                            _this.autocompleteShow();
                                        } else {
                                            if (_this._config.onAutocompleteHide instanceof Object && _this._config.onAutocompleteHide instanceof Function) {
                                                if (_this._config.debug)
                                                    console.log('Call `onAutocompleteHide` method', this);

                                                _this._config.onAutocompleteHide().call(this);
                                            }
                                            _this.autocompleteHide();
                                        }
                                        _this._callbackInProcess = false;
                                    },
                                    error: function(jqXHR, status, error) {
                                        if (_this._config.onAutocompleteError instanceof Object && _this._config.onAutocompleteError instanceof Function) {
                                            if (_this._config.debug)
                                                console.log('Call `onAutocompleteError` method', this);

                                            _this._config.onAutocompleteError.call(this);
                                        }
                                        _this._callbackInProcess = false;
                                    }
                                });
                            }
                        });

                        $('body').delegate('#autocomplete-' + _this._tagsListId + ' a', 'click', function(event) {

                            event.preventDefault();

                            _this.$tagsInput.val('');
                            var $target = $(event.target);
                            var index = $target.data('index');
                            var value = $target.data('value');

                            if (index && value)
                                var result = _this.addTag(index, value);
                            else
                                var result = _this.addTag(value);

                            if (result) {
                                if (_this._config.onAutocompleteHide instanceof Object && _this._config.onAutocompleteHide instanceof Function) {
                                    if (_this._config.debug)
                                        console.log('Call `onAutocompleteHide` method', this);

                                    _this._config.onAutocompleteHide.call(this);
                                }

                                _this.autocompleteHide();
                                _this.updateValues();
                            }

                        });
                    }
                },
                autocompleteShow: {
                    value: function autocompleteShow() {
                        var _this = this;
                        _this.$autocomplete.addClass('show');

                        if (_this._config.onAutocompleteShown instanceof Object && _this._config.onAutocompleteShown instanceof Function) {
                            if (_this._config.debug)
                                console.log('Call `onAutocompleteShown` method', this);

                            _this._config.onAutocompleteShown.call(this);
                        }
                    }
                },
                autocompleteHide: {
                    value: function autocompleteHide() {
                        var _this = this;
                        _this.$autocomplete.removeClass('show');
                        _this.response = [];

                        if (_this._config.onAutocompleteHidden instanceof Object && _this._config.onAutocompleteHidden instanceof Function) {
                            if (_this._config.debug)
                                console.log('Call `onAutocompleteHidden` method', this);

                            _this._config.onAutocompleteHidden.call(this);
                        }
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