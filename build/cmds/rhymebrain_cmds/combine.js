'use strict';

/* eslint max-len:0 */
var themes = require('../../themes');
var tools = require('../../tools');

var _ = require('lodash');
var chalk = require('chalk');
var moment = require('moment');
var needle = require('needle');
var noon = require('noon');

var CFILE = process.env.HOME + '/.leximaven.noon';

exports.command = 'combine <query>';
exports.desc = 'Rhymebrain portmanteaus';
exports.builder = {
  out: {
    alias: 'o',
    desc: 'Write cson, json, noon, plist, yaml, xml',
    default: '',
    type: 'string'
  },
  force: {
    alias: 'f',
    desc: 'Force overwriting outfile',
    default: false,
    type: 'boolean'
  },
  save: {
    alias: 's',
    desc: 'Save flags to config file',
    default: false,
    type: 'boolean'
  },
  lang: {
    alias: 'l',
    desc: 'ISO 639-1 language code',
    default: 'en',
    type: 'string'
  },
  max: {
    alias: 'm',
    desc: 'Max results to return',
    default: 5,
    type: 'number'
  }
};
exports.handler = function (argv) {
  tools.checkConfig(CFILE);
  var config = noon.load(CFILE);
  var proceed = false;
  var stamp = new Date(config.rbrain.date.stamp);
  var now = new Date();
  var diff = moment(now).diff(stamp, 'minutes');
  var reset = 60 - diff;
  if (diff < 60) {
    config.rbrain.date.remain = config.rbrain.date.remain - 1;
    noon.save(CFILE, config);
  } else if (diff >= 60) {
    config.rbrain.date.stamp = moment().format();
    config.rbrain.date.remain = config.rbrain.date.limit;
    console.log(chalk.white('Reset API limit to ' + config.rbrain.date.limit + '/' + config.rbrain.date.interval + '.'));
    config.rbrain.date.remain = config.rbrain.date.remain - 1;
    noon.save(CFILE, config);
  }
  if (config.rbrain.date.remain === 0) {
    proceed = false;
  } else if (config.rbrain.date.remain < 0) {
    proceed = false;
    config.rbrain.date.remain = 0;
    noon.save(CFILE, config);
  } else {
    proceed = true;
  }
  if (proceed) {
    (function () {
      var userConfig = {
        combine: {
          lang: argv.l,
          max: argv.m
        }
      };
      if (config.merge) config = _.merge({}, config, userConfig);
      var theme = themes.loadTheme(config.theme);
      if (config.verbose) themes.labelDown('Rhymebrain', theme, null);
      var query = argv.query;
      var task = 'Portmanteaus';
      var prefix = 'http://rhymebrain.com/talk?function=get';
      var uri = '' + prefix + task + '&word=' + query + '&';
      var pcont = [];
      pcont.push('lang=' + config.rbrain.combine.lang + '&');
      pcont.push('maxResults=' + config.rbrain.combine.max + '&');
      var rest = pcont.join('');
      var url = '' + uri + rest;
      url = encodeURI(url);
      themes.labelDown('Portmanteaus', theme, null);
      var tofile = {
        type: 'portmanteau',
        source: 'http://rhymebrain.com',
        url: url
      };
      needle.get(url, function (error, response) {
        if (!error && response.statusCode === 200) {
          var list = response.body;
          for (var i = 0; i <= list.length - 1; i++) {
            var item = list[i];
            themes.labelRight(item.source, theme, item.combined);
            tofile[['set' + i]] = item.source;
            tofile[['portmanteau' + i]] = item.combined;
          }
          if (argv.o) tools.outFile(argv.o, argv.f, tofile);
          if (argv.s && config.merge) noon.save(CFILE, config);
          if (argv.s && !config.merge) console.err(chalk.red('Set option merge to true!'));
          console.log(config.rbrain.date.remain + '/' + config.rbrain.date.limit + ' requests remaining this hour, will reset in ' + reset + ' minutes.');
        } else {
          console.error(chalk.red.bold('HTTP ' + response.statusCode + ':') + ' ' + chalk.red(error));
        }
      });
    })();
  } else {
    console.error(chalk.red('Reached this hour\'s usage limit of ' + config.rbrain.date.limit + '.'));
    process.exit(1);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNtZHMvcmh5bWVicmFpbl9jbWRzL2NvbWJpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQU0sU0FBUyxRQUFRLGNBQVIsQ0FBZjtBQUNBLElBQU0sUUFBUSxRQUFRLGFBQVIsQ0FBZDs7QUFFQSxJQUFNLElBQUksUUFBUSxRQUFSLENBQVY7QUFDQSxJQUFNLFFBQVEsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNLFNBQVMsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNLFNBQVMsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNLE9BQU8sUUFBUSxNQUFSLENBQWI7O0FBRUEsSUFBTSxRQUFXLFFBQVEsR0FBUixDQUFZLElBQXZCLHFCQUFOOztBQUVBLFFBQVEsT0FBUixHQUFrQixpQkFBbEI7QUFDQSxRQUFRLElBQVIsR0FBZSx5QkFBZjtBQUNBLFFBQVEsT0FBUixHQUFrQjtBQUNoQixPQUFLO0FBQ0gsV0FBTyxHQURKO0FBRUgsVUFBTSwwQ0FGSDtBQUdILGFBQVMsRUFITjtBQUlILFVBQU07QUFKSCxHQURXO0FBT2hCLFNBQU87QUFDTCxXQUFPLEdBREY7QUFFTCxVQUFNLDJCQUZEO0FBR0wsYUFBUyxLQUhKO0FBSUwsVUFBTTtBQUpELEdBUFM7QUFhaEIsUUFBTTtBQUNKLFdBQU8sR0FESDtBQUVKLFVBQU0sMkJBRkY7QUFHSixhQUFTLEtBSEw7QUFJSixVQUFNO0FBSkYsR0FiVTtBQW1CaEIsUUFBTTtBQUNKLFdBQU8sR0FESDtBQUVKLFVBQU0seUJBRkY7QUFHSixhQUFTLElBSEw7QUFJSixVQUFNO0FBSkYsR0FuQlU7QUF5QmhCLE9BQUs7QUFDSCxXQUFPLEdBREo7QUFFSCxVQUFNLHVCQUZIO0FBR0gsYUFBUyxDQUhOO0FBSUgsVUFBTTtBQUpIO0FBekJXLENBQWxCO0FBZ0NBLFFBQVEsT0FBUixHQUFrQixVQUFDLElBQUQsRUFBVTtBQUMxQixRQUFNLFdBQU4sQ0FBa0IsS0FBbEI7QUFDQSxNQUFJLFNBQVMsS0FBSyxJ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QUExQlc7QUEyQ1osR0EzQ0QsTUEyQ087QUFDTCxZQUFRLEtBQVIsQ0FBYyxNQUFNLEdBQU4sMENBQWdELE9BQU8sTUFBUCxDQUFjLElBQWQsQ0FBbUIsS0FBbkUsT0FBZDtBQUNBLFlBQVEsSUFBUixDQUFhLENBQWI7QUFDRDtBQUNGLENBMUVEIiwiZmlsZSI6ImNtZHMvcmh5bWVicmFpbl9jbWRzL2NvbWJpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbWF4LWxlbjowICovXG5jb25zdCB0aGVtZXMgPSByZXF1aXJlKCcuLi8uLi90aGVtZXMnKVxuY29uc3QgdG9vbHMgPSByZXF1aXJlKCcuLi8uLi90b29scycpXG5cbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuY29uc3QgbmVlZGxlID0gcmVxdWlyZSgnbmVlZGxlJylcbmNvbnN0IG5vb24gPSByZXF1aXJlKCdub29uJylcblxuY29uc3QgQ0ZJTEUgPSBgJHtwcm9jZXNzLmVudi5IT01FfS8ubGV4aW1hdmVuLm5vb25gXG5cbmV4cG9ydHMuY29tbWFuZCA9ICdjb21iaW5lIDxxdWVyeT4nXG5leHBvcnRzLmRlc2MgPSAnUmh5bWVicmFpbiBwb3J0bWFudGVhdXMnXG5leHBvcnRzLmJ1aWxkZXIgPSB7XG4gIG91dDoge1xuICAgIGFsaWFzOiAnbycsXG4gICAgZGVzYzogJ1dyaXRlIGNzb24sIGpzb24sIG5vb24sIHBsaXN0LCB5YW1sLCB4bWwnLFxuICAgIGRlZmF1bHQ6ICcnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9LFxuICBmb3JjZToge1xuICAgIGFsaWFzOiAnZicsXG4gICAgZGVzYzogJ0ZvcmNlIG92ZXJ3cml0aW5nIG91dGZpbGUnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgc2F2ZToge1xuICAgIGFsaWFzOiAncycsXG4gICAgZGVzYzogJ1NhdmUgZmxhZ3MgdG8gY29uZmlnIGZpbGUnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgbGFuZzoge1xuICAgIGFsaWFzOiAnbCcsXG4gICAgZGVzYzogJ0lTTyA2MzktMSBsYW5ndWFnZSBjb2RlJyxcbiAgICBkZWZhdWx0OiAnZW4nLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9LFxuICBtYXg6IHtcbiAgICBhbGlhczogJ20nLFxuICAgIGRlc2M6ICdNYXggcmVzdWx0cyB0byByZXR1cm4nLFxuICAgIGRlZmF1bHQ6IDUsXG4gICAgdHlwZTogJ251bWJlcicsXG4gIH0sXG59XG5leHBvcnRzLmhhbmRsZXIgPSAoYXJndikgPT4ge1xuICB0b29scy5jaGVja0NvbmZpZyhDRklMRSlcbiAgbGV0IGNvbmZpZyA9IG5vb24ubG9hZChDRklMRSlcbiAgbGV0IHByb2NlZWQgPSBmYWxzZVxuICBjb25zdCBzdGFtcCA9IG5ldyBEYXRlKGNvbmZpZy5yYnJhaW4uZGF0ZS5zdGFtcClcbiAgY29uc3Qgbm93ID0gbmV3IERhdGVcbiAgY29uc3QgZGlmZiA9IG1vbWVudChub3cpLmRpZmYoc3RhbXAsICdtaW51dGVzJylcbiAgY29uc3QgcmVzZXQgPSA2MCAtIGRpZmZcbiAgaWYgKGRpZmYgPCA2MCkge1xuICAgIGNvbmZpZy5yYnJhaW4uZGF0ZS5yZW1haW4gPSBjb25maWcucmJyYWluLmRhdGUucmVtYWluIC0gMVxuICAgIG5vb24uc2F2ZShDRklMRSwgY29uZmlnKVxuICB9IGVsc2UgaWYgKGRpZmYgPj0gNjApIHtcbiAgICBjb25maWcucmJyYWluLmRhdGUuc3RhbXAgPSBtb21lbnQoKS5mb3JtYXQoKVxuICAgIGNvbmZpZy5yYnJhaW4uZGF0ZS5yZW1haW4gPSBjb25maWcucmJyYWluLmRhdGUubGltaXRcbiAgICBjb25zb2xlLmxvZyhjaGFsay53aGl0ZShgUmVzZXQgQVBJIGxpbWl0IHRvICR7Y29uZmlnLnJicmFpbi5kYXRlLmxpbWl0fS8ke2NvbmZpZy5yYnJhaW4uZGF0ZS5pbnRlcnZhbH0uYCkpXG4gICAgY29uZmlnLnJicmFpbi5kYXRlLnJlbWFpbiA9IGNvbmZpZy5yYnJhaW4uZGF0ZS5yZW1haW4gLSAxXG4gICAgbm9vbi5zYXZlKENGSUxFLCBjb25maWcpXG4gIH1cbiAgaWYgKGNvbmZpZy5yYnJhaW4uZGF0ZS5yZW1haW4gPT09IDApIHtcbiAgICBwcm9jZWVkID0gZmFsc2VcbiAgfSBlbHNlIGlmIChjb25maWcucmJyYWluLmRhdGUucmVtYWluIDwgMCkge1xuICAgIHByb2NlZWQgPSBmYWxzZVxuICAgIGNvbmZpZy5yYnJhaW4uZGF0ZS5yZW1haW4gPSAwXG4gICAgbm9vbi5zYXZlKENGSUxFLCBjb25maWcpXG4gIH0gZWxzZSB7XG4gICAgcHJvY2VlZCA9IHRydWVcbiAgfVxuICBpZiAocHJvY2VlZCkge1xuICAgIGNvbnN0IHVzZXJDb25maWcgPSB7XG4gICAgICBjb21iaW5lOiB7XG4gICAgICAgIGxhbmc6IGFyZ3YubCxcbiAgICAgICAgbWF4OiBhcmd2Lm0sXG4gICAgICB9LFxuICAgIH1cbiAgICBpZiAoY29uZmlnLm1lcmdlKSBjb25maWcgPSBfLm1lcmdlKHt9LCBjb25maWcsIHVzZXJDb25maWcpXG4gICAgY29uc3QgdGhlbWUgPSB0aGVtZXMubG9hZFRoZW1lKGNvbmZpZy50aGVtZSlcbiAgICBpZiAoY29uZmlnLnZlcmJvc2UpIHRoZW1lcy5sYWJlbERvd24oJ1JoeW1lYnJhaW4nLCB0aGVtZSwgbnVsbClcbiAgICBjb25zdCBxdWVyeSA9IGFyZ3YucXVlcnlcbiAgICBjb25zdCB0YXNrID0gJ1BvcnRtYW50ZWF1cydcbiAgICBjb25zdCBwcmVmaXggPSAnaHR0cDovL3JoeW1lYnJhaW4uY29tL3RhbGs/ZnVuY3Rpb249Z2V0J1xuICAgIGNvbnN0IHVyaSA9IGAke3ByZWZpeH0ke3Rhc2t9JndvcmQ9JHtxdWVyeX0mYFxuICAgIGNvbnN0IHBjb250ID0gW11cbiAgICBwY29udC5wdXNoKGBsYW5nPSR7Y29uZmlnLnJicmFpbi5jb21iaW5lLmxhbmd9JmApXG4gICAgcGNvbnQucHVzaChgbWF4UmVzdWx0cz0ke2NvbmZpZy5yYnJhaW4uY29tYmluZS5tYXh9JmApXG4gICAgY29uc3QgcmVzdCA9IHBjb250LmpvaW4oJycpXG4gICAgbGV0IHVybCA9IGAke3VyaX0ke3Jlc3R9YFxuICAgIHVybCA9IGVuY29kZVVSSSh1cmwpXG4gICAgdGhlbWVzLmxhYmVsRG93bignUG9ydG1hbnRlYXVzJywgdGhlbWUsIG51bGwpXG4gICAgY29uc3QgdG9maWxlID0ge1xuICAgICAgdHlwZTogJ3BvcnRtYW50ZWF1JyxcbiAgICAgIHNvdXJjZTogJ2h0dHA6Ly9yaHltZWJyYWluLmNvbScsXG4gICAgICB1cmwsXG4gICAgfVxuICAgIG5lZWRsZS5nZXQodXJsLCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gcmVzcG9uc2UuYm9keVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBsaXN0Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2ldXG4gICAgICAgICAgdGhlbWVzLmxhYmVsUmlnaHQoaXRlbS5zb3VyY2UsIHRoZW1lLCBpdGVtLmNvbWJpbmVkKVxuICAgICAgICAgIHRvZmlsZVtbYHNldCR7aX1gXV0gPSBpdGVtLnNvdXJjZVxuICAgICAgICAgIHRvZmlsZVtbYHBvcnRtYW50ZWF1JHtpfWBdXSA9IGl0ZW0uY29tYmluZWRcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJndi5vKSB0b29scy5vdXRGaWxlKGFyZ3YubywgYXJndi5mLCB0b2ZpbGUpXG4gICAgICAgIGlmIChhcmd2LnMgJiYgY29uZmlnLm1lcmdlKSBub29uLnNhdmUoQ0ZJTEUsIGNvbmZpZylcbiAgICAgICAgaWYgKGFyZ3YucyAmJiAhY29uZmlnLm1lcmdlKSBjb25zb2xlLmVycihjaGFsay5yZWQoJ1NldCBvcHRpb24gbWVyZ2UgdG8gdHJ1ZSEnKSlcbiAgICAgICAgY29uc29sZS5sb2coYCR7Y29uZmlnLnJicmFpbi5kYXRlLnJlbWFpbn0vJHtjb25maWcucmJyYWluLmRhdGUubGltaXR9IHJlcXVlc3RzIHJlbWFpbmluZyB0aGlzIGhvdXIsIHdpbGwgcmVzZXQgaW4gJHtyZXNldH0gbWludXRlcy5gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtjaGFsay5yZWQuYm9sZChgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9OmApfSAke2NoYWxrLnJlZChlcnJvcil9YClcbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKGBSZWFjaGVkIHRoaXMgaG91cidzIHVzYWdlIGxpbWl0IG9mICR7Y29uZmlnLnJicmFpbi5kYXRlLmxpbWl0fS5gKSlcbiAgICBwcm9jZXNzLmV4aXQoMSlcbiAgfVxufVxuIl19