(function ()
{
    'use strict';
    function CompanyDAO($resource)
    {
        var api = $resource('/api/company/:a', null, {
            get: {
                isArray: false
            }, query: {method: 'GET', isArray: true}
        });

        return {
            findByNip: function (nip)
            {
                return api.get({a: nip}).$promise;
            }, query: function ()
            {
                return api.query().$promise;
            }
        };
    }

    angular.module('app').factory('CompanyDAO', ['$resource', CompanyDAO]);

})();
