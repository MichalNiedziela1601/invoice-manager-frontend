(function(){
    'use strict';

    function addBankAccountDirective(){
        function controllerFn(){
            /*jshint validthis:true */
            var ctrl = this;
            ctrl.editEntry = null;
            ctrl.addNew = function(){
                if(!ctrl.accounts){
                    ctrl.accounts = {};
                }
                var length = Object.keys(ctrl.accounts).length;
                ctrl.accounts[length] = {editMode: true, bankName: ctrl.accounts[0]  ? ctrl.accounts[0].bankName : '',
                    swift: ctrl.accounts[0] ? ctrl.accounts[0].swift : null};
            };

            ctrl.save = function(entry){
                ctrl.editEntry = null;
                entry.editMode = false;
                ctrl.acc = ctrl.accounts;
            };

            ctrl.edit = function(entry){
                ctrl.editEntry = angular.copy(entry);
                entry.editMode = true;
            };

            ctrl.cancel = function (entry, key)
            {
                entry.editMode = false;

                if (ctrl.editEntry) {
                    ctrl.accounts[key] = ctrl.editEntry;
                    ctrl.editEntry = null;
                } else {
                    delete ctrl.accounts[key];
                }
            };

            ctrl.delete = function(key){
                delete ctrl.accounts[key];
            };

        }
        return {
            restrict: 'E',
            bindToController: {
                accounts: '='
            },
            templateUrl: 'common/directives/addBankAccount/addBankAccount.tpl.html',
            controller: controllerFn,
            controllerAs: 'addAccountCtrl'
        };


    }

    angular.module('app')
        .directive('addBankAccount', addBankAccountDirective);


})();
