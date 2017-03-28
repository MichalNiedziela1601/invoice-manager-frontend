(function ()
{
    'use strict';

    function NipMaskDirective()
    {

        function linkFn(scope, elem, attrs, NgModelCtrl)
        {
            var formatPostCode = function(value){
                if(value === undefined) {
                    return '';
                }
                value = value.toString();
                value = value.replace(/[^0-9]/g,'');
                if(value.length > 10){
                    value = value.slice(0,10);
                }

                return value;
            };

            var applyFormating = function ()
            {
                var value = elem.val();
                var original = value;
                if(!value || value.length === 0) {
                    return;
                }
                value = formatPostCode(value);
                if(value !== original){
                    elem.val(value);
                    elem.triggerHandler('input');
                }
            };
            elem.on('keyup', function (e)
            {
                var keycode = e.keyCode;
                var isTextInputKey =
                        (keycode > 47 && keycode < 58) ||
                        keycode === 32 || keycode === 8 ||
                        (keycode > 64 && keycode < 91) ||
                        (keycode > 95 && keycode < 112) ||
                        (keycode > 185 && keycode < 193) ||
                        (keycode > 218 && keycode < 223);
                if (isTextInputKey) {
                    applyFormating();
                }
            });

            NgModelCtrl.$formatters.push(function(value){
                if (!value || value.length === 0) {
                    return value;
                }
                value = formatPostCode(value);
                return value;
            });

        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: linkFn
        };

    }

    angular.module('app')
            .directive('nipMask', NipMaskDirective);


})();
