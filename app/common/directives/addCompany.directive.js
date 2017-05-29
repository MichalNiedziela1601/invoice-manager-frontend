(function ()
{
    'use strict';

    function AddCompanyDirective(CompanyDAO, Person)
    {
        function controller($scope,$timeout)
        {
            /*jshint validthis:true */
            var ctrl = this;
            ctrl.addComp = false;
            ctrl.personAdded = false;
            ctrl.invalidFormAlert = false;

            $scope.$watchCollection(angular.bind(this, function ()
            {
                return [this.type, this.company];
            }), function (oldVal, newVal)
            {
                if ('company' === newVal[0]) {
                    ctrl.activeTab = 0;
                    ctrl.disablePerson = true;
                    ctrl.disableCompany = false;
                    ctrl.disableFormCompany = true;
                    ctrl.disableFormPerson = true;
                } else if ('person' === newVal[0]) {
                    ctrl.person = newVal[1];
                    ctrl.company = null;
                    ctrl.activeTab = 1;
                    ctrl.disableCompany = true;
                    ctrl.disablePerson = false;
                    ctrl.disableFormCompany = true;
                    ctrl.disableFormPerson = true;
                }
            });
            function addCompany(form)
            {
                if (form.$valid) {
                    if (!ctrl.edit) {
                        CompanyDAO.addCompany(ctrl.company).then(function ()
                        {
                            ctrl.invalidFormAlert = false;
                            form.$setPristine();
                            ctrl.addComp = true;
                            ctrl.company = {};
                        }).catch(function (error)
                        {
                            console.error(error);
                            ctrl.showError = true;
                            ctrl.errorMessage = error.data.message || error.data || error;
                        });
                    } else {
                        CompanyDAO.updateCompany(ctrl.company).then(function ()
                        {
                            ctrl.invalidFormAlert = false;
                            ctrl.disableFormCompany = true;
                            form.$setPristine();
                            ctrl.addComp = true;
                        }).catch(function (error)
                        {
                            console.error(error);
                            ctrl.showError = true;
                            ctrl.errorMessage = error.data.message || error.data || error;
                        });
                    }

                } else {
                    ctrl.invalidFormAlert = true;
                    ctrl.addComp = false;
                }
            }

            function closeAddSuccess()
            {
                ctrl.addComp = false;
            }

            function closeInvalidFormAlert()
            {
                ctrl.invalidFormAlert = false;
            }

            function validateNip()
            {
                if (ctrl.company.nip || 9 < ctrl.company.nip.length) {
                    CompanyDAO.findByNip(ctrl.company.nip).then(function ()
                    {
                        ctrl.showAlert = true;
                    }).catch(function ()
                    {
                        ctrl.showAlert = false;
                    });
                }
            }

            ctrl.validateNipPerson = function ()
            {
                if (ctrl.person.nip || 9 < ctrl.person.nip.length) {
                    Person.findByNip(ctrl.person.nip).then(function ()
                    {
                        ctrl.showAlert = true;
                    }).catch(function (error)
                    {
                        console.error(error);
                        ctrl.showAlert = false;
                    });
                }
            };

            ctrl.validateShortcut = function ()
            {
                if (ctrl.company.shortcut) {
                    $timeout(function()
                    {
                        CompanyDAO.findShortcut(ctrl.company.shortcut).then(function (result)
                        {
                            ctrl.showShortcut = !!result[0];
                        })
                                .catch(function (error)
                                {
                                    console.error(error);
                                });

                    },400);

                }
            };

            ctrl.validateShortcutPerson = function ()
            {
                if (ctrl.person.shortcut) {
                    $timeout(function ()
                    {
                        Person.findShortcut(ctrl.person.shortcut).then(function (result)
                        {
                            ctrl.showShortcut = !!result[0];
                        })
                                .catch(function (error)
                                {
                                    console.error(error);
                                });
                    }, 400);

                }
            };

            ctrl.addPerson = function (form)
            {
                if (form.$valid) {
                    if (!ctrl.edit) {
                        Person.addPerson(ctrl.person).then(function ()
                        {
                            ctrl.invalidFormAlert = false;
                            ctrl.personAdded = true;
                            form.$setPristine();
                            ctrl.showAlert = false;
                            ctrl.person = {};

                        })
                                .catch(function (error)
                                {
                                    ctrl.showError = true;
                                    ctrl.errorMessage = error.data || error.data.message || error;
                                });
                    } else {
                        Person.updatePerson(ctrl.person).then(function ()
                        {
                            ctrl.invalidFormAlert = false;
                            form.$setPristine();
                            ctrl.showAlert = false;
                            ctrl.personAdded = true;
                            ctrl.disableFormPerson = true;
                        }).catch(function (error)
                        {
                            console.error(error);
                            ctrl.showError = true;
                            ctrl.errorMessage = error.data.message || error.data || error;
                        });
                    }

                } else {
                    ctrl.invalidFormAlert = true;
                    ctrl.personAdded = false;
                }
            };

            ctrl.toggleEditCompany = function()
            {
                ctrl.disableFormCompany = !ctrl.disableFormCompany;
                ctrl.copyComp = angular.copy(ctrl.company);

            };

            ctrl.cancelCompany = function(){
                ctrl.disableFormCompany = !ctrl.disableFormCompany;
                ctrl.company = ctrl.copyComp;
            };

            ctrl.toggleEditPerson = function()
            {
                ctrl.disableFormPerson = !ctrl.disableFormPerson;
                ctrl.copyPers = angular.copy(ctrl.person);
            };

            ctrl.cancelPerson = function(){
                ctrl.person = ctrl.copyPers;
                ctrl.disableFormPerson = !ctrl.disableFormPerson;
            };

            ctrl.closeAddPerson = function ()
            {
                ctrl.personAdded = false;
            };

            ctrl.closeShowError = function(){
                ctrl.showError = false;
            };

            ctrl.validateNip = validateNip;
            ctrl.addCompany = addCompany;
            ctrl.closeAddSuccess = closeAddSuccess;
            ctrl.closeInvalidFormAlert = closeInvalidFormAlert;
        }

        return {
            restrict: 'EA',
            replace: true,
            bindToController: {
                company: '=',
                edit: '=',
                type: '='
            },
            transclude: true,
            templateUrl: '/common/directives/addCompany.tpl.html',
            controller: controller,
            controllerAs: 'addCompDCtrl'
        };
    }

    angular.module('app')
            .directive('addCompany', ['CompanyDAO', 'Person', AddCompanyDirective]);

})();
