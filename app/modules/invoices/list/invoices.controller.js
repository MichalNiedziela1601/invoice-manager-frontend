(function ()
{
    'use strict';
    function InvoicesController(ListService)
    {
        var ctrl = this;
        ctrl.message = 'Invoices';

        ListService.get().then(function (data)
        {
            ctrl.invoicesList = data;
        });
    }

    angular.module('app').controller('InvoicesController', ['ListService', InvoicesController]);

})();
