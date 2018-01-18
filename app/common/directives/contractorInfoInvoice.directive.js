(function ()
{
    'use strict';

    function ContractorInfoInvoiceDirective()
    {
        return {
            restrict: 'E',
            scope: {
                company: '='
            },
            templateUrl: 'common/directives/contractorInfoInvoice.tpl.html',
            replace: true
        };
    }

    angular.module('app')
            .directive('contractorInfoInvoice', ContractorInfoInvoiceDirective);

})();
