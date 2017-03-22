(function ()
{
    'use strict';
    function InvoicesController(InvoiceDAO)
    {
        var ctrl = this;
        ctrl.message = 'Invoices';

        InvoiceDAO.query({type: 'sell'}).then(function (data)
        {
            ctrl.invoicesListSale = data;
        });
        InvoiceDAO.query({type: 'buy'}).then(function (data)
        {
            ctrl.invoicesListBuy = data;
        });
    }

    angular.module('app').controller('InvoicesController', ['InvoiceDAO', InvoicesController]);

})();
