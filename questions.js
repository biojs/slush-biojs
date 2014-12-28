var _ = require('underscore');
var path = require('path');
var rc = require("rc");

module.exports.getKeys = function(){
  var prompts = prompts || module.exports.getPrompts();
  return _.pluck(prompts, "name");
};

module.exports.getPrompts = function(prev, opts){
  prev = prev || {};
  opts = opts || {};
  conf = rc("slush-biojs", {
    appDescription: '',
    appVersion: '0.1.0',
    authorName: opts.fullname || opts.username || "",
    authorEmail: opts.email || "",
    userName: opts.username,
    gulp: false,
    phantomjs: false,
    vis: true,
    tests: true,
    jshint: false,
    license: "Apache 2"
  });

  var prompts = [{
      name: 'appName',
      message: 'Module name? (required)',
      default: function() {
        return prev.appName || path.basename(process.cwd());
      }
    }, {
      name: 'appDescription',
      message: 'Description?',
      default: function() {
        return prev.appDescription || conf.appDescription;
      }
    }, {
      name: 'appVersion',
      message: 'Module version?',
      default: function() {
        return prev.appVersion || conf.appVersion;
      }
    }, {
      name: 'authorName',
      message: 'Author name?',
      default: function() {
        return prev.authorName || conf.authorName;
      }
    }, {
      name: 'authorEmail',
      message: 'Author email?',
      default: function() {
        return prev.authorEmail || conf.authorEmail;
      }
    }, {
      name: 'userName',
      message: 'Github username?',
      default: function(answers) {
        return prev.userName || conf.userName || answers.name;
      }
    }, {
      name: 'keywords',
      message: 'Keywords for npm (separate with comma)',
      default: function() {
        return prev.keywords || '';
      }
    }, {
      name: 'vis',
      type: "confirm",
      message: 'A visualization lib?',
      default: function() {
        if( prev.vis !== undefined) return prev.vis;
        return conf.vis;
      }
    }, {
      name: 'tests',
      type: "confirm",
      message: 'Unit tests',
      default: function() {
        if( prev.test !== undefined) return prev.test;
        return conf.tests;
      }
    }, {
       name: 'gulp',
      type: "confirm",
      message: 'Configure a build system? (recommended)',
      default: function() {
        if( prev.gulp !== undefined) return prev.gulp;
        return conf.gulp;
      }
    }, {
    name: 'phantomjs',
      type: "confirm",
      message: 'UI tests with PhantomJS (headless browser)',
      default: function() {
        if( prev.phantomjs !== undefined) return prev.phantomjs;
        return conf.phantomjs;
      },
      when: function(answers) {
        return (answers.vis && answers.tests && answers.gulp);
      }
    }, {
      name: 'jshint',
      type: "confirm",
      message: 'Linting (Check code style with JSHint)',
      default: function() {
        if( prev.jshint !== undefined) return prev.jshint;
        return conf.jshint;
      },
    },
    /*{
         name: 'coverage',
         type: "confirm",
         default: true,
         message: 'Check code coverage?',
        },*/
    {
      type: 'list',
      name: 'license',
      message: 'Choose your license type',
      choices: ['Apache 2', 'MIT', 'BSD'],
      default: function() {
        return prev.license || conf.license;
      }
    }, {
      type: 'confirm',
      name: 'moveon',
      default: true,
      message: 'Is this correct?'
    }
  ];

  return prompts;
};
