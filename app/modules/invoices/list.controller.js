(function ()
{
    'use strict';
    function ListController(ListService)
    {
        var ctrl = this;
        ctrl.message = 'Invoices';

        ListService.get().then(function (data)
        {
            ctrl.invoicesList = data;
        });
    }

    angular.module('app').controller('ListController', ['ListService', ListController]);

})();
