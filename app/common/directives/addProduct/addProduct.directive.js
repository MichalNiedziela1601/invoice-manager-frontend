(function ()
{
    'use strict';

    function AddProductDirective()
    {
        function controllerFn()
        {
            /*jshint validthis:true */
            var ctrl = this;
            ctrl.editEntry = null;
            ctrl.vats = [
                5, 8, 23
            ];

            ctrl.calculateBrutto = function (entry)
            {
                if (entry.vat && !ctrl.reverseCharge) {
                    if (!isNaN(entry.netto) && !isNaN(entry.vat) && !isNaN(entry.amount)) {
                        var brutto = Number((entry.netto * entry.amount * (1 + entry.vat / 100)).toFixed(2));
                        entry.brutto = brutto;

                    }
                } else if (ctrl.reverseCharge) {
                    entry.brutto = Number((entry.netto * entry.amount).toFixed(2));
                }
                else {
                    if (undefined === entry.amount || null === entry.amount || '' === entry.amount) {
                        entry.brutto = entry.netto;
                    } else {
                        entry.brutto = Number((entry.netto * entry.amount).toFixed(2));
                    }
                }
            };

            ctrl.edit = function (entry)
            {
                ctrl.editEntry = angular.copy(entry);
                entry.editMode = true;
            };

            ctrl.save = function (entry)
            {
                entry.editMode = false;
                ctrl.editEntry = null;
                ctrl.calculate();
            };

            ctrl.cancel = function (entry, key)
            {
                entry.editMode = false;

                if (ctrl.editEntry) {
                    ctrl.products[key] = ctrl.editEntry;
                    ctrl.editEntry = null;
                } else {
                    delete ctrl.products[key];
                }
            };

            ctrl.addNew = function ()
            {
                var keys = Object.keys(ctrl.products);
                var len = keys.length;
                ctrl.products[len] = {editMode: true, amount: 1, unit: 'unit'};
            };

            ctrl.deleteProduct = function (key)
            {
                delete ctrl.products[key];
            };
        }

        return {
            restrict: 'E',
            bindToController: {
                products: '=',
                calculate: '&',
                reverseCharge: '=',
                showAmount: '='
            },
            templateUrl: 'common/directives/addProduct/addProduct.tpl.html',
            controller: controllerFn,
            controllerAs: 'addProductCtrl',
            link: function (scope, elem)
            {
                elem.find('#reverse').on('click', function ()
                {
                    if (true === scope.addProductCtrl.reverseCharge) {
                        elem.find('#vat').addClass('hide');
                    } else {
                        elem.find('#vat').removeClass('hide');
                    }

                });
            }
        };

    }

    angular.module('app')
            .directive('addProduct', AddProductDirective);
})();
