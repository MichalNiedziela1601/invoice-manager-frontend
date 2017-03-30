(function ()
{
    'use strict';
    function StartController(AuthDAO)
    {
        var ctrl = this;
        ctrl.message = 'Invoice Managment';
        ctrl.isAuth = AuthDAO.isAuthenticated();
    }

    angular.module('app').controller('StartController', ['AuthDAO',StartController]);

})();
