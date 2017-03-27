(function ()
{
    'use strict';

    function AddCompanyDirective(CompanyDAO)
    {

        function controller()
        {
            var ctrl = this;

            function addCompany()
            {
                CompanyDAO.addCompany(ctrl.company).then(function ()
                {
                    ctrl.showDirective();
                });
            }

            function validateNip()
            {
                if (9 < ctrl.company.nip.toString().length) {
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
        }

        return {
            restrict: 'EA',
            replace: true,
            bindToController: {
                company: '=',
                showDirective: '&'
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
