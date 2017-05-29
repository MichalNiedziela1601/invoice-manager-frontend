'use strict';
describe('AddCompanyDirective', function ()
{
    var controller;
    var companyDaoMock;
    var addCompDir;
    var companyMock;
    var form;
    var scope;
    var Person;
    var timeout;

    beforeEach(module('app'));
    beforeEach(inject(function (addCompanyDirective, $controller, CompanyDAO, $rootScope, _Person_, $timeout)
    {
        addCompDir = addCompanyDirective[0];
        companyDaoMock = CompanyDAO;
        scope = $rootScope.$new();
        Person = _Person_;
        timeout = $timeout;
        companyMock = {
            name: 'dfghjk', nip: 1234567890, regon: 2345678906, address: {

                buildNr: '4', city: 'Tarnów', flatNr: '76', postCode: '33-100', street: 'sdfghjk'
            }
        };


        spyOn(companyDaoMock, 'findByNip').and.callFake(function (booleanValue)
        {
            if (booleanValue === 1234567890) {
                return successfulPromise(companyMock);
            } else {
                return unsuccessfulPromise();
            }
        });

        controller = $controller(addCompDir.controller, {CompanyDAO: companyDaoMock, $scope: scope, Person: Person});

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
            it('should personAdded set false', function ()
            {
                expect(controller.personAdded).toBeFalsy();
            });
        });

        describe('watchCollections', function ()
        {
            describe('when type is not defined', function ()
            {
                it('should disablePerson to be undefined', function ()
                {
                    expect(controller.disablePerson).toBeUndefined();
                });
                it('should disableCompany to be undefined', function ()
                {
                    expect(controller.disableCompany).toBeUndefined();
                });
                it('should activeTab to be undefinde', function ()
                {
                    expect(controller.activeTab).toBeUndefined();
                });
                it('should disableFormPerson to be undefined', function ()
                {
                    expect(controller.disableFormPerson).toBeUndefined();
                });
                it('should disableFormCompany to be undefined', function ()
                {
                    expect(controller.disableFormCompany).toBeUndefined();
                });
            });

            describe('when type is company', function ()
            {
                beforeEach(function ()
                {
                    controller.type = 'company';
                    scope.$digest();
                });
                it('should disablePerson to be true', function ()
                {
                    expect(controller.disablePerson).toBeTruthy();
                });
                it('should disableCompany to be false', function ()
                {
                    expect(controller.disableCompany).toBeFalsy();
                });
                it('should activeTab to be 0', function ()
                {
                    expect(controller.activeTab).toBe(0);
                });
                it('should disableFormPerson to be true', function ()
                {
                    expect(controller.disableFormPerson).toBeTruthy();
                });
                it('should disableFormCompany to be true', function ()
                {
                    expect(controller.disableFormCompany).toBeTruthy();
                });
            });

            describe('when type is person', function ()
            {
                beforeEach(function ()
                {
                    controller.type = 'person';
                    controller.company = {firstName: 'Adam', lastName: 'Nowak'};
                    scope.$digest();
                });
                it('should disablePerson to be false', function ()
                {
                    expect(controller.disablePerson).toBeFalsy();
                });
                it('should disableCompany to be true', function ()
                {
                    expect(controller.disableCompany).toBeTruthy();
                });
                it('should activeTab to be 1', function ()
                {
                    expect(controller.activeTab).toBe(1);
                });
                it('should disableFormPerson to be true', function ()
                {
                    expect(controller.disableFormPerson).toBeTruthy();
                });
                it('should disableFormCompany to be true', function ()
                {
                    expect(controller.disableFormCompany).toBeTruthy();
                });
                it('should set person', function ()
                {
                    expect(controller.person).toEqual({firstName: 'Adam', lastName: 'Nowak'});
                });
                it('should set company to empty object', function ()
                {
                    expect(controller.company).toBeNull();
                });
            });
        });
        describe('addCompany', function ()
        {
            describe('when form is valid and not edit', function ()
            {
                beforeEach(function ()
                {
                    spyOn(companyDaoMock, 'addCompany').and.callFake(function ()
                    {
                        return successfulPromise(companyMock);
                    });
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    controller.company = {name: 'Jakub', regon: null, nip: 1234567890};
                    controller.addCompany(form);
                });
                it('should set company to empty  ', function ()
                {
                    expect(controller.company).toEqual({});
                });
                describe('companyDAO.addCompany should be called with ', function ()
                {
                    it('should be called with controller.company', function ()
                    {
                        expect(companyDaoMock.addCompany).toHaveBeenCalledWith({name: 'Jakub', regon: null, nip: 1234567890});
                    });
                    it('should set invalidFormAlert to false', function ()
                    {
                        expect(controller.invalidFormAlert).toBe(false);
                    });
                    it('should call form $setPristine', function ()
                    {
                        expect(form.$setPristine).toHaveBeenCalled();
                    });
                    it('controller addComp to be true', function ()
                    {
                        expect(controller.addComp).toBe(true);
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

            describe('when addCompany throw error', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    spyOn(companyDaoMock, 'addCompany').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: 'Error'});
                    });
                    controller.company = {name: 'Jakub', regon: null, nip: 1234567890};
                    controller.addCompany(form);
                });
                it('should set showError to true', function ()
                {
                    expect(controller.showError).toBeTruthy();
                });
                it('should set errorMessage', function ()
                {
                    expect(controller.errorMessage).toEqual('Error');
                });
            });

            describe('when form is valid and edit is defined', function ()
            {
                beforeEach(function ()
                {
                    spyOn(companyDaoMock, 'updateCompany').and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    controller.edit = true;
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    controller.company = {name: 'Jakub', regon: null, nip: 1234567890};
                    controller.addCompany(form);
                });

                describe('companyDAO.update should be called with ', function ()
                {
                    it('should be called with controller.company', function ()
                    {
                        expect(companyDaoMock.updateCompany).toHaveBeenCalledWith({name: 'Jakub', regon: null, nip: 1234567890});
                    });
                    it('should set invalidFormAlert to false', function ()
                    {
                        expect(controller.invalidFormAlert).toBe(false);
                    });
                    it('should set disableFormCompany', function ()
                    {
                        expect(controller.disableFormCompany).toBeTruthy();
                    });
                    it('should call form $setPristine', function ()
                    {
                        expect(form.$setPristine).toHaveBeenCalled();
                    });
                    it('controller addComp to be true', function ()
                    {
                        expect(controller.addComp).toBe(true);
                    });
                });

            });

            describe('when updateCompany throw error', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    controller.edit = true;
                    spyOn(form, '$setPristine');
                    spyOn(companyDaoMock, 'updateCompany').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: {message: 'Something bad happens'}});
                    });
                    controller.company = {name: 'Jakub', regon: null, nip: 1234567890};
                    controller.addCompany(form);
                });
                it('should set showError to true', function ()
                {
                    expect(controller.showError).toBeTruthy();
                });
                it('should set errorMessage', function ()
                {
                    expect(controller.errorMessage).toEqual('Something bad happens');
                });
            });
        });

        describe('closeInvalidFormAlert', function ()
        {
            beforeEach(function ()
            {
                controller.closeInvalidFormAlert();
            });
            it('should set invalidFormAlert to false', function ()
            {
                expect(controller.invalidFormAlert).toBeFalsy();
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

        describe('validateNipPerson', function ()
        {
            describe('when find nip', function ()
            {
                beforeEach(function ()
                {
                    spyOn(Person, 'findByNip').and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    controller.person = {nip: 1234567890};
                    controller.validateNipPerson();
                });
                it('should call Person.findByNip', function ()
                {
                    expect(Person.findByNip).toHaveBeenCalledTimes(1);
                });
                it('should call Person.findByNip with nip', function ()
                {
                    expect(Person.findByNip).toHaveBeenCalledWith(1234567890);
                });
                it('should set showAlert to true', function ()
                {
                    expect(controller.showAlert).toBeTruthy();
                });
            });
            describe('when not find nip', function ()
            {
                beforeEach(function ()
                {
                    spyOn(Person, 'findByNip').and.callFake(function ()
                    {
                        return unsuccessfulPromise();
                    });
                    controller.person = {nip: 1234567890};
                    controller.validateNipPerson();
                });
                it('should set showAlert to false', function ()
                {
                    expect(controller.showAlert).toBeFalsy();
                });
            });
        });

        describe('validateShortcut', function ()
        {
            describe('when not found shortcut', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {shortcut: 'short'};
                    spyOn(companyDaoMock, 'findShortcut').and.callFake(function ()
                    {
                        return successfulPromise({});
                    });
                    controller.validateShortcut();
                    timeout.flush(401);
                    timeout.verifyNoPendingTasks();

                });
                it('should set showShortcut to false', function ()
                {
                    expect(controller.showShortcut).toBeFalsy();
                });
            });
            describe('when found shortcut', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {shortcut: 'short'};
                    spyOn(companyDaoMock, 'findShortcut').and.callFake(function ()
                    {
                        return successfulPromise({0: {shortcut: 'short'}});
                    });
                    controller.validateShortcut();
                    timeout.flush(401);
                    timeout.verifyNoPendingTasks();

                });
                it('should set showShortcut to false', function ()
                {
                    expect(controller.showShortcut).toBeTruthy();
                });
            });
            describe('when throw error', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {shortcut: 'short'};
                    spyOn(companyDaoMock, 'findShortcut').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: 'Cannot connect'});
                    });
                    spyOn(console, 'error');
                    controller.validateShortcut();
                    timeout.flush(401);
                    timeout.verifyNoPendingTasks();

                });
                it('should call console.error', function ()
                {
                    expect(console.error).toHaveBeenCalledTimes(1);
                });
                it('should call console.error with error', function ()
                {
                    expect(console.error).toHaveBeenCalledWith({data: 'Cannot connect'});
                });
            });
        });

        describe('validateShortcutPerson', function ()
        {
            describe('when not found shortcut', function ()
            {
                beforeEach(function ()
                {
                    controller.person = {shortcut: 'short'};
                    spyOn(Person, 'findShortcut').and.callFake(function ()
                    {
                        return successfulPromise({});
                    });
                    controller.validateShortcutPerson();
                    timeout.flush(401);
                    timeout.verifyNoPendingTasks();

                });
                it('should set showShortcut to false', function ()
                {
                    expect(controller.showShortcut).toBeFalsy();
                });
            });
            describe('when found shortcut', function ()
            {
                beforeEach(function ()
                {
                    controller.person = {shortcut: 'short'};
                    spyOn(Person, 'findShortcut').and.callFake(function ()
                    {
                        return successfulPromise({0: {shortcut: 'short'}});
                    });
                    controller.validateShortcutPerson();
                    timeout.flush(401);
                    timeout.verifyNoPendingTasks();

                });
                it('should set showShortcut to false', function ()
                {
                    expect(controller.showShortcut).toBeTruthy();
                });
            });
            describe('when throw error', function ()
            {
                beforeEach(function ()
                {
                    controller.person = {shortcut: 'short'};
                    spyOn(Person, 'findShortcut').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: 'Cannot connect'});
                    });
                    spyOn(window.console, 'error');
                    controller.validateShortcutPerson();
                    timeout.flush(401);
                    timeout.verifyNoPendingTasks();

                });
                it('should call console.error', function ()
                {
                    expect(console.error).toHaveBeenCalledTimes(1);
                });
                it('should call console.error with error', function ()
                {
                    expect(console.error).toHaveBeenCalledWith({data: 'Cannot connect'});
                });
            });
        });

        describe('addPerson', function ()
        {
            describe('when form is valid and not edit', function ()
            {
                beforeEach(function ()
                {
                    spyOn(Person, 'addPerson').and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    controller.person = {firstName: 'Jakub', nip: 1234567890};
                    controller.addPerson(form);
                });
                it('should set company to empty  ', function ()
                {
                    expect(controller.person).toEqual({});
                });
                describe('Person.addPerson should be called with ', function ()
                {
                    it('should be called with controller.person', function ()
                    {
                        expect(Person.addPerson).toHaveBeenCalledWith({firstName: 'Jakub', nip: 1234567890});
                    });
                    it('should set invalidFormAlert to false', function ()
                    {
                        expect(controller.invalidFormAlert).toBe(false);
                    });
                    it('should call form $setPristine', function ()
                    {
                        expect(form.$setPristine).toHaveBeenCalled();
                    });
                    it('controller personAdded to be true', function ()
                    {
                        expect(controller.personAdded).toBe(true);
                    });
                });

            });
            describe('form is invalid', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = false;
                    controller.addPerson(form.$valid);

                });

                it('should return true in invalidFormAlert', function ()
                {
                    expect(controller.invalidFormAlert).toBe(true);
                });
                it('should set personAdded to false', function ()
                {
                    expect(controller.personAdded).toBeFalsy();
                });
            });

            describe('when addPerson throw error', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    spyOn(Person, 'addPerson').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: 'Error'});
                    });
                    controller.company = {firstName: 'Jakub', nip: 1234567890};
                    controller.addPerson(form);
                });
                it('should set showError to true', function ()
                {
                    expect(controller.showError).toBeTruthy();
                });
                it('should set errorMessage', function ()
                {
                    expect(controller.errorMessage).toEqual('Error');
                });
            });

            describe('when form is valid and edit is defined', function ()
            {
                beforeEach(function ()
                {
                    spyOn(Person, 'updatePerson').and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    controller.edit = true;
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    controller.person = {firstName: 'Jakub', nip: 1234567890};
                    controller.addPerson(form);
                });

                describe('Person.updatePerson should be called with ', function ()
                {
                    it('should be called with controller.person', function ()
                    {
                        expect(Person.updatePerson).toHaveBeenCalledWith({firstName: 'Jakub', nip: 1234567890});
                    });
                    it('should set invalidFormAlert to false', function ()
                    {
                        expect(controller.invalidFormAlert).toBe(false);
                    });
                    it('should set disableFormPerson', function ()
                    {
                        expect(controller.disableFormPerson).toBeTruthy();
                    });
                    it('should call form $setPristine', function ()
                    {
                        expect(form.$setPristine).toHaveBeenCalled();
                    });
                    it('controller personAdded to be true', function ()
                    {
                        expect(controller.personAdded).toBe(true);
                    });
                });

            });

            describe('when updatePerson throw error', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    controller.edit = true;
                    spyOn(form, '$setPristine');
                    spyOn(Person, 'updatePerson').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: {message: 'Something bad happens'}});
                    });
                    controller.person = {name: 'Jakub', regon: null, nip: 1234567890};
                    controller.addPerson(form);
                });
                it('should set showError to true', function ()
                {
                    expect(controller.showError).toBeTruthy();
                });
                it('should set errorMessage', function ()
                {
                    expect(controller.errorMessage).toEqual('Something bad happens');
                });
            });
        });
    });

    describe('toggleEditCompany', function ()
    {
        beforeEach(function ()
        {
            controller.disableFormCompany = true;
            controller.company = {name: 'Firma'};
            controller.toggleEditCompany();
        });
        it('should set disableFormCompany to false ', function ()
        {
            expect(controller.disableFormCompany).toBeFalsy();
        });
        it('should set copyComp', function ()
        {
            expect(controller.copyComp).toEqual({name: 'Firma'});
        });
    });

    describe('cancelCompany', function ()
    {
        beforeEach(function ()
        {
            controller.copyComp = {name: 'Firma'};
            controller.disableFormCompany = true;
            controller.cancelCompany();
        });
        it('should set disableFormCompany to false ', function ()
        {
            expect(controller.disableFormCompany).toBeFalsy();
        });
        it('should set company', function ()
        {
            expect(controller.company).toEqual({name: 'Firma'});
        });
    });

    describe('toggleEditPerson', function ()
    {
        beforeEach(function ()
        {
            controller.disableFormPerson = true;
            controller.person = {name: 'Firma'};
            controller.toggleEditPerson();
        });
        it('should set disableFormPerson to false ', function ()
        {
            expect(controller.disableFormPerson).toBeFalsy();
        });
        it('should set copyComp', function ()
        {
            expect(controller.copyPers).toEqual({name: 'Firma'});
        });
    });

    describe('cancelCompany', function ()
    {
        beforeEach(function ()
        {
            controller.copyPers = {name: 'Firma'};
            controller.disableFormPerson = true;
            controller.cancelPerson();
        });
        it('should set disableFormPerson to false ', function ()
        {
            expect(controller.disableFormPerson).toBeFalsy();
        });
        it('should set person', function ()
        {
            expect(controller.person).toEqual({name: 'Firma'});
        });
    });

    describe('closeAddPerson', function ()
    {
        beforeEach(function ()
        {
            controller.closeAddPerson();
        });
        it('should set personAdded to false', function ()
        {
            expect(controller.personAdded).toBeFalsy();
        });
    });

    describe('closeShowError', function ()
    {
        beforeEach(function ()
        {
            controller.closeShowError();
        });
        it('should set showError to false', function ()
        {
            expect(controller.showError).toBeFalsy();
        });
    });
});
