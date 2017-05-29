'use strict';
describe('FindContractorDirective', function ()
{
    var controller;
    var companyDaoMock, personDaoMock, findContrCtrl, mockTestCompany, mockFoundTestCompany;
    var nips;
    var $window;
    var userInfoMock;
    var personsMock;
    var form;
    var timeout;

    beforeEach(module('app'));
    beforeEach(inject(function (findContractorDirective, $controller, CompanyDAO, Person, _$window_, _$timeout_)
    {
        companyDaoMock = CompanyDAO;
        personDaoMock = Person;
        $window = _$window_;
        timeout = _$timeout_;
        findContrCtrl = findContractorDirective[0];

        userInfoMock = {
            'id': 2,
            'name': 'Firma BUDEX',
            'nip': 1224567890,
            'regon': 6189567,
            'addressId': 2,
            'googleCompanyId': null,
            'bankAccount': '98753091857947708385263947',
            'bankName': 'Alior Bank',
            'swift': 'INGBPLPW',
            'email': 'user@gmail.com',
            'address': {'id': 2, 'street': 'Krakowska', 'buildNr': '4', 'flatNr': null, 'postCode': '33-120', 'city': 'City 1'}
        };

        $window.sessionStorage.setItem('userInfo', angular.toJson(userInfoMock));

        mockFoundTestCompany = JSON.parse($window.sessionStorage.getItem('userInfo'));

        mockTestCompany = {
            id: 1, name: 'Firma 1', nip: 1234567890, regon: 6789567, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: 33 - 100, city: 'Tarnów'
        };
        nips = [
            {nip: 1234567890},
            {nip: 1224567890}
        ];

        personsMock = [
            {id: 1, firstName: 'Jan', lastName: 'Kowalski'},
            {id: 2, firstName: 'Karol', lastName: 'Medrzewski'}
        ];
        spyOn(companyDaoMock, 'findByNip').and.callFake(function (booleanValue)
        {
            if (booleanValue === 1234567890) {
                return successfulPromise(mockTestCompany);
            } else {
                return unsuccessfulPromise();
            }
        });

        spyOn(companyDaoMock, 'getNips').and.callFake(function (nip)
        {
            if (nip === 12) {
                return successfulPromise(nips);
            } else if (nip === 1233) {
                return successfulPromise([]);
            } else {
                return unsuccessfulPromise('Error with something');
            }
        });

        controller = $controller(findContrCtrl.controller, {CompanyDAO: companyDaoMock, Person: personDaoMock, $window: $window});
    }));

    describe('controller', function ()
    {
        describe('initialization', function ()
        {
            it('should set showBox', function ()
            {
                expect(controller.showBox).toBeFalsy();
            });
            it('should set showAlert', function ()
            {
                expect(controller.showAlert).toBeFalsy();
            });
            it('should showCompanyContractor to true', function ()
            {
                expect(controller.showCompanyContractor).toBeTruthy();
            });
            it('should showPersonContractor to true', function ()
            {
                expect(controller.showPersonContractor).toBeTruthy();
            });
            it('should set  errorMessage to null', function ()
            {
                expect(controller.errorMessage).toBeNull();
            });
            it('should set showError to false', function ()
            {
                expect(controller.showError).toBeFalsy();
            });
            it('should set userInfo', function ()
            {
                expect(controller.userInfo).toEqual(mockFoundTestCompany);
            });
        });

        describe('findContractor', function ()
        {
            describe('contractor nip is valid', function ()
            {
                beforeEach(function ()
                {
                    controller.nipContractor = 1234567890;
                    controller.findContractor();
                });

                it('should call findByNip function', function ()
                {
                    expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
                });
                it('should set showBox to false', function ()
                {
                    expect(controller.showBox).toEqual(true);
                });
                it('should set showAlert to false', function ()
                {
                    expect(controller.showAlert).toEqual(false);
                });
                it('should set companyModel to null', function ()
                {
                    expect(controller.companyModel).toBeNull();
                });
                it('should set company to proper values from database', function ()
                {
                    expect(controller.company).toEqual(mockTestCompany);
                });
                it('should set nipContractor to null', function ()
                {
                    expect(controller.nipContractor).toBeNull();
                });
            });

            describe('contractor nip is invalid', function ()
            {
                beforeEach(function ()
                {
                    controller.nipContractor = 9999999999;
                    controller.findContractor();
                });

                it('should call findByNip function', function ()
                {
                    expect(companyDaoMock.findByNip).toHaveBeenCalledWith(9999999999);
                });
                it('should set showBox to false', function ()
                {
                    expect(controller.showBox).toEqual(false);
                });
                it('should set showAlert to false', function ()
                {
                    expect(controller.showAlert).toEqual(true);
                });
                it('should set showButton to false', function ()
                {
                    expect(controller.showButton).toEqual(true);
                });
            });
        });

        describe('findCompaniesByNip', function ()
        {
            var nipsResult;
            describe('when pass valid part of nip', function ()
            {
                beforeEach(function ()
                {
                    controller.findCompaniesByNip(12).then(function (result)
                    {
                        nipsResult = result;
                    });
                });
                it('should call CompanyDAO.getNips', function ()
                {
                    expect(companyDaoMock.getNips).toHaveBeenCalled();
                });
                it('should call CompanyDAO.getNIps with args', function ()
                {
                    expect(companyDaoMock.getNips).toHaveBeenCalledWith(12);
                });
                it('should return array of nips', function ()
                {
                    expect(nipsResult).toEqual(nips);
                });
            });

            describe('when not pass valid part of nip', function ()
            {
                beforeEach(function ()
                {
                    controller.findCompaniesByNip(1233).then(function (result)
                    {
                        nipsResult = result;
                    });
                });
                it('should return empty array', function ()
                {
                    expect(nipsResult).toEqual([]);
                });
            });
        });

        describe('onSelect', function ()
        {
            describe('when choose nip from typehead', function ()
            {
                beforeEach(function ()
                {
                    spyOn(controller, 'findContractor');
                    controller.onSelectCompany(nips[0]);
                });
                it('should set nipContractor', function ()
                {
                    expect(controller.nipContractor).toBe(nips[0].nip);
                });
                it('should set contractorType', function ()
                {
                    expect(controller.contractorType).toBe('company');
                });
                it('should call findContractor', function ()
                {
                    expect(controller.findContractor).toHaveBeenCalled();
                });
            });
        });

        describe('findPersonByLastName', function ()
        {
            beforeEach(function ()
            {
                spyOn(personDaoMock, 'findByName').and.callFake(function ()
                {
                    return successfulPromise(personsMock);
                });
                controller.findPersonByLastName('ski');
            });
            it('should call Person.findByName', function ()
            {
                expect(personDaoMock.findByName).toHaveBeenCalledTimes(1);
            });
            it('should call Person.findByName with args', function ()
            {
                expect(personDaoMock.findByName).toHaveBeenCalledWith('ski');
            });

        });

        describe('onSelectPerson', function ()
        {
            var personMock = {id: 1, firstName: 'Jan', lastName: 'Kowalski', addressId: 4};
            beforeEach(function ()
            {
                spyOn(personDaoMock, 'getById').and.callFake(function ()
                {
                    return successfulPromise(personMock);
                });
                controller.onSelectPerson(personsMock[0]);
            });
            it('should call Person.getById', function ()
            {
                expect(personDaoMock.getById).toHaveBeenCalledTimes(1);
            });
            it('should call Person.getById with args', function ()
            {
                expect(personDaoMock.getById).toHaveBeenCalledWith(1);
            });
            it('should set personModel to null', function ()
            {
                expect(controller.personModel).toBeNull();
            });
            it('should set showBoc to true', function ()
            {
                expect(controller.showBox).toBeTruthy();
            });
            it('should showAlert to false', function ()
            {
                expect(controller.showAlert).toBeFalsy();
            });
            it('should set company to result', function ()
            {
                expect(controller.company).toEqual(personMock);
            });
            it('should set contractorType to person', function ()
            {
                expect(controller.contractorType).toBe('person');
            });
        });

        describe('toggleShowCompany', function ()
        {
            beforeEach(function ()
            {
                controller.showCompanyContractor = true;
                controller.toggleShowCompany();
            });
            it('should set showCompanyContractor to false', function ()
            {
                expect(controller.showCompanyContractor).toBeFalsy();
            });
            it('should set showPersonContractor to true', function ()
            {
                expect(controller.showPersonContractor).toBeTruthy();
            });
            it('should set company to null', function ()
            {
                expect(controller.company).toBeNull();
            });
        });

        describe('toggleShowPerson', function ()
        {
            beforeEach(function ()
            {
                controller.showPersonContractor = true;
                controller.toggleShowPerson();
            });
            it('should set showCompanyContractor to false', function ()
            {
                expect(controller.showPersonContractor).toBeFalsy();
            });
            it('should set showPersonContractor to true', function ()
            {
                expect(controller.showCompanyContractor).toBeTruthy();
            });
            it('should set company to null', function ()
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
                    return successfulPromise(mockFoundTestCompany);
                });
                form = {};
                form.$valid = true;
                form.$setPristine = angular.noop;
                spyOn(form, '$setPristine');
                controller.company = {name: 'Jakub', nip: 1234567890};
                controller.addCompany(form);
            });
            it('should set company to empty  ', function ()
            {
                expect(controller.company)
                        .toEqual({
                            id: 1,
                            name: 'Firma 1',
                            nip: 1234567890,
                            regon: 6789567,
                            street: 'Spokojna',
                            buildNr: 4,
                            flatNr: 3,
                            postCode: -67,
                            city: 'Tarnów'
                        });
            });
            describe('companyDAO.addCompany should be called with ', function ()
            {
                it('should be called with controller.company', function ()
                {
                    expect(companyDaoMock.addCompany).toHaveBeenCalledWith({name: 'Jakub', nip: 1234567890});
                });
                it('should set invalidFormAlert to false', function ()
                {
                    expect(controller.invalidFormAlert).toBe(false);
                });
                it('should call form $setPristine', function ()
                {
                    expect(form.$setPristine).toHaveBeenCalled();
                });
                it('should set nipContractor', function ()
                {
                    expect(controller.nipContractor).toBeNull();
                });
                it('should set contractorType to company', function ()
                {
                    expect(controller.contractorType).toEqual('company');
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
                controller.company = {name: 'Jakub', regon: '', nip: 1234567890};
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
                spyOn(personDaoMock, 'findByNip').and.callFake(function ()
                {
                    return successfulPromise();
                });
                controller.person = {nip: 1234567890};
                controller.validateNipPerson();
            });
            it('should call Person.findByNip', function ()
            {
                expect(personDaoMock.findByNip).toHaveBeenCalledTimes(1);
            });
            it('should call Person.findByNip with nip', function ()
            {
                expect(personDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
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
                spyOn(personDaoMock, 'findByNip').and.callFake(function ()
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
                controller.company = {shortcut: 'short'};
                spyOn(personDaoMock, 'findShortcut').and.callFake(function ()
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
                controller.company = {shortcut: 'short'};
                spyOn(personDaoMock, 'findShortcut').and.callFake(function ()
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
                controller.company = {shortcut: 'short'};
                spyOn(personDaoMock, 'findShortcut').and.callFake(function ()
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

    describe('addPerson', function ()
    {
        describe('when form is valid', function ()
        {
            beforeEach(function ()
            {
                spyOn(personDaoMock, 'addPerson').and.callFake(function ()
                {
                    return successfulPromise({id: 1});
                });
                spyOn(personDaoMock, 'getById').and.callFake(function ()
                {
                    return successfulPromise({firstName: 'Jakub', regon: '', nip: 1234567890, id: 4});
                });
                form = {};
                form.$valid = true;
                form.$setPristine = angular.noop;
                spyOn(form, '$setPristine');
                controller.company = {firstName: 'Jakub', regon: '', nip: 1234567890};
                controller.addPerson(form);
            });
            it('should set company to result  ', function ()
            {
                expect(controller.company).toEqual({firstName: 'Jakub', regon: '', nip: 1234567890, id: 4});
            });
            describe('Person.addPerson should be called with ', function ()
            {
                it('should be called with controller.person', function ()
                {
                    expect(personDaoMock.addPerson).toHaveBeenCalledWith({firstName: 'Jakub', nip: 1234567890});
                });
                it('should set invalidFormAlert to false', function ()
                {
                    expect(controller.invalidFormAlert).toBe(false);
                });
                it('should call form $setPristine', function ()
                {
                    expect(form.$setPristine).toHaveBeenCalled();
                });
                it('should set contractorType to person', function ()
                {
                    expect(controller.contractorType).toBe('person');
                });
                it('should set showBox to true', function ()
                {
                    expect(controller.showBox).toBeTruthy();
                });
                it('should set showPersonContractor to true', function ()
                {
                    expect(controller.showPersonContractor).toBeTruthy();
                });
                it('should set showCompanyContractor to true', function ()
                {
                    expect(controller.showCompanyContractor).toBeTruthy();
                });
                it('should set noResultsCompany to false', function ()
                {
                    expect(controller.noResultsCompany).toBeFalsy();
                });
                it('should set noResultsPerson to false', function ()
                {
                    expect(controller.noResultsPerson).toBeFalsy();
                });
                it('should set companyModel to null', function ()
                {
                    expect(controller.companyModel).toBeNull();
                });
                it('should set personModel to null', function ()
                {
                    expect(controller.personModel).toBeNull();
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
                spyOn(personDaoMock, 'addPerson').and.callFake(function ()
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
    });
});

