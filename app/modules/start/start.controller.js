(function ()
{
    'use strict';
    function StartController(UserDAO)
    {
        var ctrl = this;
        ctrl.message = 'Invoice Managment';
        ctrl.isAuth = UserDAO.isAuthenticated();
    }

    angular.module('app').controller('StartController', ['UserDAO',StartController]);

})();
