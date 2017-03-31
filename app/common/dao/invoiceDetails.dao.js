(function ()
{
    'use strict';

    function InvoiceDetailsDAO($resource)
    {
        var api = $resource('/api/invoice/:id', null, {
            details: {method: 'GET'},
            update: { method: 'PUT'}
        });
        return {
            query: function (id)
            {
                return api.details(id).$promise;
            },
            update: function (id,invoice){
                return api.update({id: id},invoice).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDetailsDAO', ['$resource', InvoiceDetailsDAO]);
})();
