(function ()
{
    'use strict';
    function ContractorsController()
    {
        var ctrl = this;
        ctrl.message = 'Contractors';
    }

    angular.module('app').controller('ContractorsController', ContractorsController);

})();
