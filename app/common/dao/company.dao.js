(function ()
{
    'use strict';
    function CompanyDAO($resource, $http)
    {
        function setAddress(address)
        {
            if ('GB' !== address.countryCode) {
                return address.street +
                        ' ' +
                        address.buildNr +
                        '' +
                        (address.flatNr ? '/' + address.flatNr : '') +
                        ', ' +
                        address.postCode +
                        ' ' +
                        address.city +
                        ', ' +
                        address.country;
            } else {
                return address.buildNr +
                        '' +
                        (address.flatNr ? '/' + address.flatNr : '') +
                        ', ' +
                        address.street +
                        ', ' +
                        address.postCode +
                        ' ' +
                        address.city +
                        ', ' +
                        address.country;
            }

        }

        function queryTransformResponse(data)
        {
            angular.forEach(data, function (obj)
            {
                obj.address = setAddress(obj.address);
            });
            return data;
        }

        var api = $resource('/api/company/:a/:b', null, {
            get: {
                isArray: false
            }, query: {
                method: 'GET', isArray: true,
                transformResponse: $http.defaults.transformResponse.concat(queryTransformResponse)
            }, addCompany: {
                method: 'POST'
            },
            findShortcut: {
                method: 'GET', isArray: true
            },
            update: {
                method: 'PUT'
            }
        });

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
            findShortcut: function (shortcut)
            {
                return api.findShortcut({a: 'shortcut', shortcut: shortcut}).$promise;
            },
            getById: function (id)
            {
                return api.get({a: 'id', id: id}).$promise;
            },
            updateCompany: function (company)
            {
                return api.update(company).$promise;
            }
        };
    }

    angular.module('app').factory('CompanyDAO', ['$resource', '$http', CompanyDAO]);

})();
