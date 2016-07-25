var changePassword = angular.module('changePassword',[]);

changePassword.controller('changePwd',['$scope','$http','$location','TipService',
    function($scope,$http,$location,TipService){
        $scope.submiting = '确认';
        $scope.submitPWD = function(data){
            $scope.submiting = '提交中';
            var url ='/changepwd'
            $http.post(url,data).
            success(function(data){
                $scope.submiting = '确认';
                if(data.success===true){
                    TipService.setMessage("修改密码成功",'success');
                    $location.path('/changeSuccess');
                }else{
                    TipService.setMessage(data.err,'danger');
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
    }
}]);
