'use strict';
describe('InvoiceDetailsController', function ()
{
    var InvoiceDetailsDAOMock;
    var $routeParamsMock;
    var invoiceDetailsCtrlMock;
    var invoiceMock;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, $routeParams)
    {
        $routeParamsMock = $routeParams;
        invoiceMock = {
            invoiceNr: 'FV 12/2/345',
            nettoValue: 456.56,
            bruttoValue: 589.89
        };

        $routeParamsMock.id = 1;

        InvoiceDetailsDAOMock = jasmine.createSpyObj('InvoiceDetailsDAO', ['query']);
        InvoiceDetailsDAOMock.query.and.callFake(function ()
        {
            return successfulPromise(invoiceMock);
        });

        invoiceDetailsCtrlMock = $controller('InvoiceDetailsController', {$routeParams: $routeParamsMock, InvoiceDetailsDAO: InvoiceDetailsDAOMock});
    }));

    describe('initialization', function ()
    {
        it('should set message', function ()
        {
            expect(invoiceDetailsCtrlMock.message).toEqual('Details Invoice');
        });
        it('should set id from routeParams', function ()
        {
            expect(invoiceDetailsCtrlMock.id).toEqual(1);
        });
        it('should call InvoiceDetailsDAO.query', function ()
        {
            expect(InvoiceDetailsDAOMock.query).toBeDefined();
            expect(InvoiceDetailsDAOMock.query).toHaveBeenCalled();
        });
        it('should call InvoiceDetailsDAO.query with id', function ()
        {
            expect(InvoiceDetailsDAOMock.query).toHaveBeenCalledWith({id: 1});
        });
        it('should set invoiceDetalis', function ()
        {
            expect(invoiceDetailsCtrlMock.details).toBe(invoiceMock);
        });
    });

});
