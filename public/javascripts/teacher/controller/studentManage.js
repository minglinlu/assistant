
var studentManage = angular.module('studentManage',[]);

studentManage.controller('studentManage',['$scope','$http','TipService','$location',
    function ($scope,$http,TipService,$location) {
        $scope.items = [];
        $scope.pageItems = [];
        $scope.currentPage = 0;
        $scope.perPage = 10;
        $scope.typename={
            sid:"学号",
            nickname:"姓名",
            class:'班级'
        };
        $scope.query={
            type:"sid",
            msg:""
        };

        $scope.nextPage = function(){
            if( $scope.currentPage + 1 < $scope.pageItems.length)
                $scope.currentPage+=1;
        }

        $scope.prevPage = function(){
            if( $scope.currentPage - 1 >= 0)
                $scope.currentPage-=1;
        }

        $scope.searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        }

        $scope.groupToPages = function(tempArray){
            var length = parseInt(tempArray.length/$scope.perPage);
            $scope.pageItems=[];
            $scope.currentPage=0;
            for(x in tempArray)
            {
                if(x%$scope.perPage==0){
                    $scope.pageItems.push([tempArray[x]]);
                }else{
                    $scope.pageItems[parseInt(x/$scope.perPage)].push(tempArray[x]);
                }
            }
        }

        $scope.toggleMenu = function(event){
            $(event.target).parentsUntil('tbody').toggleClass('active');
            $(event.target).parentsUntil('tbody').next('tr').toggle();
        }

        $scope.Details = function(x){
            $location.path('/studentDetail'+JSON.stringify(x));
        }
        $scope.editLogo = function(x){
            $location.path('/studentLogo'+JSON.stringify(x));
        }
        $scope.getStudents = function(){
            var url ='/teacher/studentInfo';
            $http.post(url,{}).
            success(function(data, status, headers, config){
                if(data.success==false){
                    TipService.setMessage('获取学生信息失败!','danger')
                }else {
                    $scope.items = data;
                    $scope.groupToPages($scope.items);
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }();
    }]) ;
var uploader;

studentManage.controller('studentLogo',['$rootScope','$scope','$http','TipService','$routeParams',
    function($rootScope,$scope,$http,TipService,$routeParams){
        $scope.param = $.parseJSON($routeParams.par);
         $scope.getImg = function (){
            var url='/teacher/getImg'
            $http.post(url,$scope.param)
                .success(function(data, status, headers, config){
                if(data.photo == null)
                {
                    $scope.photos=[];
                    return;
                }
                var urlArray = data.photo.split(',');
                if(urlArray.length!=0){
                    $scope.photos = urlArray.slice(0,urlArray.length-1);
                }else{
                    $scope.photos = urlArray;
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("error");
            });
        }

        $scope.delImg = function(photoname){
            var url ='/teacher/delImg';
            $http.post(url, $.extend({filename:photoname},$scope.param)).
            success(function(data, status, headers, config){
                $scope.getImg();
                TipService.setMessage('删除成功','success');
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("error");
            });
        }



        $scope.getImg();
        uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,

            fileSizeLimit:2*1024*1024,
            // swf文件路径
            swf: 'javascripts/webuploader/Uploader.swf',
            method:'POST',
            formData:$scope.param,
            // 文件接收服务端。
            server:'/teacher/upload',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#filePicker',

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/!*'
            }
        });

        uploader.on( 'uploadError', function(err) {
            TipService.setMessage(err,'danger');
        });

        uploader.on('error', function(type){
            switch(type) {
                case "Q_EXCEED_SIZE_LIMIT":
                    TipService.setMessage('文件过大，请上传较小的文件！','danger');
                    break;
                case "Q_EXCEED_NUM_LIMIT":
                    TipService.setMessage('添加的文件数量过多','danger');
                    break;
                case "Q_TYPE_DENIED":
                    TipService.setMessage('文件类型错误','danger');
                    break;
            }
        });
        uploader.on('uploadSuccess',function(file,res){
            TipService.setMessage('上传成功','success');
            uploader.reset();
            $scope.getImg();
        });
}]);