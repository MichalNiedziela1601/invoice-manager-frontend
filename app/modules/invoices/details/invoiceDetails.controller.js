(function ()
{
    'use strict';
    function InvoiceDetailsController(InvoiceDetailsDAO, InvoiceDAO, $routeParams)
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
        ctrl.productNotChoosen = false;
        ctrl.changeNumber = true;
        ctrl.showLoader = false;
        ctrl.payment = [
            {type: 'cash'},
            {type: 'bank transfer'}
        ];
        ctrl.showBox = false;
        ctrl.accountNr = null;
        ctrl.showAccountNotChosen = false;
        ctrl.showChooseAccount = false;

        function createSummary(details)
        {
            ctrl.summary = [];
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

        ctrl.checkAccounts = function ()
        {
            ctrl.showChooseAccount = ('bank transfer' === ctrl.details.paymentMethod);

        };

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

                ctrl.dealer = ctrl.details.companyDealer ? ctrl.details.companyDealer : ctrl.details.personDealer;
                ctrl.accountNr = ctrl.details.dealerAccountNr;

                ctrl.tooltip = ('unpaid' === ctrl.details.status) ? 'Mark as paid' : 'Mark as unpaid';
                if (!ctrl.details.reverseCharge) {
                    createSummary(ctrl.details);
                }
                ctrl.checkAccounts();

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
            ctrl.getDetails();
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

        function getInvoiceNumber()
        {
            var year = ctrl.createDatePicker.date.getFullYear();
            var month = ctrl.createDatePicker.date.getMonth() + 1;
            InvoiceDAO.number(year, month).then(function (number)
            {
                ctrl.details.invoiceNr = 'FV ' + year + '/' + month + '/' + number.number;
            }).catch(function (error)
            {
                console.log('error', error);
            });
        }

        function checkTypeTransaction()
        {
            if (ctrl.details.paymentMethod) {
                if ('bank transfer' === ctrl.details.paymentMethod) {
                    return !!ctrl.details.dealerAccountNr;
                } else if ('cash' === ctrl.details.paymentMethod) {
                    ctrl.details.dealerAccountNr = null;
                    return true;
                }
            }

        }


        function editInvoice(form)
        {
            if (Object.keys(ctrl.details.products).length > 0) {
                if (checkTypeTransaction()) {
                    if (form.$valid) {
                        ctrl.details.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                        ctrl.details.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
                        ctrl.details.companyDealer = _.get(ctrl.details, 'companyDealer.id');
                        ctrl.details.companyRecipent = _.get(ctrl.details, 'companyRecipent.id');
                        ctrl.details.personDealer = _.get(ctrl.details, 'personDealer.id');
                        ctrl.details.personRecipent = _.get(ctrl.details, 'personRecipent.id');

                        changeContractor();
                        ctrl.showLoader = true;
                        InvoiceDetailsDAO.update(ctrl.id, ctrl.details).then(function ()
                        {
                            ctrl.changeNumber = true;
                            ctrl.showLoader = false;
                            ctrl.summary = [];
                            ctrl.showBox = false;
                            ctrl.getDetails();
                            ctrl.showEdit();
                        })
                                .catch(function (error)
                                {
                                    ctrl.changeNumber = true;
                                    ctrl.showLoader = false;
                                    ctrl.getDetails();
                                    ctrl.errorMessage = error.data || error.message || error;
                                    ctrl.formInvalidAlert = true;
                                });
                    }
                } else {
                    ctrl.showAccountNotChosen = true;
                }
            } else {
                ctrl.productNotChoosen = true;
            }

        }

        function closeFormInvalidAlert()
        {
            ctrl.formInvalidAlert = false;
        }

        ctrl.closeProductNotChoosen = function ()
        {
            ctrl.productNotChoosen = false;
        };

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

        ctrl.checkAdvanced = function (form)
        {
            if (ctrl.details.advance > Number(ctrl.details.bruttoValue)) {
                form.advance.$error.validationError = true;
                form.$setValidity('advance', false);
            } else {
                form.advance.$error.validationError = false;
                form.$setValidity('advance', true);
            }
        };

        ctrl.toogleChangeNumber = function ()
        {
            ctrl.changeNumber = !ctrl.changeNumber;
        };

        ctrl.closeAccountNotChosen = function ()
        {
            ctrl.showAccountNotChosen = false;
        };

        ctrl.getInvoiceNumber = getInvoiceNumber;
        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.showEdit = showEdit;
        ctrl.getDetails = getDetails;
        ctrl.editInvoice = editInvoice;
    }

    angular.module('app').controller('InvoiceDetailsController', ['InvoiceDetailsDAO', 'InvoiceDAO', '$routeParams', InvoiceDetailsController]);
})();
