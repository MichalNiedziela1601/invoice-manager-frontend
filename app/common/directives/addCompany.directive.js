(function ()
{
    'use strict';

    function AddCompanyDirective()
    {

        function controllerFn()
        {
            var ctrl = this;

            function addCompany()
            {
                ctrl.showDirective();
            }

            ctrl.addCompany = addCompany;
        }

        return {
            restrict: 'EA',
            replace: true,
            bindToController: {
                company: '=',
                showDirective: '&'
            },
            templateUrl: '/common/directives/addCompany.tpl.html',
            controller: controllerFn,
            controllerAs: 'addCompDCtrl'
        };
    }

    angular.module('app')
            .directive('addCompany', AddCompanyDirective);

})();
