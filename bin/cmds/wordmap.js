'use strict';

var themes = require('../themes');
var tools = require('../tools');

var _ = require('lodash');
var child = require('child_process');
var noon = require('noon');

var CFILE = process.env.HOME + '/.leximaven.noon';

exports.command = 'map <word>';
exports.desc = 'Maps of word info';
exports.builder = {
  limit: {
    alias: 'l',
    desc: 'Limits the number of results',
    default: 1,
    type: 'number'
  },
  save: {
    alias: 's',
    desc: 'Save flags to config file',
    default: false,
    type: 'boolean'
  }
};
exports.handler = function (argv) {
  tools.checkConfig(CFILE);
  var config = noon.load(CFILE);
  var userConfig = {
    wordmap: {
      limit: argv.l
    }
  };
  if (config.merge) config = _.merge({}, config, userConfig);
  if (argv.s && config.merge) noon.save(CFILE, config);
  if (argv.s && !config.merge) throw new Error("Can't save user config, set option merge to true.");
  var theme = themes.loadTheme(config.theme);
  if (config.verbose) themes.label(theme, 'down', 'Wordmap');
  var word = argv.word;
  var l = argv.l;
  var bin = process.cwd() + '/bin/leximaven.js';
  child.spawnSync('node', [bin, 'rbrain', 'combine', '-m' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'rbrain', 'info', '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'rbrain', 'rhyme', '-m' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'define', '-l' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'example', '-l' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'hyphen', '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'origin', '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'phrase', '-l' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'pronounce', '-l' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'wordnik', 'relate', '-l' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'acronym', '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'dmuse', '-m' + l, 'ml=' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'onelook', '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'urban', '-l' + l, '' + word], { stdio: 'inherit' });
  child.spawnSync('node', [bin, 'anagram', '-t' + l, '' + word], { stdio: 'inherit' });
};