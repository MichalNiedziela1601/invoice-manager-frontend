'use strict';
describe('AddCompanyDirective', function ()
{
    var controller;
    var companyDaoMock;
    var addCompDir;
    var companyMock;
    var form;

    beforeEach(module('app'));
    beforeEach(inject(function (addCompanyDirective, $controller, CompanyDAO)
    {
        addCompDir = addCompanyDirective[0];
        companyDaoMock = CompanyDAO;
        companyMock = {
            name: 'dfghjk', nip: 1234567890, regon: 2345678906, address: {

                buildNr: '4', city: 'Tarnów', flatNr: '76', postCode: '33-100', street: 'sdfghjk'
            }
        };
        spyOn(companyDaoMock, 'addCompany').and.callFake(function ()
        {
            return successfulPromise(companyMock);
        });

        spyOn(companyDaoMock, 'findByNip').and.callFake(function (booleanValue)
        {
            if (booleanValue === 1234567890) {
                return successfulPromise(companyMock);
            } else {
                return unsuccessfulPromise();
            }
        });

        controller = $controller(addCompDir.controller, {CompanyDAO: companyDaoMock});
        controller.showDirective = function ()
        {
            return true;
        };

    }));
    describe('controller', function ()
    {
        describe('initialization', function ()
        {
            it('should addComp set false', function ()
            {
                expect(controller.addComp).toBe(false);
            });
            it('should invalidFormAlert set to false', function ()
            {
                expect(controller.invalidFormAlert).toBe(false);
            });
        });
        describe('addCompany', function ()
        {
            describe('form is valid', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid= true;
                    controller.company = {name: 'Jakub', regon : '',nip: 1234567890};
                    controller.addCompany(form);
                });
                it('should delete regon  ', function ()
                {
                    expect(controller.company).toEqual({name: 'Jakub', nip: 1234567890});
                });
                describe('companyDAO.addCompany should be called with ', function ()
                {
                    it('should be called with controller.company', function ()
                    {
                         expect(companyDaoMock.addCompany).toHaveBeenCalledWith({name: 'Jakub', nip: 1234567890});
                    });
                    it('controller addComp to be true', function ()
                    {
                          expect(controller.addComp).toBe(true);
                    });
                    it('controller showDirective to be true', function ()
                    {
                        expect(controller.showDirective()).toBe(true);
                    });
                });

            });
            describe('form is invalid', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = false;
                    controller.addCompany(form.$valid);

                });

                it('should return true in invalidFormAlert', function ()
                {
                    expect(controller.invalidFormAlert).toBe(true);
                });
            });
        });
        describe('closeAddSuccess', function ()
        {
            beforeEach(function ()
            {
                controller.closeAddSuccess();
            });
            it('should addComp set to false', function ()
            {
                expect(controller.addComp).toBe(false);
            });
        });

        describe('vallidateNip', function ()
        {

            describe('findByNip with valid value', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {nip: 1234567890};

                    controller.validateNip();
                });
                it('companyDaoMock.findByNip should be called with 1234567890', function ()
                {
                    expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
                });
                it('should controller.showAlert must be true', function ()
                {
                    expect(controller.showAlert).toBe(true);
                });

            });
            describe('findByNip with valid value', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {nip: 12345890};
                    controller.validateNip();
                });
                it('companyDaoMock.findByNip should be called with 12345890', function ()
                {
                    expect(companyDaoMock.findByNip).toHaveBeenCalledWith(12345890);
                });
                it('should function go to catch, controller.showAlert must be false', function ()
                {
                    expect(controller.showAlert).toBe(false);
                });
            });
        });
    });
});
