'use strict';

var modRewrite = require('connect-modrewrite');
var config = {app: 'app'};
var mountFolder;

module.exports = function (grunt)
{
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    require('load-grunt-tasks')(grunt);

    mountFolder = function (connect, dir)
    {
        return connect['static'](require('path').resolve(dir));
    };

    grunt.initConfig({
                config: config,
                watch: {
                    livereload: {
                        options: {
                            livereload: '<%= connect.options.livereload %>'
                        },
                        files: ['<%= config.app %>/index.html',
                                '<%= config.app %>/*.js',
                                '<%= config.app %>/modules/**/*',
                                '<%= config.app %>/common/**/*',
                                '<%= config.app %>/style/**/*']
                    }
                },
                connect: {
                    options: {
                        port: 9000,
                        livereload: 35729,
                        hostname: 'localhost'
                    },
                    livereload: {
                        options: {
                            open: true,
                            middleware: function (connect)
                            {
                                return [
                                    // in case of using html5Mode - makes accessible uris without hashbang but containing view's path
                                    modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.ttf|\\.woff|(\\api.+)$ /index.html [L]']),
                                    mountFolder(connect, config.app),
                                    connect().use('/bower_components', connect.static('./bower_components')),
                                    require('grunt-connect-proxy/lib/utils').proxyRequest];
                            }
                        }
                    },
                    proxies: [{
                        context: '/api',
                        host: 'localhost',
                        port: 3000,
                        changeOrigin: true
                    }],
                    jshint: {
                        default: {
                            options: {
                                jshintrc: true
                            },
                            files: {
                                src: ['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*.js']
                            }
                        },
                        verify: {
                            options: {
                                jshintrc: true,
                                reporter: 'checkstyle',
                                reporterOutput: 'target/jshint.xml'
                            },
                            files: {src: ['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*.js']}
                        }
                    }
                }

            }
    );

    grunt.registerTask('serve', ['configureProxies', 'connect:livereload', 'watch']);

    grunt.registerTask('default', ['serve']);
};
