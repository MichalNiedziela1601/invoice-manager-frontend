'use strict';
describe('addCompany.directive.js', function ()
{
    var controller;
    var companyDaoMock;
    var addCompDir;
    beforeEach(module('app'));
    beforeEach(inject(function (addCompanyDirective)
    {
        addCompDir = addCompanyDirective[0];
    }));
    describe('controller', function ()
    {
        describe('', function ()
        {
            beforeEach(inject(function ($controller, CompanyDAO)
            {
                companyDaoMock = CompanyDAO;
                controller = $controller(addCompDir.controller, {CompanyDAO: companyDaoMock})

            }));

            it('should niewiem', function ()
            {
                expect(controller.addComp).toBe(false);
            });
        });
    });
});
