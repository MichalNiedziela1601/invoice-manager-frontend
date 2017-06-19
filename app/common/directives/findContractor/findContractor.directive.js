(function ()
{
    'use strict';

    function FindContractorDirective()
    {
        function controllerFn($window, $timeout, CompanyDAO, Person)
        {
            /*jshint validthis:true */
            var ctrl = this;
            ctrl.showBox = false;
            ctrl.showAlert = false;
            ctrl.showCompanyContractor = true;
            ctrl.showPersonContractor = true;
            ctrl.errorMessage = null;
            ctrl.showError = false;
            ctrl.userInfo = JSON.parse($window.sessionStorage.userInfo);

            ctrl.checkAccount = function(){
                if(ctrl.company.bankAccounts){
                    return Object.keys(ctrl.company.bankAccounts).length > 1;
                }
                return true;
            };

            ctrl.checkAccountChosen = function(){
                if(!ctrl.checkAccount()){
                    ctrl.accountNr = '0';
                } else {
                    ctrl.accountNr = null;
                }
            };

            ctrl.findContractor = function ()
            {
                CompanyDAO.getById(ctrl.idCompany).then(function (result)
                {
                    ctrl.company = result;
                    ctrl.companyModel = null;
                    ctrl.showBox = true;
                    ctrl.showAlert = false;
                    ctrl.idCompany = null;
                    ctrl.checkAccountChosen();
                    ctrl.showFind();
                }).catch(function ()
                {
                    ctrl.showAlert = true;
                    ctrl.showButton = true;
                    ctrl.showBox = false;
                });
            };

            ctrl.findCompaniesByNip = function (nip)
            {
                return CompanyDAO.getNips(nip).then(function (response)
                {
                    response.map(function(company,index){
                        if(ctrl.userInfo.nip === company.nip){
                            response.splice(index,1);
                        }
                    });
                    return response;
                });
            };

            ctrl.onSelectCompany = function ($item)
            {
                ctrl.idCompany = $item.id;
                ctrl.contractorType = 'company';
                ctrl.findContractor();
            };

            ctrl.findPersonByLastName = function (lastName)
            {
                return Person.findByName(lastName).then(function (result)
                {
                    return result;
                });
            };

            ctrl.onSelectPerson = function ($item)
            {
                Person.getById($item.id).then(function (data)
                {
                    ctrl.personModel = null;
                    ctrl.showBox = true;
                    ctrl.showAlert = false;
                    ctrl.company = data;
                    ctrl.contractorType = 'person';
                    ctrl.checkAccountChosen();
                });
            };

            ctrl.toggleShowCompany = function ()
            {
                ctrl.showCompanyContractor = !ctrl.showCompanyContractor;
                ctrl.showPersonContractor = true;
                ctrl.company = null;
            };

            ctrl.toggleShowPerson = function ()
            {
                ctrl.showCompanyContractor = true;
                ctrl.showPersonContractor = false;
                ctrl.company = null;
            };

            ctrl.showFind = function ()
            {
                ctrl.showPersonContractor = true;
                ctrl.showCompanyContractor = true;
                ctrl.noResultsCompany = false;
                ctrl.noResultsPerson = false;
                ctrl.companyModel = null;
                ctrl.personModel = null;

            };

            ctrl.addComp = false;
            ctrl.invalidFormAlert = false;
            function addCompany(form)
            {
                if (form.$valid) {
                    if(undefined !== ctrl.company.regon && 0 === ctrl.company.regon.length){
                        delete ctrl.company.regon;
                    }
                    CompanyDAO.addCompany(ctrl.company).then(function (data)
                    {

                        ctrl.invalidFormAlert = false;
                        form.$setPristine();
                        ctrl.idCompany = data.id;
                        ctrl.contractorType = 'company';
                        ctrl.findContractor();
                    })
                            .catch(function (error)
                            {
                                console.error(error);
                                ctrl.showError = true;
                                ctrl.errorMessage = error.data || error.data.message || error;
                            });
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
                if (ctrl.company.nip || 9 < ctrl.company.nip.toString().length) {
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
                    $timeout(function ()
                    {
                        CompanyDAO.findShortcut(ctrl.company.shortcut).then(function (result)
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

            ctrl.validateShortcutPerson = function ()
            {
                if ( ctrl.company.shortcut) {
                    $timeout(function ()
                    {
                        Person.findShortcut(ctrl.company.shortcut).then(function (result)
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

            ctrl.closeShowError = function(){
                ctrl.showError = false;
            };

            ctrl.addPerson = function(form)
            {
                if (form.$valid) {
                    if (undefined !== ctrl.company.regon && 0 === ctrl.company.regon.length) {
                        delete ctrl.company.regon;
                    }
                    Person.addPerson(ctrl.company).then(function (result)
                    {
                        ctrl.invalidFormAlert = false;
                        form.$setPristine();
                        ctrl.contractorType = 'person';
                        Person.getById(result.id).then(function(person)
                        {
                            ctrl.showBox = true;
                            ctrl.showAlert = false;
                            ctrl.company = person;
                            ctrl.showFind();
                        });
                    })
                            .catch(function (error)
                            {
                                ctrl.showError = true;
                                ctrl.errorMessage = error.data || error.data.message || error;
                            });
                } else {
                    ctrl.invalidFormAlert = true;
                    ctrl.addComp = false;
                }
            };

            ctrl.validateNip = validateNip;
            ctrl.addCompany = addCompany;
            ctrl.closeAddSuccess = closeAddSuccess;
            ctrl.closeInvalidFormAlert = closeInvalidFormAlert;

        }

        return {
            restrict: 'E',
            templateUrl: 'common/directives/findContractor/findContractor.tpl.html',
            bindToController: {
                company: '=',
                contractorType: '=',
                showBox: '=',
                accountNr: '='
            },
            controller: controllerFn,
            controllerAs: 'findContractorCtrl'
        };


    }

    angular.module('app')
            .directive('findContractor', FindContractorDirective);


})();
