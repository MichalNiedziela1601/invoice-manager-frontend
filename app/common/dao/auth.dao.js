(function ()
{
    'use strict';
    function AuthDAO($resource)
    {
        var api = $resource('/api/auth/:a', null, {
            login: {method: 'POST', params: {a: 'login'}},
            registration: {method: 'POST', params: {a: 'registration'}}
        });

        return {
            login: function (credential)
            {
                return api.login(credential).$promise;
            },
            registration: function (registed)
            {
                return api.registration(registed).$promise;
            }
        };
    }

    angular.module('app').factory('AuthDAO', ['$resource', AuthDAO]);

})();

