'use strict';
describe('ContractorDetaildController', function ()
{
    var routeParams;
    var CompanyDAOMock;
    var PersonMock;
    var contractorCtrl;
    var resultMock;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, _$routeParams_, _CompanyDAO_, _Person_)
    {
        routeParams = _$routeParams_;
        CompanyDAOMock = _CompanyDAO_;
        PersonMock = _Person_;

        routeParams.id = 1;
        routeParams.type = 'company';
        contractorCtrl = $controller('ContractorDetailsController', {$routeParams: routeParams, CompanyDAO: CompanyDAOMock, Person: PersonMock});
    }));

    describe('initialization', function ()
    {
        it('should set id', function ()
        {
            expect(contractorCtrl.id).toBe(1);
        });
        describe('when $routeParams.type is company', function ()
        {
            describe('when getById success', function ()
            {
                beforeEach(inject(function ($controller)
                {
                    resultMock = {name: 'FIrma'};
                    routeParams.type = 'company';
                    spyOn(CompanyDAOMock, 'getById').and.callFake(function ()
                    {
                        return successfulPromise(resultMock);
                    });
                    contractorCtrl = $controller('ContractorDetailsController', {$routeParams: routeParams, CompanyDAO: CompanyDAOMock, Person: PersonMock});
                }));
                it('should set type to company', function ()
                {
                    expect(contractorCtrl.type).toBe('company');
                });
                it('should call CompanyDAO.getById', function ()
                {
                    expect(CompanyDAOMock.getById).toHaveBeenCalledTimes(1);
                });
                it('should call CompanyDAO.getById with args', function ()
                {
                    expect(CompanyDAOMock.getById).toHaveBeenCalledWith(1);
                });
                it('should set contractor to result', function ()
                {
                    expect(contractorCtrl.contractor).toEqual(resultMock);
                });
            });
            describe('when getById throw error', function ()
            {
                beforeEach(inject(function ($controller)
                {
                    routeParams.type = 'company';
                    spyOn(console, 'error');
                    spyOn(CompanyDAOMock, 'getById').and.callFake(function ()
                    {
                        return unsuccessfulPromise({error: 'Cannot find company'});
                    });
                    contractorCtrl = $controller('ContractorDetailsController', {$routeParams: routeParams, CompanyDAO: CompanyDAOMock, Person: PersonMock});
                }));
                it('should call console.error', function ()
                {
                    expect(console.error).toHaveBeenCalledTimes(1);
                });
                it('should call console.error with error', function ()
                {
                    expect(console.error).toHaveBeenCalledWith({error: 'Cannot find company'});
                });
            });
        });
        describe('when $routeParams.type is person', function ()
        {
            describe('when getById return success', function ()
            {
                beforeEach(inject(function ($controller)
                {
                    resultMock = {firstName: 'John'};
                    routeParams.type = 'person';
                    spyOn(PersonMock, 'getById').and.callFake(function ()
                    {
                        return successfulPromise(resultMock);
                    });
                    contractorCtrl = $controller('ContractorDetailsController', {$routeParams: routeParams, CompanyDAO: CompanyDAOMock, Person: PersonMock});
                }));
                it('should set type to company', function ()
                {
                    expect(contractorCtrl.type).toBe('person');
                });
                it('should call Person.getById', function ()
                {
                    expect(PersonMock.getById).toHaveBeenCalledTimes(1);
                });
                it('should call Person.getById with args', function ()
                {
                    expect(PersonMock.getById).toHaveBeenCalledWith(1);
                });
                it('should set contractor to result', function ()
                {
                    expect(contractorCtrl.contractor).toEqual(resultMock);
                });
            });
            describe('when getById throw error', function ()
            {
                beforeEach(inject(function ($controller)
                {
                    routeParams.type = 'person';
                    spyOn(console, 'error');
                    spyOn(PersonMock, 'getById').and.callFake(function ()
                    {
                        return unsuccessfulPromise({error: 'Cannot find person'});
                    });
                    contractorCtrl = $controller('ContractorDetailsController', {$routeParams: routeParams, CompanyDAO: CompanyDAOMock, Person: PersonMock});
                }));
                it('should call console.error', function ()
                {
                    expect(console.error).toHaveBeenCalledTimes(1);
                });
                it('should call console.error with error', function ()
                {
                    expect(console.error).toHaveBeenCalledWith({error: 'Cannot find person'});
                });
            });
        });
    });


});
