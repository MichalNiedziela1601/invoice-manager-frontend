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
    var companyListMock;

    beforeEach(module('app'));
    beforeEach(inject(function (findContractorDirective, $controller, CompanyDAO, Person, _$window_)
    {
        companyDaoMock = CompanyDAO;
        personDaoMock = Person;
        $window = _$window_;
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
            id: 1,
            name: 'Firma 1',
            nip: 1234567890,
            regon: 6789567,
            street: 'Spokojna',
            buildNr: 4,
            flatNr: 3,
            postCode: '33-100',
            city: 'Tarnów',
            country: 'Poland',
            bankAccounts: {
                '0' : {
                    editMode: false,
                    account: '3423423423'
                }
            }
        };

        companyListMock = [{
            name: 'Firma X', nip: 5454545454, address: {
                street: 'Zielona', buildNr: '12', flatNr: '14', postCode: '11-111', city: 'Lublin'
            }
        }, {
            name: 'Firma X', nip: 5454545454, address: {
                street: 'Niebieska', buildNr: '15', flatNr: '1', postCode: '22-333', city: 'Warszawa'
            }
        }, mockFoundTestCompany];

        personsMock = [
            {id: 1, firstName: 'Jan', lastName: 'Kowalski', bankAccounts: {
                '0' : {
                    editMode: false,
                    account: '3423423423'
                }
            }},
            {id: 2, firstName: 'Karol', lastName: 'Medrzewski', bankAccounts: {
                '0' : {
                    editMode: false,
                    account: '3423423423'
                }
            }}
        ];


        spyOn(companyDaoMock, 'getById').and.callFake(function (id)
        {
            if (id === 1) {
                return successfulPromise(mockTestCompany);
            } else {
                return unsuccessfulPromise();
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

        describe('getCompanies', function ()
        {
            beforeEach(function ()
            {
                spyOn(companyDaoMock,'query').and.callFake(function(){
                    return successfulPromise(companyListMock);
                });
                controller.getCompanies();
            });
            it('should return list of companies', function ()
            {
                expect(controller.companies).toEqual(companyListMock);
            });
        });

        describe('getPersons', function ()
        {
            beforeEach(function ()
            {
                spyOn(personDaoMock,'getPersons').and.callFake(function(){
                    return successfulPromise(personsMock);
                });
                controller.getPersons();
            });
            it('should return list of persons', function ()
            {
                expect(controller.persons).toEqual(personsMock);
            });
        });

        describe('checkAccount', function ()
        {
            describe('when account exists', function ()
            {
                describe('when accounts lenght greaten then 1', function ()
                {
                    beforeEach(function ()
                    {
                        controller.company = {
                            bankAccounts: {'0': {account: '849374934'}, '1': {account: '7943853953495'}}
                        };

                    });
                    it('should return true', function ()
                    {
                        expect(controller.checkAccount()).toBeTruthy();
                    });
                });
                describe('when accounts length equal 1', function ()
                {
                    beforeEach(function ()
                    {
                        controller.company = {
                            bankAccounts: {'0': {account: '849374934'}}
                        };

                    });
                    it('should return true', function ()
                    {
                        expect(controller.checkAccount()).toBeFalsy();
                    });
                });
            });
            describe('when accounts null', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {};
                });
                it('should return true', function ()
                {
                    expect(controller.checkAccount()).toBeTruthy();
                });
            });
        });

        describe('checkAccountChosen', function ()
        {
            describe('when account exists and length is 1', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {
                        bankAccounts : {'0': {}}
                    };
                    controller.checkAccountChosen();
                });
                it('should set accountNr to 0', function ()
                {
                    expect(controller.accountNr).toBe('0');
                });
            });
            describe('when checkAccount return true', function ()
            {
                beforeEach(function ()
                {
                    controller.company = {
                        bankAccounts : {'0': {}, '1': {}}
                    };
                    controller.checkAccountChosen();
                });
                it('should set accountNr to null', function ()
                {
                    expect(controller.accountNr).toBeNull();
                });
            });
        });

        describe('findContractor', function ()
        {
            describe('contractor id is valid', function ()
            {
                beforeEach(function ()
                {
                    controller.idCompany = 1;
                    controller.findContractor();
                });

                it('should call findByNip function', function ()
                {
                    expect(companyDaoMock.getById).toHaveBeenCalledWith(1);
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
            });

            describe('contractor nip is invalid', function ()
            {
                beforeEach(function ()
                {
                    controller.idCompany = 3;
                    controller.findContractor();
                });

                it('should call findByNip function', function ()
                {
                    expect(companyDaoMock.getById).toHaveBeenCalledWith(3);
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


        describe('onSelect', function ()
        {
            describe('when choose nip from typehead', function ()
            {
                beforeEach(function ()
                {
                    spyOn(controller, 'findContractor');
                    controller.onSelectCompany({id: 1, nip: '1234567890'});
                });
                it('should set nipContractor', function ()
                {
                    expect(controller.idCompany).toBe(1);
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


        describe('onSelectPerson', function ()
        {
            var personMock = {id: 1, firstName: 'Jan', lastName: 'Kowalski', addressId: 4, bankAccounts: {
                '0' : {
                    editMode: false,
                    account: '3423423423'
                }
            }};
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
                    return successfulPromise({id: 1});
                });
                form = {};
                form.$valid = true;
                form.$setPristine = angular.noop;
                spyOn(form, '$setPristine');
                controller.company = {name: 'Jakub', nip: 1234567890};
                controller.addCompany(form);
            });
            it('should set company to find by id  ', function ()
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
                            postCode: '33-100',
                            city: 'Tarnów',
                            country: 'Poland',
                            bankAccounts: {
                                '0' : {
                                    editMode: false,
                                    account: '3423423423'
                                }
                            }
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
                it('should set idCompany', function ()
                {
                    expect(controller.idCompany).toBeNull();
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
            describe('when error.data', function ()
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

            describe('when error.data.message', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    spyOn(companyDaoMock, 'addCompany').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: { message: 'Error'}});
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

        describe('findByNip with invalid value', function ()
        {
            beforeEach(function ()
            {
                spyOn(companyDaoMock, 'findByNip').and.callFake(function (nip)
                {
                    if (nip === 1234567890) {
                        return successfulPromise(mockTestCompany);
                    } else {
                        return unsuccessfulPromise();
                    }
                });
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
                spyOn(companyDaoMock, 'findByNip').and.callFake(function (nip)
                {
                    if (nip === 1234567890) {
                        return successfulPromise(mockTestCompany);
                    } else {
                        return unsuccessfulPromise();
                    }
                });
                controller.company = {nip: 123458901234};
                controller.validateNip();
            });
            it('companyDaoMock.findByNip should be called with 12345890', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(123458901234);
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
                    return successfulPromise({firstName: 'Jakub', nip: 1234567890, id: 4});
                });
                form = {};
                form.$valid = true;
                form.$setPristine = angular.noop;
                spyOn(form, '$setPristine');
                controller.company = {firstName: 'Jakub', nip: 1234567890};
                controller.addPerson(form);
            });
            it('should set company to result  ', function ()
            {
                expect(controller.company).toEqual({firstName: 'Jakub', nip: 1234567890, id: 4});
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
            describe('when error.data', function ()
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

            describe('when error.data.message', function ()
            {
                beforeEach(function ()
                {
                    form = {};
                    form.$valid = true;
                    form.$setPristine = angular.noop;
                    spyOn(form, '$setPristine');
                    spyOn(personDaoMock, 'addPerson').and.callFake(function ()
                    {
                        return unsuccessfulPromise({data: {message: 'Error'}});
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
});

