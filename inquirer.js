var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  str = require('underscore.string'),
  inquirer = require('inquirer'),
  fs = require('fs'),
  join = require('path').join,
  _ = require('underscore');
var colors = require('colors');

var inq = {};
module.exports = inq;

inq.ask = function ask(prompts, cb) {
  inquirer.prompt(prompts,
    function(answers) {
      if (!answers.appName) {
        // empty space so that everyone can see this error msg
        console.log();
        console.warn("WARNING: you must enter a package name. try it again ;-)");
        console.log();
        return cb(answers, true);
      }
      if (!answers.moveon) {
        return cb(answers, true);
      }

      // defaults
      answers.tests = answers.tests || false;
      if (answers.phantomjs === undefined) {
        answers.phantomjs = false;
      }

      answers.appNameSlug = str.slugify(answers.appName);
      // some chars are not valid chars for a variable
      answers.appNameVar = answers.appNameSlug.split("-").join("");
      answers.appNameVar = answers.appNameVar.split("_").join("");
      answers.appNameShort = answers.appNameSlug;
      // try to make the name shorter
      ["-", "_", "."].forEach(function(item) {
        if (answers.appNameShort.indexOf(item) >= 0) {
          var splitted = answers.appNameShort.split(item);
          answers.appNameShort = splitted[splitted.length - 1];
        }
      });

      var d = new Date();
      answers.year = d.getFullYear();
      answers.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

      var files = [__dirname + '/templates/**'];
      if (answers.license === 'MIT') {
        files.push('!' + __dirname + '/templates/LICENSE_BSD');
        files.push('!' + __dirname + '/templates/LICENSE_APACHE');
      } else if (answers.license === 'Apache 2') {
        files.push('!' + __dirname + '/templates/LICENSE_BSD');
        files.push('!' + __dirname + '/templates/LICENSE_MIT');
      } else {
        files.push('!' + __dirname + '/templates/LICENSE_MIT');
        files.push('!' + __dirname + '/templates/LICENSE_APACHE');
      }

      if (!answers.vis) {
        files.push('!' + __dirname + '/templates/{examples,examples/**}');
        files.push('!' + __dirname + '/templates/test/index.html');
      }

      // check when PhantomJS should be automatically ignored
      if (!(answers.vis && answers.tests)) {
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

      if (!answers.css) {
        files.push('!' + __dirname + '/templates/{css,css/**}');
      }


      //TODO - coverage is not working
      answers.coverage = false;

      if (!answers.coverage) {
        files.push('!' + __dirname + '/templates/{coverage,coverage/**}');
      }

      answers.keywords = answers.keywords.split(",");
      // toLower
      answers.keywords = answers.keywords.join('|').toLowerCase().split('|');

      // no keywords entered
      if (answers.keywords.length === 1 && answers.keywords[0].length === 0) {
        answers.keywords = [];
      }
      // ensure that the package has a biojs keyword
      if (!("biojs" in answers.keywords)) {
        answers.keywords.push("biojs");
      }
      for (var key in answers.keywords) {
        answers.keywords[key] = answers.keywords[key].trim();
      }
      answers.keywordList = JSON.stringify(answers.keywords);

      answers._scripts = inq.getCommands(answers, files);
      answers.scripts = inq.dictToJSON(answers._scripts, files);
      answers.devDependencies = inq.dictToJSON(inq.getDevDependencies(answers));

      // ignore the example.html by default
      files.push('!' + __dirname + '/templates/example.html');

      var cbFire = function() {
        inq.showHelp(answers);
        cb(answers, false);
      };

      gulp.src(files)
        .pipe(template(answers))
        .pipe(rename(function(file) {
          var appReplace = file.basename.replace(new RegExp('appNameShort', 'g'), answers.appNameShort);
          file.basename = appReplace;
          // choose the correct license
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
          // hidden files
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
          // we don't need special test folders if there is no phantomjs 
          if (answers.tests && !answers.phantomjs) {
            if (file.dirname.substring(0, 9) === "test/unit") {
              file.dirname = file.dirname.replace("unit", "");
            }
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .on('end', function() {
          // do some cleanup on end
          if (answers.tests && !answers.phantomjs) {
            fs.rmdir(join(process.cwd(), "test", "unit"), cbFire);
          } else {
            cbFire();
          }
        })
        .pipe(install());
    });
};

inq.showHelp = function(answers) {
  var scripts = answers._scripts;

  var show = function() {
    console.log.apply(console, arguments);
  };

  show();
  show("Congrats - these commands are now available");
  show();

  if (scripts.build !== undefined) {
    show("npm run build".green);
    show("* will bundle all your files and dependencies into one file (using browserify).");
    show();
  }

  if (scripts.sniper !== undefined) {
    show("npm run sniper".green);
    show("* runs a local web server");
    show("* allows you to test your examples (for the BioJS registry)");
    show("* open http://0.0.0.0:9090/examples");
    show();
  }

  if (answers.tests !== undefined) {
    show("npm test".green);
    show("* will run your unit tests");
    show();
    if (scripts["test-watch"] !== undefined) {
      show("npm test-watch)".green);
      show("* will run your unit tests");
      show();
    }
  }

  if (scripts.watch !== undefined) {
    show("npm run watch".green);
    show("* will watch your files and run browserify on file changes");
    show();
  }

  if (scripts.css !== undefined) {
    show("npm run css".green);
    show("* will bundle all your css files of your package and your dependencies (supports CSS transforms)");
    show();

    show("npm run watch-css".green);
    show("* will listen to file changes and hence rerun the css pipeline)");
    show();
  }

  if (scripts.w !== undefined) {
    show("npm run w".green);
    show("Runs all these commands in one shell");
    show("* `npm run sniper`");
    show("* `npm run watch`");
    if (scripts.css !== undefined) {
      show("* `npm run watch-css`");
    }
    show();
  }


  show("For more details see: https://github.com/biojs/slush-biojs");
  show();
};

inq.getCommands = function(answers, files) {
  var commands = {};
  commands.test = "echo 'Error: no test specified' && exit 1";


  if (!answers.gulp) {
    files.push('!' + __dirname + '/templates/gulpfile.js');
    files.push('!' + __dirname + '/templates/test/index.html');
    commands.build = "mkdirp build && browserify -r ./:" + answers.appNameSlug + " -o build/" + answers.appNameShort + ".js";
    commands["build-browser"] = "npm run build";
    commands.prepublish = "npm run build";

    if (answers.vis) {
      commands.watch = "watchify -r ./:" + answers.appNameSlug + " -v -o build/" + answers.appNameShort + ".js";
    }
    if (answers.tests) {
      commands.test = "mocha";
    }
    if (answers.jshint) {
      commands.lint = "jshint -c .jshintrc lib --verbose";
    }
  } else {
    commands.build = "gulp build";
    commands["build-browser"] = "gulp build-browser";
    commands["build-browser-min"] = "gulp build-browser-gzip";
    commands.prepublish = "gulp build";
    commands.watch = "gulp watch";
    commands["test-watch"] = "gulp test-watch";
    if (answers.tests) {
      commands.test = "gulp test";
    }
  }
  if (answers.vis) {
    // single quotes don't work on windows
    commands.w = 'prunner \\"npm run sniper\\" \\"npm run watch\\"';
    commands.sniper = "biojs-sniper .";
    if (answers.css) {
      commands.prepublish += " && npm run css";
      commands.w += ' \\"npm run watch-css\\"';
      commands.css = "parcelify ./ -c build/bundle.css";
      commands["watch-css"] = "parcelify -w ./ -c build/bundle.css --loglevel verbose";
    }
  }
  return commands;
};

inq.getDevDependencies = function(a) {
  var devDependencies = {};

  // default dependencies
  devDependencies["mkdirp"] = "^0.5.0";
  devDependencies["browserify"] = "6.x";

  if (a.coverage) {
    devDependencies["blanket"] = "^1.1.6";
    devDependencies["coveralls"] = "^2.11.1";
    devDependencies["mocha-lcov-reporter"] = "0.x";
    if (a.gulp) {
      devDependencies["gulp-coveralls"] = "^0.1.3";
    }
  }

  if (a.vis) {
    devDependencies["biojs-sniper"] = "0.x";
    devDependencies["watchify"] = "^1.0.6";
    devDependencies["prunner"] = "1.x";
  }

  if (a.css) {
    devDependencies["parcelify"] = "0.x";
  }

  if (a.jshint) {
    if (a.gulp) {
      devDependencies["gulp-jshint"] = "1.x";
    } else {
      devDependencies["jshint"] = "^2.5.10";
    }
  }

  if (a.tests) {
    devDependencies["chai"] = "1.x";
    devDependencies["mocha"] = "1.x";
    if (a.gulp) {
      devDependencies["gulp-mocha"] = "1.x";
    }
    if (a.phantomjs) {
      devDependencies["gulp-mocha-phantomjs"] = "0.x";
    }
  }

  if (a.gulp) {
    devDependencies["del"] = "^0.1.3";
    devDependencies["gulp"] = "^3.8.8";
    devDependencies["gulp-chmod"] = "^1.1.1";
    devDependencies["gulp-gzip"] = "^0.0.8";
    devDependencies["gulp-rename"] = "^1.2.0";
    devDependencies["gulp-streamify"] = "^0.0.5";
    devDependencies["gulp-uglify"] = "^1.0.1";
    devDependencies["gulp-util"] = "^3.0.1";
    devDependencies["vinyl-source-stream"] = "^1.0.0";
  }

  return devDependencies;
};

inq.dictToJSON = function(dict) {
  return _.map(dict, function(val, key) {
    return '\t\t"' + key + '": "' + val + '"';
  }).join(",\n");
};
