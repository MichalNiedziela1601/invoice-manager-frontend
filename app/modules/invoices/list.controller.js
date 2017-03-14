(function ()
{
    'use strict';
    function ListController()
    {
        var ctrl = this;
        ctrl.message = 'Invoices';

    }

    angular.module('app').controller('ListController', ListController);

})();
