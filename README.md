# Zabuto Calendar

The Zabuto Calendar jQuery Plugin lets you add a simple month calendar to your web page. It's lightweight, efficient and easy to use.


## Getting Started
Include jQuery and use the production versions of the [javascript] and accompanied [stylesheet].

[javascript]: https://raw.github.com/zabuto/calendar/develop/dist/zabuto_calendar.min.js
[stylesheet]: https://raw.github.com/zabuto/calendar/develop/dist/zabuto_calendar.min.css

Initialize the calendar your web page:

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script src="https://cdn.rawgit.com/zabuto/calendar/develop/dist/zabuto_calendar.min.js"></script>
<link href="https://cdn.rawgit.com/zabuto/calendar/develop/dist/zabuto_calendar.min.css" rel="stylesheet">

<div id="my-calendar"></div>

<script>
jQuery(function($) {
  $("#my-calendar").zabuto_calendar();
});
</script>
```
## Examples
Examples for the use of the calendar are includes in the sources. You can also check them out in the demo: http://zabuto.com/dev/calendar/demo/.

## Issues and contributing
Please review the guidelines for [contributing](CONTRIBUTING.md) for more information.

## License
Licensed under the MIT license.
