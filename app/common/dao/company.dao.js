(function ()
{
    'use strict';
    function CompanyDAO($resource)
    {
        var api = $resource('/api/company/:a', null, {
            get: {
                isArray: false
            }
        });

        return {
            findByNip: function (nip)
            {
                return api.get({a: nip}).$promise;
            }
        };
    }

    angular.module('app').factory('CompanyDAO', ['$resource', CompanyDAO]);

})();
