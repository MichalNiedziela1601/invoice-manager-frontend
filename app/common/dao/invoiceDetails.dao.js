(function ()
{
    'use strict';

    function InvoiceDetailsDAO($resource)
    {
        var api = $resource('/api/invoice/:id', null, {
            details: {method: 'GET'}
        });
        return {
            query: function (id)
            {
                return api.details(id).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDetailsDAO', ['$resource', InvoiceDetailsDAO]);
})();
