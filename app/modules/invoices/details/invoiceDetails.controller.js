(function ()
{
    'use strict';
    function InvoiceDetailsController(InvoiceDetailsDAO, $routeParams)
    {
        var ctrl = this;
        ctrl.message = 'Details Invoice';
        ctrl.id = $routeParams.id;
        InvoiceDetailsDAO.query({id: ctrl.id}).then(function (data)
        {
            ctrl.details = data;
        });
    }

    angular.module('app').controller('InvoiceDetailsController', ['InvoiceDetailsDAO', '$routeParams', InvoiceDetailsController]);
})();
