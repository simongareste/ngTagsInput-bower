/*!
 * ngTagsInput v3.2.0
 * http://mbenford.github.io/ngTagsInput
 *
 * Copyright (c) 2013-2019 Michael Benford
 * License: MIT
 *
 * Generated at 2019-08-22 10:59:26 +0200
 */
(function (angular$1) {
'use strict';

var Constants = {
  KEYS: {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    delete: 46,
    comma: 188
  },
  MAX_SAFE_INTEGER: 9007199254740991,
  SUPPORTED_INPUT_TYPES: ['text', 'email', 'url']
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

TagsInputDirective.$inject = ['$timeout', '$document', '$window', '$q', 'tagsInputConfig', 'tiUtil', 'tiConstants'];
/**
 * @ngdoc directive
 * @name tagsInput
 * @module ngTagsInput
 *
 * @description
 * Renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable Angular expression to data-bind to.
 * @param {boolean=} [useStrings=false] Flag indicating that the model is an array of strings (EXPERIMENTAL).
 * @param {string=} [template=NA] URL or id of a custom template for rendering each tag.
 * @param {string=} [templateScope=NA] Scope to be passed to custom templates - of both tagsInput and
 *    autoComplete directives - as $scope.
 * @param {string=} [displayProperty=text] Property to be rendered as the tag label.
 * @param {string=} [keyProperty=text] Property to be used as a unique identifier for the tag.
 * @param {string=} [type=text] Type of the input element. Only 'text', 'email' and 'url' are supported values.
 * @param {string=} [text=NA] Assignable Angular expression for data-binding to the element's text.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} [maxLength=MAX_SAFE_INTEGER] Maximum length allowed for a new tag.
 * @param {number=} [minTags=0] Sets minTags validation error key if the number of tags added is less than minTags.
 * @param {number=} [maxTags=MAX_SAFE_INTEGER] Sets maxTags validation error key if the number of tags added is greater
 *    than maxTags.
 * @param {boolean=} [allowLeftoverText=false] Sets leftoverText validation error key if there is any leftover text in
 *    the input element when the directive loses focus.
 * @param {string=} [removeTagSymbol=×] (Obsolete) Symbol character for the remove tag button.
 * @param {boolean=} [addOnEnter=true] Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=} [addOnSpace=false] Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=} [addOnComma=true] Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=} [addOnBlur=true] Flag indicating that a new tag will be added when the input field loses focus.
 * @param {boolean=} [addOnPaste=false] Flag indicating that the text pasted into the input field will be split into tags.
 * @param {string=} [pasteSplitPattern=,] Regular expression used to split the pasted text into tags.
 * @param {boolean=} [replaceSpacesWithDashes=true] Flag indicating that spaces will be replaced with dashes.
 * @param {string=} [allowedTagsPattern=.+] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into the new tag
 *    input box instead of being removed when the backspace key is pressed and the input box is empty.
 * @param {boolean=} [addFromAutocompleteOnly=false] Flag indicating that only tags coming from the autocomplete list
 *    will be allowed. When this flag is true, addOnEnter, addOnComma, addOnSpace and addOnBlur values are ignored.
 * @param {boolean=} [spellcheck=true] Flag indicating whether the browser's spellcheck is enabled for the input field or not.
 * @param {expression=} [tagClass=NA] Expression to evaluate for each existing tag in order to get the CSS classes to be used.
 *    The expression is provided with the current tag as $tag, its index as $index and its state as $selected. The result
 *    of the evaluation must be one of the values supported by the ngClass directive (either a string, an array or an object).
 *    See https://docs.angularjs.org/api/ng/directive/ngClass for more information.
 * @param {expression=} [onTagAdding=NA] Expression to evaluate that will be invoked before adding a new tag. The new
 *    tag is available as $tag. This method must return either a boolean value or a promise. If either a false value or a rejected
 *    promise is returned, the tag will not be added.
 * @param {expression=} [onTagAdded=NA] Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression=} [onInvalidTag=NA] Expression to evaluate when a tag is invalid. The invalid tag is available as $tag.
 * @param {expression=} [onTagRemoving=NA] Expression to evaluate that will be invoked before removing a tag. The tag
 *    is available as $tag. This method must return either a boolean value or a promise. If either a false value or a rejected
 *    promise is returned, the tag will not be removed.
 * @param {expression=} [onTagRemoved=NA] Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 * @param {expression=} [onTagClicked=NA] Expression to evaluate upon clicking an existing tag. The clicked tag is available as $tag.
 */
function TagsInputDirective($timeout, $document, $window, $q, tagsInputConfig, tiUtil, tiConstants) {
  'ngInject';

  function TagList(options, events, onTagAdding, onTagRemoving) {
    var self = {};

    var getTagText = function getTagText(tag) {
      return tiUtil.safeToString(tag[options.displayProperty]);
    };
    var setTagText = function setTagText(tag, text) {
      tag[options.displayProperty] = text;
    };

    var canAddTag = function canAddTag(tag) {
      var tagText = getTagText(tag);
      var valid = tagText && tagText.length >= options.minLength && tagText.length <= options.maxLength && options.allowedTagsPattern.test(tagText) && !tiUtil.findInObjectArray(self.items, tag, options.keyProperty || options.displayProperty);

      return $q.when(valid && onTagAdding({ $tag: tag })).then(tiUtil.promisifyValue);
    };

    var canRemoveTag = function canRemoveTag(tag) {
      return $q.when(onTagRemoving({ $tag: tag })).then(tiUtil.promisifyValue);
    };

    self.items = [];

    self.addText = function (text) {
      var tag = {};
      setTagText(tag, text);
      return self.add(tag);
    };

    self.add = function (tag) {
      var tagText = getTagText(tag);

      if (options.replaceSpacesWithDashes) {
        tagText = tiUtil.replaceSpacesWithDashes(tagText);
      }

      setTagText(tag, tagText);

      return canAddTag(tag).then(function () {
        self.items.push(tag);
        events.trigger('tag-added', { $tag: tag });
      }).catch(function () {
        if (tagText) {
          events.trigger('invalid-tag', { $tag: tag });
        }
      });
    };

    self.remove = function (index) {
      var tag = self.items[index];
      return canRemoveTag(tag).then(function () {
        self.items.splice(index, 1);
        self.clearSelection();
        events.trigger('tag-removed', { $tag: tag });
        return tag;
      });
    };

    self.select = function (index) {
      if (index < 0) {
        index = self.items.length - 1;
      } else if (index >= self.items.length) {
        index = 0;
      }

      self.index = index;
      self.selected = self.items[index];
    };

    self.selectPrior = function () {
      self.select(--self.index);
    };

    self.selectNext = function () {
      self.select(++self.index);
    };

    self.removeSelected = function () {
      return self.remove(self.index);
    };

    self.clearSelection = function () {
      self.selected = null;
      self.index = -1;
    };

    self.getItems = function () {
      return options.useStrings ? self.items.map(getTagText) : self.items;
    };

    self.clearSelection();

    return self;
  }

  function validateType(type) {
    return tiConstants.SUPPORTED_INPUT_TYPES.indexOf(type) !== -1;
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      tags: '=ngModel',
      text: '=?',
      templateScope: '=?',
      tagClass: '&',
      onTagAdding: '&',
      onTagAdded: '&',
      onInvalidTag: '&',
      onTagRemoving: '&',
      onTagRemoved: '&',
      onTagClicked: '&'
    },
    replace: false,
    transclude: true,
    templateUrl: 'ngTagsInput/tags-input.html',
    controller: ['$scope', '$element', '$attrs', function controller($scope, $element, $attrs) {
      'ngInject';

      $scope.events = tiUtil.simplePubSub();

      $scope.options = tagsInputConfig.load('tagsInput', $element, $attrs, $scope.events, {
        template: [String, 'ngTagsInput/tag-item.html'],
        type: [String, 'text', validateType],
        placeholder: [String, 'Add a tag'],
        tabindex: [Number, null],
        removeTagSymbol: [String, String.fromCharCode(215)],
        replaceSpacesWithDashes: [Boolean, true],
        minLength: [Number, 3],
        maxLength: [Number, tiConstants.MAX_SAFE_INTEGER],
        addOnEnter: [Boolean, true],
        addOnSpace: [Boolean, false],
        addOnComma: [Boolean, true],
        addOnBlur: [Boolean, true],
        addOnPaste: [Boolean, false],
        pasteSplitPattern: [RegExp, /,/],
        allowedTagsPattern: [RegExp, /.+/],
        enableEditingLastTag: [Boolean, false],
        minTags: [Number, 0],
        maxTags: [Number, tiConstants.MAX_SAFE_INTEGER],
        displayProperty: [String, 'text'],
        keyProperty: [String, ''],
        allowLeftoverText: [Boolean, false],
        addFromAutocompleteOnly: [Boolean, false],
        spellcheck: [Boolean, true],
        useStrings: [Boolean, false]
      });

      $scope.tagList = new TagList($scope.options, $scope.events, tiUtil.handleUndefinedResult($scope.onTagAdding, true), tiUtil.handleUndefinedResult($scope.onTagRemoving, true));

      this.registerAutocomplete = function () {
        return {
          addTag: function addTag(tag) {
            return $scope.tagList.add(tag);
          },
          getTags: function getTags() {
            return $scope.tagList.items;
          },
          getCurrentTagText: function getCurrentTagText() {
            return $scope.newTag.text();
          },
          getOptions: function getOptions() {
            return $scope.options;
          },
          getTemplateScope: function getTemplateScope() {
            return $scope.templateScope;
          },
          on: function on(name, handler) {
            $scope.events.on(name, handler, true);
            return this;
          }
        };
      };

      this.registerTagItem = function () {
        return {
          getOptions: function getOptions() {
            return $scope.options;
          },
          removeTag: function removeTag(index) {
            if ($scope.disabled) {
              return;
            }
            $scope.tagList.remove(index);
          }
        };
      };
    }],
    link: function link(scope, element, attrs, ngModelCtrl) {
      var hotkeys = [tiConstants.KEYS.enter, tiConstants.KEYS.comma, tiConstants.KEYS.space, tiConstants.KEYS.backspace, tiConstants.KEYS.delete, tiConstants.KEYS.left, tiConstants.KEYS.right];
      var tagList = scope.tagList;
      var events = scope.events;
      var options = scope.options;
      var input = element.find('input');
      var validationOptions = ['minTags', 'maxTags', 'allowLeftoverText'];

      var setElementValidity = function setElementValidity() {
        ngModelCtrl.$setValidity('maxTags', tagList.items.length <= options.maxTags);
        ngModelCtrl.$setValidity('minTags', tagList.items.length >= options.minTags);
        ngModelCtrl.$setValidity('leftoverText', scope.hasFocus || options.allowLeftoverText ? true : !scope.newTag.text());
      };

      var focusInput = function focusInput() {
        $timeout(function () {
          input[0].focus();
        });
      };

      ngModelCtrl.$isEmpty = function (value) {
        return !value || !value.length;
      };

      scope.newTag = {
        text: function text(value) {
          if (angular.isDefined(value)) {
            scope.text = value;
            events.trigger('input-change', value);
          } else {
            return scope.text || '';
          }
        },

        invalid: null
      };

      scope.track = function (tag) {
        return tag[options.keyProperty || options.displayProperty];
      };

      scope.getTagClass = function (tag, index) {
        var selected = tag === tagList.selected;
        return [scope.tagClass({ $tag: tag, $index: index, $selected: selected }), { selected: selected }];
      };

      scope.$watch('tags', function (value) {
        if (value) {
          tagList.items = tiUtil.makeObjectArray(value, options.displayProperty);
          if (options.useStrings) {
            return;
          }

          scope.tags = tagList.items;
        } else {
          tagList.items = [];
        }
      });

      scope.$watch('tags.length', function () {
        setElementValidity();

        // ngModelController won't trigger validators when the model changes (because it's an array),
        // so we need to do it ourselves. Unfortunately this won't trigger any registered formatter.
        ngModelCtrl.$validate();
      });

      attrs.$observe('disabled', function (value) {
        scope.disabled = value;
      });

      scope.eventHandlers = {
        input: {
          keydown: function keydown($event) {
            events.trigger('input-keydown', $event);
          },
          focus: function focus() {
            if (scope.hasFocus) {
              return;
            }

            scope.hasFocus = true;
            events.trigger('input-focus');
          },
          blur: function blur() {
            $timeout(function () {
              var activeElement = $document.prop('activeElement');
              var lostFocusToBrowserWindow = activeElement === input[0];
              var lostFocusToChildElement = element[0].contains(activeElement);

              if (lostFocusToBrowserWindow || !lostFocusToChildElement) {
                scope.hasFocus = false;
                events.trigger('input-blur');
              }
            });
          },
          paste: function paste($event) {
            $event.getTextData = function () {
              var clipboardData = $event.clipboardData || $event.originalEvent && $event.originalEvent.clipboardData;
              return clipboardData ? clipboardData.getData('text/plain') : $window.clipboardData.getData('Text');
            };
            events.trigger('input-paste', $event);
          }
        },
        host: {
          click: function click() {
            if (scope.disabled) {
              return;
            }
            focusInput();
          }
        },
        tag: {
          click: function click(tag) {
            events.trigger('tag-clicked', { $tag: tag });
          }
        }
      };

      events.on('tag-added', scope.onTagAdded).on('invalid-tag', scope.onInvalidTag).on('tag-removed', scope.onTagRemoved).on('tag-clicked', scope.onTagClicked).on('tag-added', function () {
        scope.newTag.text('');
      }).on('tag-added tag-removed', function () {
        scope.tags = tagList.getItems();
        // Ideally we should be able call $setViewValue here and let it in turn call $setDirty and $validate
        // automatically, but since the model is an array, $setViewValue does nothing and it's up to us to do it.
        // Unfortunately this won't trigger any registered $parser and there's no safe way to do it.
        ngModelCtrl.$setDirty();
        focusInput();
      }).on('invalid-tag', function () {
        scope.newTag.invalid = true;
      }).on('option-change', function (e) {
        if (validationOptions.indexOf(e.name) !== -1) {
          setElementValidity();
        }
      }).on('input-change', function () {
        tagList.clearSelection();
        scope.newTag.invalid = null;
      }).on('input-focus', function () {
        element.triggerHandler('focus');
        ngModelCtrl.$setValidity('leftoverText', true);
      }).on('input-blur', function () {
        if (options.addOnBlur && !options.addFromAutocompleteOnly) {
          tagList.addText(scope.newTag.text());
        }
        element.triggerHandler('blur');
        setElementValidity();
      }).on('input-keydown', function (event) {
        var _addKeys;

        var key = event.keyCode;

        if (tiUtil.isModifierOn(event) || hotkeys.indexOf(key) === -1) {
          return;
        }

        var addKeys = (_addKeys = {}, defineProperty(_addKeys, tiConstants.KEYS.enter, options.addOnEnter), defineProperty(_addKeys, tiConstants.KEYS.comma, options.addOnComma), defineProperty(_addKeys, tiConstants.KEYS.space, options.addOnSpace), _addKeys);

        var shouldAdd = !options.addFromAutocompleteOnly && addKeys[key];
        var shouldRemove = (key === tiConstants.KEYS.backspace || key === tiConstants.KEYS.delete) && tagList.selected;
        var shouldEditLastTag = key === tiConstants.KEYS.backspace && scope.newTag.text().length === 0 && options.enableEditingLastTag;
        var shouldSelect = (key === tiConstants.KEYS.backspace || key === tiConstants.KEYS.left || key === tiConstants.KEYS.right) && scope.newTag.text().length === 0 && !options.enableEditingLastTag;

        if (shouldAdd) {
          tagList.addText(scope.newTag.text());
        } else if (shouldEditLastTag) {
          tagList.selectPrior();
          tagList.removeSelected().then(function (tag) {
            if (tag) {
              scope.newTag.text(tag[options.displayProperty]);
            }
          });
        } else if (shouldRemove) {
          tagList.removeSelected();
        } else if (shouldSelect) {
          if (key === tiConstants.KEYS.left || key === tiConstants.KEYS.backspace) {
            tagList.selectPrior();
          } else if (key === tiConstants.KEYS.right) {
            tagList.selectNext();
          }
        }

        if (shouldAdd || shouldSelect || shouldRemove || shouldEditLastTag) {
          event.preventDefault();
        }
      }).on('input-paste', function (event) {
        if (options.addOnPaste) {
          var data = event.getTextData();
          var tags = data.split(options.pasteSplitPattern);

          if (tags.length > 1) {
            tags.forEach(function (tag) {
              tagList.addText(tag);
            });
            event.preventDefault();
          }
        }
      });
    }
  };
}

TagItemDirective.$inject = ['tiUtil'];
/**
 * @ngdoc directive
 * @name tiTagItem
 * @module ngTagsInput
 *
 * @description
 * Represents a tag item. Used internally by the tagsInput directive.
 */
function TagItemDirective(tiUtil) {
  'ngInject';

  return {
    restrict: 'E',
    require: '^tagsInput',
    template: '<ng-include src="$$template"></ng-include>',
    scope: {
      $scope: '=scope',
      data: '='
    },
    link: function link(scope, element, attrs, tagsInputCtrl) {
      var tagsInput = tagsInputCtrl.registerTagItem();
      var options = tagsInput.getOptions();

      scope.$$template = options.template;
      scope.$$removeTagSymbol = options.removeTagSymbol;

      scope.$getDisplayText = function () {
        return tiUtil.safeToString(scope.data[options.displayProperty]);
      };
      scope.$removeTag = function () {
        tagsInput.removeTag(scope.$index);
      };

      scope.$watch('$parent.$index', function (value) {
        scope.$index = value;
      });
    }
  };
}

AutocompleteDirective.$inject = ['$document', '$timeout', '$sce', '$q', 'tagsInputConfig', 'tiUtil', 'tiConstants'];
/**
 * @ngdoc directive
 * @name autoComplete
 * @module ngTagsInput
 *
 * @description
 * Provides autocomplete support for the tagsInput directive.
 *
 * @param {expression} source Expression to evaluate upon changing the input content. The input value is available as
 *    $query. The result of the expression must be a promise that eventually resolves to an array of strings.
 * @param {string=} [template=NA] URL or id of a custom template for rendering each element of the autocomplete list.
 * @param {string=} [displayProperty=tagsInput.displayText] Property to be rendered as the autocomplete label.
 * @param {number=} [debounceDelay=100] Amount of time, in milliseconds, to wait before evaluating the expression in
 *    the source option after the last keystroke.
 * @param {number=} [minLength=3] Minimum number of characters that must be entered before evaluating the expression
 *    in the source option.
 * @param {boolean=} [highlightMatchedText=true] Flag indicating that the matched text will be highlighted in the
 *    suggestions list.
 * @param {number=} [maxResultsToShow=10] Maximum number of results to be displayed at a time.
 * @param {boolean=} [loadOnDownArrow=false] Flag indicating that the source option will be evaluated when the down arrow
 *    key is pressed and the suggestion list is closed. The current input value is available as $query.
 * @param {boolean=} [loadOnEmpty=false] Flag indicating that the source option will be evaluated when the input content
 *    becomes empty. The $query variable will be passed to the expression as an empty string.
 * @param {boolean=} [loadOnFocus=false] Flag indicating that the source option will be evaluated when the input element
 *    gains focus. The current input value is available as $query.
 * @param {boolean=} [selectFirstMatch=true] Flag indicating that the first match will be automatically selected once
 *    the suggestion list is shown.
 * @param {expression=} [matchClass=NA] Expression to evaluate for each match in order to get the CSS classes to be used.
 *    The expression is provided with the current match as $match, its index as $index and its state as $selected. The result
 *    of the evaluation must be one of the values supported by the ngClass directive (either a string, an array or an object).
 *    See https://docs.angularjs.org/api/ng/directive/ngClass for more information.
 */
function AutocompleteDirective($document, $timeout, $sce, $q, tagsInputConfig, tiUtil, tiConstants) {
  'ngInject';

  function SuggestionList(loadFn, options, events) {
    var self = {};
    var lastPromise = null;

    var getTagId = function getTagId() {
      return options.tagsInput.keyProperty || options.tagsInput.displayProperty;
    };

    var getDifference = function getDifference(array1, array2) {
      return array1.filter(function (item) {
        return !tiUtil.findInObjectArray(array2, item, getTagId(), function (a, b) {
          if (options.tagsInput.replaceSpacesWithDashes) {
            a = tiUtil.replaceSpacesWithDashes(a);
            b = tiUtil.replaceSpacesWithDashes(b);
          }
          return tiUtil.defaultComparer(a, b);
        });
      });
    };

    self.reset = function () {
      lastPromise = null;

      self.items = [];
      self.visible = false;
      self.index = -1;
      self.selected = null;
      self.query = null;
    };

    self.show = function () {
      if (options.selectFirstMatch) {
        self.select(0);
      } else {
        self.selected = null;
      }
      self.visible = true;
    };

    self.load = tiUtil.debounce(function (query, tags) {
      self.query = query;

      var promise = $q.when(loadFn({ $query: query }));
      lastPromise = promise;

      promise.then(function (items) {
        if (promise !== lastPromise) {
          return;
        }

        items = tiUtil.makeObjectArray(items.data || items, getTagId());
        items = getDifference(items, tags);
        self.items = items.slice(0, options.maxResultsToShow);

        if (self.items.length > 0) {
          self.show();
        } else {
          self.reset();
        }
      });
    }, options.debounceDelay);

    self.selectNext = function () {
      self.select(++self.index);
    };

    self.selectPrior = function () {
      self.select(--self.index);
    };

    self.select = function (index) {
      if (index < 0) {
        index = self.items.length - 1;
      } else if (index >= self.items.length) {
        index = 0;
      }
      self.index = index;
      self.selected = self.items[index];
      events.trigger('suggestion-selected', index);
    };

    self.reset();

    return self;
  }

  function scrollToElement(root, index) {
    var element = root.find('li').eq(index);
    var parent = element.parent();
    var elementTop = element.prop('offsetTop');
    var elementHeight = element.prop('offsetHeight');
    var parentHeight = parent.prop('clientHeight');
    var parentScrollTop = parent.prop('scrollTop');

    if (elementTop < parentScrollTop) {
      parent.prop('scrollTop', elementTop);
    } else if (elementTop + elementHeight > parentHeight + parentScrollTop) {
      parent.prop('scrollTop', elementTop + elementHeight - parentHeight);
    }
  }

  return {
    restrict: 'E',
    require: '^tagsInput',
    scope: {
      source: '&',
      matchClass: '&'
    },
    templateUrl: 'ngTagsInput/auto-complete.html',
    controller: ['$scope', '$element', '$attrs', function controller($scope, $element, $attrs) {
      'ngInject';

      $scope.events = tiUtil.simplePubSub();

      $scope.options = tagsInputConfig.load('autoComplete', $element, $attrs, $scope.events, {
        template: [String, 'ngTagsInput/auto-complete-match.html'],
        debounceDelay: [Number, 100],
        minLength: [Number, 3],
        highlightMatchedText: [Boolean, true],
        maxResultsToShow: [Number, 10],
        loadOnDownArrow: [Boolean, false],
        loadOnEmpty: [Boolean, false],
        loadOnFocus: [Boolean, false],
        selectFirstMatch: [Boolean, true],
        displayProperty: [String, '']
      });

      $scope.suggestionList = new SuggestionList($scope.source, $scope.options, $scope.events);

      this.registerAutocompleteMatch = function () {
        return {
          getOptions: function getOptions() {
            return $scope.options;
          },
          getQuery: function getQuery() {
            return $scope.suggestionList.query;
          }
        };
      };
    }],
    link: function link(scope, element, attrs, tagsInputCtrl) {
      var hotkeys = [tiConstants.KEYS.enter, tiConstants.KEYS.tab, tiConstants.KEYS.escape, tiConstants.KEYS.up, tiConstants.KEYS.down];
      var suggestionList = scope.suggestionList;
      var tagsInput = tagsInputCtrl.registerAutocomplete();
      var options = scope.options;
      var events = scope.events;

      options.tagsInput = tagsInput.getOptions();

      var shouldLoadSuggestions = function shouldLoadSuggestions(value) {
        return value && value.length >= options.minLength || !value && options.loadOnEmpty;
      };

      scope.templateScope = tagsInput.getTemplateScope();

      scope.addSuggestionByIndex = function (index) {
        suggestionList.select(index);
        scope.addSuggestion();
      };

      scope.addSuggestion = function () {
        var added = false;

        if (suggestionList.selected) {
          tagsInput.addTag(angular.copy(suggestionList.selected));
          suggestionList.reset();
          added = true;
        }
        return added;
      };

      scope.track = function (item) {
        return item[options.tagsInput.keyProperty || options.tagsInput.displayProperty];
      };

      scope.getSuggestionClass = function (item, index) {
        var selected = item === suggestionList.selected;
        return [scope.matchClass({ $match: item, $index: index, $selected: selected }), { selected: selected }];
      };

      tagsInput.on('tag-added tag-removed invalid-tag input-blur', function () {
        suggestionList.reset();
      }).on('input-change', function (value) {
        if (shouldLoadSuggestions(value)) {
          suggestionList.load(value, tagsInput.getTags());
        } else {
          suggestionList.reset();
        }
      }).on('input-focus', function () {
        var value = tagsInput.getCurrentTagText();
        if (options.loadOnFocus && shouldLoadSuggestions(value)) {
          suggestionList.load(value, tagsInput.getTags());
        }
      }).on('input-keydown', function (event) {
        var key = event.keyCode;
        var handled = false;

        if (tiUtil.isModifierOn(event) || hotkeys.indexOf(key) === -1) {
          return;
        }

        if (suggestionList.visible) {

          if (key === tiConstants.KEYS.down) {
            suggestionList.selectNext();
            handled = true;
          } else if (key === tiConstants.KEYS.up) {
            suggestionList.selectPrior();
            handled = true;
          } else if (key === tiConstants.KEYS.escape) {
            suggestionList.reset();
            handled = true;
          } else if (key === tiConstants.KEYS.enter || key === tiConstants.KEYS.tab) {
            handled = scope.addSuggestion();
          }
        } else {
          if (key === tiConstants.KEYS.down && scope.options.loadOnDownArrow) {
            suggestionList.load(tagsInput.getCurrentTagText(), tagsInput.getTags());
            handled = true;
          }
        }

        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return false;
        }
      });

      events.on('suggestion-selected', function (index) {
        scrollToElement(element, index);
      });
    }
  };
}

AutocompleteMatchDirective.$inject = ['$sce', 'tiUtil'];
/**
 * @ngdoc directive
 * @name tiAutocompleteMatch
 * @module ngTagsInput
 *
 * @description
 * Represents an autocomplete match. Used internally by the autoComplete directive.
 */
function AutocompleteMatchDirective($sce, tiUtil) {
  'ngInject';

  return {
    restrict: 'E',
    require: '^autoComplete',
    template: '<ng-include src="$$template"></ng-include>',
    scope: {
      $scope: '=scope',
      data: '='
    },
    link: function link(scope, element, attrs, autoCompleteCtrl) {
      var autoComplete = autoCompleteCtrl.registerAutocompleteMatch();
      var options = autoComplete.getOptions();

      scope.$$template = options.template;
      scope.$index = scope.$parent.$index;

      scope.$highlight = function (text) {
        if (options.highlightMatchedText) {
          text = tiUtil.safeHighlight(text, autoComplete.getQuery());
        }
        return $sce.trustAsHtml(text);
      };

      scope.$getDisplayText = function () {
        return tiUtil.safeToString(scope.data[options.displayProperty || options.tagsInput.displayProperty]);
      };
    }
  };
}

AutosizeDirective.$inject = ['tagsInputConfig'];
/**
 * @ngdoc directive
 * @name tiAutosize
 * @module ngTagsInput
 *
 * @description
 * Automatically sets the input's width so its content is always visible. Used internally by tagsInput directive.
 */
function AutosizeDirective(tagsInputConfig) {
  'ngInject';

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ctrl) {
      var threshold = tagsInputConfig.getTextAutosizeThreshold();
      var span = angular.element('<span class="input"></span>');

      span.css('display', 'none').css('visibility', 'hidden').css('width', 'auto').css('white-space', 'pre');

      element.parent().append(span);

      var resize = function resize(originalValue) {
        var value = originalValue;
        var width = void 0;

        if (angular.isString(value) && value.length === 0) {
          value = attrs.placeholder;
        }

        if (value) {
          span.text(value);
          span.css('display', '');
          width = span.prop('offsetWidth');
          span.css('display', 'none');
        }

        element.css('width', width ? width + threshold + 'px' : '');

        return originalValue;
      };

      ctrl.$parsers.unshift(resize);
      ctrl.$formatters.unshift(resize);

      attrs.$observe('placeholder', function (value) {
        if (!ctrl.$modelValue) {
          resize(value);
        }
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name tiBindAttrs
 * @module ngTagsInput
 *
 * @description
 * Binds attributes to expressions. Used internally by tagsInput directive.
 */
function BindAttributesDirective() {
  return function (scope, element, attrs) {
    scope.$watch(attrs.tiBindAttrs, function (value) {
      angular.forEach(value, function (value, key) {
        attrs.$set(key, value);
      });
    }, true);
  };
}

/**
 * @ngdoc directive
 * @name tiTranscludeAppend
 * @module ngTagsInput
 *
 * @description
 * Re-creates the old behavior of ng-transclude. Used internally by tagsInput directive.
 */
function TranscludeAppendDirective() {
  return function (scope, element, attrs, ctrl, transcludeFn) {
    transcludeFn(function (clone) {
      element.append(clone);
    });
  };
}

/**
 * @ngdoc service
 * @name tagsInputConfig
 * @module ngTagsInput
 *
 * @description
 * Sets global configuration settings for both tagsInput and autoComplete directives. It's also used internally to parse and
 *  initialize options from HTML attributes.
 */
function TagsInputConfigurationProvider() {
  'ngInject';

  var _this = this;

  var globalDefaults = {};
  var interpolationStatus = {};
  var autosizeThreshold = 3;

  /**
   * @ngdoc method
   * @name tagsInputConfig#setDefaults
   * @description Sets the default configuration option for a directive.
   *
   * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
   * @param {object} defaults Object containing options and their values.
   *
   * @returns {object} The service itself for chaining purposes.
   */
  this.setDefaults = function (directive, defaults$$1) {
    globalDefaults[directive] = defaults$$1;
    return _this;
  };

  /**
   * @ngdoc method
   * @name tagsInputConfig#setActiveInterpolation
   * @description Sets active interpolation for a set of options.
   *
   * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
   * @param {object} options Object containing which options should have interpolation turned on at all times.
   *
   * @returns {object} The service itself for chaining purposes.
   */
  this.setActiveInterpolation = function (directive, options) {
    interpolationStatus[directive] = options;
    return _this;
  };

  /**
   * @ngdoc method
   * @name tagsInputConfig#setTextAutosizeThreshold
   * @description Sets the threshold used by the tagsInput directive to re-size the inner input field element based on its contents.
   *
   * @param {number} threshold Threshold value, in pixels.
   *
   * @returns {object} The service itself for chaining purposes.
   */
  this.setTextAutosizeThreshold = function (threshold) {
    autosizeThreshold = threshold;
    return _this;
  };

  this.$get = ['$interpolate', function ($interpolate) {
    'ngInject';

    var _converters;

    var converters = (_converters = {}, defineProperty(_converters, String, function (value) {
      return value.toString();
    }), defineProperty(_converters, Number, function (value) {
      return parseInt(value, 10);
    }), defineProperty(_converters, Boolean, function (value) {
      return value.toLowerCase() === 'true';
    }), defineProperty(_converters, RegExp, function (value) {
      return new RegExp(value);
    }), _converters);

    return {
      load: function load(directive, element, attrs, events, optionDefinitions) {
        var defaultValidator = function defaultValidator() {
          return true;
        };
        var options = {};

        angular.forEach(optionDefinitions, function (value, key) {
          var type = value[0];
          var localDefault = value[1];
          var validator = value[2] || defaultValidator;
          var converter = converters[type];

          var getDefault = function getDefault() {
            var globalValue = globalDefaults[directive] && globalDefaults[directive][key];
            return angular.isDefined(globalValue) ? globalValue : localDefault;
          };

          var updateValue = function updateValue(value) {
            options[key] = value && validator(value) ? converter(value) : getDefault();
          };

          if (interpolationStatus[directive] && interpolationStatus[directive][key]) {
            attrs.$observe(key, function (value) {
              updateValue(value);
              events.trigger('option-change', { name: key, newValue: value });
            });
          } else {
            updateValue(attrs[key] && $interpolate(attrs[key])(element.scope()));
          }
        });

        return options;
      },
      getTextAutosizeThreshold: function getTextAutosizeThreshold() {
        return autosizeThreshold;
      }
    };
  }];
}

UtilService.$inject = ['$timeout', '$q'];
/***
 * @ngdoc service
 * @name tiUtil
 * @module ngTagsInput
 *
 * @description
 * Helper methods used internally by the directive. Should not be called directly from user code.
 */
function UtilService($timeout, $q) {
  'ngInject';

  var self = {};

  self.debounce = function (fn, delay) {
    var timeoutId = void 0;
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      $timeout.cancel(timeoutId);
      timeoutId = $timeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  };

  self.makeObjectArray = function (array, key) {
    if (!angular.isArray(array) || array.length === 0 || angular.isObject(array[0])) {
      return array;
    }

    return array.map(function (item) {
      return defineProperty({}, key, item);
    });
  };

  self.findInObjectArray = function (array, obj, key, comparer) {
    var item = null;
    comparer = comparer || self.defaultComparer;

    array.some(function (element) {
      if (comparer(element[key], obj[key])) {
        item = element;
        return true;
      }
    });

    return item;
  };

  self.defaultComparer = function (a, b) {
    // I'm aware of the internationalization issues regarding toLowerCase()
    // but I couldn't come up with a better solution right now
    return self.safeToString(a).toLowerCase() === self.safeToString(b).toLowerCase();
  };

  self.safeHighlight = function (str, value) {
    str = self.encodeHTML(str);
    value = self.encodeHTML(value);

    if (!value) {
      return str;
    }

    var escapeRegexChars = function escapeRegexChars(str) {
      return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    };
    var expression = new RegExp('&[^;]+;|' + escapeRegexChars(value), 'gi');

    return str.replace(expression, function (match) {
      return match.toLowerCase() === value.toLowerCase() ? '<em>' + match + '</em>' : match;
    });
  };

  self.safeToString = function (value) {
    return angular.isUndefined(value) || value === null ? '' : value.toString().trim();
  };

  self.encodeHTML = function (value) {
    return self.safeToString(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  self.handleUndefinedResult = function (fn, valueIfUndefined) {
    return function () {
      var result = fn.apply(null, arguments);
      return angular.isUndefined(result) ? valueIfUndefined : result;
    };
  };

  self.replaceSpacesWithDashes = function (str) {
    return self.safeToString(str).replace(/\s/g, '-');
  };

  self.isModifierOn = function (event) {
    return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
  };

  self.promisifyValue = function (value) {
    value = angular.isUndefined(value) ? true : value;
    return $q[value ? 'when' : 'reject']();
  };

  self.simplePubSub = function () {
    var events = {};
    return {
      on: function on(names, handler, first) {
        names.split(' ').forEach(function (name) {
          if (!events[name]) {
            events[name] = [];
          }
          var method = first ? [].unshift : [].push;
          method.call(events[name], handler);
        });
        return this;
      },
      trigger: function trigger(name, args) {
        var handlers = events[name] || [];
        handlers.every(function (handler) {
          return self.handleUndefinedResult(handler, true)(args);
        });
        return this;
      }
    };
  };

  return self;
}

TemplateCacheRegister.$inject = ['$templateCache'];
/*@ngInject*/
function TemplateCacheRegister($templateCache) {
  $templateCache.put('ngTagsInput/auto-complete-match.html', "<span ng-bind-html=\"$highlight($getDisplayText())\"></span>");
  $templateCache.put('ngTagsInput/auto-complete.html', "<div class=\"autocomplete\" ng-if=\"suggestionList.visible\"><ul class=\"suggestion-list\"><li class=\"suggestion-item\" ng-repeat=\"item in suggestionList.items track by track(item)\" ng-class=\"getSuggestionClass(item, $index)\" ng-click=\"addSuggestionByIndex($index)\" ng-mouseenter=\"suggestionList.select($index)\"><ti-autocomplete-match scope=\"templateScope\" data=\"::item\"></ti-autocomplete-match></li></ul></div>");
  $templateCache.put('ngTagsInput/tag-item.html', "<span ng-bind=\"$getDisplayText()\"></span> <a class=\"remove-button\" ng-click=\"$removeTag()\" ng-bind=\"::$$removeTagSymbol\"></a>");
  $templateCache.put('ngTagsInput/tags-input.html', "<div class=\"host\" tabindex=\"-1\" ng-click=\"eventHandlers.host.click()\" ti-transclude-append><div class=\"tags\" ng-class=\"{focused: hasFocus}\"><ul class=\"tag-list\"><li class=\"tag-item\" ng-repeat=\"tag in tagList.items track by track(tag)\" ng-class=\"getTagClass(tag, $index)\" ng-click=\"eventHandlers.tag.click(tag)\"><ti-tag-item scope=\"templateScope\" data=\"::tag\"></ti-tag-item></li></ul><input class=\"input\" autocomplete=\"off\" ng-model=\"newTag.text\" ng-model-options=\"{getterSetter: true}\" ng-keydown=\"eventHandlers.input.keydown($event)\" ng-focus=\"eventHandlers.input.focus($event)\" ng-blur=\"eventHandlers.input.blur($event)\" ng-paste=\"eventHandlers.input.paste($event)\" ng-trim=\"false\" ng-class=\"{'invalid-tag': newTag.invalid}\" ng-disabled=\"disabled\" ti-bind-attrs=\"{type: options.type, placeholder: options.placeholder, tabindex: options.tabindex, spellcheck: options.spellcheck}\" ti-autosize></div></div>");
}

angular$1.module('ngTagsInput', []).directive('tagsInput', TagsInputDirective).directive('tiTagItem', TagItemDirective).directive('autoComplete', AutocompleteDirective).directive('tiAutocompleteMatch', AutocompleteMatchDirective).directive('tiAutosize', AutosizeDirective).directive('tiBindAttrs', BindAttributesDirective).directive('tiTranscludeAppend', TranscludeAppendDirective).factory('tiUtil', UtilService).constant('tiConstants', Constants).provider('tagsInputConfig', TagsInputConfigurationProvider).run(TemplateCacheRegister);

}(angular));

//# sourceMappingURL=ng-tags-input.js.map