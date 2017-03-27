(function ()
{
    'use strict';
    function AddContractorsController()
    {
        var ctrl = this;
        ctrl.message = 'Contractors';

        ctrl.company = {};

        function closeAddCompanySuccess()
        {
            ctrl.addComp = true;
            ctrl.company = {};
        }
        ctrl.closeAddCompanySuccess = closeAddCompanySuccess;

        ctrl.addComp = false;
    }

    angular.module('app').controller('AddContractorsController', [AddContractorsController]);

})();
