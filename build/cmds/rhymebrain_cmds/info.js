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

exports.command = 'info <word>';
exports.desc = 'Rhymebrain word info';
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
        info: {
          lang: argv.l,
          max: argv.m
        }
      };
      if (config.merge) config = _.merge({}, config, userConfig);
      var theme = themes.loadTheme(config.theme);
      if (config.verbose) themes.labelDown('Rhymebrain', theme, null);
      var word = argv.word;
      var task = 'WordInfo';
      var prefix = 'http://rhymebrain.com/talk?function=get';
      var uri = '' + prefix + task + '&word=' + word + '&';
      var pcont = [];
      pcont.push('lang=' + config.rbrain.info.lang + '&');
      pcont.push('maxResults=' + config.rbrain.info.max + '&');
      var rest = pcont.join('');
      var url = '' + uri + rest;
      url = encodeURI(url);
      themes.labelDown('Word Info', theme, null);
      var tofile = {
        type: 'word info',
        source: 'http://rhymebrain.com',
        url: url
      };
      var ctstyle = _.get(chalk, theme.content.style);
      needle.get(url, function (error, response) {
        if (!error && response.statusCode === 200) {
          var info = response.body;
          themes.labelRight('Arpabet', theme, info.pron);
          themes.labelRight('IPA', theme, info.ipa);
          themes.labelRight('Syllables', theme, info.syllables);
          tofile.arpabet = info.pron;
          tofile.ipa = info.ipa;
          tofile.syllables = info.syllables;
          var flags = [];
          if (info.flags.match(/a/)) {
            flags.push(ctstyle('[' + chalk.red.bold('Offensive') + ']'));
            tofile.offensive = true;
          }
          if (info.flags.match(/b/)) {
            flags.push(ctstyle('[Found in dictionary]'));
            tofile.dict = true;
          }
          if (info.flags.match(/c/)) {
            flags.push(ctstyle('[Trusted pronunciation, not generated]'));
            tofile.trusted = true;
          }
          themes.labelRight('Word Flags', theme, flags.join(''));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNtZHMvcmh5bWVicmFpbl9jbWRzL2luZm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQU0sU0FBUyxRQUFRLGNBQVIsQ0FBZjtBQUNBLElBQU0sUUFBUSxRQUFRLGFBQVIsQ0FBZDs7QUFFQSxJQUFNLElBQUksUUFBUSxRQUFSLENBQVY7QUFDQSxJQUFNLFFBQVEsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNLFNBQVMsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNLFNBQVMsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNLE9BQU8sUUFBUSxNQUFSLENBQWI7O0FBRUEsSUFBTSxRQUFXLFFBQVEsR0FBUixDQUFZLElBQXZCLHFCQUFOOztBQUVBLFFBQVEsT0FBUixHQUFrQixhQUFsQjtBQUNBLFFBQVEsSUFBUixHQUFlLHNCQUFmO0FBQ0EsUUFBUSxPQUFSLEdBQWtCO0FBQ2hCLE9BQUs7QUFDSCxXQUFPLEdBREo7QUFFSCxVQUFNLDBDQUZIO0FBR0gsYUFBUyxFQUhOO0FBSUgsVUFBTTtBQUpILEdBRFc7QUFPaEIsU0FBTztBQUNMLFdBQU8sR0FERjtBQUVMLFVBQU0sMkJBRkQ7QUFHTCxhQUFTLEtBSEo7QUFJTCxVQUFNO0FBSkQsR0FQUztBQWFoQixRQUFNO0FBQ0osV0FBTyxHQURIO0FBRUosVUFBTSwyQkFGRjtBQUdKLGFBQVMsS0FITDtBQUlKLFVBQU07QUFKRixHQWJVO0FBbUJoQixRQUFNO0FBQ0osV0FBTyxHQURIO0FBRUosVUFBTSx5QkFGRjtBQUdKLGFBQVMsSUFITDtBQUlKLFVBQU07QUFKRjtBQW5CVSxDQUFsQjtBQTBCQSxRQUFRLE9BQVIsR0FBa0IsVUFBQyxJQUFELEVBQVU7QUFDMUIsUUFBTSxXQUFOLENBQWtCLEtBQWxCO0FBQ0EsTUFBSSxTQUFTLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBYjtBQUNBLE1BQUksVUFBVSxLQUFkO0FBQ0EsTUFBTSxRQUFRLElBQUksSUFBSixDQUFTLE9BQU8sTUFBUCxDQUFj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Q0FBdkM7QUFDQSxjQUFJLEtBQUssQ0FBVCxFQUFZLE1BQU0sT0FBTixDQUFjLEtBQUssQ0FBbkIsRUFBc0IsS0FBSyxDQUEzQixFQUE4QixNQUE5QjtBQUNaLGNBQUksS0FBSyxDQUFMLElBQVUsT0FBTyxLQUFyQixFQUE0QixLQUFLLElBQUwsQ0FBVSxLQUFWLEVBQWlCLE1BQWpCO0FBQzVCLGNBQUksS0FBSyxDQUFMLElBQVUsQ0FBQyxPQUFPLEtBQXRCLEVBQTZCLFFBQVEsR0FBUixDQUFZLE1BQU0sR0FBTixDQUFVLDJCQUFWLENBQVo7QUFDN0Isa0JBQVEsR0FBUixDQUFlLE9BQU8sTUFBUCxDQUFjLElBQWQsQ0FBbUIsTUFBbEMsU0FBNEMsT0FBTyxNQUFQLENBQWMsSUFBZCxDQUFtQixLQUEvRCxxREFBb0gsS0FBcEg7QUFDRCxTQTFCRCxNQTBCTztBQUNMLGtCQUFRLEtBQVIsQ0FBaUIsTUFBTSxHQUFOLENBQVUsSUFBVixXQUF1QixTQUFTLFVBQWhDLE9BQWpCLFNBQW1FLE1BQU0sR0FBTixDQUFVLEtBQVYsQ0FBbkU7QUFDRDtBQUNGLE9BOUJEO0FBM0JXO0FBMERaLEdBMURELE1BMERPO0FBQ0wsWUFBUSxLQUFSLENBQWMsTUFBTSxHQUFOLDBDQUFnRCxPQUFPLE1BQVAsQ0FBYyxJQUFkLENBQW1CLEtBQW5FLE9BQWQ7QUFDQSxZQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0Q7QUFDRixDQXpGRCIsImZpbGUiOiJjbWRzL3JoeW1lYnJhaW5fY21kcy9pbmZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50IG1heC1sZW46MCAqL1xuY29uc3QgdGhlbWVzID0gcmVxdWlyZSgnLi4vLi4vdGhlbWVzJylcbmNvbnN0IHRvb2xzID0gcmVxdWlyZSgnLi4vLi4vdG9vbHMnKVxuXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcbmNvbnN0IGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcbmNvbnN0IG5lZWRsZSA9IHJlcXVpcmUoJ25lZWRsZScpXG5jb25zdCBub29uID0gcmVxdWlyZSgnbm9vbicpXG5cbmNvbnN0IENGSUxFID0gYCR7cHJvY2Vzcy5lbnYuSE9NRX0vLmxleGltYXZlbi5ub29uYFxuXG5leHBvcnRzLmNvbW1hbmQgPSAnaW5mbyA8d29yZD4nXG5leHBvcnRzLmRlc2MgPSAnUmh5bWVicmFpbiB3b3JkIGluZm8nXG5leHBvcnRzLmJ1aWxkZXIgPSB7XG4gIG91dDoge1xuICAgIGFsaWFzOiAnbycsXG4gICAgZGVzYzogJ1dyaXRlIGNzb24sIGpzb24sIG5vb24sIHBsaXN0LCB5YW1sLCB4bWwnLFxuICAgIGRlZmF1bHQ6ICcnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9LFxuICBmb3JjZToge1xuICAgIGFsaWFzOiAnZicsXG4gICAgZGVzYzogJ0ZvcmNlIG92ZXJ3cml0aW5nIG91dGZpbGUnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgc2F2ZToge1xuICAgIGFsaWFzOiAncycsXG4gICAgZGVzYzogJ1NhdmUgZmxhZ3MgdG8gY29uZmlnIGZpbGUnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgbGFuZzoge1xuICAgIGFsaWFzOiAnbCcsXG4gICAgZGVzYzogJ0lTTyA2MzktMSBsYW5ndWFnZSBjb2RlJyxcbiAgICBkZWZhdWx0OiAnZW4nLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9LFxufVxuZXhwb3J0cy5oYW5kbGVyID0gKGFyZ3YpID0+IHtcbiAgdG9vbHMuY2hlY2tDb25maWcoQ0ZJTEUpXG4gIGxldCBjb25maWcgPSBub29uLmxvYWQoQ0ZJTEUpXG4gIGxldCBwcm9jZWVkID0gZmFsc2VcbiAgY29uc3Qgc3RhbXAgPSBuZXcgRGF0ZShjb25maWcucmJyYWluLmRhdGUuc3RhbXApXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlXG4gIGNvbnN0IGRpZmYgPSBtb21lbnQobm93KS5kaWZmKHN0YW1wLCAnbWludXRlcycpXG4gIGNvbnN0IHJlc2V0ID0gNjAgLSBkaWZmXG4gIGlmIChkaWZmIDwgNjApIHtcbiAgICBjb25maWcucmJyYWluLmRhdGUucmVtYWluID0gY29uZmlnLnJicmFpbi5kYXRlLnJlbWFpbiAtIDFcbiAgICBub29uLnNhdmUoQ0ZJTEUsIGNvbmZpZylcbiAgfSBlbHNlIGlmIChkaWZmID49IDYwKSB7XG4gICAgY29uZmlnLnJicmFpbi5kYXRlLnN0YW1wID0gbW9tZW50KCkuZm9ybWF0KClcbiAgICBjb25maWcucmJyYWluLmRhdGUucmVtYWluID0gY29uZmlnLnJicmFpbi5kYXRlLmxpbWl0XG4gICAgY29uc29sZS5sb2coY2hhbGsud2hpdGUoYFJlc2V0IEFQSSBsaW1pdCB0byAke2NvbmZpZy5yYnJhaW4uZGF0ZS5saW1pdH0vJHtjb25maWcucmJyYWluLmRhdGUuaW50ZXJ2YWx9LmApKVxuICAgIGNvbmZpZy5yYnJhaW4uZGF0ZS5yZW1haW4gPSBjb25maWcucmJyYWluLmRhdGUucmVtYWluIC0gMVxuICAgIG5vb24uc2F2ZShDRklMRSwgY29uZmlnKVxuICB9XG4gIGlmIChjb25maWcucmJyYWluLmRhdGUucmVtYWluID09PSAwKSB7XG4gICAgcHJvY2VlZCA9IGZhbHNlXG4gIH0gZWxzZSBpZiAoY29uZmlnLnJicmFpbi5kYXRlLnJlbWFpbiA8IDApIHtcbiAgICBwcm9jZWVkID0gZmFsc2VcbiAgICBjb25maWcucmJyYWluLmRhdGUucmVtYWluID0gMFxuICAgIG5vb24uc2F2ZShDRklMRSwgY29uZmlnKVxuICB9IGVsc2Uge1xuICAgIHByb2NlZWQgPSB0cnVlXG4gIH1cbiAgaWYgKHByb2NlZWQpIHtcbiAgICBjb25zdCB1c2VyQ29uZmlnID0ge1xuICAgICAgaW5mbzoge1xuICAgICAgICBsYW5nOiBhcmd2LmwsXG4gICAgICAgIG1heDogYXJndi5tLFxuICAgICAgfSxcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5tZXJnZSkgY29uZmlnID0gXy5tZXJnZSh7fSwgY29uZmlnLCB1c2VyQ29uZmlnKVxuICAgIGNvbnN0IHRoZW1lID0gdGhlbWVzLmxvYWRUaGVtZShjb25maWcudGhlbWUpXG4gICAgaWYgKGNvbmZpZy52ZXJib3NlKSB0aGVtZXMubGFiZWxEb3duKCdSaHltZWJyYWluJywgdGhlbWUsIG51bGwpXG4gICAgY29uc3Qgd29yZCA9IGFyZ3Yud29yZFxuICAgIGNvbnN0IHRhc2sgPSAnV29yZEluZm8nXG4gICAgY29uc3QgcHJlZml4ID0gJ2h0dHA6Ly9yaHltZWJyYWluLmNvbS90YWxrP2Z1bmN0aW9uPWdldCdcbiAgICBjb25zdCB1cmkgPSBgJHtwcmVmaXh9JHt0YXNrfSZ3b3JkPSR7d29yZH0mYFxuICAgIGNvbnN0IHBjb250ID0gW11cbiAgICBwY29udC5wdXNoKGBsYW5nPSR7Y29uZmlnLnJicmFpbi5pbmZvLmxhbmd9JmApXG4gICAgcGNvbnQucHVzaChgbWF4UmVzdWx0cz0ke2NvbmZpZy5yYnJhaW4uaW5mby5tYXh9JmApXG4gICAgY29uc3QgcmVzdCA9IHBjb250LmpvaW4oJycpXG4gICAgbGV0IHVybCA9IGAke3VyaX0ke3Jlc3R9YFxuICAgIHVybCA9IGVuY29kZVVSSSh1cmwpXG4gICAgdGhlbWVzLmxhYmVsRG93bignV29yZCBJbmZvJywgdGhlbWUsIG51bGwpXG4gICAgY29uc3QgdG9maWxlID0ge1xuICAgICAgdHlwZTogJ3dvcmQgaW5mbycsXG4gICAgICBzb3VyY2U6ICdodHRwOi8vcmh5bWVicmFpbi5jb20nLFxuICAgICAgdXJsLFxuICAgIH1cbiAgICBjb25zdCBjdHN0eWxlID0gXy5nZXQoY2hhbGssIHRoZW1lLmNvbnRlbnQuc3R5bGUpXG4gICAgbmVlZGxlLmdldCh1cmwsIChlcnJvciwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSByZXNwb25zZS5ib2R5XG4gICAgICAgIHRoZW1lcy5sYWJlbFJpZ2h0KCdBcnBhYmV0JywgdGhlbWUsIGluZm8ucHJvbilcbiAgICAgICAgdGhlbWVzLmxhYmVsUmlnaHQoJ0lQQScsIHRoZW1lLCBpbmZvLmlwYSlcbiAgICAgICAgdGhlbWVzLmxhYmVsUmlnaHQoJ1N5bGxhYmxlcycsIHRoZW1lLCBpbmZvLnN5bGxhYmxlcylcbiAgICAgICAgdG9maWxlLmFycGFiZXQgPSBpbmZvLnByb25cbiAgICAgICAgdG9maWxlLmlwYSA9IGluZm8uaXBhXG4gICAgICAgIHRvZmlsZS5zeWxsYWJsZXMgPSBpbmZvLnN5bGxhYmxlc1xuICAgICAgICBjb25zdCBmbGFncyA9IFtdXG4gICAgICAgIGlmIChpbmZvLmZsYWdzLm1hdGNoKC9hLykpIHtcbiAgICAgICAgICBmbGFncy5wdXNoKGN0c3R5bGUoYFske2NoYWxrLnJlZC5ib2xkKCdPZmZlbnNpdmUnKX1dYCkpXG4gICAgICAgICAgdG9maWxlLm9mZmVuc2l2ZSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5mbGFncy5tYXRjaCgvYi8pKSB7XG4gICAgICAgICAgZmxhZ3MucHVzaChjdHN0eWxlKCdbRm91bmQgaW4gZGljdGlvbmFyeV0nKSlcbiAgICAgICAgICB0b2ZpbGUuZGljdCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5mbGFncy5tYXRjaCgvYy8pKSB7XG4gICAgICAgICAgZmxhZ3MucHVzaChjdHN0eWxlKCdbVHJ1c3RlZCBwcm9udW5jaWF0aW9uLCBub3QgZ2VuZXJhdGVkXScpKVxuICAgICAgICAgIHRvZmlsZS50cnVzdGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHRoZW1lcy5sYWJlbFJpZ2h0KCdXb3JkIEZsYWdzJywgdGhlbWUsIGZsYWdzLmpvaW4oJycpKVxuICAgICAgICBpZiAoYXJndi5vKSB0b29scy5vdXRGaWxlKGFyZ3YubywgYXJndi5mLCB0b2ZpbGUpXG4gICAgICAgIGlmIChhcmd2LnMgJiYgY29uZmlnLm1lcmdlKSBub29uLnNhdmUoQ0ZJTEUsIGNvbmZpZylcbiAgICAgICAgaWYgKGFyZ3YucyAmJiAhY29uZmlnLm1lcmdlKSBjb25zb2xlLmVycihjaGFsay5yZWQoJ1NldCBvcHRpb24gbWVyZ2UgdG8gdHJ1ZSEnKSlcbiAgICAgICAgY29uc29sZS5sb2coYCR7Y29uZmlnLnJicmFpbi5kYXRlLnJlbWFpbn0vJHtjb25maWcucmJyYWluLmRhdGUubGltaXR9IHJlcXVlc3RzIHJlbWFpbmluZyB0aGlzIGhvdXIsIHdpbGwgcmVzZXQgaW4gJHtyZXNldH0gbWludXRlcy5gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtjaGFsay5yZWQuYm9sZChgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9OmApfSAke2NoYWxrLnJlZChlcnJvcil9YClcbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKGBSZWFjaGVkIHRoaXMgaG91cidzIHVzYWdlIGxpbWl0IG9mICR7Y29uZmlnLnJicmFpbi5kYXRlLmxpbWl0fS5gKSlcbiAgICBwcm9jZXNzLmV4aXQoMSlcbiAgfVxufVxuIl19