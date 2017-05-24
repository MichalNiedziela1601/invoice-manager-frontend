(function ()
{
    'use strict';
    function UserDAO($resource,$window)
    {
        var api = $resource('/api/user/:a', null, {
            updateAddress: {method: 'PUT', params: {a: 'address'}},
            updateAccount: {method: 'PUT', params: {a: 'account'}},
            login: {method: 'POST', params: {a: 'auth'}},
            getUserInfo: {method: 'GET', params: {a: 'auth'}},
            registration: {method: 'POST', params: {a: 'registration'}},
            addNewUser: {method: 'POST', params: {a: 'newUser'}}
        });

        function getToken() {
            return $window.sessionStorage.token;
        }

        function isAuthenticated() {
            return $window.sessionStorage.token ? true : false;
        }

        function logout(){
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.userInfo;
        }

        return {
            updateAddress: function (address)
            {
                return api.updateAddress(address).$promise;
            },
            updateAccount: function (accountData)
            {
                return api.updateAccount(accountData).$promise;
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
            addNewUser: function(credentials,companyId){
                Object.assign(credentials,{companyId: companyId});
                return api.addNewUser(credentials).$promise;
            },
            getToken: getToken,
            isAuthenticated: isAuthenticated,
            logout: logout
        };
    }

    angular.module('app').factory('UserDAO', ['$resource','$window', UserDAO]);

})();

