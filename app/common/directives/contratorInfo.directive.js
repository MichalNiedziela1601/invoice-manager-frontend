(function ()
{
    'use strict';

    function ContractorInfoDirective()
    {
        return {
            restrict: 'E',
            scope: {
                company: '='
            },
            templateUrl: 'common/directives/contractorInfo.tpl.html',
            replace: true
        };
    }

    angular.module('app')
            .directive('contractorInfo', ContractorInfoDirective);

})();
