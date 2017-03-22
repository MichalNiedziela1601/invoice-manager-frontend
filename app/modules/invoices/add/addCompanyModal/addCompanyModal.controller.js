(function ()
{
    'use strict';

    function AddCompanyModalController($uibModalInstance, companyDetails)
    {
        var ctrl = this;
        ctrl.companyDetails = companyDetails;

        ctrl.ok = function ()
        {
            $uibModalInstance.close(ctrl.companyDetails);
        };

        ctrl.cancel = function ()
        {
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular.module('app')
            .controller('AddCompanyModalController', ['$uibModalInstance', 'companyDetails', AddCompanyModalController]);
})();
