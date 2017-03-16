(function ()
{
    'use strict';
    function InvoiceDAO($resource)
    {
        var api = $resource('/api/invoice', null, {
            get: {
                isArray: true
            }
        });

        return {
            query: function (filtr)
            {
                return api.get(filtr).$promise;
            },
            add: function (invoice)
            {
                return api.save(invoice).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDAO', ['$resource', InvoiceDAO]);

})();

