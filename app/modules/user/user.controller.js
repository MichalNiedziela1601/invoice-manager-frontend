(function ()
{
    'use strict';
    function UserController(UserDAO,CompanyDAO, $window)
    {
        var ctrl = this;

        ctrl.addressOpen = true;
        ctrl.personalOpen = true;
        ctrl.bankOpen = true;
        ctrl.showName = false;
        ctrl.addressOpen = false;
        ctrl.userInfo = JSON.parse($window.sessionStorage.userInfo);

        ctrl.openAddress = function ()
        {
            ctrl.addressOpen = !ctrl.addressOpen;
            ctrl.personalOpen = true;
            ctrl.bankOpen = true;
        };
        ctrl.openPersonal = function ()
        {
            ctrl.personalOpen = !ctrl.personalOpen;
            ctrl.addressOpen = true;
            ctrl.bankOpen = true;
        };
        ctrl.openBank = function ()
        {
            ctrl.bankOpen = !ctrl.bankOpen;
            ctrl.addressOpen = true;
            ctrl.personalOpen = true;
        };

        ctrl.userAddressData = ctrl.userInfo.address;

        ctrl.userPersonalData =
        {
            firstName: '',
            lastName: '',
            pesel: ''
        };
        ctrl.userAccountData =
        {
            bankName: '',
            accountNumber: ''
        };


        ctrl.addAddress = function ()
        {
            UserDAO.addAddress(ctrl.userAddressData).then(function ()
            {

            });
        };
        ctrl.addPersonalData = function ()
        {
            UserDAO.addPersonalData(ctrl.userPersonalData).then(function ()
            {

            });
        };
        ctrl.addAccountData = function ()
        {
            UserDAO.addAccountData(ctrl.userAccountData).then(function ()
            {

            });
        };

    }

    angular.module('app').controller('UserController', ['UserDAO','CompanyDAO','$window', UserController]);

})();
