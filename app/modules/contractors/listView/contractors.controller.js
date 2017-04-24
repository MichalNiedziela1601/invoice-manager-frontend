(function ()
{
    'use strict';
    function ContractorsController(CompanyDAO,NgTableParams)
    {
        var ctrl = this;
        ctrl.message = 'Contractors';
        ctrl.itemsByPage = 10;

        CompanyDAO.query().then(function (data)
        {
            ctrl.companies = data;
            ctrl.companyTable = new NgTableParams({
                sorting: { Name: 'asc'}
            }, {
                dataset: ctrl.companies
            });
        });

        function applyGlobalSearch()
        {
            var term = ctrl.globalSearchTerm;
            ctrl.companyTable.filter({$: term});
        }

        ctrl.applyGlobalSearch = applyGlobalSearch;
    }

    angular.module('app').controller('ContractorsController', ['CompanyDAO','NgTableParams', ContractorsController]);

})();
