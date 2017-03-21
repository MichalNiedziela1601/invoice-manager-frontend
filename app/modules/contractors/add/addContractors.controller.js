(function ()
{
    'use strict';
    function AddContractorsController()
    {
        var ctrl = this;
        ctrl.message = 'Contractors';

        ctrl.company = {};
    }

    angular.module('app').controller('AddContractorsController', [AddContractorsController]);

})();
