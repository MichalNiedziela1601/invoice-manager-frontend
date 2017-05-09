module.exports = function (config)
{
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: ['app/bower_components/lodash/dist/lodash.core.min.js',
                'app/bower_components/angular/angular.js',
                'app/bower_components/angular-animate/angular-animate.min.js',
                'app/bower_components/angular-bootstrap/ui-bootstrap.min.js',
                'app/bower_components/angular-css/angular-css.min.js',
                'app/bower_components/angular-mocks/angular-mocks.js',
                'app/bower_components/angular-resource/angular-resource.min.js',
                'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'app/bower_components/angular-route/angular-route.min.js',
                'app/bower_components/angular-sanitize/angular-sanitize.min.js',
                'app/bower_components/ng-file-upload/ng-file-upload.min.js',
                'app/bower_components/angular-messages/angular-messages.js',
                'app/bower_components/angular-jwt/dist/angular-jwt.min.js',
                'app/bower_components/ng-table-bundle/ng-table.min.js',
                'app/bower_components/ng-lodash/build/ng-lodash.min.js',
                'app/app.js',
                'app/app.config.js',
                'app/app.route.js',
                'app/app.run.js',
                'app/modules/**/*.js',
                'app/common/**/*.js',
                'test/unit/**/*.spec.js',
                'test/testHelper.js'],

        // list of files / patterns to exclude
        exclude: [],

        reporters: ['spec', 'coverage', 'junit'],

        preprocessors: {
            'app/*.js': 'coverage', 'app/!(bower_components)/**/*.js': 'coverage'
        },

        coverageReporter: {
            dir: 'target/', type: 'html'
        },

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        // Which plugins to enable
        plugins: ['karma-chrome-launcher', 'karma-jasmine', 'karma-spec-reporter', 'karma-coverage', 'karma-junit-reporter'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        //https://github.com/karma-runner/karma/issues/895
        usePolling: true
        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
