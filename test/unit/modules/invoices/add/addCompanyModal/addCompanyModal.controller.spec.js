describe('AddCompanyModalController', function ()
{
    'use strict';

    var modalInstance;
    var addCompanyModal;

    beforeEach(module('app'));
    beforeEach(inject(function($controller){
        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };

        addCompanyModal = $controller('AddCompanyModalController',{$uibModalInstance: modalInstance});
    }));

    describe('initialization', function ()
    {
        it('should set company', function ()
        {
            expect(addCompanyModal.company).toEqual({});
        });
    });

    describe('ok', function ()
    {
        it('should call close', function ()
        {
            addCompanyModal.ok();
            expect(modalInstance.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('cancel', function ()
    {
        it('should call dismiss', function ()
        {
            addCompanyModal.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledTimes(1);
        });
    });
});
