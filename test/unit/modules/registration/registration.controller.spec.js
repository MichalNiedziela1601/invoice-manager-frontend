describe('RegistrationController', function()
{
   'use strict';

    var registerCtrl;
    var userDaoMock;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller, UserDAO)
    {
        userDaoMock = UserDAO;

        registerCtrl = $controller('RegistrationCompanyController', {AuthDAO: userDaoMock});
    }));

    describe('initialization', function()
    {
        it('should set message variable', function ()
        {
            expect(registerCtrl.message).toBe('Registration');
        });
        describe('registrationCredential', function ()
        {
            it('should set registrationCredential.name property', function ()
            {
                expect(registerCtrl.registrationCredential.name).toBe('');
            });
            it('should set registrationCredential.nip property', function ()
            {
                expect(registerCtrl.registrationCredential.nip).toBe('');
            });
            it('should set registrationCredential.email property', function ()
            {
                expect(registerCtrl.registrationCredential.email).toBe('');
            });
            it('should set registrationCredential.password property', function ()
            {
                expect(registerCtrl.registrationCredential.password).toBe('');
            });
        });
        describe('registrationRepeatPassword', function ()
        {
            it('should set registrationRepeatPassword.repeatPassword property', function ()
            {
                expect(registerCtrl.registrationRepeatPassword.repeatPassword).toBe('');
            });
        });
    });

    describe('registration function', function ()
    {
        describe('password length is less than 4', function ()
        {
            beforeEach(function()
            {
                registerCtrl.registrationCredential.password = 'ola';
                registerCtrl.registration();
            });
            it('should set alertMinLength variable to true', function ()
            {
                expect(registerCtrl.alertMinLength).toEqual(true);
            });
        });
        
        describe('password length is greater than or equal to 4', function ()
        {
            beforeEach(function()
            {
                spyOn(userDaoMock, 'registration').and.callFake(function(){
                    return successfulPromise();
                });
                registerCtrl.registrationCredential = {
                    name: 'ola', nip: '1111111111', email: 'ola@wp.pl', password: 'olaola'
                };
                registerCtrl.registration();
            });
            it('should set alertMinLength variable to false', function ()
            {
                expect(registerCtrl.alertMinLength).toEqual(false);
            });
            it('should call userDAO.registration function', function ()
            {
                expect(userDaoMock.registration).toHaveBeenCalledWith({
                    name: 'ola', nip: '1111111111', email: 'ola@wp.pl', password: 'olaola'
                });
            });
        });

        describe('isPasswordEqual function', function ()
        {
            beforeEach(function()
            {
                spyOn(userDaoMock, 'registration').and.callFake(function(){
                    return successfulPromise();
                });
                registerCtrl.registrationCredential.password = 'olaola';
                registerCtrl.registrationRepeatPassword.repeatPassword = 'olaola1';
            });
            it('should return true if passwords is not the same ', function ()
            {
                expect(registerCtrl.isPasswordsEqual()).toEqual(true);
            });
        });

        describe('when registration throw error', function ()
        {
            beforeEach(function ()
            {
                spyOn(userDaoMock, 'registration').and.callFake(function(){
                    return unsuccessfulPromise({data: 'This email exist in database'});
                });
                registerCtrl.registrationCredential = {
                    name: 'ola', nip: '1111111111', email: 'ola@wp.pl', password: 'olaola'
                };
                registerCtrl.registration();
            });
            it('should set errorMessage', function ()
            {
                expect(registerCtrl.errorMessage).toEqual('This email exist in database');
            });
        });
    });

    describe('closeInvalidFormAlert', function ()
    {
        beforeEach(function ()
        {
            registerCtrl.closeInvalidFormAlert();
        });
        it('should set invalidFormAlert to true', function ()
        {
            expect(registerCtrl.invalidFormAlert).toBeTruthy();
        });
    });
});
