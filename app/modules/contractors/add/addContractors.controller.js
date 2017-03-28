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
            ctrl.company = {};
        }
        ctrl.closeAddCompanySuccess = closeAddCompanySuccess;

    }

    angular.module('app').controller('AddContractorsController', [AddContractorsController]);

})();
