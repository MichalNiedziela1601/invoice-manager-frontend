(function ()
{
    'use strict';

    function InvoiceDetailsDAO($resource)
    {
        var api = $resource('/api/invoice/:id/:b', null, {
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
            },
            changeStatus: function (id,status)
            {
                return api.update({id: id, b: 'status'}, {status: status}).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDetailsDAO', ['$resource', InvoiceDetailsDAO]);
})();
