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



    }

    angular.module('app').config(config);

})();
