(function ()
{
    'use strict';

    angular.module('app')
            .run(function ($rootScope,authManager,$location,$window,jwtHelper,UserDAO)
            {
                authManager.redirectWhenUnauthenticated();
                $rootScope.$on('$routeChangeStart', function(event, newUrl){
                    if(!UserDAO.isAuthenticated() && newUrl.requireAuth){
                        $location.path('/login');
                    }

                    if(UserDAO.isAuthenticated()){
                        if(jwtHelper.isTokenExpired(UserDAO.getToken()) && newUrl.requireAuth){
                            $location.path('/login');
                        }
                    }
                });
            });

})();
