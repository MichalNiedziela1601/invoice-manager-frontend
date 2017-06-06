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
                return api.save({a: 'upload'},invoice).$promise;
            },
            issue: function(invoice)
            {
                return api.save({a: 'issue'},invoice).$promise;
            },
            number: function(year,month, type)
            {
                return api.query({a: 'number', year: year, month: month, type: type}).$promise;
            }
        };
    }

    angular.module('app').factory('InvoiceDAO', ['$resource', InvoiceDAO]);

})();

