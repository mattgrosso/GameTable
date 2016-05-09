module.exports = function(grunt) {
  'use strict';

    grunt.initConfig({

      jshint:{
        options:{
          jshintrc: true
        },
        all: ['./**/*.js']
      },

      watch:{

      },

      clean: ['build/'],

      concat: {
        options: {
          seperator: ';',
          sourceMap: true
        },
        js: {
          src: 'src/**/*.js',
          dest: 'build/js/main.js'
        }
      },

      copy:{
        html:{
          expand: true,
          src: ['**/*.html'],
          dest: 'build/',
          cwd: 'src/'
        }
      },

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['clean', 'copy', 'concat', 'jshint']);

};
