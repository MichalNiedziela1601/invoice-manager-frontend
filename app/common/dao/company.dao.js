(function ()
{
    'use strict';
    function CompanyFactory($resource)
    {
        var api = $resource('/api/company/:nip', null, {
            get: {
                isArray: false
            }
        });

        return {
            findByNip: function (nip)
            {
                return api.get({nip: nip}).$promise;
            }
        };
    }

    angular.module('app')
            .factory('Company', ['$resource', CompanyFactory]);


})();
