(function ()
{
    'use strict';
    function CompanyDAO($resource)
    {
        function setAddress(address){
            return address.street + ' '+address.buildNr +''+ (address.flatNr ? '/'+address.flatNr : '') + ' '+address.postCode + ' '+address.city;
        }
        var api = $resource('/api/company/:a/:b', null, {
            get: {
                isArray: false
            }, query: {method: 'GET', isArray: true,
            transformResponse: function (data)
            {
                data = JSON.parse(data);
                angular.forEach(data,function(obj){
                    obj.address = setAddress(obj.address);
                });
                return data;
            }}, addCompany: {
                method: 'POST', isArray: false
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
            }
        };
    }

    angular.module('app').factory('CompanyDAO', ['$resource', CompanyDAO]);

})();
