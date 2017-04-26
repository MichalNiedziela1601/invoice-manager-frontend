(function ()
{
    'use strict';
    function UserController(UserDAO,jwtHelper,CompanyDAO)
    {
        var ctrl = this;

        ctrl.addressOpen = true;
        ctrl.personalOpen = true;
        ctrl.bankOpen = true;
        ctrl.showName = false;
        ctrl.companyName = null;
        ctrl.addressOpen = false;

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
        ctrl.token = jwtHelper.decodeToken(UserDAO.getToken());


        ctrl.userAddressData =
        {

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

        CompanyDAO.findByNip(ctrl.token.nip).then(function(company){
            ctrl.companyName = company.name;
            ctrl.userAddressData.street = company.street;
            ctrl.userAddressData.buildNr = company.buildNr;
            ctrl.userAddressData.flatNr = company.flatNr;
            ctrl.userAddressData.postCode = company.postCode;
            ctrl.userAddressData.city = company.city;
            ctrl.showName = true;
        });

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

    angular.module('app').controller('UserController', ['UserDAO','jwtHelper','CompanyDAO', UserController]);

})();
