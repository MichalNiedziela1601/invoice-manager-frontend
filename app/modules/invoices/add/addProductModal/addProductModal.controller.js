(function ()
{
    'use strict';

    function AddProductModalController($uibModalInstance, product)
    {
        var ctrl = this;
        ctrl.product = product || {};

        ctrl.ok = function ()
        {
            $uibModalInstance.close(ctrl.product);
        };

        ctrl.cancel = function ()
        {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular.module('app')
            .controller('AddProductModalController', ['$uibModalInstance','product', AddProductModalController]);


})();
