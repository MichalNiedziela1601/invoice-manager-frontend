(function ()
{
    'use strict';
    function PersonFactory($resource)
    {

        var api = $resource('/api/person/:a');

        return {
            findByName: function (lastName)
            {
                return api.query({a: 'findByName', lastName: lastName}).$promise;
            },
            getById: function(id){
                return api.get({a: id}).$promise;
            }
        };
    }

    angular.module('app')
            .factory('Person', ['$resource', PersonFactory]);

})();
