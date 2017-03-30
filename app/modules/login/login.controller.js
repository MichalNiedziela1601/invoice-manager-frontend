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
        ctrl.login = function ()
        {
            AuthDAO.login(ctrl.loginCredential).then(function ()
            {
                $location.path('/invoices');
            });
        };
    }

    angular.module('app').controller('LoginController', ['$location', 'AuthDAO', LoginController]);

})();
