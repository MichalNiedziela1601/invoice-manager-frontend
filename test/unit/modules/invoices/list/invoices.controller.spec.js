'use strict';
describe('InvoiceListController', function ()
{
    var InvoiceDAOMock;
    var invoiceCtrl;
    var invoices;
    var filterSell;
    var filterBuy;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller)
    {
        invoices = [
            {id: 1, invoiceNr: 'Fv 12/23', type: 'sell'},
            {id: 2, invoiceNr: 'Fv 12/43', type: 'buy'},
            {id: 3, invoiceNr: 'Fv 12/33', type: 'sell'}
        ];
        filterBuy = {type: 'buy'};
        filterSell = {type: 'sell'};

        InvoiceDAOMock = jasmine.createSpyObj('InvoiceDAO', ['query']);
        InvoiceDAOMock.query.and.callFake(function (filter)
        {
            if (filter.type === filterSell.type) {
                return successfulPromise([invoices[0], invoices[2]]);
            }
            else if (filter.type === filterBuy.type) {
                return successfulPromise(invoices[1]);
            }
        });
        invoiceCtrl = $controller('InvoicesController', {InvoiceDAO: InvoiceDAOMock});
    }));

    describe('Initialization', function ()
    {
        it('should set message', function ()
        {
            expect(invoiceCtrl.message).toEqual('Invoices');
        });
        it('should call InvoiceDAO.query', function ()
        {
            expect(InvoiceDAOMock.query).toBeDefined();
            expect(InvoiceDAOMock.query).toHaveBeenCalled();
        });
        it('should call InvoceDAO.query twice', function ()
        {
            expect(InvoiceDAOMock.query).toHaveBeenCalledTimes(2);
        });
        it('should call InvoiceDAO.query with type: sell', function ()
        {
            expect(InvoiceDAOMock.query.calls.first().args[0]).toEqual(filterSell);
        });
        it('should call InvoiceDAO.query with type: buy', function ()
        {
            expect(InvoiceDAOMock.query.calls.mostRecent().args[0]).toEqual(filterBuy);
        });
        it('should set invoicesListSale', function ()
        {
            expect(invoiceCtrl.invoicesListSale).toEqual([invoices[0], invoices[2]]);
        });
        it('should set invoicesListBuy', function ()
        {
            expect(invoiceCtrl.invoicesListBuy).toEqual(invoices[1]);
        });
    });
});
