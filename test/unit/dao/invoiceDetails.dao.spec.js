'use strict';
describe('InvoiceDetailsDAO', function ()
{
    var invoiceDetailDAOMock;
    var httpBackend;
    var mockResponse;
    var scope;

    beforeEach(module('app'));
    beforeEach(inject(function(InvoiceDetailsDAO,$httpBackend, $rootScope){
        invoiceDetailDAOMock = InvoiceDetailsDAO;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation(false);
        httpBackend.verifyNoOutstandingRequest();
    });
    describe('query', function ()
    {
        it('should return invoice', function ()
        {
            httpBackend.expectGET('/api/invoice').respond(200);
            invoiceDetailDAOMock.query(1);
            httpBackend.flush();
        });
    });

    describe('update', function ()
    {
        it('should update invoice', function ()
        {
            httpBackend.expectPUT('/api/invoice/1').respond(200);
            invoiceDetailDAOMock.update(1,{id: 1});
            httpBackend.flush();
        });
    });

    describe('changeStatus', function ()
    {
        it('should change status', function ()
        {
            httpBackend.expectPUT('/api/invoice/1/status').respond(200);
            invoiceDetailDAOMock.changeStatus(1,'paid');
            httpBackend.flush();
        });
    });
});
