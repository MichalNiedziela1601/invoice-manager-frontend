describe('UserController', function ()
{
    'use strict';
    var userCtrl;
    var userDaoMock;
    var companyDaoMock;
    var companyMock;
    var $window;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, UserDAO, CompanyDAO, _$window_)
    {
        userDaoMock = UserDAO;
        companyDaoMock = CompanyDAO;
        $window = _$window_;

        $window.sessionStorage.setItem('userInfo', angular.toJson({
            'id': 2,
            'name': 'Firma BUDEX',
            'nip': 1224567890,
            'regon': 6189567,
            'addressId': 2,
            'googleCompanyId': null,
            'bankAccount': '98753091857947708385263947',
            'swift': 'INGBPLPW',
            'email': 'user@gmail.com',
            'address': {'id': 2, 'street': 'Krakowska', 'buildNr': '4', 'flatNr': null, 'postCode': '33-120', 'city': 'City 1'}
        }));

        companyMock = angular.fromJson($window.sessionStorage.getItem('userInfo'));

        spyOn(userDaoMock, 'addAddress').and.callFake(function ()
        {
            return successfulPromise();
        });
        spyOn(userDaoMock, 'addPersonalData').and.callFake(function ()
        {
            return successfulPromise();
        });
        spyOn(userDaoMock, 'addAccountData').and.callFake(function ()
        {
            return successfulPromise();
        });


        userCtrl = $controller('UserController', {UserDAO: userDaoMock, CompanyDAO: companyDaoMock, $window: $window});
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
            expect(userCtrl.showName).toBeFalsy();
        });
        it('should set addressOpen', function ()
        {
            expect(userCtrl.addressOpen).toBeFalsy();
        });

        it('should set userAddressData.street', function ()
        {
            expect(userCtrl.userAddressData.street).toBe(companyMock.address.street);
        });
        it('should set userAddressData.buildNr', function ()
        {
            expect(userCtrl.userAddressData.buildNr).toBe(companyMock.address.buildNr);
        });
        it('should set userAddressData.flatNr', function ()
        {
            expect(userCtrl.userAddressData.flatNr).toBe(companyMock.address.flatNr);
        });
        it('should set userAddressData.postCode', function ()
        {
            expect(userCtrl.userAddressData.postCode).toBe(companyMock.address.postCode);
        });
        it('should set userAddressData.city', function ()
        {
            expect(userCtrl.userAddressData.city).toBe(companyMock.address.city);
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
