describe('AddProductModalController', function ()
{
    'use strict';
    var addproductModalCtrl;
    var modalInstance;
    var productMock;
    
    beforeEach(module('app'));
    beforeEach(inject(function($controller){
        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };
        productMock = undefined;
        
        addproductModalCtrl = $controller('AddProductModalController',{$uibModalInstance: modalInstance, product: productMock});
    }));

    describe('when add new product', function ()
    {
        beforeEach(function ()
        {
            productMock = undefined;
        });
        describe('initialization', function ()
        {
            it('should set product', function ()
            {
                expect(addproductModalCtrl.product).toEqual({});
            });
            
        });
    });

    describe('when edit product', function ()
    {
        beforeEach(inject(function ($controller)
        {
            productMock = {
                name: 'Service',
                amount: 2,
                netto: 1000,
                vat: 23,
                brutto: 2460
            };
            addproductModalCtrl = $controller('AddProductModalController',{$uibModalInstance: modalInstance, product: productMock});
        }));
        describe('initialization', function ()
        {
            it('should set product', function ()
            {
                expect(addproductModalCtrl.product).toEqual(productMock);
            });
        });
    });

    describe('ok', function ()
    {
        beforeEach(function ()
        {
            addproductModalCtrl.ok();
        });
        it('should call close', function ()
        {
            expect(modalInstance.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('cancel', function ()
    {
        beforeEach(function ()
        {
            addproductModalCtrl.cancel();
        });
        it('should call dismiss', function ()
        {
            expect(modalInstance.dismiss).toHaveBeenCalledTimes(1);
        });
    });
});
