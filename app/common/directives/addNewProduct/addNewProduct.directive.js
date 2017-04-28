(function ()
{
    'use strict';

    function AddNewProductDirective()
    {
        function controller()
        {
            /* jshint validthis: true */
            var ctrl = this;
            ctrl.vats = [
                { vat: 5},
                { vat: 8},
                { vat: 23}
            ];

            ctrl.calculateBrutto = function(){
                if(!isNaN(ctrl.product.netto) && !isNaN(ctrl.product.vat) && !isNaN(ctrl.product.amount) ){
                    var brutto = (ctrl.product.netto * ctrl.product.amount * (1 + ctrl.product.vat/100)).toFixed(2);
                    ctrl.product.brutto = parseFloat(brutto);

                }
            };

            ctrl.add = function (form)
            {
                if(form.$valid){
                    ctrl.addProduct();
                }
            };
        }

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            bindToController: {
                product: '=',
                addProduct: '&'
            },
            templateUrl: 'common/directives/addNewProduct/addNewProduct.directive.tpl.html',
            controller: controller,
            controllerAs: 'addNewProductCtrl'
        };
    }

    angular.module('app')
            .directive('addNewProduct', AddNewProductDirective);


})();
