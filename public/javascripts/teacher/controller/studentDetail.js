
var studentDetail = angular.module('studentDetail',[]);

studentDetail.controller('studentDetail',['$scope','$http','TipService','$routeParams','$location',
    function ($scope,$http,TipService,$routeParams,$location) {
        $scope.param = $.parseJSON($routeParams.par);
        $scope.typename = {
            sid:'学号',
            nickname:'姓名',
            politicalStatus:'政治面貌',
            grade:'年级',
            department:'专业',
            from:'生源地',
            dormitory:'宿舍',
            post:'职位',
            evaluation:'综合评测',
            specialty:'特点',
            financial:'家庭情况',
            comment:'备注'
        };
        $scope.Details={
        };

        $scope.getDetail = function(student){
            var url ='/teacher/studentDetail';
            $http.post(url,student).
            success(function(data, status, headers, config){
                if(data.success==false){
                    TipService.setMessage('获取个人信息失败!','danger')
                }else {
                    $scope.Details=data;
                    $.extend($scope.Details,$scope.param);
                    $('.table').show();
                    $('#loadPart').hide();
                }
            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }($scope.param);

        $scope.edit = function(){
            $location.path('/editDetail'+JSON.stringify($scope.Details));
        }
    }]) ;

studentDetail.controller('editDetail',['$scope','$http','TipService','$routeParams',
    function($scope,$http,TipService,$routeParams){
        $scope.inputName = {
            nickname:'姓名',
            politicalStatus:'政治面貌',
            grade:'年级',
            department:'专业',
            from:'生源地',
            dormitory:'宿舍',
            post:'职位',
            evaluation:'综合评测',
        };

        $scope.textName = {
            specialty:'特点',
            financial:'家庭情况',
            comment:'备注'
        };

        $scope.submitting = '保存'
        $scope.Detail=$.parseJSON($routeParams.par);

        $scope.saveInfo = function(x){
            $scope.submitting = '提交中';
            var url ='/teacher/saveStudentInfo'
            $http.post(url,x).
            success(function(data) {
                if (data.success === false) {
                    $scope.submitting = '保存';
                    TipService.setMessage('保存失败','danger')

                } else {
                    $scope.submitting = '保存';
                    TipService.setMessage('保存成功','success')
                }
            });
        }
    }]);
