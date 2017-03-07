(function ()
{
    'use strict';
    function StartController()
    {
        var ctrl = this;
        ctrl.message = 'Start';
    }

    angular.module('app')
            .controller('StartController', StartController);


})();
