(function ()
{
    'use strict';
    function UserController(UserDAO, $window)
    {
        var ctrl = this;
        ctrl.userAdded = false;
        ctrl.invalidFormAlert = false;
        ctrl.addressEdit = true;
        ctrl.accountEdit = true;
        ctrl.invalidAddress = false;
        ctrl.invalidAccount = false;
        ctrl.registrationCredential = {
            password: ''
        };
        ctrl.registrationRepeatPassword = {
            repeatPassword: ''
        };


        function getInfoUser(){
            ctrl.userInfo = JSON.parse($window.sessionStorage.userInfo);
            ctrl.userAddressData = ctrl.userInfo.address;
            ctrl.userAccountData =
            {
                bankName: ctrl.userInfo.bankName,
                bankAccount: ctrl.userInfo.bankAccount,
                swift: ctrl.userInfo.swift
            };
        }

        ctrl.addAddress = function (form)
        {
            if(form.$valid){
                UserDAO.updateAddress(ctrl.userAddressData).then(function ()
                {
                    UserDAO.getUserInfo().then(function(data)
                    {
                        $window.sessionStorage.setItem('userInfo', angular.toJson(data));
                        getInfoUser();
                        ctrl.addressEdit = true;
                    });
                })
                        .catch(function (error)
                        {
                            ctrl.errorMessage = error.data.message || error;
                            ctrl.invalidAddress = true;
                        });
            }

        };

        ctrl.addAccountData = function (form)
        {
            if(form.$valid){
                UserDAO.updateAccount(ctrl.userAccountData).then(function ()
                {
                    UserDAO.getUserInfo().then(function(data)
                    {
                        $window.sessionStorage.setItem('userInfo', angular.toJson(data));
                        getInfoUser();
                        ctrl.accountEdit = true;
                    });
                })
                        .catch(function(error) {
                            ctrl.errorMessage = error.data.message || error;
                            ctrl.invalidAccount = true;
                        });
            }
        };

        ctrl.isPasswordsEqual = function ()
        {
            return ctrl.registrationCredential.password !== ctrl.registrationRepeatPassword.repeatPassword;
        };

        ctrl.addNewUser = function(form)
        {
            var passwordEqual = !ctrl.isPasswordsEqual();
            if(form.$valid && passwordEqual){
                UserDAO.addNewUser(ctrl.registrationCredential, ctrl.userInfo.id).then(function(){
                    ctrl.userAdded = true;
                    ctrl.registrationCredential = {
                        password: null
                    };
                    ctrl.registrationRepeatPassword = {
                        repeatPassword: null
                    };
                    form.$setPristine();
                }).catch(function (error)
                {
                    ctrl.errorMessage = error.message || error.data.message || error;
                    ctrl.invalidFormAlert = true;
                });
            }

        };

        ctrl.closeAddUser = function ()
        {
            ctrl.userAdded = false;
        };

        ctrl.closeInvalidFormAlert = function ()
        {
            ctrl.invalidFormAlert = false;
        };

        ctrl.closeInvalidAddress = function ()
        {
            ctrl.invalidAddress = false;
        };
        ctrl.closeInvalidAccount = function ()
        {
            ctrl.invalidAccount = false;
        };

        ctrl.toggleAddressEdit = function ()
        {
            ctrl.addressEdit = !ctrl.addressEdit;
        };
        ctrl.toggleAccountEdit = function ()
        {
            ctrl.accountEdit = !ctrl.accountEdit;
        };


        function init(){
            getInfoUser();
        }

        init();
    }

    angular.module('app').controller('UserController', ['UserDAO','$window', UserController]);

})();
