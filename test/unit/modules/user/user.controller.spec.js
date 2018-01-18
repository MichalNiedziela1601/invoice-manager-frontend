describe('UserController', function ()
{
    'use strict';
    var userCtrl;
    var userDaoMock;
    var companyMock;
    var $window;
    var form;
    var userInfoMock;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, UserDAO, _$window_)
    {
        userDaoMock = UserDAO;
        $window = _$window_;
        userInfoMock = {
            'id': 2,
            'name': 'Firma BUDEX',
            'nip': 1224567890,
            'regon': 6189567,
            'addressId': 2,
            'googleCompanyId': null,
            'bankAccounts': {'0' : { account: '98753091857947708385263947', name: 'PLN', bankName: 'ALior', swift: 'BIGPLPW'} },
            'email': 'user@gmail.com',
            'address': {'id': 2, 'street': 'Krakowska', 'buildNr': '4', 'flatNr': null, 'postCode': '33-120', 'city': 'City 1'}
        };

        $window.sessionStorage.setItem('userInfo', angular.toJson(userInfoMock));

        companyMock = angular.fromJson($window.sessionStorage.getItem('userInfo'));

        spyOn(userDaoMock, 'updateAddress').and.callFake(function ()
        {
            return successfulPromise();
        });
        spyOn(userDaoMock, 'updateAccount').and.callFake(function ()
        {
            return successfulPromise();
        });
        spyOn(userDaoMock, 'addNewUser').and.callFake(function ()
        {
            return successfulPromise();
        });

        spyOn(userDaoMock,'getUserInfo').and.callFake(function(){
            return successfulPromise(userInfoMock);
        });


        userCtrl = $controller('UserController', {UserDAO: userDaoMock, $window: $window});
    }));

    describe('initialization', function ()
    {
        it('should set userAdded', function ()
        {
            expect(userCtrl.userAdded).toBeFalsy();
        });
        it('should set invalidFormAlert', function ()
        {
            expect(userCtrl.invalidFormAlert).toBeFalsy();
        });
        it('should set addressEdit', function ()
        {
            expect(userCtrl.addressEdit).toBeTruthy();
        });
        it('should set accountEdit', function ()
        {
            expect(userCtrl.accountEdit).toBeTruthy();
        });
        it('should set invalidAddress', function ()
        {
            expect(userCtrl.invalidAddress).toBeFalsy();
        });
        it('should set invalidAccount', function ()
        {
            expect(userCtrl.invalidAccount).toBeFalsy();
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
        it('should set userAccountData.bankName', function ()
        {
            expect(userCtrl.userAccountData).toEqual(companyMock.bankAccounts);
        });
    });



    describe('addAddress', function ()
    {
        describe('when update address', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: true
                };
                userCtrl.addAddress(form);
            });
            it('should call userDao.addAddress', function ()
            {
                expect(userDaoMock.updateAddress).toHaveBeenCalled();
                expect(userDaoMock.updateAddress).toHaveBeenCalledTimes(1);
            });
            it('should call userDao.addAddress with userAddressData', function ()
            {
                expect(userDaoMock.updateAddress).toHaveBeenCalledWith(userCtrl.userAddressData);
            });
            it('should set addressEdit', function ()
            {
                expect(userCtrl.addressEdit).toBeTruthy();
            });
        });
        describe('when error occurred', function ()
        {
            beforeEach(function ()
            {
                userDaoMock.updateAddress.and.callFake(function(){
                    return unsuccessfulPromise({data: {
                        message: 'Something bad happens'
                    }});
                });
                form = {
                    $valid: true
                };
                userCtrl.addAddress(form);
            });
            it('should set errorMessage', function ()
            {
                expect(userCtrl.errorMessage).toBe('Something bad happens');
            });
            it('should set invalidAccount', function ()
            {
                expect(userCtrl.invalidAddress).toBeTruthy();
            });
        });
    });

    describe('addAccountData', function ()
    {
        describe('when update account data', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: true,
                    $setPristine: angular.noop
                };
                spyOn(form,'$setPristine');
                userCtrl.addAccountData(form);
            });
            it('should call userDao.addAccountData', function ()
            {
                expect(userDaoMock.updateAccount).toHaveBeenCalled();
                expect(userDaoMock.updateAccount).toHaveBeenCalledTimes(1);
            });
            it('should call userDao.addAddress with userAddressData', function ()
            {
                expect(userDaoMock.updateAccount).toHaveBeenCalledWith(userCtrl.userAccountData);
            });
            it('should set accountEdit', function ()
            {
                expect(userCtrl.accountEdit).toBeTruthy();
            });
        });
        describe('when error occurred', function ()
        {
            beforeEach(function ()
            {
                userDaoMock.updateAccount.and.callFake(function(){
                    return unsuccessfulPromise({data: {
                        message: 'Something bad happens'
                    }});
                });
                form = {
                    $valid: true
                };
                userCtrl.addAccountData(form);
            });
            it('should set errorMessage', function ()
            {
                expect(userCtrl.errorMessage).toBe('Something bad happens');
            });
            it('should set invalidAccount', function ()
            {
                expect(userCtrl.invalidAccount).toBeTruthy();
            });
        });
    });

    describe('isPasswordEqual', function ()
    {
        describe('when equal', function ()
        {
            beforeEach(function ()
            {
                userCtrl.registrationCredential.password = 'topsecret';
                userCtrl.registrationRepeatPassword.repeatPassword = 'topsecret';
            });
            it('should return true', function ()
            {
                expect(userCtrl.isPasswordsEqual()).toBeFalsy();
            });
        });
        describe('when passwords not equal', function ()
        {
            beforeEach(function ()
            {
                userCtrl.registrationCredential.password = 'topsecret';
                userCtrl.registrationRepeatPassword.repeatPassword = 'top';
            });
            it('should return false', function ()
            {
                expect(userCtrl.isPasswordsEqual()).toBeTruthy();
            });
        });
    });

    describe('addNewUser', function ()
    {
        describe('when added new user', function ()
        {
            beforeEach(function ()
            {
                userCtrl.registrationCredential.password = 'topsecret';
                userCtrl.registrationCredential.email = 'blabla@bla.pl';
                userCtrl.registrationRepeatPassword.repeatPassword = 'topsecret';
                form = {
                    $valid: true,
                    $setPristine: function() {}
                };
                userCtrl.addNewUser(form);
            });
            it('should call addNewUser form UserDAO', function ()
            {
                expect(userDaoMock.addNewUser).toHaveBeenCalled();
                expect(userDaoMock.addNewUser).toHaveBeenCalledTimes(1);
                expect(userDaoMock.addNewUser).toHaveBeenCalledWith( {password: 'topsecret', email: 'blabla@bla.pl' }, companyMock.id);
            });
            it('should set registrationCredentials', function ()
            {
                expect(userCtrl.registrationCredential).toEqual({password: null});
            });
            it('should set registrationRepeatPassword', function ()
            {
                expect(userCtrl.registrationRepeatPassword).toEqual({repeatPassword: null});
            });
        });
        describe('when email exist', function ()
        {
            beforeEach(function ()
            {
                userCtrl.registrationCredential.password = 'topsecret';
                userCtrl.registrationCredential.email = 'blabla@bla.pl';
                userCtrl.registrationRepeatPassword.repeatPassword = 'topsecret';
                form = {
                    $valid: true,
                    $setPristine: function() {}
                };
                userDaoMock.addNewUser.and.callFake(function ()
                {
                    return unsuccessfulPromise({data : {
                        message: 'Email exists in database'
                    }});
                });
                userCtrl.addNewUser(form);
            });
            it('should call addNewUser form UserDAO', function ()
            {
                expect(userDaoMock.addNewUser).toHaveBeenCalled();
                expect(userDaoMock.addNewUser).toHaveBeenCalledTimes(1);
                expect(userDaoMock.addNewUser).toHaveBeenCalledWith( {password: 'topsecret', email: 'blabla@bla.pl' }, companyMock.id);
            });
            it('should set errorMessage', function ()
            {
                expect(userCtrl.errorMessage).toEqual('Email exists in database');
            });
            it('should set invalidFormAlert', function ()
            {
                expect(userCtrl.invalidFormAlert).toBeTruthy();
            });
        });
    });

    describe('closeAddUser', function ()
    {
        beforeEach(function ()
        {
            userCtrl.closeAddUser();
        });
        it('should set userAdded', function ()
        {
            expect(userCtrl.userAdded).toBeFalsy();
        });
    });

    describe('closeInvalidFormAlert', function ()
    {
        beforeEach(function ()
        {
            userCtrl.closeInvalidFormAlert();
        });
        it('should set invalidFormAlert', function ()
        {
            expect(userCtrl.invalidFormAlert).toBeFalsy();
        });
    });
    describe('closeInvalidAddress', function ()
    {
        beforeEach(function ()
        {
            userCtrl.closeInvalidAddress();
        });
        it('should set invalidAddress', function ()
        {
            expect(userCtrl.invalidAddress).toBeFalsy();
        });
    });
    describe('closeInvalidAccount', function ()
    {
        beforeEach(function ()
        {
            userCtrl.closeInvalidAccount();
        });
        it('should set invalidAccount', function ()
        {
            expect(userCtrl.invalidAccount).toBeFalsy();
        });
    });

    describe('toggleAddressEdit', function ()
    {
        beforeEach(function ()
        {
            userCtrl.addressEdit = true;
            userCtrl.toggleAddressEdit();
        });
        it('should set addressEdit', function ()
        {
            expect(userCtrl.addressEdit).toBeFalsy();
        });
    });

    describe('toggleAccountEdit', function ()
    {
        beforeEach(function ()
        {
            userCtrl.accountEdit = true;
            userCtrl.toggleAccountEdit();
        });
        it('should set accountEdit', function ()
        {
            expect(userCtrl.accountEdit).toBeFalsy();
        });
    });

    describe('addNewAccount', function ()
    {
        beforeEach(function ()
        {
            userCtrl.addNewAccount();
        });
        it('should set userAccountData', function ()
        {
            expect(userCtrl.userAccountData[1]).toEqual({ bankName: 'ALior', swift: 'BIGPLPW' });
        });
    });

});
