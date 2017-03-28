(function ()
{
    'use strict';
    function RegistrationCompanyController(AuthDAO)
    {
        var ctrl = this;
        ctrl.message = 'Registration';

        ctrl.registrationCredential = {
            name: '', nip: '', email: '', password: ''
        };
        ctrl.registrationRepeatPassword = {
            repeatPassword: ''
        };

        ctrl.registration = function ()
        {
            if(ctrl.registrationCredential.password.length < 4){
                ctrl.alertMinLength = true;
            } else {
                ctrl.alertMinLength = false;
                AuthDAO.registration(ctrl.registrationCredential).then(function ()
                {

                });
            }
        };

        ctrl.isPasswordsEqual = function ()
        {
            return ctrl.registrationCredential.password !== ctrl.registrationRepeatPassword.repeatPassword;
        };
    }

    angular.module('app').controller('RegistrationCompanyController', ['AuthDAO', RegistrationCompanyController]);

})();
