(function ()
{
    'use strict';
    function InvoicesController(InvoiceDAO, NgTableParams)
    {
        var ctrl = this;
        ctrl.message = 'Invoices';
        ctrl.buyByPage = 10;
        ctrl.sellByPage = 10;


        InvoiceDAO.query({type: 'sell'}).then(function (data)
        {
            ctrl.invoicesListSale = data;
            ctrl.sellTable = new NgTableParams({
                sorting: { invoiceNr: 'asc'}

            }, {
                dataset: ctrl.invoicesListSale
            });
        });
        InvoiceDAO.query({type: 'buy'}).then(function (data)
        {
            ctrl.invoicesListBuy = data;
            ctrl.buyTable = new NgTableParams({
                sorting: { invoiceNr: 'asc'}

            }, {
                dataset: ctrl.invoicesListBuy
            });
        });

        function applyGlobalSearchSell(){
            var term = ctrl.globalSearchTermSell;
            ctrl.sellTable.filter({ $: term});
        }
        function applyGlobalSearchBuy(){
            var term = ctrl.globalSearchTermBuy;
            ctrl.buyTable.filter({ $: term});
        }

        ctrl.applyGlobalSearchSell = applyGlobalSearchSell;
        ctrl.applyGlobalSearchBuy = applyGlobalSearchBuy;
    }

    angular.module('app').controller('InvoicesController', ['InvoiceDAO','NgTableParams', InvoicesController]);

})();
