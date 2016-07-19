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

exports.command = 'phrase <word>';
exports.desc = 'Wordnik bi-gram phrases';
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
  limit: {
    alias: 'l',
    desc: 'Limit number of results',
    default: 5,
    type: 'number'
  },
  canon: {
    alias: 'c',
    desc: 'Use canonical',
    default: false,
    type: 'boolean'
  },
  weight: {
    alias: 'w',
    desc: 'Minimum weighted mutual info',
    default: 13,
    type: 'number'
  }
};
exports.handler = function (argv) {
  tools.checkConfig(CFILE);
  var config = noon.load(CFILE);
  var proceed = false;
  var stamp = new Date(config.wordnik.date.stamp);
  var now = new Date();
  var diff = moment(now).diff(stamp, 'minutes');
  var reset = 60 - diff;
  if (diff < 60) {
    config.wordnik.date.remain = config.wordnik.date.remain - 1;
    noon.save(CFILE, config);
  } else if (diff >= 60) {
    config.wordnik.date.stamp = moment().format();
    config.wordnik.date.remain = config.wordnik.date.limit;
    console.log(chalk.white('Reset API limit to ' + config.wordnik.date.limit + '/' + config.wordnik.date.interval + '.'));
    config.wordnik.date.remain = config.wordnik.date.remain - 1;
    noon.save(CFILE, config);
  }
  if (config.wordnik.date.remain === 0) {
    proceed = false;
  } else if (config.wordnik.date.remain < 0) {
    proceed = false;
    config.wordnik.date.remain = 0;
    noon.save(CFILE, config);
  } else {
    proceed = true;
  }
  if (proceed) {
    (function () {
      var userConfig = {
        phrase: {
          canon: argv.c,
          limit: argv.l,
          weight: argv.w
        }
      };
      if (config.merge) config = _.merge({}, config, userConfig);
      var theme = themes.loadTheme(config.theme);
      if (config.verbose) themes.labelDown('Wordnik', theme, null);
      var word = argv.word;
      var task = 'phrases';
      var prefix = 'http://api.wordnik.com:80/v4/word.json/';
      var apikey = process.env.WORDNIK;
      var uri = '' + prefix + word + '/' + task + '?';
      var pcont = [];
      pcont.push('useCanonical=' + argv.c + '&');
      pcont.push('limit=' + argv.l + '&');
      pcont.push('wlmi=' + argv.w + '&');
      pcont.push('api_key=' + apikey);
      var rest = pcont.join('');
      var url = '' + uri + rest;
      url = encodeURI(url);
      themes.labelDown('Bi-gram phrases', theme, null);
      var tofile = {
        type: 'phrase',
        source: 'http://www.wordnik.com',
        url: url
      };
      needle.get(url, function (error, response) {
        if (!error && response.statusCode === 200) {
          var list = response.body;
          for (var i = 0; i <= list.length - 1; i++) {
            var item = list[i];
            console.log(item.gram1 + ' ' + item.gram2);
            tofile[['agram' + i]] = item.gram1;
            tofile[['bgram' + i]] = item.gram2;
          }
          if (argv.o) tools.outFile(argv.o, argv.f, tofile);
          if (argv.s && config.merge) noon.save(CFILE, config);
          if (argv.s && !config.merge) console.err(chalk.red('Set option merge to true!'));
          console.log(config.wordnik.date.remain + '/' + config.wordnik.date.limit + ' requests remaining this hour, will reset in ' + reset + ' minutes.');
        } else {
          console.error(chalk.red.bold('HTTP ' + response.statusCode + ':') + ' ' + chalk.red(error));
        }
      });
    })();
  } else {
    console.error(chalk.red('Reached this hour\'s usage limit of ' + config.wordnik.date.limit + '.'));
    process.exit(1);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNtZHMvd29yZG5pa19jbWRzL3BocmFzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBTSxTQUFTLFFBQVEsY0FBUixDQUFmO0FBQ0EsSUFBTSxRQUFRLFFBQVEsYUFBUixDQUFkOztBQUVBLElBQU0sSUFBSSxRQUFRLFFBQVIsQ0FBVjtBQUNBLElBQU0sUUFBUSxRQUFRLE9BQVIsQ0FBZDtBQUNBLElBQU0sU0FBUyxRQUFRLFFBQVIsQ0FBZjtBQUNBLElBQU0sU0FBUyxRQUFRLFFBQVIsQ0FBZjtBQUNBLElBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBYjs7QUFFQSxJQUFNLFFBQVcsUUFBUSxHQUFSLENBQVksSUFBdkIscUJBQU47O0FBRUEsUUFBUSxPQUFSLEdBQWtCLGVBQWxCO0FBQ0EsUUFBUSxJQUFSLEdBQWUseUJBQWY7QUFDQSxRQUFRLE9BQVIsR0FBa0I7QUFDaEIsT0FBSztBQUNILFdBQU8sR0FESjtBQUVILFVBQU0sMENBRkg7QUFHSCxhQUFTLEVBSE47QUFJSCxVQUFNO0FBSkgsR0FEVztBQU9oQixTQUFPO0FBQ0wsV0FBTyxHQURGO0FBRUwsVUFBTSwyQkFGRDtBQUdMLGFBQVMsS0FISjtBQUlMLFVBQU07QUFKRCxHQVBTO0FBYWhCLFFBQU07QUFDSixXQUFPLEdBREg7QUFFSixVQUFNLDJCQUZGO0FBR0osYUFBUyxLQUhMO0FBSUosVUFBTTtBQUpGLEdBYlU7QUFtQmhCLFNBQU87QUFDTCxXQUFPLEdBREY7QUFFTCxVQUFNLHlCQUZEO0FBR0wsYUFBUyxDQUhKO0FBSUwsVUFBTTtBQUpELEdBbkJTO0FBeUJoQixTQUFPO0FBQ0wsV0FBTyxHQURGO0FBRUwsVUFBTSxlQUZEO0FBR0wsYUFBUyxLQUhKO0FBSUwsVUFBTTtBQUpELEdBekJTO0FBK0JoQixVQUFRO0FBQ04sV0FBTyxHQUREO0FBRU4sVUFBTSw4QkFGQTtBQUdOLGFBQVMsRUFISDtBQUlOLFVBQU07QUFKQTtBQS9CUSxDQUFsQjtBQXNDQSxRQUFRLE9B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LEtBQXRIO0FBQ0QsU0FaRCxNQVlPO0FBQ0wsa0JBQVEsS0FBUixDQUFpQixNQUFNLEdBQU4sQ0FBVSxJQUFWLFdBQXVCLFNBQVMsVUFBaEMsT0FBakIsU0FBbUUsTUFBTSxHQUFOLENBQVUsS0FBVixDQUFuRTtBQUNEO0FBQ0YsT0FoQkQ7QUE5Qlc7QUErQ1osR0EvQ0QsTUErQ087QUFDTCxZQUFRLEtBQVIsQ0FBYyxNQUFNLEdBQU4sMENBQWdELE9BQU8sT0FBUCxDQUFlLElBQWYsQ0FBb0IsS0FBcEUsT0FBZDtBQUNBLFlBQVEsSUFBUixDQUFhLENBQWI7QUFDRDtBQUNGLENBOUVEIiwiZmlsZSI6ImNtZHMvd29yZG5pa19jbWRzL3BocmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBtYXgtbGVuOjAgKi9cbmNvbnN0IHRoZW1lcyA9IHJlcXVpcmUoJy4uLy4uL3RoZW1lcycpXG5jb25zdCB0b29scyA9IHJlcXVpcmUoJy4uLy4uL3Rvb2xzJylcblxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5jb25zdCBuZWVkbGUgPSByZXF1aXJlKCduZWVkbGUnKVxuY29uc3Qgbm9vbiA9IHJlcXVpcmUoJ25vb24nKVxuXG5jb25zdCBDRklMRSA9IGAke3Byb2Nlc3MuZW52LkhPTUV9Ly5sZXhpbWF2ZW4ubm9vbmBcblxuZXhwb3J0cy5jb21tYW5kID0gJ3BocmFzZSA8d29yZD4nXG5leHBvcnRzLmRlc2MgPSAnV29yZG5payBiaS1ncmFtIHBocmFzZXMnXG5leHBvcnRzLmJ1aWxkZXIgPSB7XG4gIG91dDoge1xuICAgIGFsaWFzOiAnbycsXG4gICAgZGVzYzogJ1dyaXRlIGNzb24sIGpzb24sIG5vb24sIHBsaXN0LCB5YW1sLCB4bWwnLFxuICAgIGRlZmF1bHQ6ICcnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9LFxuICBmb3JjZToge1xuICAgIGFsaWFzOiAnZicsXG4gICAgZGVzYzogJ0ZvcmNlIG92ZXJ3cml0aW5nIG91dGZpbGUnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgc2F2ZToge1xuICAgIGFsaWFzOiAncycsXG4gICAgZGVzYzogJ1NhdmUgZmxhZ3MgdG8gY29uZmlnIGZpbGUnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgbGltaXQ6IHtcbiAgICBhbGlhczogJ2wnLFxuICAgIGRlc2M6ICdMaW1pdCBudW1iZXIgb2YgcmVzdWx0cycsXG4gICAgZGVmYXVsdDogNSxcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgfSxcbiAgY2Fub246IHtcbiAgICBhbGlhczogJ2MnLFxuICAgIGRlc2M6ICdVc2UgY2Fub25pY2FsJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gIH0sXG4gIHdlaWdodDoge1xuICAgIGFsaWFzOiAndycsXG4gICAgZGVzYzogJ01pbmltdW0gd2VpZ2h0ZWQgbXV0dWFsIGluZm8nLFxuICAgIGRlZmF1bHQ6IDEzLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICB9LFxufVxuZXhwb3J0cy5oYW5kbGVyID0gKGFyZ3YpID0+IHtcbiAgdG9vbHMuY2hlY2tDb25maWcoQ0ZJTEUpXG4gIGxldCBjb25maWcgPSBub29uLmxvYWQoQ0ZJTEUpXG4gIGxldCBwcm9jZWVkID0gZmFsc2VcbiAgY29uc3Qgc3RhbXAgPSBuZXcgRGF0ZShjb25maWcud29yZG5pay5kYXRlLnN0YW1wKVxuICBjb25zdCBub3cgPSBuZXcgRGF0ZVxuICBjb25zdCBkaWZmID0gbW9tZW50KG5vdykuZGlmZihzdGFtcCwgJ21pbnV0ZXMnKVxuICBjb25zdCByZXNldCA9IDYwIC0gZGlmZlxuICBpZiAoZGlmZiA8IDYwKSB7XG4gICAgY29uZmlnLndvcmRuaWsuZGF0ZS5yZW1haW4gPSBjb25maWcud29yZG5pay5kYXRlLnJlbWFpbiAtIDFcbiAgICBub29uLnNhdmUoQ0ZJTEUsIGNvbmZpZylcbiAgfSBlbHNlIGlmIChkaWZmID49IDYwKSB7XG4gICAgY29uZmlnLndvcmRuaWsuZGF0ZS5zdGFtcCA9IG1vbWVudCgpLmZvcm1hdCgpXG4gICAgY29uZmlnLndvcmRuaWsuZGF0ZS5yZW1haW4gPSBjb25maWcud29yZG5pay5kYXRlLmxpbWl0XG4gICAgY29uc29sZS5sb2coY2hhbGsud2hpdGUoYFJlc2V0IEFQSSBsaW1pdCB0byAke2NvbmZpZy53b3JkbmlrLmRhdGUubGltaXR9LyR7Y29uZmlnLndvcmRuaWsuZGF0ZS5pbnRlcnZhbH0uYCkpXG4gICAgY29uZmlnLndvcmRuaWsuZGF0ZS5yZW1haW4gPSBjb25maWcud29yZG5pay5kYXRlLnJlbWFpbiAtIDFcbiAgICBub29uLnNhdmUoQ0ZJTEUsIGNvbmZpZylcbiAgfVxuICBpZiAoY29uZmlnLndvcmRuaWsuZGF0ZS5yZW1haW4gPT09IDApIHtcbiAgICBwcm9jZWVkID0gZmFsc2VcbiAgfSBlbHNlIGlmIChjb25maWcud29yZG5pay5kYXRlLnJlbWFpbiA8IDApIHtcbiAgICBwcm9jZWVkID0gZmFsc2VcbiAgICBjb25maWcud29yZG5pay5kYXRlLnJlbWFpbiA9IDBcbiAgICBub29uLnNhdmUoQ0ZJTEUsIGNvbmZpZylcbiAgfSBlbHNlIHtcbiAgICBwcm9jZWVkID0gdHJ1ZVxuICB9XG4gIGlmIChwcm9jZWVkKSB7XG4gICAgY29uc3QgdXNlckNvbmZpZyA9IHtcbiAgICAgIHBocmFzZToge1xuICAgICAgICBjYW5vbjogYXJndi5jLFxuICAgICAgICBsaW1pdDogYXJndi5sLFxuICAgICAgICB3ZWlnaHQ6IGFyZ3YudyxcbiAgICAgIH0sXG4gICAgfVxuICAgIGlmIChjb25maWcubWVyZ2UpIGNvbmZpZyA9IF8ubWVyZ2Uoe30sIGNvbmZpZywgdXNlckNvbmZpZylcbiAgICBjb25zdCB0aGVtZSA9IHRoZW1lcy5sb2FkVGhlbWUoY29uZmlnLnRoZW1lKVxuICAgIGlmIChjb25maWcudmVyYm9zZSkgdGhlbWVzLmxhYmVsRG93bignV29yZG5paycsIHRoZW1lLCBudWxsKVxuICAgIGNvbnN0IHdvcmQgPSBhcmd2LndvcmRcbiAgICBjb25zdCB0YXNrID0gJ3BocmFzZXMnXG4gICAgY29uc3QgcHJlZml4ID0gJ2h0dHA6Ly9hcGkud29yZG5pay5jb206ODAvdjQvd29yZC5qc29uLydcbiAgICBjb25zdCBhcGlrZXkgPSBwcm9jZXNzLmVudi5XT1JETklLXG4gICAgY29uc3QgdXJpID0gYCR7cHJlZml4fSR7d29yZH0vJHt0YXNrfT9gXG4gICAgY29uc3QgcGNvbnQgPSBbXVxuICAgIHBjb250LnB1c2goYHVzZUNhbm9uaWNhbD0ke2FyZ3YuY30mYClcbiAgICBwY29udC5wdXNoKGBsaW1pdD0ke2FyZ3YubH0mYClcbiAgICBwY29udC5wdXNoKGB3bG1pPSR7YXJndi53fSZgKVxuICAgIHBjb250LnB1c2goYGFwaV9rZXk9JHthcGlrZXl9YClcbiAgICBjb25zdCByZXN0ID0gcGNvbnQuam9pbignJylcbiAgICBsZXQgdXJsID0gYCR7dXJpfSR7cmVzdH1gXG4gICAgdXJsID0gZW5jb2RlVVJJKHVybClcbiAgICB0aGVtZXMubGFiZWxEb3duKCdCaS1ncmFtIHBocmFzZXMnLCB0aGVtZSwgbnVsbClcbiAgICBjb25zdCB0b2ZpbGUgPSB7XG4gICAgICB0eXBlOiAncGhyYXNlJyxcbiAgICAgIHNvdXJjZTogJ2h0dHA6Ly93d3cud29yZG5pay5jb20nLFxuICAgICAgdXJsLFxuICAgIH1cbiAgICBuZWVkbGUuZ2V0KHVybCwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCFlcnJvciAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHJlc3BvbnNlLmJvZHlcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbGlzdC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gbGlzdFtpXVxuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2l0ZW0uZ3JhbTF9ICR7aXRlbS5ncmFtMn1gKVxuICAgICAgICAgIHRvZmlsZVtbYGFncmFtJHtpfWBdXSA9IGl0ZW0uZ3JhbTFcbiAgICAgICAgICB0b2ZpbGVbW2BiZ3JhbSR7aX1gXV0gPSBpdGVtLmdyYW0yXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3YubykgdG9vbHMub3V0RmlsZShhcmd2Lm8sIGFyZ3YuZiwgdG9maWxlKVxuICAgICAgICBpZiAoYXJndi5zICYmIGNvbmZpZy5tZXJnZSkgbm9vbi5zYXZlKENGSUxFLCBjb25maWcpXG4gICAgICAgIGlmIChhcmd2LnMgJiYgIWNvbmZpZy5tZXJnZSkgY29uc29sZS5lcnIoY2hhbGsucmVkKCdTZXQgb3B0aW9uIG1lcmdlIHRvIHRydWUhJykpXG4gICAgICAgIGNvbnNvbGUubG9nKGAke2NvbmZpZy53b3JkbmlrLmRhdGUucmVtYWlufS8ke2NvbmZpZy53b3JkbmlrLmRhdGUubGltaXR9IHJlcXVlc3RzIHJlbWFpbmluZyB0aGlzIGhvdXIsIHdpbGwgcmVzZXQgaW4gJHtyZXNldH0gbWludXRlcy5gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtjaGFsay5yZWQuYm9sZChgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9OmApfSAke2NoYWxrLnJlZChlcnJvcil9YClcbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKGBSZWFjaGVkIHRoaXMgaG91cidzIHVzYWdlIGxpbWl0IG9mICR7Y29uZmlnLndvcmRuaWsuZGF0ZS5saW1pdH0uYCkpXG4gICAgcHJvY2Vzcy5leGl0KDEpXG4gIH1cbn1cbiJdfQ==