(function ()
{
    'use strict';

    function AddCompanyDirective()
    {

        function controllerFn($scope)
        {
            var ctrl = this;
            ctrl.newCompany = {};

            function addCompany()
            {
                $scope.company = ctrl.newCompany;
                $scope.showDirective();
            }

            ctrl.addCompany = addCompany;
        }

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                company: '=',
                showDirective: '&'
            },
            templateUrl: 'common/directives/addCompany.tpl.html',
            controller: controllerFn,
            controllerAs: 'addCompDCtrl'
        };
    }

    angular.module('app')
            .directive('addCompany', AddCompanyDirective);

})();
