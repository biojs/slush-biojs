/*
 * slush-biojs-io
 */

var gulp = require('gulp'),
  _ = require('underscore'),
  fullnameTask = require('fullname'),
  usernameTask = require('username');

var inquirer = require("./inquirer.js");
var questions = require("./questions.js");

var exec = require('child_process').exec;

gulp.task('default', function(done) {
  // set handy defaults

  var opts = {};
  opts.fullname = "";
  opts.email = "";
  opts.username = "";

  usernameTask(function(err, name) {
    opts.username = name;
  });
  fullnameTask(function(err, name) {
    opts.fullname = name;
  });
  exec('git config --global user.email', function(err, stdout) {
    opts.email = stdout.trim();
  });

  var prev = {};
  var prompts = questions.getPrompts(prev, opts);
  var repeater = function(answers, repeat) {
    prev = _.pick(answers, questions.getKeys(prompts));
    prompts = questions.getPrompts(prev, opts);
    if (repeat) {
      inquirer.ask(prompts, repeater);
    } else {
      done();
      // TODO: save some answers as default
    }
  };
  inquirer.ask(prompts, repeater);
});
