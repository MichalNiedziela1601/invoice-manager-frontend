describe('CompanyDAO', function ()
{
    'use strict';

    var companyDAOMock;
    var mockResponse;
    var httpBackend;
    var scope;

    function transformAddress(address)
    {
        if ('GB' !== address.countryCode) {
            return address.street +
                    ' ' +
                    address.buildNr +
                    '' +
                    (address.flatNr ? '/' + address.flatNr : '') +
                    ', ' +
                    address.postCode +
                    ' ' +
                    address.city +
                    ', ' +
                    address.country;
        } else {
            return address.buildNr +
                    '' +
                    (address.flatNr ? '/' + address.flatNr : '') +
                    ', ' +
                    address.street +
                    ', ' +
                    address.postCode +
                    ' ' +
                    address.city +
                    ', ' +
                    address.country;
        }
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
                {
                    name: 'Firma 1',
                    address: {street: 'Spokojna', buildNr: '45', flatNr: '4', postCode: '33-100', city: 'Tarnów', country: 'Poland', countryCode: 'PL'}
                },
                {
                    name: 'Firma 2',
                    address: {street: 'Krakowska', buildNr: '4', postCode: '33-100', city: 'Tarnów', country: 'Poland', countryCode: 'GB'}
                }
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

    describe('findShortcut', function ()
    {
        describe('when find shortcut', function ()
        {
            it('should return id of result', function ()
            {
                mockResponse = [{id: 4}];
                httpBackend.expectGET('/api/company/shortcut?shortcut=MELEX').respond(200, mockResponse);
                companyDAOMock.findShortcut({shortcut: 'MELEX'}).then(function (data)
                {
                    httpBackend.flush();
                    expect(data[0].id).toBe(4);
                });
            });
        });
        describe('when not found shortcut', function ()
        {
            it('should return empty array', function ()
            {
                mockResponse = [];
                httpBackend.expectGET('/api/company/shortcut?shortcut=JAN').respond(200, mockResponse);
                companyDAOMock.findShortcut({shortcut: 'JAN'}).then(function (data)
                {
                    httpBackend.flush();
                    expect(data).toEqual();
                });
            });

        });
    });

    describe('getById', function ()
    {
        it('should return company', function ()
        {
            mockResponse =
            {id: 1, name: 'Firma test', nip: 1234567890, addressId: 1, address: {street: 'TEst', buildNr: '4', postCode: '44-444', city: 'Test'}};
            httpBackend.expectGET('/api/company/id?id=1').respond(200, mockResponse);
            companyDAOMock.getById(1).then(function (data)
            {
                httpBackend.flush();
                expect(data).toEqual(mockResponse);
            });
            scope.$digest();
        });
    });

    describe('update', function ()
    {
        it('should return code 200', function ()
        {
            var responseStatus;
            httpBackend.whenPUT('/api/company').respond(200, {status: 200});
            var response = companyDAOMock.updateCompany({name: 'New Firm name'}).then(function (data)
            {
                responseStatus = data;
            });
            httpBackend.flush();
            scope.$digest();
            expect(responseStatus.status).toEqual(200);
            return response;
        });
    });


});
