(function ()
{
    'use strict';
    function RegistrationCompanyController(AuthDAO)
    {
        var ctrl = this;
        ctrl.message = 'Registration';

        ctrl.registrationCredential = {
            companyName: '', email: '', nip: '', password: '', repeatPassword: ''
        };

        ctrl.registration = function ()
        {
            AuthDAO.registration(ctrl.registrationCredential).then(function ()
            {

            });
        };

        ctrl.isPasswordsEqual = function ()
        {
            return ctrl.registrationCredential.password !== ctrl.registrationCredential.repeatPassword;
        };
    }

    angular.module('app').controller('RegistrationCompanyController', ['AuthDAO', RegistrationCompanyController]);

})();
