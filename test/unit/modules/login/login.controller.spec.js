'use strict';
describe('LoginController', function ()
{
    var loginCtrl;
    var location;
    var $window;
    var UserDAOMock;
    var form;
    
    beforeEach(module('app'));
    beforeEach(inject(function($controller,$location,_$window_,UserDAO){
        location = $location;
        $window = _$window_;
        UserDAOMock = UserDAO;
        loginCtrl = $controller('LoginController',{$location: location, $window: $window, UserDAO: UserDAOMock});
    }));

    describe('initialization', function ()
    {
        it('should set message', function ()
        {
            expect(loginCtrl.message).toBe('Start');
        });
        it('should set loginCredentials', function ()
        {
            expect(loginCtrl.loginCredential).toEqual({email: '', password: ''});
        });
        it('should set invalidFormALert to false', function ()
        {
            expect(loginCtrl.invalidFormAlert).toBeFalsy();
        });
    });

    describe('login', function ()
    {
        describe('when form invalid', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: false
                };
                loginCtrl.login(form);
            });
            it('should set errorMessage', function ()
            {
                expect(loginCtrl.errorMessage).toEqual('Requested fields are not correct!');
            });
            it('should set invalidFormAlert to true', function ()
            {
                expect(loginCtrl.invalidFormAlert).toBeTruthy();
            });
        });
        describe('when form is valid', function ()
        {
            describe('when login sucessfull', function ()
            {
                beforeEach(function ()
                {
                    form = {
                        $valid: true
                    };
                    spyOn(location,'path');
                    loginCtrl.loginCredential = {
                        email: 'test@test',
                        password: 'test'
                    };
                    spyOn(UserDAOMock,'getUserInfo').and.callFake(function(){
                        return successfulPromise({id: 1, email: 'test@test'});
                    });
                    spyOn(UserDAOMock,'login').and.callFake(function(){
                        return successfulPromise();
                    });
                    loginCtrl.login(form);
                });
                it('should call UserDAO.login', function ()
                {
                    expect(UserDAOMock.login).toHaveBeenCalledTimes(1);
                });
                it('should call UserDAO.login with credentials', function ()
                {
                    expect(UserDAOMock.login).toHaveBeenCalledWith({
                        email: 'test@test',
                        password: 'test'
                    });
                });
                it('should call UserDAO.getUserInfo', function ()
                {
                    expect(UserDAOMock.getUserInfo).toHaveBeenCalledTimes(1);
                });
                it('should set sessionStorage item userInfo', function ()
                {
                    expect(angular.fromJson($window.sessionStorage.getItem('userInfo'))).toEqual({id: 1, email: 'test@test'});
                });
                it('should call $location.path to invoices', function ()
                {
                    expect(location.path).toHaveBeenCalledWith('/invoices');
                });
            });

            describe('when login fail', function ()
            {
                beforeEach(function ()
                {
                    form = {
                        $valid: true,
                        $setUntouched: angular.noop
                    };
                    spyOn(form,'$setUntouched');
                    loginCtrl.loginCredential = {
                        email: 'test@test',
                        password: 'test'
                    };
                    spyOn(UserDAOMock,'login').and.callFake(function(){
                        return unsuccessfulPromise({data: 'Invalid password'});
                    });
                    loginCtrl.login(form);
                });
                it('should set errorMessage', function ()
                {
                    expect(loginCtrl.errorMessage).toEqual('Invalid password');
                });
                it('should call $setUntouched', function ()
                {
                    expect(form.$setUntouched).toHaveBeenCalledTimes(1);
                });
                it('should set invalidFormAlert to true', function ()
                {
                    expect(loginCtrl.invalidFormAlert).toBeTruthy();
                });
            });

        });

    });

    describe('closeInvalidFormAlert', function ()
    {
        beforeEach(function ()
        {
            loginCtrl.closeInvalidFormAlert();
        });
        it('should set invalidFormAlert to false', function ()
        {
            expect(loginCtrl.invalidFormAlert).toBeFalsy();
        });
    });
});
