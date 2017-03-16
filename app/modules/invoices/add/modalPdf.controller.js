(function ()
{
    'use strict';

    function ModalPdfController($uibModalInstance)
    {
        var ctrl = this;

        // sample pdf file
        ctrl.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

        ctrl.ok = function ()
        {
            $uibModalInstance.close();
        };

        ctrl.cancel = function ()
        {
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular.module('app').controller('ModalPdfController', ['$uibModalInstance', ModalPdfController]);
})();
