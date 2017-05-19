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
        ctrl.payment = [
            {type: 'cash'},
            {type: 'bank transfer'}
        ];
        ctrl.vats = [
            5, 8, 23, 'N/A'
        ];

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

                if (_.some(ctrl.details.products, ['vat', 'N/A'])) {
                    ctrl.reverseCharge = true;
                }
                else {
                    ctrl.reverseCharge = false;
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

        ctrl.calculateBrutto = function (entry)
        {
            if ('N/A' !== entry.vat) {

                if (!isNaN(entry.netto) && !isNaN(entry.vat) && !isNaN(entry.amount)) {
                    var brutto = Number((entry.netto * entry.amount * (1 + entry.vat / 100)).toFixed(2));
                    entry.brutto = brutto;

                }
            } else {
                if (undefined === entry.amount || null === entry.amount || '' === entry.amount) {
                    entry.brutto = entry.netto;
                } else {
                    entry.brutto = Number((entry.netto * entry.amount).toFixed(2));
                }
            }
        };

        function calculateNettoBrutto()
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
                ctrl.details.bruttoValue = Number(Math.round(brutto + 'e2')+'e-2');
            }
        }


        function deleteProduct(key)
        {
            delete ctrl.details.products[key];
        }

        getDetails();


        function showEdit()
        {
            ctrl.showEditInvoice = !ctrl.showEditInvoice;
            ctrl.showDetailsInvoice = !ctrl.showDetailsInvoice;
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

                InvoiceDetailsDAO.update(ctrl.id, ctrl.details).then(function ()
                {
                    ctrl.summary = [];
                    ctrl.getDetails();
                    ctrl.showEdit();
                })
                        .catch(function (error)
                        {
                            ctrl.errorMessage = error.data;
                            ctrl.formInvalidAlert = true;
                        });
            }
        }

        function closeFormInvalidAlert()
        {
            ctrl.invalidFormAlert = false;
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

        ctrl.editEntry = null;

        ctrl.edit = function (entry)
        {
            ctrl.editEntry = angular.copy(entry);
            entry.editMode = true;
        };

        ctrl.save = function (entry)
        {
            entry.editMode = false;
            ctrl.editEntry = null;
            calculateNettoBrutto();
        };

        ctrl.cancel = function (entry, key)
        {
            entry.editMode = false;

            if (ctrl.editEntry !== null) {
                ctrl.details.products[key] = ctrl.editEntry;
                ctrl.editEntry = null;
            } else {
                delete ctrl.details.products[key];
            }
        };

        ctrl.addNew = function ()
        {
            var keys = Object.keys(ctrl.details.products);
            var len = keys.length;
            ctrl.details.products[len] = {editMode: true};

        };

        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.showEdit = showEdit;
        ctrl.getDetails = getDetails;
        ctrl.editInvoice = editInvoice;
        ctrl.deleteProduct = deleteProduct;
    }

    angular.module('app').controller('InvoiceDetailsController', ['InvoiceDetailsDAO', '$routeParams', InvoiceDetailsController]);
})();
