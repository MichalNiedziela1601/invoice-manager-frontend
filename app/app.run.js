(function ()
{
    'use strict';

    angular.module('app')
            .run(function ($rootScope,authManager,$location,UserDAO,jwtHelper)
            {
                authManager.redirectWhenUnauthenticated();
                $rootScope.$on('$routeChangeStart', function(event, newUrl){
                    if(!UserDAO.isAuthenticated() && newUrl.requireAuth || jwtHelper.isTokenExpired(UserDAO.getToken())){
                        $location.path('/login');
                    }
                });
            });

})();
