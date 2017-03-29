describe('AddContractors.controller', function ()
{
    'use strict';

    var addContractor;

    beforeEach(module('app'));
    beforeEach(inject(function($controller){
        addContractor = $controller('AddContractorsController');
    }));

    describe('initialization', function ()
    {
        it('should set message', function ()
        {
            expect(addContractor.message).toEqual('Contractors');
        });
        it('should set company to empty object', function ()
        {
            expect(addContractor.company).toEqual({});
        });
    });

    describe('closeAddCompanySuccess', function ()
    {
        beforeEach(function ()
        {
            addContractor.company = { name: 'Firma test', nip: 1233456788};
        });
        it('before call company should have some value', function ()
        {
            expect(addContractor.company).toEqual({ name: 'Firma test', nip: 1233456788});
        });
        it('should clear company after call function', function ()
        {
            addContractor.closeAddCompanySuccess();
            expect(addContractor.company).toEqual({});
        });
    });
});
