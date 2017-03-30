(function ()
{
    'use strict';
    function AuthDAO($resource,$window)
    {
        var api = $resource('/api/auth/:a', null, {
            login: {method: 'POST', params: {a: 'login'}},
            getUserInfo: {method: 'GET', params: {a: 'login'}},
            registration: {method: 'POST', params: {a: 'registration'}}
        });

        function getToken() {
            return $window.sessionStorage.token;
        }

        function isAuthenticated() {
            return $window.sessionStorage.token ? true : false;
        }

        function logout(){
            delete $window.sessionStorage.token;
        }



        return {
            login: function (credential)
            {
                return api.login(credential, function(data) {
                    $window.sessionStorage.token = data.token;
                }).$promise;
            },
            registration: function (registed)
            {
                return api.registration(registed).$promise;
            },
            getUserInfo: function(){
                return api.getUserInfo().$promise;
            },
            getToken: getToken,
            isAuthenticated: isAuthenticated,
            logout: logout
        };
    }

    angular.module('app').factory('AuthDAO', ['$resource','$window', AuthDAO]);

})();

