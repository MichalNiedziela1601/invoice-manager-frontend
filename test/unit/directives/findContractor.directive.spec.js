'use strict';
describe('FindContractorDirective', function ()
{
    var controller;
    var companyDaoMock, personDaoMock, findContrCtrl, mockTestCompany, mockFoundTestCompany;
    var nips;

    beforeEach(module('app'));
    beforeEach(inject(function(findContractorDirective,$controller, CompanyDAO, Person){
        companyDaoMock = CompanyDAO;
        personDaoMock = Person;
        findContrCtrl = findContractorDirective[0];
        mockFoundTestCompany = {
            id: 2, name: 'Firma BUDEX', nip: 1224567890, regon: 6189567, street: 'Krakowska', buildNr: 4, flatNr: null, postCode: '33-120', city: 'City 1'
        };
        mockTestCompany = {
            id: 1, name: 'Firma 1', nip: 1234567890, regon: 6789567, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: 33 - 100, city: 'Tarnów'
        };
        nips = [
            {nip: 1234567890},
            {nip: 1224567890}
        ];

        spyOn(companyDaoMock, 'findByNip').and.callFake(function (booleanValue)
        {
            if (booleanValue === 1234567890) {
                return successfulPromise(mockTestCompany);
            } else if (booleanValue === 1224567890) {
                return successfulPromise(mockFoundTestCompany);
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

        controller = $controller(findContrCtrl.controller,{CompanyDAO: companyDaoMock, Person: personDaoMock});
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
    });

});
