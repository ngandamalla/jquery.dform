/*
 * jQuery dform plugin
 * Copyright (C) 2012 David Luecke <daff@neyeon.com>, [http://daffl.github.com/jquery.dform]
 * 
 * Licensed under the MIT license
 */
(function($)
{
	/**
	 * section: jQuery UI
	 *
	 * Subscribers using the <jQuery UI Framework 
	 * at http://jqueryui.com>. Types and subscribers will only be
	 * added, if the corresponding jQuery UI plugin functions are available.
	 */

	/**
	 * function: _getOptions
	 * 
	 * Returns a object containing the options for a jQuery UI widget.
	 * The options will be taken from jQuery.ui.[typename].prototype.options
	 * 
	 * Parameters:
	 * 	type - The jQuery UI type
	 * 	options - The options to evaluate
	 */
	var getOptions = function(type, options)
	{
		var keys = $.keyset($.ui[type]["prototype"]["options"]);
		return $.withKeys(options, keys);
	}
		
	/**
	 * type: progressbar
	 * 
	 * Returns a jQuery UI progressbar.
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI progressbar documentation at
	 * 	http://jqueryui.com/demos/progressbar/>
	 * 
	 * Example:
	 * (start code)
	 * {
	 * 		"type" : "progressbar",
	 * 		"value" : 30,
	 * 		"caption" : "Progressbar"
	 * }
	 * (end)
	 */
	$.dform.addTypeIf($.isFunction($.fn.progressbar), "progressbar", 
		function(options)
		{
			return $("<div>").dform('attr', options).progressbar(_getOptions("progressbar", options));
		});
	
	/**
	 * type: slider
	 * 
	 * Returns a slider element.
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI slider documentation at
	 * 	http://jqueryui.com/demos/slider/>
	 * 
	 * Example:
	 * (start code)
	 * {
	 * 		"type" : "slider",
	 * 		"values" : [ 30, 80 ],
	 * 		"range" : true,
	 * 		"caption" : "Slider"
	 * }
	 * (end)
	 */
	$.dform.addTypeIf($.isFunction($.fn.slider), "slider", 
		function(options)
		{
			return $("<div>").dform('attr', options).slider(_getOptions("slider", options));
		});

	/**
	 * type: accordion
	 * 
	 * Creates an element container for a jQuery UI accordion.
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI accordion documentation at 
	 * 	http://jqueryui.com/demos/accordion/> 
	 * 
	 * Example:
	 * (start code)
	 * {
	 * 		"type" : "accordion",
	 * 		"caption" : "Accordion",
	 * 		"entries" :
	 * 		[
	 * 			{
	 * 				"caption" : "Entry 1",
	 * 				"elements" :
	 * 				[
	 * 					{
	 * 						"type" : "span",
	 * 						"html" : "Some HTML in accordion entry 1"
	 * 					}
	 * 				]
	 * 			},
	 * 			{
	 * 				"caption" : "Entry 2",
	 * 				"elements" :
	 * 				[
	 * 					{
	 * 						"type" : "span",
	 * 						"html" : "Some HTML in accordion entry 2"
	 * 					}
	 * 				]
	 * 			}
	 * 		]
	 * }
	 * (end)
	 */
	$.dform.addTypeIf($.isFunction($.fn.accordion), "accordion",
		function(options)
		{
			return $("<div>").dform('attr', options);
		});

	/**
	 * type: tabs
	 * 
	 * Returns a container for jQuery UI tabs element.
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI tabs documentation at
	 * 	http://jqueryui.com/demos/tabs/>
	 * 
	 * Example:
	 * (start code)
	 * {
	 * 		"type" : "tabs",
	 * 		"entries" :
	 * 		{
	 * 			"tab1":
	 * 			{
	 * 				"caption" : "Step 1",
	 * 				"elements" :
	 * 				[
	 * 					{
	 * 						"name" : "textfield",
	 * 						"caption" : "Just a textfield",
	 * 						"type" : "text"
	 * 					},
	 * 					{
	 * 						"type" : "span",
	 * 						"html" : "Some HTML in tab 1"
	 * 					}
	 * 				]
	 * 			},
	 * 			"tab2" :
	 * 			{
	 * 				"caption" : "Step 2",
	 * 				"elements" :
	 * 				[
	 * 					{
	 * 						"type" : "span",
	 * 						"html" : "Some HTML in tab 2"
	 * 					}
	 * 				]
	 * 			}
	 * 		}
	 * }
	 * (end) 
	 */
	$.dform.addTypeIf($.isFunction($.fn.tabs),
		"tabs", function(options)
		{
			return $("<div>").dform('attr', options);
		});
	
	/**
	 * subscriber: entries
	 * 
	 * Creates entries for <tabs> or <accordion> elements.
	 * Use the <elements> subscriber to create subelements in each entry.
	 * 
	 * For types:
	 * 	<tabs>, <accordion>
	 * 
	 * Parameters:
	 * 	options - All options for the container div. The <caption> will be
	 * 	turned into the accordion or tab title.
	 * 	type - The type of the *this* element
	 */
	$.dform.subscribeIf($.isFunction($.fn.accordion), "entries",
		function(options, type) {
			if(type == "accordion")
			{
				var scoper = this;
				$.each(options, function(index, options) {
					var el = $.extend({ "type" : "div" }, options);
					$(scoper).formElement(el);
					if(options.caption) {
						var label = $(scoper).children("div:last").prev();
						label.replaceWith('<h3><a href="#">' + label.html() + '</a></h3>');
					}
				});
			}
		});
	$.dform.subscribeIf($.isFunction($.fn.tabs), "entries",
		function(options, type) {
			if(type == "tabs")
			{
				var scoper = this;
				this.append("<ul>");
				var ul = $(scoper).children("ul:first");
				$.each(options, function(index, options) {
					var id = options.id ? options.id : index;
					$.extend(options, { "type" : "container", "id" : id });
					$(scoper).dform('append', options);
					var label = $(scoper).children("div:last").prev();
					$(label).wrapInner($("<a>").attr("href", "#" + id));
					$(ul).append($("<li>").wrapInner(label));
				});
			}
		});
		
	/**
	 * subscriber: dialog
	 * 
	 * Creates a dialog on container elements.
	 * 
	 * For types:
	 * 	<form>, <fieldset>
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI dialog documentation at
	 *	http://jqueryui.com/demos/dialog/>
	 * 	type - The type of the *this* element
	 */
	$.dform.subscribeIf($.isFunction($.fn.dialog), "dialog",
		function(options, type)
		{
			if (type == "form" || type == "fieldset")
				this.dialog(options);
		});

	/**
	 * subscriber: resizable
	 * 
	 * Makes the current element resizeable.
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI resizable documentation at
	 *	http://jqueryui.com/demos/resizable/>
	 * 	type - The type of the *this* element
	 * 
	 * Example:
	 * Makes a <tabs> element resizable
	 * 
	 * (start code)
	 * {
	 * 		"type" : "tabs",
	 * 		"resizable" :
	 * 		{
	 * 			"minHeight" : 200,
	 * 			"minWidth" : 300
	 * 		},
	 * 		"entries" :
	 * 		{
	 * 			"resizable-tab1":
	 * 			{
	 * 				"caption" : "Step 1",
	 * 				"elements" :
	 * 				[
	 * 					{
	 * 						"type" : "span",
	 * 						"html" : "Some HTML in tab 1"
	 * 					}
	 * 				]
	 * 			},
	 * 			"resizable-tab2" :
	 * 			{
	 * 				"caption" : "Step 2",
	 * 				"elements" :
	 * 				[
	 * 					{
	 * 						"type" : "span",
	 * 						"html" : "Some HTML in tab 2"
	 * 					}
	 * 				]
	 * 			}
	 * 		}
	 * }
	 * (end) 
	 */
	$.dform.subscribeIf($.isFunction($.fn.resizable), "resizable",
		function(options, type)
		{
			this.resizable(options);
		});

	/**
	 * subscriber: datepicker
	 * 
	 * Turns a text element into a datepicker.
	 * 
	 * For types:
	 * 	<text>
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI datepicker documentation at
	 *	http://jqueryui.com/demos/datepicker/>
	 * 	type - The type of the *this* element
	 * 
	 * Example:
	 * Initializes the datepicker, using a button to show it
	 * 
	 * (start code)
	 * {
	 * 		"name" : "date",
	 * 		"type" : "text",
	 * 		"datepicker" : {  "showOn" : "button" }
	 * }
	 * (end)
	 */
	$.dform.subscribeIf($.isFunction($.fn.datepicker), "datepicker", 
		function(options, type)
		{
			if (type == "text")
				this.datepicker(options);
		});

	/**
	 * subscriber: autocomplete
	 * 
	 * Adds the autocomplete feature to a text element.
	 * 
	 * For types:
	 * 	<text>
	 * 
	 * Parameters:
	 * 	options - As specified in the <jQuery UI autotomplete documentation at
	 *	http://jqueryui.com/demos/autotomplete/>
	 * 	type - The type of the *this* element
	 * 
	 * Example:
	 * Initializes the datepicker, using a button to show it
	 * 
	 * (start code)
	 * {
	 * 		"name" : "textfield",
	 * 		"caption" : "Autocomplete",
	 * 		"type" : "text",
	 * 		"placeholder" : "Type 'A', 'B' or 'W'",
	 * 		"autocomplete" :
	 * 		{
	 * 			"source" : [ "Apple", "Android", "Windows Phone", "Blackberry" ]
	 * 		}
	 * }
	 * (end)
	 */
	$.dform.subscribeIf($.isFunction($.fn.autocomplete), "autocomplete", 
		function(options, type)
		{
			if (type == "text")
				this.autocomplete(options);
		});

	/**
	 * subscriber: [post]
	 * 
	 * Post processing subscriber that adds jQuery UI styling classes to
	 * <text>, <textarea>, <password> and <fieldset> elements as well
	 * as calling .button() on <submit> or <button> elements.
	 * 
	 * Additionally, <accordion> and <tabs> elements will be initialized
	 * with their options given.
	 * 
	 * Parameters:
	 * options - All options that have been used for 
	 * creating the current element.
	 * type - The type of the *this* element
	 */
	$.dform.subscribe("[post]",
		function(options, type)
		{
			if (this.parents("form").hasClass("ui-widget"))
			{
				if ((type == "button" || type == "submit") && $.isFunction($.fn.button))
					this.button();
				if ($.inArray(type, [ "text", "textarea", "password",
						"fieldset" ]) != -1)
					this.addClass("ui-widget-content ui-corner-all");
			}
			if(type == "accordion" || type == "tabs") {
				this[type](_getOptions(type, options));
			}
		});
	
	/**
	 * section: Validation Plugin
	 *
	 * Support for the <jQuery validation 
	 * plugin at http://bassistance.de/jquery-plugins/jquery-plugin-validation/>
	 */
	$.dform.subscribeIf($.isFunction($.fn.validate), // Subscribe if validation plugin is available
	{
		/**
		 * subscriber: [pre]
		 * 
		 * Add a preprocessing subscriber that calls .validate() on the form,
		 * so that we can add rules to the input elements. Additionally
		 * the jQuery UI highlight classes will be added to the validation
		 * plugin default settings if the form has the ui-widget class.
		 * 
		 * Parameters:
		 * options - All options that have been used for 
		 * creating the current element.
		 * type - The type of the *this* element
		 */
		"[pre]" : function(options, type)
		{
			if(type == "form")
			{
				var defaults = {};
				if(this.hasClass("ui-widget"))
				{
					defaults = {
						highlight: function(input)
						{
							$(input).addClass("ui-state-highlight");
						},
						unhighlight: function(input)
						{
							$(input).removeClass("ui-state-highlight");
						}
					};
				}
				if (typeof (options.validate) == 'object')
					$.extend(defaults, options.validate);
				this.validate(defaults);
			}
		},
		/**
		 * subscriber: validate
		 * 
		 * Adds support for the jQuery validation rulesets.
		 * For types: <text>, <password>, <textarea>, <radio>, <checkbox> sets up rules through rules("add", rules) for validation plugin
		 * For type <form> sets up as options object for validate method of validation plugin
		 * For rules of types <checkboxes> and <radiobuttons> you should use this subscriber for type <form> (to see example below)
		 * 
		 * Example:
		 * validations for radiobuttons group and for text field:
		 * 
		 * (start code)
		 * {
		 *	"type" : "form",
		 * 	"validate" :
		 *	{
		 *		"rules" :
		 *		{
		 *			"radio_group": "required"
		 *		}
		 *	},
		 *	"elements" :
		 *	[
		 *		{
		 *			"type" : "radiobuttons",
		 *			"caption" : "You should choose from here"
		 *			"name" : "radio_group",
		 *			"options" :
		 *			{
		 *				"Y" : "Yes",
		 *				"N" : "No"
		 *			}
		 *
		 *		},
		 *		{
		 *			"type" : "text",
		 *			"name" : "url",
		 *			"validate" :
		 *			{
		 *				"required" : true,
		 *				"url" : true
		 *			}
		 *		}
		 *	
		 *	]
		 * }
		 * (end)
		 */
		"validate" : function(options, type)
		{
			if (type != "form")
				this.rules("add", options);
		}
	});

	/**
	 * section: jQuery Form
	 *
	 * Support for loading and submitting forms dynamically via AJAX using
	 * the <jQuery form at http://jquery.malsup.com/form/> plugin.
	 */
	/**
	 * subscriber: ajax
	 * 
	 * If the current element is a form, it will be turned into a dynamic form
	 * that can be submitted asynchronously.
	 * 
	 * Parameters:
	 * options - Options as specified in the <jQuery Form plugin documentation at http://jquery.malsup.com/form/#options-object>
	 * type - The type of the *this* element
	 */
	$.dform.subscribeIf($.isFunction($.fn.ajaxForm), "ajax",
		function(options, type)
		{
			if(type === "form")
			{
				this.ajaxForm(options);
			}
		});

	/**
	 * section: i18n
	 *
	 * Localization is supported by using the <jQuery Global at https://github.com/jquery/jquery-global>
	 * plugin.
	 */
	function _getTranslate(options)
	{
		if ($.isFunction(options.split)) 
		{
			var elements = options.split('.');
			if (elements.length > 1) 
			{
				var area = elements.shift();
				var translations = jQuery.global.localize(area);
				if (translations) 
				{
					return $.getValueAt(translations, elements);
				}
			}
		}
		return false;
	}
	/**
	 * subscriber: i18n-html
	 * 
	 * Extends the <html> subscriber that will replace any string with it's translated
	 * equivalent using the jQuery Global plugin. The html content will be interpreted
	 * as an index string where the first part indicates the localize main index and
	 * every following a sub index using <getValueAt>.
	 * 
	 * Example:
	 * 
	 * // Register localized strings
	 * jQuery.global.localize("form", "en", 
	 * {
	 * 		"name" : "A name",
	 * 		"field" :
	 * 		{
	 * 			"username" : "User name",
	 * 			"password" : "Password"
	 * 		}
	 * });
	 * 
	 * {
	 * 		"type" : "div",
	 * 		"html" : "form.name",
	 * 		"elements" :
	 * 		[
	 * 			{
	 * 				"type" : "h2",
	 * 				"html" : "form.field.password"
	 * 			}
	 * 		]
	 * }
	 * (end code)
	 * 
	 * Parameters:
	 * options - The html string to localize
	 * type - The type of the *this* element
	 */	
	$.dform.subscribeIf(($.global && $.isFunction($.global.localize)),
		'html', function(options, type) 
	{
		var translated = _getTranslate(options);
		if(translated) $(this).html(translated);
	});

	/**
	 * Returns the value in an object based on the given dot separated
	 * path or false if not found.
	 *
	 *	 $.getValueAt({ "test" : { "inner" : { "value" : "X" }}}, "test.inner.value")
	 *	 // will return "X"
	 *
	 * @param {Object} object The object to traverse
	 * @param {String|Array} path The path to use. It can be either a dot separated string or
	 * an array of indexes.
	 * @return {Object|Boolean} The objects value or false
	 */
	if($.global) {
		$.getValueAt = function (object, path)
		{
			var elements = isArray(path) ? path : path.split('.');
			var result = object;
			for (var i = 0; i < elements.length; i++) {
				var current = elements[i];
				if (!result[current])
					return false;
				result = result[current];
			}
			return result;
		}
	}

	/**
	 * subscriber: i18n-options
	 * 
	 * Extends the <options> subscriber for using internationalized option
	 * lists.
	 *  
	 * Parameters:
	 * options - Options as specified in the <jQuery Form plugin documentation at http://jquery.malsup.com/form/#options-object>
	 * type - The type of the *this* element
	 */	
	$.dform.subscribeIf($.global, 'options', function(options, type) 
	{
		if(type == 'select' && (typeof(options) == 'string')) {
			$(this).html('');
			var optlist = _getTranslate(options);
			if(optlist) {
				$(this).dform('run', 'options', optlist, type);
			}
		}
	});
})(jQuery);
