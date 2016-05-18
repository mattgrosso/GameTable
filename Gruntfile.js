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

      notify_hooks: {
        options: {
          enabled: true,
          max_jshint_notifications: 5, // maximum number of notifications from jshint output
          duration: 1 // the duration of notification in seconds, for `notify-send only
        }
      },

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('js-build', ['concat:js']);
    grunt.registerTask('css-build', ['sass']);
    grunt.registerTask('default', ['clean', 'copy', 'concat', 'jshint']);

};
