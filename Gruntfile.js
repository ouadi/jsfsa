/*global module:false*/
module.exports = function (grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        files:{
            src:'src/<%= pkg.name %>.js',
            dist:{
                full: 'dist/<%= pkg.name %>.js',
                min: 'dist/<%= pkg.name %>.min.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> ' + 'Copyright (c) <%= grunt.template.today("yyyy") %> ' + '<%= pkg.author %>; Licensed <%= pkg.licenses[0].type %> */'
            },
            build: {
                src: '<%=files.src%>',
                dest: '<%=files.dist.min%>'
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint test'
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        concat: {
            source: {
                src: '<%=files.src%>',
                dest: '<%=files.dist.full%>'
            }
        },
        replace: {
            bower:{
                options:{
                    variables:{
                        'version': '<%= pkg.version %>',
                        'name': '<%= pkg.name %>',
                        'dist_min': '<%=files.dist.min%>',
                        'dist_full': '<%=files.dist.full%>'
                    }
                },
                files: [{
                    src: 'template.bower.json',
                    dest: 'bower.json'
                }]
            },
            dist: {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>'
                    }
                },
                files: [
                    { src: 'dist/<%= pkg.name %>.js', dest: 'dist/<%= pkg.name %>.js'},
                    { src: 'dist/<%= pkg.name %>.min.js', dest: 'dist/<%= pkg.name %>.min.js'}
                ]
            }
        },
        jasmine: {
            source: ['src/**/*.js'],
            dist: [ 'dist/*.js' ],
            options: {
                specs: ['specs/**/*.js']
            }
        },
        jsdoc: {
            dist: {
                src: ['src/*.js'],
                options: {
                    destination: 'docs',
                    private: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-bump');

    // Default task.
    grunt.registerTask('test', ['jshint', 'jasmine:source']);
    grunt.registerTask('build', ['test', 'concat', 'uglify', 'replace']);
    grunt.registerTask('docs', ['jsdoc']);
    grunt.registerTask('travis', ['jshint', 'jasmine']);
};