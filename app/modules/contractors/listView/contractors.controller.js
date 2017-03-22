(function ()
{
    'use strict';
    function ContractorsController(CompanyDAO)
    {
        var ctrl = this;
        ctrl.message = 'Contractors';

        CompanyDAO.query().then(function (data)
        {
            ctrl.companies = data;
        });
        ctrl.company = {

        };
    }

    angular.module('app').controller('ContractorsController', ['CompanyDAO', ContractorsController]);

})();
