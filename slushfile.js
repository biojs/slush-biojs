/*
 * slush-biojs-io
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    str = require('underscore.string'),
    inquirer = require('inquirer'),
    username = require('username'),
    _ = require('underscore'),
    fullnameTask = require('fullname');

var exec = require('child_process').exec;

// set handy defaults

var fullname = "";
var email = "";
var username = "";
fullnameTask(function(err,name){
    fullname = name;
});
exec('git config --global user.email', function (err, stdout) {
			email = stdout.trim();
});

gulp.task('default', function(done) {
    var prompts = [{
        name: 'appName',
        message: 'Module name? (required)'
    }, {
        name: 'appDescription',
        message: 'Description?'
    }, {
        name: 'appVersion',
        message: 'Module version?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'Author name?',
        default: function(){
          return fullname || username || "";
        }
    }, {
        name: 'authorEmail',
        message: 'Author email?',
        default: function(){
          return email || "";
        }
    }, {
        name: 'userName',
        message: 'Github username?',
        default: function(answers){
          return answers.name;
        }
    }, {
        name: 'keywords',
        message: 'Keywords for npm (separate with comma)',
    }, {
      name: 'vis',
      type: "confirm",
      default: true,
      message: 'A visualization lib?',
  }, {
      name: 'gulp',
      type: "confirm",
      default: false,
      message: 'Configure a build system? (recommended)',
   }, {
      name: 'tests',
      type: "confirm",
      default: true,
      message: 'Unit tests',
      when: function(answers){
          return !!answers.gulp;
        }
   }, {
      name: 'phantomjs',
      type: "confirm",
      default: false,
      message: 'UI tests with PhantomJS (headless browser)',
      when: function(answers){
        return (answers.vis && answers.tests && answers.gulp);
      }
    }, {
      name: 'jshint',
      type: "confirm",
      default: true,
      message: 'Linting (Check code style with JSHint)',
      when: function(answers){
        return answers.gulp;
      }
    }, /*{
     name: 'coverage',
     type: "confirm",
     default: true,
     message: 'Check code coverage?',
    },*/ {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['Apache 2','MIT', 'BSD'],
        default: 'Apache 2'
    },{
        type: 'confirm',
        name: 'moveon',
        default: true,
        message: 'Is this correct?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function(answers) {
            if (!answers.appName) {
              // empty space so that everyone can see this error msg
                console.log();
                console.warn("WARNING: you must enter a package name. try it again ;-)");
                console.log();
                return done();
            }
            if (!answers.moveon) {
                return done();
            }

            // defaults
            answers.tests = answers.tests || false;

            answers.appNameSlug = str.slugify(answers.appName)
            // some chars are not valid chars for a variable
            answers.appNameVar = answers.appNameSlug.split("-").join("");
            answers.appNameVar = answers.appNameVar.split("_").join("");

            var d = new Date();
            answers.year = d.getFullYear();
            answers.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
            var files = [__dirname + '/templates/**'];
            if (answers.license === 'MIT') {
                files.push('!' + __dirname + '/templates/LICENSE_BSD');
                files.push('!' + __dirname + '/templates/LICENSE_APACHE');
            }else if (answers.license === 'Apache 2') {
                files.push('!' + __dirname + '/templates/LICENSE_BSD');
                files.push('!' + __dirname + '/templates/LICENSE_MIT');
            } else {
                files.push('!' + __dirname + '/templates/LICENSE_MIT');
                files.push('!' + __dirname + '/templates/LICENSE_APACHE');
            }

            if (!answers.vis) {
              files.push('!' + __dirname + '/templates/{snippets,snippets/**}');
              files.push('!' + __dirname + '/templates/test/index.html');
            }

            // check when PhantomJS should be automatically ignored
            if(!(answers.vis && answers.tests)){
              answers.phantomjs = false;
            }

            // only call phantomjs when we have vis + tests
            if (!answers.phantomjs) {
              files.push('!' + __dirname + '/templates/test/{dom,dom/**}');
            }

            if (!answers.jshint) {
              files.push('!' + __dirname + '/templates/_jshintrc');
            }

            if (!answers.tests) {
              files.push('!' + __dirname + '/templates/{test,test/**}');
            }

            var commands = {};
            if (!answers.gulp) {
              files.push('!' + __dirname + '/templates/gulpfile.js');
              commands.test = "echo 'Error: no test specified' && exit 1";
              commands.build = "mkdirp build && browserify -r ./:"+answers.appNameSlug+" -o build/" + answers.appNameVar + ".js";
              commands["build-browser"] = "npm run build";
              commands.prepublish = "npm run build";
              commands.watch = "watchify -r ./:"+answers.appNameSlug+" -v -o build/" + answers.appNameVar + ".js";
            }else{
              commands.test = "gulp test";
              commands.build = "gulp build";
              commands["build-browser"] = "gulp build-browser";
              commands["build-browser-min"] = "gulp build-browser-gzip";
              commands.prepublish = "gulp build";
              commands.watch = "gulp watch";
              commands["test-watch"] = "gulp test-watch";
            }

            // default commands
            commands.sniper = "biojs-sniper .";
            answers.scripts = _.map(commands, function(val,key){ return '\t\t"' + key + '": "' + val + '"' }).join(",\n");

            //TODO
            answers.coverage = false;

            if (!answers.coverage) {
              files.push('!' + __dirname + '/templates/{coverage,coverage/**}');
            }

            answers.keywords = answers.keywords.split(",");
            // toLower
            answers.keywords = answers.keywords.join('|').toLowerCase().split('|');

            // no keywords entered
            if (answers.keywords.length === 1 && answers.keywords[0].length === 0){
              answers.keywords = [];
            }
            // ensure that the package has a biojs keyword
            if(!("biojs" in answers.keywords)){
              answers.keywords.push("biojs");
            }
            for(var key in answers.keywords){
              answers.keywords[key] = answers.keywords[key].trim();
            }
            answers.keywordList = JSON.stringify(answers.keywords);

            gulp.src(files)
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    var appReplace = file.basename.replace(new RegExp('appName', 'g'), answers.appNameVar);
                    file.basename = appReplace;
                    if (answers.license === 'MIT') {
                        var mit = file.basename.replace('LICENSE_MIT', 'LICENSE');
                        file.basename = mit;
                    } else if (answers.license === 'Apache 2') {
                        var apache = file.basename.replace('LICENSE_APACHE', 'LICENSE');
                        file.basename = apache;
                    } else {
                        var bsd = file.basename.replace('LICENSE_BSD', 'LICENSE');
                        file.basename = bsd;
                    }
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function() {
                    done();
                });
        });
});
