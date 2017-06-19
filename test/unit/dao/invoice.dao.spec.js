'use strict';
describe('InvoiceDAO', function ()
{
    var invoiceDAOMock;
    var mockResponse;
    var httpBackend;
    var scope;
    var promise;

    beforeEach(module('app'));

    beforeEach(inject(function (InvoiceDAO, $httpBackend, $rootScope)
    {
        invoiceDAOMock = InvoiceDAO;
        httpBackend = $httpBackend;
        scope = $rootScope;

    }));
    afterEach(function ()
    {
        httpBackend.verifyNoOutstandingRequest();
        httpBackend.verifyNoOutstandingExpectation();
    });

    describe('query', function ()
    {
        describe('when type is sell', function ()
        {
            it('should return sell invoices', function ()
            {
                mockResponse = [{id: 1, type: 'sell'}, {id: 4, type: 'sell'}];
                httpBackend.expectGET('/api/invoice?type=sell').respond(200, mockResponse);
                promise = invoiceDAOMock.query({type: 'sell'});

                promise.then(function (data)
                {
                    expect(data[0].id).toEqual(1);
                    expect(data[1].id).toEqual(4);
                });
                httpBackend.flush();
                scope.$digest();
            });
        });
        describe('when type is buy', function ()
        {
            it('should return buy invoices', function ()
            {
                mockResponse = [{id: 1, type: 'buy'}, {id: 4, type: 'buy'}];
                httpBackend.expectGET('/api/invoice?type=buy').respond(200, mockResponse);
                promise = invoiceDAOMock.query({type: 'buy'});

                promise.then(function (data)
                {
                    expect(data[0].id).toEqual(1);
                    expect(data[1].id).toEqual(4);
                });
                httpBackend.flush();
                scope.$digest();
            });
        });
    });

    describe('add', function ()
    {
        describe('when add successfully', function ()
        {
            it('should return 200', function ()
            {
                httpBackend.expectPOST('/api/invoice/upload').respond(200, {});
                invoiceDAOMock.add({invoiceNr: 'FV 2017/5/12'}).then(function (data)
                {
                    expect(data[0]).toEqual();
                });
                httpBackend.flush();
                scope.$digest();
            });
        });
        describe('when invoice not have a createDate property', function ()
        {
            it('should return 400', function ()
            {
                httpBackend.expectPOST('/api/invoice/upload').respond(400, {data: 'createDate cannot be null'});
                invoiceDAOMock.add({invoiceNr: 'FV 2017/5/12'}).catch(function (error)
                {
                    expect(error.data).toEqual({data: 'createDate cannot be null'});
                    expect(error.status).toBe(400);
                });
                httpBackend.flush();
            });
        });
    });

    describe('issue', function ()
    {
        describe('when add successfully', function ()
        {
            it('should return 200', function ()
            {
                httpBackend.expectPOST('/api/invoice/issue').respond(200, {});
                invoiceDAOMock.issue({invoiceNr: 'FV 2017/5/12'}).then(function (data)
                {
                    expect(data[0]).toEqual();
                });
                httpBackend.flush();
                scope.$digest();
            });
        });
        describe('when invoice not have a createDate property', function ()
        {
            it('should return 400', function ()
            {
                httpBackend.expectPOST('/api/invoice/issue').respond(400, {data: 'createDate cannot be null'});
                invoiceDAOMock.issue({invoiceNr: 'FV 2017/5/12'}).catch(function (error)
                {
                    expect(error.data).toEqual({data: 'createDate cannot be null'});
                    expect(error.status).toBe(400);
                });
                httpBackend.flush();
            });
        });
    });

    describe('number', function ()
    {
        it('should return number', function ()
        {
            httpBackend.expectGET('/api/invoice/number?year=2017&month=5&type=sell').respond(200, {number: 2});
            invoiceDAOMock.number(2017, 5, 'sell').then(function (data)
            {
                expect(data.number).toEqual(2);
            });
            httpBackend.flush();
        });
    });
});
