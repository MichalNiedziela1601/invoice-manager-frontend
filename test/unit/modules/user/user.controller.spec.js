describe('UserController', function ()
{
    'use strict';
    var userCtrl;
    var userDaoMock;
    var jwtHelperMock;
    var companyDaoMock;
    var token;
    var tokenDecode;
    var companyMock;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, UserDAO, jwtHelper, CompanyDAO)
    {
        userDaoMock = UserDAO;
        jwtHelperMock = jwtHelper;
        companyDaoMock = CompanyDAO;
        companyMock = {
            name: 'sdfsfd',
            street: 'Błotna',
            buildNr: '45a',
            flatNr: null,
            postCode: '33-100',
            city: 'Gdzieś na krańcu świata'
        };
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJuaXAiOjEyMjQ1Njc4OTAsImNvb' +
                'XBhbnlJZCI6MiwiaWF0IjoxNDkzMzI0OTA2LCJleHA' +
                'iOjE0OTMzMjg1MDZ9.TVFz4SGCENSk5lf-fxoIoFFNl_rQG1Gl-1ZNLA_m9-0';
        tokenDecode = {
            companyId: 2,
            email: 'admin@gmail.com',
            exp: 1493328506,
            iat: 1493324906,
            id: 1,
            nip: 1224567890
        };
        spyOn(jwtHelperMock, 'decodeToken').and.returnValue(tokenDecode);
        spyOn(userDaoMock,'getToken').and.returnValue(token);
        spyOn(userDaoMock,'addAddress').and.callFake(function(){
            return successfulPromise();
        });
        spyOn(userDaoMock,'addPersonalData').and.callFake(function ()
        {
            return successfulPromise();
        });
        spyOn(userDaoMock,'addAccountData').and.callFake(function ()
        {
            return successfulPromise();
        });
        spyOn(companyDaoMock,'findByNip').and.callFake(function(){
            return successfulPromise(companyMock);
        });


        userCtrl = $controller('UserController', {UserDAO: userDaoMock, jwtHelper: jwtHelperMock, CompanyDAO: companyDaoMock});
    }));

    describe('initialization', function ()
    {
        it('should set addressOpen', function ()
        {
            expect(userCtrl.addressOpen).toBeFalsy();
        });
        it('should set personalOpen', function ()
        {
            expect(userCtrl.personalOpen, 'personalOpen').toBeTruthy();
        });
        it('should set bankOpen', function ()
        {
            expect(userCtrl.bankOpen).toBeTruthy();
        });
        it('should set showName', function ()
        {
            expect(userCtrl.showName).toBeTruthy();
        });
        it('should set companyName', function ()
        {
            expect(userCtrl.companyName).toBe(companyMock.name);
        });
        it('should set addressOpen', function ()
        {
            expect(userCtrl.addressOpen).toBeFalsy();
        });
        it('should call UserDAO.getToken', function ()
        {
            expect(userDaoMock.getToken).toHaveBeenCalled();
        });
        it('should call jwthelper.decodeToken', function ()
        {
            expect(jwtHelperMock.decodeToken).toHaveBeenCalled();
        });
        it('should set token', function ()
        {
            expect(userCtrl.token).toBe(tokenDecode);
        });
        it('should call companyDAO.findByNip', function ()
        {
            expect(companyDaoMock.findByNip).toHaveBeenCalled();
        });
        it('should call companyDAO.findByNip with nip decode', function ()
        {
            expect(companyDaoMock.findByNip).toHaveBeenCalledWith(tokenDecode.nip);
        });
        it('should set userAddressData.street', function ()
        {
            expect(userCtrl.userAddressData.street).toBe(companyMock.street);
        });
        it('should set userAddressData.buildNr', function ()
        {
            expect(userCtrl.userAddressData.buildNr).toBe(companyMock.buildNr);
        });
        it('should set userAddressData.flatNr', function ()
        {
            expect(userCtrl.userAddressData.flatNr).toBe(companyMock.flatNr);
        });
        it('should set userAddressData.postCode', function ()
        {
            expect(userCtrl.userAddressData.postCode).toBe(companyMock.postCode);
        });
        it('should set userAddressData.city', function ()
        {
            expect(userCtrl.userAddressData.city).toBe(companyMock.city);
        });
    });

    describe('openAddress ', function ()
    {
        beforeEach(function ()
        {
            userCtrl.openAddress();
        });
        it('should set addressOpen', function ()
        {
            expect(userCtrl.addressOpen).toBeTruthy();
        });
        it('should set personalOpen', function ()
        {
            expect(userCtrl.personalOpen).toBeTruthy();
        });
        it('should set bankOpen', function ()
        {
            expect(userCtrl.bankOpen).toBeTruthy();
        });
    });
    describe('openPersonal', function ()
    {
        beforeEach(function ()
        {
            userCtrl.openPersonal();
        });
        it('should set personalOpen', function ()
        {
            expect(userCtrl.personalOpen).toBeFalsy();
        });
        it('should set addressOpen', function ()
        {
            expect(userCtrl.addressOpen).toBeTruthy();
        });
        it('should set bankOpen', function ()
        {
            expect(userCtrl.bankOpen).toBeTruthy();
        });
    });

    describe('openBank', function ()
    {
        beforeEach(function ()
        {
            userCtrl.openBank();
        });
        it('should set bankOpen', function ()
        {
            expect(userCtrl.bankOpen).toBeFalsy();
        });
        it('should set addressOpen', function ()
        {
            expect(userCtrl.addressOpen).toBeTruthy();
        });
        it('should set personalOpen', function ()
        {
            expect(userCtrl.personalOpen).toBeTruthy();
        });
    });

    describe('addAddress', function ()
    {
        beforeEach(function ()
        {
            userCtrl.addAddress();
        });
        it('should call userDao.addAddress', function ()
        {
            expect(userDaoMock.addAddress).toHaveBeenCalled();
            expect(userDaoMock.addAddress).toHaveBeenCalledTimes(1);
        });
        it('should call userDao.addAddress with userAddressData', function ()
        {
            expect(userDaoMock.addAddress).toHaveBeenCalledWith(userCtrl.userAddressData);
        });
    });
    describe('addPersonalData', function ()
    {
        beforeEach(function ()
        {
            userCtrl.addPersonalData();
        });
        it('should call userDao.addPersonalData', function ()
        {
            expect(userDaoMock.addPersonalData).toHaveBeenCalled();
            expect(userDaoMock.addPersonalData).toHaveBeenCalledTimes(1);
        });
        it('should call userDao.addPersonalData with userAddressData', function ()
        {
            expect(userDaoMock.addPersonalData).toHaveBeenCalledWith(userCtrl.userPersonalData);
        });
    });
    describe('addAccountData', function ()
    {
        beforeEach(function ()
        {
            userCtrl.addAccountData();
        });
        it('should call userDao.addAccountData', function ()
        {
            expect(userDaoMock.addAccountData).toHaveBeenCalled();
            expect(userDaoMock.addAccountData).toHaveBeenCalledTimes(1);
        });
        it('should call userDao.addAddress with userAddressData', function ()
        {
            expect(userDaoMock.addAccountData).toHaveBeenCalledWith(userCtrl.userAccountData);
        });
    });

});
