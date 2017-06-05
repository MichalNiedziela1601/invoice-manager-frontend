(function ()
{
    'use strict';

    function CapitalizeDirective()
    {
        function linkFn(scope, elem, attrs, modelCtrl)
        {
            var capitalize = function (inputValue)
            {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: linkFn
        };
    }

    angular.module('app')
            .directive('capitalize', CapitalizeDirective);


})();
