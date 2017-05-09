'use strict';
describe('AddNewProductDirective', function ()
{
    var controller;
    var addNewProduct;
    var productMock;
    var form;

    beforeEach(module('app'));
    beforeEach(inject(function(addNewProductDirective,$controller){
        addNewProduct = addNewProductDirective[0];
        productMock = { name: 'Product 1', netto: 345.45, vat: 23, amount: 1};

        controller = $controller(addNewProduct.controller);
        controller.product = productMock;
        controller.addProduct = function(){};
    }));

    describe('initialization', function ()
    {
        it('should set vats', function ()
        {
            expect(controller.vats).toEqual([
                { vat: 5},
                { vat: 8},
                { vat: 23},
                { vat: 'N/A'}
            ]);
        });
    });

    describe('calculateBrutto', function ()
    {
        describe('when amount exists and vat is not N/A', function ()
        {
            beforeEach(function ()
            {
                controller.calculateBrutto();
            });
            it('should set brutto', function ()
            {
                expect(controller.product.brutto).toEqual(parseFloat((productMock.netto * (1 +productMock.vat/100) * productMock.amount).toFixed(2),10));
            });
        });
        describe('when vat is N/A', function ()
        {
            describe('when amount is undefined', function ()
            {
                beforeEach(function ()
                {
                    productMock = { name: 'Product 1', netto: 3000.00, vat: 'N/A'};
                    controller.product = productMock;
                    controller.calculateBrutto();
                });
                it('should set brutto', function ()
                {
                    expect(controller.product.brutto).toEqual(parseFloat(productMock.netto));
                });
            });
            describe('wehn amount is defined', function ()
            {
                beforeEach(function ()
                {
                    productMock = { name: 'Product 1', netto: 3000.00, vat: 'N/A', amount: 2};
                    controller.product = productMock;
                    controller.calculateBrutto();
                });
                it('should set brutto', function ()
                {
                    expect(controller.product.brutto).toEqual(parseFloat(productMock.netto * productMock.amount));
                });
            });
        });
    });
    describe('add', function ()
    {
        beforeEach(function ()
        {
            spyOn(controller,'addProduct');
            form = {};
            form.$valid = true;
            controller.add(form);
        });
        it('should call addProduct', function ()
        {
            expect(controller.addProduct).toHaveBeenCalled();
        });
    });
});
