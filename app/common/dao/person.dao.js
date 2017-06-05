(function ()
{
    'use strict';
    function PersonFactory($resource,$http)
    {

        function queryTransformResponse(data){
            angular.forEach(data,function(obj){
                obj.address = setAddress(obj.address);
                obj.name = setName(obj.firstName,obj.lastName);
            });
            return data;
        }

        var api = $resource('/api/person/:a',null, {
            getPersons: {
                method: 'GET', isArray: true, transformResponse: $http.defaults.transformResponse.concat(queryTransformResponse)
            },
            update: { method: 'PUT'}
        });

        function setAddress(address){
            return address.street + ' '+address.buildNr +''+ (address.flatNr ? '/'+address.flatNr : '') + ' '+address.postCode + ' '+address.city;
        }

        function setName(firstName, lastName)
        {
            return lastName + ' ' + firstName;
        }

        return {
            findByName: function (lastName)
            {
                return api.query({a: 'findByName', lastName: lastName}).$promise;
            },
            getById: function(id){
                return api.get({a: id}).$promise;
            },
            addPerson: function(person)
            {
                return api.save(person).$promise;
            },
            findShortcut: function(shortcut){
                return api.query({a: 'shortcut', shortcut: shortcut}).$promise;
            },
            findByNip: function(nip){
                return api.get({a: 'nip', nip: nip}).$promise;
            },
            getPersons: function(){
                return api.getPersons().$promise;
            },
            updatePerson: function(person){
                return api.update(person).$promise;
            }
        };
    }

    angular.module('app')
            .factory('Person', ['$resource','$http', PersonFactory]);

})();
