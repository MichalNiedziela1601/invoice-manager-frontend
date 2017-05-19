(function ()
{
    'use strict';
    function CompanyDAO($resource,$http)
    {
        function setAddress(address){
            return address.street + ' '+address.buildNr +''+ (address.flatNr ? '/'+address.flatNr : '') + ' '+address.postCode + ' '+address.city;
        }

        function queryTransformResponse(data){
            angular.forEach(data,function(obj){
                obj.address = setAddress(obj.address);
            });
            return data;
        }
        var api = $resource('/api/company/:a/:b', null, {
            get: {
                isArray: false
            }, query: {method: 'GET', isArray: true,
            transformResponse:  $http.defaults.transformResponse.concat(queryTransformResponse)
                }, addCompany: {
                method: 'POST', isArray: false
            },
            findShortcut: {
                method: 'GET', isArray: true
            }
        });

        var nips = $resource('/api/companies/:a',null);

        return {
            findByNip: function (nip)
            {
                return api.get({a: nip}).$promise;
            }, query: function ()
            {
                return api.query().$promise;
            }, addCompany: function (company)
            {
                return api.addCompany(company).$promise;
            },
            getNips: function(nip){
                return nips.query({a: nip}).$promise;
            },
            findShortcut: function(shortcut){
                return api.findShortcut({a: 'shortcut', shortcut: shortcut}).$promise;
            }
        };
    }

    angular.module('app').factory('CompanyDAO', ['$resource','$http', CompanyDAO]);

})();
