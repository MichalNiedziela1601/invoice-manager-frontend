describe('AddContractorsController', function ()
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

});
