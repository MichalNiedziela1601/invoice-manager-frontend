(function ()
{
    'use strict';
    function LoginController($location, $window, UserDAO)
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
                UserDAO.login(ctrl.loginCredential).then(function ()
                {
                    ctrl.invalidFormAlert = false;
                }).then(function()
                {
                    UserDAO.getUserInfo().then(function(data){
                        $window.sessionStorage.setItem('userInfo', angular.toJson(data));
                        $location.path('/invoices');
                    });
                }).catch(function(error){
                    form.$setUntouched();
                    ctrl.errorMessage = error.data;
                    ctrl.invalidFormAlert = true;
                });
            } else {
                ctrl.errorMessage = 'Requested fields are not correct!';
                ctrl.invalidFormAlert = true;
            }

        };

        ctrl.closeInvalidFormAlert = function()
        {
            ctrl.invalidFormAlert = false;
        };
    }

    angular.module('app').controller('LoginController', ['$location','$window', 'UserDAO', LoginController]);

})();
