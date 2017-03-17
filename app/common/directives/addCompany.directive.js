(function ()
{
    'use strict';

    function AddCompanyDirective(CompanyDAO)
    {

        function controllerFn() // change controller name
        {
            var ctrl = this;

            function addCompany()
            {
                console.log(ctrl.company);
                CompanyDAO.addCompany(ctrl.company).then(function ()
                {
                    console.log('debil');
                }).catch(function ()
                {
                    console.log('debil 2s');
                });
            }

            ctrl.addCompany = addCompany;
        }

        return {
            restrict: 'EA', replace: true, bindToController: {
                company: '=', showDirective: '&'
            }, transclude: true, templateUrl: '/common/directives/addCompany.tpl.html', controller: controllerFn, controllerAs: 'addCompDCtrl'
        };
    }

    angular.module('app')
            .directive('addCompany', ['CompanyDAO', AddCompanyDirective]);

})();
