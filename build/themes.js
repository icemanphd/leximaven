'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var glob = require('glob');
var noon = require('noon');

var PKGDIR = process.env.NODE_PATH + '/leximaven/';

/**
  * The themes module provides useful repetitive theme tasks
  * @module Themes
  */

/**
  * Loads theme
  * @public
  * @param {string} theme The name of the theme
  * @return {Object} theme The style to use
  */
exports.loadTheme = function (theme) {
  return noon.load(PKGDIR + 'themes/' + theme + '.noon');
};

/**
  * Gets themes for list command
  * @public
  * @return {Array} List of theme names
  */
exports.getThemes = function () {
  var list = [];
  var files = glob.sync(PKGDIR + 'themes/*.noon');
  _.each(files, function (path) {
    var name = path.replace(/themes\//, '').replace(/\.noon/, '');
    list.push(name);
  });
  return list;
};

/**
  * Prints connector and content below the label
  * @public
  * @param {string} text The label text
  * @param {Object} theme The style to use
  * @param {string} [content] The text the label points at
  */
exports.labelDown = function (text, theme, content) {
  var pstyle = _.get(chalk, theme.prefix.style);
  process.stdout.write(pstyle(theme.prefix.str));
  var tstyle = _.get(chalk, theme.text.style);
  process.stdout.write(tstyle(text));
  var sstyle = _.get(chalk, theme.suffix.style);
  process.stdout.write(sstyle(theme.suffix.str));
  console.log('');
  if (content !== null || undefined) {
    var cnstyle = _.get(chalk, theme.connector.style);
    process.stdout.write(cnstyle(theme.connector.str));
    var ctstyle = _.get(chalk, theme.content.style);
    console.log(ctstyle(content));
  }
};

/**
  * Prints connector and content next to the label
  * @public
  * @param {string} text The label text
  * @param {Object} theme The style to use
  * @param {string} [content] The text the label points at
  */
exports.labelRight = function (text, theme, content) {
  var pstyle = _.get(chalk, theme.prefix.style);
  process.stdout.write(pstyle(theme.prefix.str));
  var tstyle = _.get(chalk, theme.text.style);
  process.stdout.write(tstyle(text));
  var sstyle = _.get(chalk, theme.suffix.style);
  process.stdout.write(sstyle(theme.suffix.str));
  if (content !== null || undefined) {
    var cnstyle = _.get(chalk, theme.connector.style);
    process.stdout.write(cnstyle(theme.connector.str));
    var ctstyle = _.get(chalk, theme.content.style);
    console.log(ctstyle(content));
  }
};
//# sourceMappingURL=data:application/json;base64,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TUFBTixDQUFhLEdBQXBCLENBQXJCO0FBQ0EsTUFBSSxZQUFZLElBQVosSUFBb0IsU0FBeEIsRUFBbUM7QUFDakMsUUFBTSxVQUFVLEVBQUUsR0FBRixDQUFNLEtBQU4sRUFBYSxNQUFNLFNBQU4sQ0FBZ0IsS0FBN0IsQ0FBaEI7QUFDQSxZQUFRLE1BQVIsQ0FBZSxLQUFmLENBQXFCLFFBQVEsTUFBTSxTQUFOLENBQWdCLEdBQXhCLENBQXJCO0FBQ0EsUUFBTSxVQUFVLEVBQUUsR0FBRixDQUFNLEtBQU4sRUFBYSxNQUFNLE9BQU4sQ0FBYyxLQUEzQixDQUFoQjtBQUNBLFlBQVEsR0FBUixDQUFZLFFBQVEsT0FBUixDQUFaO0FBQ0Q7QUFDRixDQWJEIiwiZmlsZSI6InRoZW1lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG5jb25zdCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpXG5jb25zdCBub29uID0gcmVxdWlyZSgnbm9vbicpXG5cbmNvbnN0IFBLR0RJUiA9IGAke3Byb2Nlc3MuZW52Lk5PREVfUEFUSH0vbGV4aW1hdmVuL2BcblxuLyoqXG4gICogVGhlIHRoZW1lcyBtb2R1bGUgcHJvdmlkZXMgdXNlZnVsIHJlcGV0aXRpdmUgdGhlbWUgdGFza3NcbiAgKiBAbW9kdWxlIFRoZW1lc1xuICAqL1xuXG4vKipcbiAgKiBMb2FkcyB0aGVtZVxuICAqIEBwdWJsaWNcbiAgKiBAcGFyYW0ge3N0cmluZ30gdGhlbWUgVGhlIG5hbWUgb2YgdGhlIHRoZW1lXG4gICogQHJldHVybiB7T2JqZWN0fSB0aGVtZSBUaGUgc3R5bGUgdG8gdXNlXG4gICovXG5leHBvcnRzLmxvYWRUaGVtZSA9ICh0aGVtZSkgPT4gbm9vbi5sb2FkKGAke1BLR0RJUn10aGVtZXMvJHt0aGVtZX0ubm9vbmApXG5cbi8qKlxuICAqIEdldHMgdGhlbWVzIGZvciBsaXN0IGNvbW1hbmRcbiAgKiBAcHVibGljXG4gICogQHJldHVybiB7QXJyYXl9IExpc3Qgb2YgdGhlbWUgbmFtZXNcbiAgKi9cbmV4cG9ydHMuZ2V0VGhlbWVzID0gKCkgPT4ge1xuICBjb25zdCBsaXN0ID0gW11cbiAgY29uc3QgZmlsZXMgPSBnbG9iLnN5bmMoYCR7UEtHRElSfXRoZW1lcy8qLm5vb25gKVxuICBfLmVhY2goZmlsZXMsIChwYXRoKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IHBhdGgucmVwbGFjZSgvdGhlbWVzXFwvLywgJycpLnJlcGxhY2UoL1xcLm5vb24vLCAnJylcbiAgICBsaXN0LnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGxpc3Rcbn1cblxuLyoqXG4gICogUHJpbnRzIGNvbm5lY3RvciBhbmQgY29udGVudCBiZWxvdyB0aGUgbGFiZWxcbiAgKiBAcHVibGljXG4gICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIGxhYmVsIHRleHRcbiAgKiBAcGFyYW0ge09iamVjdH0gdGhlbWUgVGhlIHN0eWxlIHRvIHVzZVxuICAqIEBwYXJhbSB7c3RyaW5nfSBbY29udGVudF0gVGhlIHRleHQgdGhlIGxhYmVsIHBvaW50cyBhdFxuICAqL1xuZXhwb3J0cy5sYWJlbERvd24gPSAodGV4dCwgdGhlbWUsIGNvbnRlbnQpID0+IHtcbiAgY29uc3QgcHN0eWxlID0gXy5nZXQoY2hhbGssIHRoZW1lLnByZWZpeC5zdHlsZSlcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocHN0eWxlKHRoZW1lLnByZWZpeC5zdHIpKVxuICBjb25zdCB0c3R5bGUgPSBfLmdldChjaGFsaywgdGhlbWUudGV4dC5zdHlsZSlcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUodHN0eWxlKHRleHQpKVxuICBjb25zdCBzc3R5bGUgPSBfLmdldChjaGFsaywgdGhlbWUuc3VmZml4LnN0eWxlKVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzc3R5bGUodGhlbWUuc3VmZml4LnN0cikpXG4gIGNvbnNvbGUubG9nKCcnKVxuICBpZiAoY29udGVudCAhPT0gbnVsbCB8fCB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBjbnN0eWxlID0gXy5nZXQoY2hhbGssIHRoZW1lLmNvbm5lY3Rvci5zdHlsZSlcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjbnN0eWxlKHRoZW1lLmNvbm5lY3Rvci5zdHIpKVxuICAgIGNvbnN0IGN0c3R5bGUgPSBfLmdldChjaGFsaywgdGhlbWUuY29udGVudC5zdHlsZSlcbiAgICBjb25zb2xlLmxvZyhjdHN0eWxlKGNvbnRlbnQpKVxuICB9XG59XG5cbi8qKlxuICAqIFByaW50cyBjb25uZWN0b3IgYW5kIGNvbnRlbnQgbmV4dCB0byB0aGUgbGFiZWxcbiAgKiBAcHVibGljXG4gICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIGxhYmVsIHRleHRcbiAgKiBAcGFyYW0ge09iamVjdH0gdGhlbWUgVGhlIHN0eWxlIHRvIHVzZVxuICAqIEBwYXJhbSB7c3RyaW5nfSBbY29udGVudF0gVGhlIHRleHQgdGhlIGxhYmVsIHBvaW50cyBhdFxuICAqL1xuZXhwb3J0cy5sYWJlbFJpZ2h0ID0gKHRleHQsIHRoZW1lLCBjb250ZW50KSA9PiB7XG4gIGNvbnN0IHBzdHlsZSA9IF8uZ2V0KGNoYWxrLCB0aGVtZS5wcmVmaXguc3R5bGUpXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHBzdHlsZSh0aGVtZS5wcmVmaXguc3RyKSlcbiAgY29uc3QgdHN0eWxlID0gXy5nZXQoY2hhbGssIHRoZW1lLnRleHQuc3R5bGUpXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHRzdHlsZSh0ZXh0KSlcbiAgY29uc3Qgc3N0eWxlID0gXy5nZXQoY2hhbGssIHRoZW1lLnN1ZmZpeC5zdHlsZSlcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoc3N0eWxlKHRoZW1lLnN1ZmZpeC5zdHIpKVxuICBpZiAoY29udGVudCAhPT0gbnVsbCB8fCB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBjbnN0eWxlID0gXy5nZXQoY2hhbGssIHRoZW1lLmNvbm5lY3Rvci5zdHlsZSlcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjbnN0eWxlKHRoZW1lLmNvbm5lY3Rvci5zdHIpKVxuICAgIGNvbnN0IGN0c3R5bGUgPSBfLmdldChjaGFsaywgdGhlbWUuY29udGVudC5zdHlsZSlcbiAgICBjb25zb2xlLmxvZyhjdHN0eWxlKGNvbnRlbnQpKVxuICB9XG59XG4iXX0=