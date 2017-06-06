describe('ContractorsController', function ()
{
    'use strict';

    var listCtrl;
    var companyDaoMock;
    var companyListMock;
    var personListMock;
    var personMOck;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, CompanyDAO, Person)
    {
        companyDaoMock = CompanyDAO;
        personMOck = Person;

        companyListMock = [{
            name: 'Firma X', nip: 5454545454, address: {
                street: 'Zielona', buildNr: '12', flatNr: '14', postCode: '11-111', city: 'Lublin'
            }
        }, {
            name: 'Firma X', nip: 5454545454, address: {
                street: 'Niebieska', buildNr: '15', flatNr: '1', postCode: '22-333', city: 'Warszawa'
            }
        }];

        personListMock = [{
            firstName: 'John', lastName: 'Smith', address: { street: 'GreenHills', buildNr: '12', city: 'Brooklyn', postCode: 'h56 09k'}
        }];

        spyOn(companyDaoMock, 'query').and.callFake(function ()
        {
            return successfulPromise(companyListMock);
        });

        spyOn(personMOck,'getPersons').and.callFake(function(){
            return successfulPromise(personListMock);
        });

        listCtrl = $controller('ContractorsController', {CompanyDAO: companyDaoMock, Person: personMOck});
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
            expect(listCtrl.companies).toEqual(companyListMock.concat(personListMock));
        });
    });

    describe('applyGlobalSearch', function ()
    {
        beforeEach(function ()
        {
            listCtrl.globalSearchTerm = 'Lublin';
            spyOn(listCtrl.companyTable,'filter');
            listCtrl.applyGlobalSearch();
        });
        it('should call companyTable.filter with term', function ()
        {
            expect(listCtrl.companyTable.filter).toHaveBeenCalled();
        });
    });

});
