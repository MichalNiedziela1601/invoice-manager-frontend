(function ()
{
    'use strict';

    function UploadPdfController($scope, $timeout, Upload, $window)
    {
        $scope.$watch('files', function ()
        {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function ()
        {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });
        $scope.log = '';

        $scope.upload = function (files)
        {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: 'https://angular-file-upload-cors-srv.appspot.com/upload', data: {
                                file: file
                            }
                        }).then(function (resp)
                        {
                            $timeout(function ()
                            {
                                $scope.log = 'file: ' + resp.config.data.file.name + ', Response: ' + JSON.stringify(resp.data) + '\n' + $scope.log;
                                $scope.pdfUrl = file;
                                $scope.objectURL = URL.createObjectURL(file);
                                $window.open($scope.objectURL);
                            });
                        });
                    }
                }
            }
        };
    }

    angular.module('app').controller('UploadPdfController', ['$scope', '$timeout', 'Upload', '$window', UploadPdfController]);
})();
