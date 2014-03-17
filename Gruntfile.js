var config = require('./config');
var couchapp = require('./couchapp');

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['assets/js/*.js'],
      options: {
        browser: true
      }
    },
    concat: {
      vendor: {
        // the files to concatenate, in order
        src: [
          'lib/jquery/*.js',
          'lib/showdown/*.js',
          'lib/autotype/*.js',
          'lib/angular/angular.js',
          'lib/angular-*/*.js',
          'lib/bootstrap/*.js',
          'lib/bootstrap-*/*.js'
        ],
        // the location of the resulting JS file
        dest: 'dist/js/vendor.js'
      },
      app: {
        src: [
          'assets/js/*.js'
        ],
        dest: 'dist/js/bundle.js'
      },
      css: {
        src: [
          'lib/*/*.css'
        ],
        dest: 'dist/css/style.css'
      }
    },
    uglify: {
      build: {
        files: {
          'dist/js/vendor.js': ['dist/js/vendor.js'],
          'dist/js/bundle.js': ['dist/js/bundle.js']
        }
      }
    },
    copy: {
      app: {
        files: [
          {
            expand: true,
            src: ['*.html'],
            cwd: 'assets/html/',
            dest: 'dist'
          }, {
            expand: true,
            src: ['glyphicons-halflings-regular.*'],
            cwd: 'lib/bootstrap/',
            dest: 'dist/fonts'
          }
        ]
      }
    },
    couchapp: {
      app: {
        app: 'couchapp',
        db: config.deploy_to,
        options: {
          okay_if_exists: true
        }
      }
    },
    mkcouchdb: {
      app: {
        db: config.deploy_to,
        options: {
          okay_if_exists: true
        }
      }
    },
    upload: {
      app: {
        db: config.deploy_to,
        folder: 'docs'
      }
    },
    scaffold: {
      app: {
        folder: 'docs',
        sitemap: config.sitemap
      }
    },
    'show-sitemap': {
      app: {
        sitemap: config.sitemap
      }
    },
    'flat-sitemap': {
      app: {
        sitemap: config.sitemap
      }
    },
    sitemap: {
      app: {
        sitemap: config.sitemap,
        db: config.deploy_to
      }
    },
    bower: {
      app: {
        // it just works :D
      }
    },
    watch: {
      build: {
        files: ['assets/**', 'couchapp/*', 'docs/**'],
        tasks: ['build']
      },
      dist: {
        files: ['dist/**'],
        tasks: ['couchapp']
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  // Custom Tasks
  grunt.registerTask('build', [
    'bower',
    'jshint',
    'concat',
    'copy'
  ]);

  grunt.registerTask('sync', [
    'mkcouchdb',
    'upload',
    'sitemap'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'mkcouchdb',
    'couchapp'
  ]);

  grunt.registerTask('production', [
    'build',
    'uglify',
    'mkcouchdb',
    'couchapp'
  ]);

};