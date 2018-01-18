(function ()
{
    'use strict';
    function ContractorsController(CompanyDAO,NgTableParams, Person)
    {
        var ctrl = this;
        ctrl.message = 'Contractors';
        ctrl.itemsByPage = 10;

        CompanyDAO.query().then(function (data)
        {
            ctrl.companies = data;
            Person.getPersons().then(function(persons)
            {
                ctrl.companies = ctrl.companies.concat(persons);
                ctrl.companyTable = new NgTableParams({
                    sorting: { Name: 'asc'}
                }, {
                    dataset: ctrl.companies
                });
            });

        }).catch(function(error){
            console.error(error);
        });

        function applyGlobalSearch()
        {
            var term = ctrl.globalSearchTerm;
            ctrl.companyTable.filter({$: term});
        }

        ctrl.applyGlobalSearch = applyGlobalSearch;
    }

    angular.module('app').controller('ContractorsController', ['CompanyDAO','NgTableParams','Person', ContractorsController]);

})();
