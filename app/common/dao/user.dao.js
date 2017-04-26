(function ()
{
    'use strict';
    function UserDAO($resource,$window)
    {
        var api = $resource('/api/user/:a', null, {
            addAddress: {method: 'POST', params: {a: 'addAddress'}},
            addPersonalData: {method: 'POST', params: {a: 'addPersonalData'}},
            addAccountData: {method: 'POST', params: {a: 'addAccountData'}},
            login: {method: 'POST', params: {a: 'auth'}},
            getUserInfo: {method: 'GET', params: {a: 'auth'}},
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
            addAddress: function (address)
            {
                return api.addAddress(address).$promise;
            },
            addPersonalData: function (personalData)
            {
                return api.addPersonalData(personalData).$promise;
            },
            addAccountData: function (accountData)
            {
                return api.addAccountData(accountData).$promise;
            },
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

    angular.module('app').factory('UserDAO', ['$resource','$window', UserDAO]);

})();

