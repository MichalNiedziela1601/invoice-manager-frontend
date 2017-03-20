(function ()
{
    'use strict';
    function UserDAO($resource)
    {
        var api = $resource('/api/user/:a', null, {
            addAddress: {method: 'POST', params: {a: 'addAddress'}},
            addPersonalData: {method: 'POST', params: {a: 'addPersonalData'}},
            addAccountData: {method: 'POST', params: {a: 'addAccountData'}}
        });

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
            }
        };
    }

    angular.module('app').factory('UserDAO', ['$resource', UserDAO]);

})();

