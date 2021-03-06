'use strict';

var modRewrite = require('connect-modrewrite');
var config = {app: 'app'};
var mountFolder;

module.exports = function (grunt)
{
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-karma');


    require('load-grunt-tasks')(grunt);

    mountFolder = function (connect, dir)
    {
        return connect['static'](require('path').resolve(dir));
    };

    grunt.initConfig({
        config: config, watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['<%= config.app %>/index.html', '<%= config.app %>/*.js', '<%= config.app %>/modules/**/*', '<%= config.app %>/common/**/*',
                    '<%= config.app %>/style/**/*']
            },
            styles: {
                files: ['<%= config.app %>/style/*.less'], // which files to watch
                tasks: ['less']
            }

        }, connect: {
            options: {
                port: 9000, livereload: 35729, hostname: '0.0.0.0'
            }, livereload: {
                options: {
                    open: true, middleware: function (connect)
                    {
                        return [// in case of using html5Mode - makes accessible uris without hashbang but containing view's path
                            modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.ttf|\\.woff|(\\api.+)$ /index.html [L]']),
                            mountFolder(connect, config.app), connect().use('/bower_components', connect.static('./bower_components')),
                            require('grunt-connect-proxy/lib/utils').proxyRequest];
                    }
                }
            }, proxies: [{
                context: '/api', host: 'localhost', port: 3000, changeOrigin: true
            }]
        }, karma: {
            options: {
                configFile: 'test/karma.conf.js'
            }, unit: {
                singleRun: true
            }, dev: {
                singleRun: false
            }
        },
        jshint: {
            default: {
                options: {
                    jshintrc: true
                }, files: {
                    src: ['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*.js']
                }
            }, verify: {
                options: {
                    jshintrc: true, reporter: 'checkstyle', reporterOutput: 'target/jshint.xml'
                }, files: {src: ['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*.js']}
            }
        },
        less: {
            development: {
                options: {
                    paths: ['app/style']
                },
                files: {
                    'app/style/main.style.css': 'app/style/main.style.less'
                }
            }
        }

    });

    grunt.registerTask('serve', ['configureProxies', 'connect:livereload','less', 'watch']);

    grunt.registerTask('default', ['serve']);

    grunt.registerTask('verify', ['jshint:default','karma:unit']);

    grunt.registerTask('test:dev', ['karma:dev']);


};
