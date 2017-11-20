/**
 * Zabuto Calendar Test Suite
 */
(function ($) {
	QUnit.start();
	QUnit.module('zabuto_calendar');

	QUnit.test('registration', function (assert) {
		assert.ok($.fn.zabuto_calendar(), 'registered as a jQuery plugin');
	});

	QUnit.test('chainability', function (assert) {
		var $div = $('<div></div>');
		assert.ok($div.zabuto_calendar().addClass('testing'), 'can be chained');
		assert.ok($div.hasClass('testing'), 'successfully chained');
	});

	QUnit.test('default settings', function (assert) {
		var $div = $('<div></div>');
		var defaults = $.fn.zabuto_calendar.defaults;
		var newDefaults = $.extend({}, $.fn.zabuto_calendar.defaults,
			{
				foo: 'bar',
				baz: true
			}
		);

		$.fn.zabuto_calendar.defaults = newDefaults;
		$div.zabuto_calendar();

		assert.propEqual($div.data('plugin_zabuto_calendar').settings, newDefaults, 'set new default settings');

		$.fn.zabuto_calendar.defaults = defaults;
	});

	QUnit.test('cleanup', function (assert) {
		var $div = $('<div></div>');
		$div.zabuto_calendar();
		$div.zabuto_calendar('destroy');

		assert.notOk($div.data('plugin_zabuto_calendar'), 'destroyed');
	});

	QUnit.test('callbacks', function (assert) {
		var $div = $('<div></div>');

		$div.zabuto_calendar({
			onInit: function () {
				assert.ok($(this).addClass('testing-on-init'), 'init callback');
				assert.ok($(this).hasClass('testing-on-init'), 'init callback successful');
			},
			onDestroy: function () {
				assert.ok($(this).addClass('testing-on-destroy'), 'destroy callback');
				assert.ok($(this).hasClass('testing-on-destroy'), 'destroy callback successful');
			}
		});

		$div.zabuto_calendar('destroy');
	});

	QUnit.test('year and month available', function (assert) {
		var $div = $('<div></div>');
		$div.zabuto_calendar();

		assert.ok(typeof $div.data('year') !== 'undefined', 'added data ”year” to content block');
		assert.ok(typeof $div.data('month') !== 'undefined', 'added data ”month” to content block');
	});

	QUnit.test('specific year and month', function (assert) {
		var $div = $('<div></div>');
		$div.zabuto_calendar({year: 2017, month: 2});
		assert.equal($div.data('year'), '2017', 'year set on init');
		assert.equal($div.data('month'), '2', 'month set on init');

		$div.zabuto_calendar('goto', 2018, 10);
		assert.equal($div.data('year'), '2018', 'year changed with goto');
		assert.equal($div.data('month'), '10', 'month changed with goto');
	});
}(jQuery));
