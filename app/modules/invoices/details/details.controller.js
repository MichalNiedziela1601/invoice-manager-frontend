(function ()
{
    'use strict';
    function DetailsController(DetailsDAO, $routeParams)
    {
        var ctrl = this;
        ctrl.message = 'Details Invoice';
        ctrl.id = $routeParams.id;
        DetailsDAO.query({id: ctrl.id}).then(function (data)
        {
            ctrl.invoiceDetails = data;
        });
    }

    angular.module('app').controller('DetailsController', ['DetailsDAO', '$routeParams', DetailsController]);
})();
