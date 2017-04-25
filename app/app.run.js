(function ()
{
    'use strict';

    angular.module('app')
            .run(function ($rootScope,authManager,$location,UserDAO)
            {
                authManager.redirectWhenUnauthenticated();
                $rootScope.$on('$routeChangeStart', function(event, newUrl){
                    if(!UserDAO.isAuthenticated() && newUrl.requireAuth){
                        $location.path('/login');
                    }
                });
            });

})();
