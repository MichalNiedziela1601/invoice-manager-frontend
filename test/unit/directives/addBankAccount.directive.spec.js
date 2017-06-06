'use strict';
describe('AddBankAccountDirective', function ()
{
    var controller;
    var addBankAccountCtrl;
    var entryMock = {editMode: false, bankName: 'Bank', swift: 'swift'};

    beforeEach(module('app'));
    beforeEach(inject(function (addBankAccountDirective, $controller)
    {
        addBankAccountCtrl = addBankAccountDirective[0];

        controller = $controller(addBankAccountCtrl.controller);

    }));

    describe('controller', function ()
    {
        describe('initialization', function ()
        {
            it('should set editEntry', function ()
            {
                expect(controller.editEntry).toBeNull();
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
        });

        describe('cancel', function ()
        {
            describe('when edit', function ()
            {
                beforeEach(function ()
                {
                    controller.accounts = {'0': {editEntry: false}};
                    entryMock = {editEndtry: true};
                    controller.edit(controller.accounts[0]);
                    controller.cancel(controller.accounts[0], 0);
                });
                it('should change editEntry to false ', function ()
                {
                    expect(controller.accounts[0].editEntry).toBeFalsy();
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
                    controller.accounts = {'0': {editEntry: false}};

                    controller.addNew();
                    controller.cancel(controller.accounts[1], 1);
                });
                it('should delete product', function ()
                {
                    expect(controller.accounts).toEqual({'0': {editEntry: false}});
                });
            });
        });

        describe('addNew', function ()
        {
            describe('when accounts null', function ()
            {
                beforeEach(function ()
                {
                    controller.accounts = {};
                    controller.addNew();
                });
                it('should add new product', function ()
                {
                    expect(controller.accounts).toEqual({'0': {editMode: true, bankName: '', swift: null}});
                });
            });
            describe('when accounts not exists', function ()
            {
                beforeEach(function ()
                {
                    controller.accounts = null;
                    controller.addNew();
                });
                it('should add new product', function ()
                {
                    expect(controller.accounts).toEqual({'0': {editMode: true, bankName: '', swift: null}});
                });
            });

        });
        describe('delete', function ()
        {
            beforeEach(function ()
            {
                controller.accounts = {'0': {editMode: true, bankName: '', swift: null}};
                controller.delete(0);
            });
            it('should delete product', function ()
            {
                expect(controller.accounts).toEqual({});
            });
        });
    });

});

