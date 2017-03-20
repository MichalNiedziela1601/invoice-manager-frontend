(function ()
{
    'use strict';
    function UserController(UserDAO)
    {
        var ctrl = this;


        ctrl.userAddressData =
                {
                    street: '',
                    numberBuilding: '',
                    numberFloat: '',
                    city: '',
                    zipCode: ''
                };
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

    angular.module('app').controller('UserController', ['UserDAO', UserController]);

})();
