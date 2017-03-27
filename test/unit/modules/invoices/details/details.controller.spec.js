'use strict';
describe('InvoiceDetailsController', function ()
{
    var DetailsDAOMock;
    var $routeParamsMock;
    var detailsCtrlMock;
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

        DetailsDAOMock = jasmine.createSpyObj('SetailsDAO', ['query']);
        DetailsDAOMock.query.and.callFake(function ()
        {
            return successfulPromise(invoiceMock);
        });

        detailsCtrlMock = $controller('DetailsController', {$routeParams: $routeParamsMock, DetailsDAO: DetailsDAOMock});
    }));

    describe('initialization', function ()
    {
        it('should set message', function ()
        {
            expect(detailsCtrlMock.message).toEqual('Details Invoice');
        });
        it('should set id from routeParams', function ()
        {
            expect(detailsCtrlMock.id).toEqual(1);
        });
        it('should call DetailsDAO.query', function ()
        {
            expect(DetailsDAOMock.query).toBeDefined();
            expect(DetailsDAOMock.query).toHaveBeenCalled();
        });
        it('should call DetailsDAO.query with id', function ()
        {
            expect(DetailsDAOMock.query).toHaveBeenCalledWith({id: 1});
        });
        it('should set invoiceDetalis', function ()
        {
            expect(detailsCtrlMock.invoiceDetails).toBe(invoiceMock);
        });
    });

});
