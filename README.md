# Bootstrap TagsInput
Tags input for Bootstrap 3

# Installation

    $ npm install bootstrap-tagsinput-plugin
    $ bower install bootstrap-tagsinput-plugin
    $ yarn add bootstrap-tagsinput-plugin
    $ composer require bootstrap-tagsinput-plugin

# Usage example

For example use the input-group:

    <div class="form-group">
        <label class="control-label" for="tags">Tags:</label>
        <input id="tags" name="tags" class="form-control" placeholder="Type your tags here..." value="one, two, three" />
    </div>

... and init from script:

    <script type="text/javascript">
        $(document).ready(function () {
            var tags = $('input#tags').tagsinput({
                delimiter: ','
            });
        });
    </script>

# Options

| Name            | Type             | Default          | Description                                                |
|:--------------- |:----------------:|:---------------- |:---------------------------------------------------------- |
| id              | string           | `empty`          | The widget ID if need. |
| delimiter       | string           | ','              | Delimiter for split tags. |
| inputClass      | string           | '.tagsinput'     | Input class. |
| labelClass      | string           | '.label .label-info' | Tag label class. |
| autocomplete    | string/boolean   | `false`          | Autocomplete URL. |
| format          | string           | "string"         | Input/output format for autocomplate. |
| minInput        | integer          | 2                | Min input lenght for add tag. |
| maxTags         | integer          | 10               | Max tags count. |
| templates       | array            | {inputWrapper, inputField, tagItem etc. }      | Templates array for widget. |
| onChange        | function         | `onChange()`     | The function that is called when input change. |
| onShow          | function         | `onShow()`       | The function that is called when widget is ready to be displayed. |
| onShown         | function         | `onShown()`      | The function that is called when widget is displayed. |
| onHide          | function         | `onHide()`       | The function that is called when widget to prepare for hiding. |
| onHidden        | function         | `onHidden()`     | The function that is called when widget is hidden. |
| onAddTag        | function         | `onAddTag()`     | The function is called when a new tag is added to the collection. |
| onRemoveTag     | function         | `onRemoveTag()`  | The function is called when the tag is removed from the collection. |
| onAutocompleteSuccess | function   | `onAutocompleteSuccess()` | The function is called when autocomplete successfully called an ajax request. |
| onAutocompleteError   | function   | `onAutocompleteError()`   | The function is called when autocomplete caused an ajax error. |
| onAutocompleteShow    | function   | `onAutocompleteShow()`    | The function that is called when autocomplete is ready to be displayed. |
| onAutocompleteShown   | function   | `onAutocompleteShown()`   | The function that is called when autocomplete is displayed. |
| onAutocompleteHide    | function   | `onAutocompleteHide()`    | The function that is called when autocomplete to prepare for hiding. |
| onAutocompleteHidden  | function   | `onAutocompleteHidden()`  | The function that is called when autocomplete is hidden. |
| debug           | boolean          | `false`          | Flag if need debug in console log. |

# Templates

| Name                | Type   | Default value                                  | Description                                                |
|:------------------- |:------:|:---------------------------------------------- |:---------------------------------------------------------- |
| inputWrapper        | string | '<div class="bootstrap-tagsinput" />'          | Template for widget wrapper. |
| inputField          | string | '<input type="text" autocomplete="false" />'   | The autocomplete field. |
| tagItem             | string | '<span class="tag" />'                         | The tag template. |
| tagRemoveLink       | string | '<a href="#" class="remove" data-dismiss="tag" aria-hidden="true">[x]</a>' | Link for remove tag. |
| autocompleteList    | string | '<div class="autocomplete dropdown-menu" />'   | Autocomplete dropdown list. |
| autocompleteItem    | string | '<li><a class="item" href="#" /></li>'         | Autocomplete dropdown item. |

# Status and version
* v.1.0.3 - Added README.md
* v.1.0.2 - Some bugfixies. Backward compatibility $.ajax for older jQuery version.
* v.1.0.1 - Added autocomplete.
* v.1.0.0 - Added base plugin and stylesheets, example.
