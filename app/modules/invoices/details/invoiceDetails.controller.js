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
        ctrl.summary = [];
        ctrl.reverseCharge = false;
        ctrl.formInvalidAlert = false;
        ctrl.errorMessage = '';
        ctrl.product = {};
        ctrl.contractorChange = false;
        ctrl.payment = [
            {type: 'cash'},
            {type: 'bank transfer'}
        ];
        ctrl.showBox = false;


        function createSummary(details)
        {
            var subTotal = _.reduce(details.products, function (result, value)
            {
                (result[value.vat] || (result[value.vat] = [])).push(value);
                return result;
            }, {});

            _.each(subTotal, function (value, key)
            {
                var sum = {
                    vat: key,
                    nettoValue: 0,
                    vatValue: 0,
                    bruttoValue: 0
                };
                _.forEach(value, function (val)
                {
                    sum.nettoValue += val.netto * (val.amount || 1);
                    sum.vatValue += val.brutto - val.netto * (val.amount || 1);
                    sum.bruttoValue += val.brutto;
                });
                ctrl.summary.push(sum);

            });
        }


        function getDetails()
        {
            InvoiceDetailsDAO.query({id: ctrl.id}).then(function (data)
            {
                data.advance = Number(data.advance);
                ctrl.details = data;
                if ('sell' === ctrl.details.type) {
                    ctrl.contractor = ctrl.details.companyRecipent ? ctrl.details.companyRecipent : ctrl.details.personRecipent;
                    ctrl.details.contractorType = ctrl.details.companyRecipent ? 'company' : 'person';
                } else if ('buy' === ctrl.details.type) {
                    ctrl.contractor = ctrl.details.companyDealer ? ctrl.details.companyDealer : ctrl.details.personDealer;
                    ctrl.details.contractorType = ctrl.details.companyDealer ? 'company' : 'person';
                }

                if (!ctrl.details.reverseCharge) {
                    createSummary(ctrl.details);
                }

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


        ctrl.calculateNettoBrutto = function ()
        {
            var len = Object.keys(ctrl.details.products).length;
            var netto = 0, brutto = 0;
            if (len > 0) {
                angular.forEach(ctrl.details.products, function (product)
                {
                    if (product.amount) {
                        netto += product.netto * product.amount;
                        brutto += product.brutto;
                    } else {
                        netto += product.netto;
                        brutto += product.brutto;
                    }
                });
                ctrl.details.nettoValue = Number(netto);
                ctrl.details.bruttoValue = Number(Math.round(brutto + 'e2') + 'e-2');
            }
        };

        getDetails();

        function showEdit()
        {
            ctrl.showEditInvoice = !ctrl.showEditInvoice;
            ctrl.showDetailsInvoice = !ctrl.showDetailsInvoice;
        }

        function changeContractor()
        {
            if ('sell' === ctrl.details.type) {
                ctrl.details.companyRecipent = ('company' === ctrl.details.contractorType) ? ctrl.contractor.id : null;
                ctrl.details.personRecipent = ('company' === ctrl.details.contractorType) ? null : ctrl.contractor.id;
            } else if ('buy' === ctrl.details.type) {
                ctrl.details.companyDealer = ('company' === ctrl.details.contractorType) ? ctrl.contractor.id : null;
                ctrl.details.personDealer = ('company' === ctrl.details.contractorType) ? null : ctrl.contractor.id;
            }

        }

        function editInvoice(form)
        {
            if (form.$valid) {
                ctrl.details.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                ctrl.details.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
                ctrl.details.companyDealer = _.get(ctrl.details, 'companyDealer.id');
                ctrl.details.companyRecipent = _.get(ctrl.details, 'companyRecipent.id');
                ctrl.details.personDealer = _.get(ctrl.details, 'personDealer.id');
                ctrl.details.personRecipent = _.get(ctrl.details, 'personRecipent.id');
                changeContractor();
                InvoiceDetailsDAO.update(ctrl.id, ctrl.details).then(function ()
                {
                    ctrl.summary = [];
                    ctrl.showBox = false;
                    ctrl.getDetails();
                    ctrl.showEdit();
                })
                        .catch(function (error)
                        {
                            ctrl.getDetails();
                            ctrl.errorMessage = error.data || error.message || error;
                            ctrl.formInvalidAlert = true;
                        });
            }
        }

        function closeFormInvalidAlert()
        {
            ctrl.formInvalidAlert = false;
        }

        ctrl.changeStatus = function ()
        {
            var status;
            switch (ctrl.details.status) {
                case 'unpaid' : {
                    status = 'paid';
                    break;
                }
                case 'paid' : {
                    status = 'unpaid';
                    break;
                }
            }
            InvoiceDetailsDAO.changeStatus(ctrl.id, status).then(function ()
            {
                getDetails();
            })
                    .catch(function (error)
                    {
                        console.error(error);
                    });
        };

        ctrl.toggleContractorChange = function ()
        {
            ctrl.contractorChange = !ctrl.contractorChange;
        };

        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.showEdit = showEdit;
        ctrl.getDetails = getDetails;
        ctrl.editInvoice = editInvoice;
    }

    angular.module('app').controller('InvoiceDetailsController', ['InvoiceDetailsDAO', '$routeParams', InvoiceDetailsController]);
})();
