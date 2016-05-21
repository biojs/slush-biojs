/*
 * slush-biojs-io
 */

var gulp = require('gulp'),
  _ = require('underscore'),
  fullnameTask = require('fullname'),
  usernameTask = require('username');
var colors = require('colors');

var show = function() {
  console.log.apply(console, arguments);
};


var inquirer = require("./inquirer.js");
var questions = require("./questions.js");


var exec = require('child_process').exec;

gulp.task('default', function(done) {
  // set handy defaults

  var opts = {};
  opts.fullname = "";
  opts.email = "";
  opts.username = "";

  npmURL = "https://registry.npmjs.org/" + require("./package.json").name + "/latest";
  var pkgVersion = require("./package.json").version;
  var http = require('client-http');

  // check whether slush-biojs is up-to-date
  show("Checking you are using the latest slush-biojs...");
  http.get(npmURL, function(data) {
    if (typeof data == "undefined" || data==null || data.search("version")==-1) {
      show("We could'n check if there is a new version of slush-biojs".red);
      show(("We will continue using the currently installed version ["+pkgVersion+"]").red);
    } else {
      var pkg = JSON.parse(data);
      var currentVersion = pkg.version;
      if (currentVersion != pkgVersion) {
        show("YOUR slush-biojs version is OUTDATED ".red + "(current: " + currentVersion + ", installed: " + pkgVersion + ")");
        show("PLEASE UPDATE slush-biojs".red);
        show("RUN: npm install -g slush-biojs");
        process.exit(1);
      } else {
        show(("We will use the currently installed version ["+pkgVersion+"]").red);
      }
    }
    execute_tasks();
  });


  var execute_tasks = function() {
    usernameTask(function(err, name) {
      opts.username = name;
    });
    fullnameTask(function(err, name) {
      opts.fullname = name;
    });
    exec('git config --global user.email', function(err, stdout) {
      opts.email = stdout.trim();
    });

    exec('npm -v ', function(err, stdout) {
      var parts = stdout.split(".");
      if (parts[0] < 2) {
        console.log();
        console.log("Your npm version is outdated. Please update");
        console.log("https://nodejs.org/en/download/");
        process.exit(1);
      }
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
  };
});
