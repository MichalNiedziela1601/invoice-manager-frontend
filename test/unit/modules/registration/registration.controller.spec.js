describe('registration.controller.js', function()
{
   'use strict';

    var registerCtrl;
    var authDaoMock;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller, AuthDAO)
    {
        authDaoMock = AuthDAO;

        spyOn(authDaoMock, 'registration').and.returnValue();

        registerCtrl = $controller('RegistrationCompanyController', {AuthDAO: authDaoMock});
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
                registerCtrl.registrationCredential = {
                    name: 'ola', nip: '1111111111', email: 'ola@wp.pl', password: 'olaola'
                };
                registerCtrl.registration();
            });
            it('should set alertMinLength variable to false', function ()
            {
                expect(registerCtrl.alertMinLength).toEqual(false);
            });
            it('should call authDAO.registration function', function ()
            {
                expect(authDaoMock.registration).toHaveBeenCalledWith({
                    name: 'ola', nip: '1111111111', email: 'ola@wp.pl', password: 'olaola'
                });
            });
        });

        describe('isPasswordEqual function', function ()
        {
            beforeEach(function()
            {
                registerCtrl.registrationCredential.password = 'olaola';
                registerCtrl.registrationRepeatPassword.repeatPassword = 'olaola1';
                // registerCtrl.isPasswordsEqual();
            });
            it('should return true if passwords is not the same ', function ()
            {
                expect(registerCtrl.isPasswordsEqual()).toEqual(true);
            });
        });
    });
});
