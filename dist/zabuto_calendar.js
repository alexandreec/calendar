/*! Zabuto Calendar - v2.0.0 - 2017-11-21
* https://github.com/zabuto/calendar
* Copyright (c) 2017 Anke Heijnen; Licensed MIT */

;(function ($) {

(function ($, window, document, undefined) {

	"use strict";

	/**
	 * Plugin name
	 */
	var pluginName = 'zabuto_calendar';

	/**
	 * Current date
	 */
	var now = new Date();

	/**
	 * Plugin constructor
	 */
	function ZabutoCalendar(element, options) {
		this.element = element;
		this._name = pluginName;
		this._defaults = $.fn[pluginName].defaults;
		this.settings = $.extend({}, this._defaults, options);
		this.settings.language = this.settings.language.toLowerCase();

		this._languages = $.fn[pluginName].languages;
		if (null !== this.settings.translation) {
			this._setTranslation(this.settings.language, this.settings.translation);
		}

		this.init();
	}

	/**
	 * Plugin wrapper
	 */
	$.fn[pluginName] = function (options) {
		var argsArray;
		if (options !== undefined) {
			var args = $.makeArray(arguments);
			argsArray = args.slice(1);
		}

		return this.each(function () {
			var instance = $.data(this, 'plugin_' + pluginName);
			if (!instance) {
				$.data(this, 'plugin_' + pluginName, new ZabutoCalendar(this, options));
			} else {
				if (typeof options === 'string' && typeof instance[options] === 'function') {
					instance[options].apply(instance, argsArray);
				}
			}
		});
	};

	/**
	 * Defaults
	 */
	$.fn[pluginName].defaults = {
		year: now.getFullYear(),
		month: (now.getMonth() + 1),
		language: 'en',
		translation: null,
		week_starts: 'monday',
		show_days: true,
		classname: null,
		header_format: 'month year',
		date_format: 'y-m-d',
		navigation: {
			prev: '<span class="glyphicon glyphicon-chevron-left"></span>',
			next: '<span class="glyphicon glyphicon-chevron-right"></span>'
		},
		onInit: $.noop,
		onDestroy: $.noop
	};

	/**
	 * Languages
	 */
	$.fn[pluginName].languages = {};

	/**
	 * Functions
	 */
	$.extend(ZabutoCalendar.prototype, {
		/**
		 * Initialize
		 */
		init: function () {
			var element = $(this.element);
			element.data('year', this.settings.year);
			element.data('month', this.settings.month);
			this.settings.onInit.call(element);
			this.render();
		},

		/**
		 * Destroy
		 */
		destroy: function () {
			var element = $(this.element);

			this.settings.onDestroy.call(element);

			element.removeData('plugin_' + pluginName);
			element.removeData('year');
			element.removeData('month');
			element.empty();
		},

		/**
		 * Go to month/year
		 */
		goto: function (year, month) {
			if (false === this._isValidDate(year, month, 1)) {
				return;
			}

			$(this.element).data('year', year);
			$(this.element).data('month', month);

			this.render();
		},

		/**
		 * Render calendar
		 */
		render: function () {
			var year = $(this.element).data('year');
			var month = $(this.element).data('month');

			$(this.element).empty();

			if (this._isValidDate(year, month, 1)) {
				$(this.element).append(this._renderTable(year, month));
			}
		},

		/**
		 * Render table
		 */
		_renderTable: function (year, month) {
			var table = $('<table></table>').addClass('zabuto-calendar');

			if (this.settings.classname) {
				table.addClass(this.settings.classname);
			}

			var thead = $('<thead></thead>');
			thead.append(this._renderNavigation(year, month));

			if (true === this.settings.show_days) {
				thead.append(this._renderDaysOfWeek());
			}

			var tbody = this._renderDaysInMonth(year, month);

			table.append(thead);
			table.append(tbody);

			return table;
		},

		/**
		 * Render navigation
		 */
		_renderNavigation: function (year, month) {
			var self = this;

			var label = self.settings.header_format;
			label = label.replace('year', year.toString());

			var translation = self._getTranslation(self.settings.language);
			if (null !== translation && 'months' in translation) {
				var labels = translation['months'];
				label = label.replace('month', labels[month.toString()]);
			} else {
				label = label.replace('month', month.toString());
			}

			var nav = $('<tr></tr>').addClass('zabuto-calendar__navigation').attr('role', 'navigation');

			var prev = self._renderNavigationItem('prev', self._calculatePrevious(year, month));
			var next = self._renderNavigationItem('next', self._calculateNext(year, month));

			var title = $('<span></span>').text(label).data('to', {
				year: self.settings.year,
				month: self.settings.month
			});
			title.addClass('zabuto-calendar__navigation__item--header__title');
			title.on('dblclick.zabuto_calendar', function (e) {
				e.preventDefault();
				var to = $(this).data('to');
				self.goto(to.year, to.month);
			});

			var header = $('<td></td>');
			header.addClass('zabuto-calendar__navigation__item--header');
			header.append(title);

			nav.append(prev);
			nav.append(header.attr('colspan', 5));
			nav.append(next);

			return nav;
		},

		/**
		 * Render navigation item
		 */
		_renderNavigationItem: function (type, to) {
			var self = this;

			type = type.toString();

			var item = $('<td></td>').data('nav', type).data('to', to);
			item.addClass('zabuto-calendar__navigation__item--' + type);
			item.html(self.settings.navigation[type]);
			item.on('click.zabuto_calendar', function (e) {
				e.preventDefault();
				var to = $(this).data('to');
				self.goto(to.year, to.month);
			});

			return item;
		},

		/**
		 * Render days of week row
		 */
		_renderDaysOfWeek: function () {
			var start = this.settings.week_starts;

			var labels = {"0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6"};
			var translation = this._getTranslation(this.settings.language);
			if (null !== translation && 'days' in translation) {
				labels = translation['days'];
			}

			var dow = $('<tr></tr>').addClass('zabuto-calendar__days-of-week');

			if (start === 0 || start === '0' || start === 'sunday') {
				dow.append($('<th></th>').text(labels['0']).addClass('zabuto-calendar__days-of-week__item'));
			}

			dow.append($('<th></th>').text(labels['1']).addClass('zabuto-calendar__days-of-week__item'));
			dow.append($('<th></th>').text(labels['2']).addClass('zabuto-calendar__days-of-week__item'));
			dow.append($('<th></th>').text(labels['3']).addClass('zabuto-calendar__days-of-week__item'));
			dow.append($('<th></th>').text(labels['4']).addClass('zabuto-calendar__days-of-week__item'));
			dow.append($('<th></th>').text(labels['5']).addClass('zabuto-calendar__days-of-week__item'));
			dow.append($('<th></th>').text(labels['6']).addClass('zabuto-calendar__days-of-week__item'));

			if (start === 1 || start === '1' || start === 'monday') {
				dow.append($('<th></th>').text(labels['0']).addClass('zabuto-calendar__days-of-week__item'));
			}

			return dow;
		},

		/**
		 * Render days of the month
		 */
		_renderDaysInMonth: function (year, month) {
			var self = this;
			var start = self.settings.week_starts;

			var weeks = self._calculateWeeksInMonth(year, month);
			var days = self._calculateLastDayOfMonth(year, month);
			var firstDow = self._calculateDayOfWeek(year, month, 1);

			var dows = [0, 1, 2, 3, 4, 5, 6];
			var checkDow = firstDow;
			if (start === 1 || start === '1' || start === 'monday') {
				dows = [1, 2, 3, 4, 5, 6, 7];
				checkDow = (firstDow === 0) ? 7 : firstDow;
			}

			var tbody = $('<tbody></tbody>');

			var day = 1;
			for (var wk = 1; wk <= weeks; wk++) {
				var row = self._renderWeek(wk, weeks);

				$.each(dows, function (i, dow) {
					if ((wk === 1 && dow < checkDow) || day > days) {
						row.append($('<td></td>').addClass('zabuto-calendar__day--empty'));
					} else {
						var cell = self._renderDay(year, month, day, dow);
						row.append(cell);
						day++;
					}
				});

				tbody.append(row);
			}

			return tbody;
		},

		/**
		 * Render single week
		 */
		_renderWeek: function (week, weeks) {
			var row = $('<tr></tr>');

			if (week === 1) {
				row.addClass('zabuto-calendar__week--first');
			} else if (week === weeks) {
				row.addClass('zabuto-calendar__week--last');
			} else {
				row.addClass('zabuto-calendar__week');
			}

			return row;
		},

		/**
		 * Render single day
		 */
		_renderDay: function (year, month, day, dow) {
			var cell = $('<td></td>').text(day);

			cell.data('date', this._dateAsString(year, month, day));
			cell.data('day', day);
			cell.data('dow', (dow === 7 ? 0 : dow));
			if (this._isToday(year, month, day)) {
				cell.data('today', 1);
				cell.addClass('zabuto-calendar__day--today');
			} else {
				cell.data('today', 0);
				cell.addClass('zabuto-calendar__day');
			}

			return cell;
		},

		/**
		 * Get translation
		 */
		_getTranslation: function (locale) {
			var languages = this._languages;
			if (locale in languages) {
				return languages[locale];
			}

			return null;
		},

		/**
		 * Set translation
		 */
		_setTranslation: function (locale, translation) {
			if (typeof translation === 'object' && 'months' in translation && 'days' in translation) {
				this._languages[locale] = translation;
				return true;
			}
			return false;
		},

		/**
		 * Calculate number of weeks in the month
		 */
		_calculateWeeksInMonth: function (year, month) {
			var start = this.settings.week_starts;

			var daysInMonth = this._calculateLastDayOfMonth(year, month);
			var firstDow = this._calculateDayOfWeek(year, month, 1);
			var lastDow = this._calculateDayOfWeek(year, month, daysInMonth);

			var first = firstDow;
			var last = lastDow;
			if (start === 1 || start === '1' || start === 'monday') {
				first = (firstDow === 0) ? 7 : firstDow;
				last = (lastDow === 0) ? 7 : lastDow;
			}

			var offset = first - last;
			var days = daysInMonth + offset;

			return Math.ceil(days / 7);
		},

		/**
		 * Calculate the last day of the month
		 */
		_calculateLastDayOfMonth: function (year, month) {
			var jsMonth = month - 1;
			var date = new Date(year, jsMonth + 1, 0);

			return date.getDate();
		},

		/**
		 * Calculate day of the week (from 0 to 6)
		 */
		_calculateDayOfWeek: function (year, month, day) {
			var jsMonth = month - 1;
			var date = new Date(year, jsMonth, day);

			return date.getDay();
		},

		/**
		 * Calculate previous month/year
		 */
		_calculatePrevious: function (year, month) {
			var prevYear = year;
			var prevMonth = (month - 1);
			if (prevMonth === 0) {
				prevYear = (year - 1);
				prevMonth = 12;
			}

			return {year: prevYear, month: prevMonth};
		},

		/**
		 * Calculate next month/year
		 */
		_calculateNext: function (year, month) {
			var nextYear = year;
			var nextMonth = (month + 1);
			if (nextMonth === 13) {
				nextYear = (year + 1);
				nextMonth = 1;
			}

			return {year: nextYear, month: nextMonth};
		},

		/**
		 * Check if date is valid
		 */
		_isValidDate: function (year, month, day) {
			if (month < 1 || month > 12) {
				return false;
			}

			var jsMonth = month - 1;
			var date = new Date(year, jsMonth, day);

			return date.getFullYear() === year && (date.getMonth()) === jsMonth && date.getDate() === Number(day);
		},

		/**
		 * Check if date is today
		 */
		_isToday: function (year, month, day) {
			var jsMonth = month - 1;

			var today = new Date();
			var date = new Date(year, jsMonth, day);

			return (date.toDateString() === today.toDateString());
		},

		/**
		 * Parse date string
		 */
		_dateAsString: function (year, month, day) {
			var string = this.settings.date_format;

			day = (day < 10) ? '0' + day : day;
			month = (month < 10) ? '0' + month : month;

			string = string.replace('y', year);
			string = string.replace('m', month);
			string = string.replace('d', day);

			return string;
		}
	});

})(jQuery, window, document, undefined);

$.fn['zabuto_calendar'].languages = $.fn['zabuto_calendar'].languages || {};
$.fn['zabuto_calendar'].languages["en"] = {"months":{"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"},"days":{"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"}};
$.fn['zabuto_calendar'].languages["nl"] = {"months":{"1":"Januari","2":"Februari","3":"Maart","4":"April","5":"Mei","6":"Juni","7":"Juli","8":"Augustus","9":"September","10":"Oktober","11":"November","12":"December"},"days":{"0":"Zo","1":"Ma","2":"Di","3":"Wo","4":"Do","5":"Vr","6":"Za"}};

})(jQuery);