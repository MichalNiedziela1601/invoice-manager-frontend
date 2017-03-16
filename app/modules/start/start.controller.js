(function ()
{
    'use strict';
    function StartController(AuthDAO)
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

            });
        };
    }

    angular.module('app').controller('StartController', ['AuthDAO', StartController]);

})();
