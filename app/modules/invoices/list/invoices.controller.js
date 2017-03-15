(function ()
{
    'use strict';
    function InvoicesController(InvoiceDAO)
    {
        var ctrl = this;
        ctrl.message = 'Invoices';

        InvoiceDAO.query().then(function (data)
        {
            ctrl.invoicesList = data;
        });
    }

    angular.module('app').controller('InvoicesController', ['InvoiceDAO', InvoicesController]);

})();
