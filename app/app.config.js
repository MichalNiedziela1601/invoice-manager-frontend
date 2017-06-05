(function ()
{
    'use strict';

    function config($locationProvider,$httpProvider,jwtOptionsProvider)
    {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode({
            enabled: true, requireBase: false
        });

        jwtOptionsProvider.config({
            whiteListedDomains: ['localhost'],
            tokenGetter: ['UserDAO',function(UserDAO){
                return UserDAO.getToken();
            }],
            unauthenticatedRedirectPath: '/login'
        });

        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.interceptors.push(function($q){
            return {
                'responseError': function(rejection) {
                    var defer = $q.defer();

                    if(401 === rejection.status) {
                        console.log('Session time out!');
                    }

                    defer.reject(rejection);
                    return defer.promise;
                }
            };
        });



    }

    angular.module('app').config(config);

})();
