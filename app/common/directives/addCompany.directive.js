(function ()
{
    'use strict';

    function AddCompanyDirective(CompanyDAO)
    {
        var ctrl = this;

        function controller()
        {
            ctrl.addComp = false;

            function addCompany()
            {
                if(undefined !== ctrl.company.regon && ctrl.company.regon.length === 0){
                    delete ctrl.company.regon;
                }
                CompanyDAO.addCompany(ctrl.company).then(function ()
                {
                    ctrl.addComp = true;
                    ctrl.showDirective();
                });
            }

            function closeAddSuccess()
            {
                ctrl.addComp = false;
            }

            function validateNip()
            {
                if (null !== ctrl.company.nip || 9 < ctrl.company.nip.toString().length) {
                    CompanyDAO.findByNip(ctrl.company.nip).then(function ()
                    {
                        ctrl.showAlert = true;
                    }).catch(function (error)
                    {
                        ctrl.showAlert = false;
                        console.error(error);
                    });

                }
            }

            ctrl.validateNip = validateNip;
            ctrl.addCompany = addCompany;
            ctrl.closeAddSuccess = closeAddSuccess;
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
