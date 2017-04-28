(function ()
{
    'use strict';
    function InvoiceDAO($resource)
    {
        var api = $resource('/api/invoice/:a', null, {
            get: {
                isArray: true
            },
            query: { isArray: false}
        });

        return {
            query: function (filtr)
            {
                return api.get(filtr).$promise;
            },
            add: function (invoice)
            {
                return api.save(invoice).$promise;
            },
            issue: function(invoice)
            {
                return api.save({a: 'issues'},invoice).$promise;
            },
            number: function(year,month)
            {
                return api.query({a: 'number', year: year, month: month}).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDAO', ['$resource', InvoiceDAO]);

})();

