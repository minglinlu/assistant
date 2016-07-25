var UserInfo = angular.module('UserInfo',[]);

UserInfo.controller('UserInfo',['$scope','$http','TipService','$filter',
    function ($scope,$http,TipService,$filter) {
        $scope.submitting = '保存';
       /* $('#birthdate')
            .datetimepicker({
                format: 'yyyy-mm-dd',
                minView:2,
                autoclose:true,
                pickerPosition:'bottom-right',
                todayHighlight:true,
                forceParse:false,
                endDate:new Date()
            })
            .on('changeDate',function(event){
                $scope.userInfo.birthdate=$filter('date')(event.date,'yyyy-MM-dd');
            });*/

        $scope.getUserInfo = function(){
            var url ='/teacher/userInfo';
            $http.post(url,{}).
            success(function(data, status, headers, config){
                if(data.success==false){
                    TipService.setMessage('获取个人信息失败!','danger')
                }else {
                    data.birthdate = $filter('date')(new Date(data.birthdate),'yyyy-MM-dd');
                    $scope.userInfo = data;
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }();

        $scope.submitInfo = function(data){
            var url ='/teacher/saveUserInfo';
            $scope.submitting = '提交中';
            $http.post(url,data).
            success(function(data, status, headers, config){
                if(data.success==false){
                    $scope.submitting = '保存';
                    TipService.setMessage('保存教师设置失败!','danger');
                }else {
                    $scope.submitting = '保存';
                    TipService.setMessage('保存教师设置成功','success');
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }
}]) ;