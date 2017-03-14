(function ()
{
    'use strict';
    function ListService($resource)
    {
        var api = $resource('/api/invoice');

        return {
            query: function ()
            {
                return api.get().$promise;
            }
        };
    }

    angular.module('app').factory('Invoice', ['$resource', ListService]);
})();
