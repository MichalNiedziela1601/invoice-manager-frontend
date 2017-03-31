(function ()
{
    'use strict';

    function ContractorInfoInvoiceDirective()
    {
        return {
            restrict: 'E',
            scope: {
                company: '=',
                address: '='
            },
            templateUrl: 'common/directives/contractorInfoInvoice.tpl.html',
            replace: true
        };
    }

    angular.module('app')
            .directive('contractorInfoInvoice', ContractorInfoInvoiceDirective);

})();
