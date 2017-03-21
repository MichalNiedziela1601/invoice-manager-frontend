(function ()
{
    'use strict';

    function AddCompanyModalController($uibModalInstance)
    {
        var ctrl = this;
        ctrl.company = {};

        ctrl.ok = function ()
        {
            $uibModalInstance.close(ctrl.company);
        };

        ctrl.cancel = function ()
        {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular.module('app')
            .controller('AddCompanyModalController', ['$uibModalInstance', AddCompanyModalController]);


})();
