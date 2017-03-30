(function ()
{
    'use strict';

    function AddCompanyDirective(CompanyDAO)
    {
        function controller()
        {
            /*jshint validthis:true */
            var ctrl = this;
            ctrl.addComp = false;
            ctrl.invalidFormAlert = false;
            function addCompany(form)
            {
                if (form.$valid) {
                    if (undefined !== ctrl.company.regon && ctrl.company.regon.length === 0) {
                        delete ctrl.company.regon;
                    }
                    CompanyDAO.addCompany(ctrl.company).then(function ()
                    {
                        ctrl.invalidFormAlert = false;
                        ctrl.addComp = true;
                        ctrl.showDirective();
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
            function closeInvalidFormAlert(){
                ctrl.invalidFormAlert = false;
            }

            function validateNip()
            {
                if (null !== ctrl.company.nip || 9 < ctrl.company.nip.toString().length) {
                    CompanyDAO.findByNip(ctrl.company.nip).then(function ()
                    {
                        ctrl.showAlert = true;
                    }).catch(function ()
                    {
                        ctrl.showAlert = false;
                    });
                }
            }

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
                showDirective: '&',
                showSuccess: '@'
            },
            transclude: true,
            templateUrl: '/common/directives/addCompany.tpl.html',
            controller: controller,
            controllerAs: 'addCompDCtrl'
        };
    }

    angular.module('app')
            .directive('addCompany', ['CompanyDAO', AddCompanyDirective]);

})();
