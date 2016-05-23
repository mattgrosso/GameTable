module.exports = function(grunt) {
  'use strict';

    grunt.loadNpmTasks('grunt-notify');
    grunt.initConfig({

      jshint: {
        options: {
          jshintrc: true
        },
        all: ['src/**/*.js']
      },

      sass: {
        project: {
          files: {
            'build/css/main.css':'src/scss/main.scss'
          }
        }
      },

      watch: {
        js: {
          files: ['src/**/*.js'],
          tasks: ['js-build']
        },
        sass: {
          files: ['src/**/*.scss'],
          tasks: ['css-build']
        },
        html: {
          files: ['src/**/*.html'],
          tasks: ['copy:html']
        }
      },

      clean: ['build/'],

      concat: {
        options: {
          seperator: ';',
          sourceMap: true
        },
        js: {
          src: ['src/app/game.module.js', 'src/**/*.js'],
          dest: 'build/js/main.js'
        }
      },

      copy: {
        html: {
          expand: true,
          src: ['**/*.html'],
          dest: 'build/',
          cwd: 'src/'
        },
        js:{
          expand: true,
          src: ['**/*.js'],
          dest: 'build/js/',
          cwd: 'vendor/'
        },
        img: {
          expand: true,
          src: ['**/*.png'],
          dest: 'build/',
          cwd: 'src/'
        }
      },

      karma: {
        app: {
          options: {
            frameworks: ['mocha', 'chai'],
            client: {
              mocha: {
                ui: 'tdd'
              }
            },
            browsers: ['PhantomJS'],
            singleRun: true,
            files: [
              'node_modules/angular/angular.js',
              'node_modules/angular-ui-router/release/angular-ui-router.js',
              'node_modules/angular-mocks/angular-mocks.js',
              'node_modules/ng-storage/ngStorage.min.js',
              'src/app/game.module.js',
              'src/header/header.controller.js',
              'src/login/login.controller.js',
              'test/specs/**/*.js'
            ],
            preprocessors:{
              'src/**/*.js': ['coverage']
            },
            reporters: [
              'progress',
              'coverage'
            ],
            coverageReporter: {
              type: 'text-summary'
            }
          }
        }
      },

      notify_hooks: {
        options: {
          enabled: true,
          max_jshint_notifications: 5, // maximum number of notifications from jshint output
          duration: 1 // the duration of notification in seconds, for `notify-send only
        }
      },

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('js-build', ['concat:js', 'jshint']);
    grunt.registerTask('css-build', ['sass']);
    grunt.registerTask('default', ['clean', 'copy', 'concat', 'jshint', 'sass']);

};
