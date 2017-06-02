(function ()
{
    'use strict';

    function FindContractorDirective()
    {
        function controllerFn(CompanyDAO, Person)
        {
            /*jshint validthis:true */
            var ctrl = this;
            ctrl.showBox = false;
            ctrl.showAlert = false;
            ctrl.addContractor = false;
            ctrl.findContractor = function ()
            {
                CompanyDAO.findByNip(ctrl.nipContractor).then(function (result)
                {
                    ctrl.companyModel = null;
                    ctrl.showBox = true;
                    ctrl.showAlert = false;
                    ctrl.company = result;
                    ctrl.nipContractor = null;
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
                    return response;
                });
            };

            ctrl.onSelectCompany = function ($item)
            {
                ctrl.nipContractor = $item.nip;
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
                });
            };

            ctrl.toggleAddContractor = function()
            {
                ctrl.addContractor = !ctrl.addContractor;
            };

        }

        return {
            restrict: 'E',
            templateUrl: 'common/directives/findContractor/findContractor.tpl.html',
            bindToController: {
                company: '=',
                contractorType: '=',
                showBox: '='
            },
            controller: controllerFn,
            controllerAs: 'findContractorCtrl'

        };


    }

    angular.module('app')
            .directive('findContractor', FindContractorDirective);


})();
