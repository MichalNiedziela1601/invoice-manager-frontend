describe('ContractorsController', function ()
{
    'use strict';

    var listCtrl;
    var companyDaoMock;
    var companyListMock;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, CompanyDAO)
    {
        companyDaoMock = CompanyDAO;

        companyListMock = [{
            name: 'Firma X', nip: 5454545454, address: {
                street: 'Zielona', buildNr: '12', flatNr: '14', postCode: '11-111', city: 'Lublin'
            }
        }, {
            name: 'Firma X', nip: 5454545454, address: {
                street: 'Niebieska', buildNr: '15', flatNr: '1', postCode: '22-333', city: 'Warszawa'
            }
        }];

        spyOn(companyDaoMock, 'query').and.callFake(function ()
        {
            return successfulPromise(companyListMock);
        });

        listCtrl = $controller('ContractorsController', {CompanyDAO: companyDaoMock});
    }));

    describe('initialization', function ()
    {
        it('should set message variable', function ()
        {
            expect(listCtrl.message).toEqual('Contractors');
        });
        it('should itemsByPage variable', function ()
        {
            expect(listCtrl.itemsByPage).toEqual(10);
        });
        it('should set data from CompanyDAO service to companies variable', function ()
        {
            expect(listCtrl.companies).toEqual(companyListMock);
        });
    });
});
