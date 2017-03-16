(function ()
{
    'use strict';
    function RegistrationCompanyController(AuthDAO)
    {
        var ctrl = this;
        ctrl.message = 'Registration';

        ctrl.registrationCredential =
                {
                    companyName: '',
                    email: '',
                    nip: '',
                    password: '',
                    repeatPassword: ''
                };

        ctrl.registration = function ()
        {
            AuthDAO.registration(ctrl.registrationCredential).then(function ()
            {

            });
        };

    }

    angular.module('app').controller('RegistrationCompanyController', ['AuthDAO', RegistrationCompanyController]);

})();
