(function ()
{
    'use strict';
    function RegistrationCompanyController()
    {
        var ctrl = this;
        ctrl.message = 'Registration';

        function registration()
        {

        }
        ctrl.registration = registration;


    }

    angular.module('app').controller('RegistrationCompanyController', [RegistrationCompanyController]);

})();
