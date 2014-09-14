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
    inquirer = require('inquirer');

gulp.task('default', function(done) {
    var prompts = [{
        name: 'appName',
        message: 'What the module name?'
    }, {
        name: 'appDescription',
        message: 'What the description?'
    }, {
        name: 'appVersion',
        message: 'What the module version?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What the author name?',
    }, {
        name: 'authorEmail',
        message: 'What the author email?',
    }, {
        name: 'userName',
        message: 'What the github username?',
    }, {
        name: 'keywords',
        message: 'Enter keywords for npm (separate with comma)',
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['Apache 2','MIT', 'BSD'],
        default: 'Apache 2'
    }];
    //Ask
    inquirer.prompt(prompts,
        function(answers) {
            if (!answers.appName) {
                return done();
            }
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
                files.push('!' + __dirname + '/templates/LICENSE_APACHE2');
            }else if (answers.license === 'Apache 2') {
                files.push('!' + __dirname + '/templates/LICENSE_BSD');
                files.push('!' + __dirname + '/templates/LICENSE_MIT');
            } else {
                files.push('!' + __dirname + '/templates/LICENSE_MIT');
                files.push('!' + __dirname + '/templates/LICENSE_APACHE2');
            }
            answers.keywords = answers.keywords.split(",");
            // no keywords entered
            if (answers.keywords.length === 1 && answers.keywords[0].length === 0){
              answers.keywords = [];
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
