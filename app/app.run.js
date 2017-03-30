(function ()
{
    'use strict';

    angular.module('app')
            .run(function ($rootScope,authManager,$location,AuthDAO)
            {
                authManager.redirectWhenUnauthenticated();
                $rootScope.$on('$routeChangeStart', function(event, newUrl){
                    if(!AuthDAO.isAuthenticated() && newUrl.requireAuth){
                        $location.path('/login');
                    }
                });
            });

})();
