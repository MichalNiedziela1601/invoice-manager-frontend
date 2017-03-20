(function ()
{
    'use strict';

    function DetailsDAO($resource)
    {
        var api = $resource('/api/invoice/:id', null, {
            details: {method: 'GET'}
        });
        return {
            query: function (id)
            {
                return api.details(id).$promise;
            }
        }
    }

    angular.module('app').factory('DetailsDAO', ['$resource', DetailsDAO]);
})();
