(function ()
{
    'use strict';
    function InvoicesController(InvoiceDAO)
    {
        var ctrl = this;
        ctrl.message = 'Invoices';
        ctrl.buyByPage = 10;
        ctrl.sellByPage = 10;

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
