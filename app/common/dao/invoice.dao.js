(function ()
{
    'use strict';
    function InvoiceDAO($resource)
    {
        var api = $resource('/api/invoice', null, {
            get: {
                isArray: false
            }
        });

        return {
            query: function ()
            {
                return api.get().$promise;
            },
            add: function (invoice)
            {
                return api.save(invoice).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDAO', ['$resource', InvoiceDAO]);

})();

