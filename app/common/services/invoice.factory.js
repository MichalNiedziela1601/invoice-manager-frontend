(function ()
{
    'use strict';
    function InvoiceFactory($resource)
    {
        var api = $resource('/api/invoice');

        return {
            add: function (invoice)
            {
                return api.save(invoice).$promise;
            }
        };
    }

    angular.module('app')
            .factory('Invoice', ['$resource', InvoiceFactory]);

})();
