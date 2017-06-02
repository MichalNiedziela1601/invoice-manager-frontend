'use strict';
describe('AddProductDirective', function ()
{
    var controller;
    var addProdCtrl;
    var entryMock = {netto: 100, vat: 23, amount: 1};
    var $scope, $compile, element;

    beforeEach(module('app'));
    beforeEach(inject(function (addProductDirective, $controller, _$compile_, $rootScope) {
        addProdCtrl = addProductDirective[0];

        controller = $controller(addProdCtrl.controller);
        controller.calculate = function(){
            return true;
        };

        $scope = $rootScope.$new();
        $compile = _$compile_;
        element = $compile('<add-product></add-product>')($scope);

        $scope.$digest();

    }));

    describe('controller', function ()
    {
        describe('initialization', function ()
        {
            it('should set editEntry', function ()
            {
                expect(controller.editEntry).toBeNull();
            });
            it('should set vats', function ()
            {
                expect(controller.vats).toEqual([5,8,23]);
            });

        });

        describe('calculateBrutto', function ()
        {
            describe('when entry have vat and reverseCharge is false', function ()
            {
                beforeEach(function ()
                {
                    controller.reverseCharge = false;
                    controller.calculateBrutto(entryMock);
                });
                it('should calculate brutto', function ()
                {
                    expect(entryMock.brutto).toEqual(123);
                });
            });
            describe('when reverseCharge is true', function ()
            {
                beforeEach(function ()
                {
                    controller.reverseCharge = true;
                    controller.calculateBrutto(entryMock);
                });
                it('should calculate brutto', function ()
                {
                    expect(entryMock.brutto).toEqual(100);
                });
            });
            describe('when entry amount is undefined', function ()
            {
                beforeEach(function ()
                {
                    controller.reverseCharge = false;
                    entryMock = {netto: 100, vat: null};
                    controller.calculateBrutto(entryMock);
                });
                it('should calculate brutto', function ()
                {
                    expect(entryMock.brutto).toEqual(100);
                });
            });
            describe('when entry amount is null', function ()
            {
                beforeEach(function ()
                {
                    controller.reverseCharge = false;
                    entryMock = {netto: 100, vat: null, amount: null};
                    controller.calculateBrutto(entryMock);
                });
                it('should calculate brutto', function ()
                {
                    expect(entryMock.brutto).toEqual(100);
                });
            });
            describe('when entry amount is empty', function ()
            {
                beforeEach(function ()
                {
                    controller.reverseCharge = false;
                    entryMock = {netto: 100, vat: null, amount: ''};
                    controller.calculateBrutto(entryMock);
                });
                it('should calculate brutto', function ()
                {
                    expect(entryMock.brutto).toEqual(100);
                });
            });
            describe('when entry amount is defined and vat is null', function ()
            {
                beforeEach(function ()
                {
                    controller.reverseCharge = false;
                    entryMock = {netto: 100, vat: null, amount: 2};
                    controller.calculateBrutto(entryMock);
                });
                it('should calculate brutto', function ()
                {
                    expect(entryMock.brutto).toEqual(200);
                });
            });
        });

        describe('edit', function ()
        {
            beforeEach(function ()
            {
                entryMock = {editMode: false};
                controller.edit(entryMock);
            });
            it('should set editMode to true', function ()
            {
                expect(entryMock.editMode).toBeTruthy();
            });
            it('should copy to editEntry', function ()
            {
                expect(controller.editEntry).toEqual({editMode: false});
            });
        });

        describe('save', function ()
        {
            beforeEach(function ()
            {
                entryMock = {editMode: true};
                controller.save(entryMock);
            });
            it('should set editMode', function ()
            {
                expect(entryMock.editMode).toBeFalsy();
            });
            it('should empty editEntry', function ()
            {
                expect(controller.editEntry).toBeNull();
            });
            it('should call calculate', function ()
            {
                expect(controller.calculate()).toBe(true);
            });
        });

        describe('cancel', function ()
        {
            describe('when edit', function ()
            {
                beforeEach(function ()
                {
                    controller.products = {'0' : {editEntry: false}};
                    entryMock = {editEndtry: true};
                    controller.edit(controller.products[0]);
                    controller.cancel(controller.products[0],0);
                });
                it('should change editEntry to false ', function ()
                {
                    expect(controller.products[0].editEntry).toBeFalsy();
                });
                it('should set editEntry to null', function ()
                {
                    expect(controller.editEntry).toBeNull();
                });
            });
            describe('when addNew', function ()
            {
                beforeEach(function ()
                {
                    controller.products = {'0' : {editEntry: false}};

                    controller.addNew();
                    controller.cancel(controller.products[1],1);
                });
                it('should delete product', function ()
                {
                    expect(controller.products).toEqual({'0' : {editEntry: false}});
                });
            });
        });

        describe('addNew', function ()
        {
            beforeEach(function ()
            {
                controller.products = {};
                controller.addNew();
            });
            it('should add new product', function ()
            {
                expect(controller.products).toEqual({'0' : {editMode: true, amount: 1, unit: 'unit'}});
            });
        });
        describe('deleteProduct', function ()
        {
            beforeEach(function ()
            {
                controller.products = {'0' : {editMode: true, amount: 1, unit: 'unit'}};
                controller.deleteProduct(0);
            });
            it('should delete product', function ()
            {
                expect(controller.products).toEqual({});
            });
        });
    });

});
