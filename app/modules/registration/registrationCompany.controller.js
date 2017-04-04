(function ()
{
    'use strict';
    function RegistrationCompanyController(AuthDAO, $location)
    {
        var ctrl = this;
        ctrl.message = 'Registration';

        ctrl.registrationCredential = {
            name: '', nip: '', email: '', password: ''
        };
        ctrl.registrationRepeatPassword = {
            repeatPassword: ''
        };

        ctrl.erorMessage = '';
        ctrl.invalidFormAlert = false;

        ctrl.registration = function ()
        {
            if (ctrl.registrationCredential.password.length < 4) {
                ctrl.alertMinLength = true;
            } else {
                ctrl.alertMinLength = false;
                AuthDAO.registration(ctrl.registrationCredential).then(function ()
                {
                    $location.path('/login');
                }).catch(function (error)
                {
                    ctrl.errorMessage = error.data;
                    ctrl.invalidFormAlert  =true;
                });
            }
        };

        ctrl.closeInvalidFormAlert = function(){
            ctrl.invalidFormAlert = !ctrl.invalidFormAlert;
        };

        ctrl.isPasswordsEqual = function ()
        {
            return ctrl.registrationCredential.password !== ctrl.registrationRepeatPassword.repeatPassword;
        };
    }

    angular.module('app').controller('RegistrationCompanyController', ['AuthDAO', '$location', RegistrationCompanyController]);

})();
