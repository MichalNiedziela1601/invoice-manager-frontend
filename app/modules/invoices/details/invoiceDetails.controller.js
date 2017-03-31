(function ()
{
    'use strict';
    function InvoiceDetailsController(InvoiceDetailsDAO, $routeParams)
    {
        var ctrl = this;
        ctrl.message = 'Details Invoice';
        ctrl.showEditInvoice = false;
        ctrl.showDetailsInvoice = true;
        ctrl.id = $routeParams.id;
        function getDetails()
        {
            InvoiceDetailsDAO.query({id: ctrl.id}).then(function (data)
            {
                ctrl.details = data;
                ctrl.createDatePicker = {
                    date: new Date(ctrl.details.createDate), opened: false, options: {
                        formatYear: 'yy', maxDate: new Date(), startingDay: 1
                    }, open: function ()
                    {
                        this.opened = !this.opened;
                    }
                };

                ctrl.executionDatePicker = {
                    date: new Date(ctrl.details.executionEndDate), opened: false, options: {
                        formatYear: 'yy', startingDay: 1
                    }, open: function ()
                    {
                        this.opened = !this.opened;
                    }
                };
            });
        }
        getDetails();



        function showEdit(){
            ctrl.showEditInvoice = !ctrl.showEditInvoice;
            ctrl.showDetailsInvoice = !ctrl.showDetailsInvoice;
        }
        function editInvoice(form){
            if(form.$valid) {
                ctrl.details.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                ctrl.details.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
                InvoiceDetailsDAO.update(ctrl.id, ctrl.details).then(function ()
                {
                    ctrl.getDetails();
                    ctrl.showEdit();
                });
            }
        }

        ctrl.showEdit = showEdit;
        ctrl.getDetails = getDetails;
        ctrl.editInvoice = editInvoice;
    }

    angular.module('app').controller('InvoiceDetailsController', ['InvoiceDetailsDAO', '$routeParams', InvoiceDetailsController]);
})();
