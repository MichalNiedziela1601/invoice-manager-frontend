(function ()
{
    'use strict';
    function ContractorsController(CompanyDAO)
    {
        var ctrl = this;
        ctrl.message = 'Contractors';
        ctrl.itemsByPage = 10;

        CompanyDAO.query().then(function (data)
        {
            ctrl.companies = data;
        });
    }

    angular.module('app').controller('ContractorsController', ['CompanyDAO', ContractorsController]);

})();
