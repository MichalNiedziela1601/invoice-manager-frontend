(function ()
{
    'use strict';
    function LoginController($location, AuthDAO)
    {
        var ctrl = this;
        ctrl.message = 'Start';
        ctrl.loginCredential = {
            email: '',
            password: ''
        };
        ctrl.invalidFormAlert = false;


        ctrl.login = function (form)
        {
            if(form.$valid) {
                AuthDAO.login(ctrl.loginCredential).then(function ()
                {
                    ctrl.invalidFormAlert = false;
                    $location.path('/invoices');
                });
            } else {
                ctrl.invalidFormAlert = true;
            }

        };

        ctrl.closeInvalidFormAlert = function()
        {
            ctrl.invalidFormAlert = false;
        };
    }

    angular.module('app').controller('LoginController', ['$location', 'AuthDAO', LoginController]);

})();
