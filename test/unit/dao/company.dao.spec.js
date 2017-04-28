describe('CompanyDAO', function ()
{
    'use strict';

    var companyDAOMock;
    var mockResponse;
    var httpBackend;
    var scope;

    function transformAddress(address)
    {
        return address.street + ' ' + address.buildNr + '' + (address.flatNr ? '/' + address.flatNr : '') + ' ' + address.postCode + ' ' + address.city;
    }

    beforeEach(module('app'));

    beforeEach(inject(function (CompanyDAO, $httpBackend, $rootScope)
    {
        companyDAOMock = CompanyDAO;
        httpBackend = $httpBackend;
        scope = $rootScope;

    }));

    describe('findByNip', function ()
    {
        beforeEach(function ()
        {
            mockResponse = {
                name: 'Firma 1',
                nip: 1234567890
            };
        });
        it('should return company', function ()
        {
            httpBackend.expectGET('/api/company/1234567890').respond(successfulPromise(mockResponse));
            companyDAOMock.findByNip(1234567890)
                    .then(function (company)
                    {
                        expect(company).toEqual(mockResponse);
                    });
            httpBackend.flush();
        });
    });

    describe('query', function ()
    {
        beforeEach(function ()
        {
            mockResponse = [
                {name: 'Firma 1', address: {street: 'Spokojna', buildNr: '45', flatNr: '4', postCode: '33-100', city: 'Tarnów'}},
                {name: 'Firma 2', address: {street: 'Krakowska', buildNr: '4', postCode: '33-100', city: 'Tarnów'}}
            ];
        });
        it('should return array of companies', function ()
        {
            httpBackend.expectGET('/api/company').respond(200, mockResponse);
            var companies = companyDAOMock.query().then(function (data)
            {
                for (var i = 0; i < 2; i++) {
                    mockResponse[i].address = transformAddress(mockResponse[i].address);
                    expect(data[i].name).toEqual(mockResponse[i].name);
                    expect(data[i].address).toEqual(mockResponse[i].address);
                }
            });
            httpBackend.flush();
            scope.$digest();
            return companies;
        });
    });
    describe('addCompany', function ()
    {
        it('should call addCompany', function ()
        {
            var company = {
                name: 'Firma 1',
                nip: 4354353533
            };
            httpBackend.expect('POST', '/api/company').respond(200, successfulPromise({}));
            companyDAOMock.addCompany(company).then(function (data)
            {
                expect(data).toEqual({});
            });
            httpBackend.flush();
        });
    });

    describe('getNips', function ()
    {
        it('should return nips', function ()
        {
            mockResponse = [
                {nip: 8987564321, name: 'Firma TAK'},
                {nip: 4564561234, name: 'FHU "POLAND"'}
            ];
            httpBackend.expectGET('/api/companies/56').respond(200, mockResponse);
            var companies = companyDAOMock.getNips(56).then(function (data)
            {
                for (var i = 0; i < 2; i++) {
                    expect(data[i].nip).toEqual(mockResponse[i].nip);
                    expect(data[i].name).toEqual(mockResponse[i].name);
                }
            });
            httpBackend.flush();
            scope.$digest();
            return companies;
        });
    });
});
