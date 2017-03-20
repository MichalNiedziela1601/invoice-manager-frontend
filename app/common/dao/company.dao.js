(function ()
{
    'use strict';
    function CompanyDAO($resource)
    {
        var api = $resource('/api/company/:a', null, {
            get: {
                isArray: false
            }, query: {method: 'GET', isArray: true}, addCompany: {
                method: 'POST', isArray: false
            }
        });

        return {
            findByNip: function (nip)
            {
                return api.get({a: nip}).$promise;
            }, query: function ()
            {
                return api.query().$promise;
            }, addCompany: function (company)
            {
                return api.addCompany(company).$promise;
            }
        };
    }

    angular.module('app').factory('CompanyDAO', ['$resource', CompanyDAO]);

})();
