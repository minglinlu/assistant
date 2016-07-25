var changePassword = angular.module('changePassword',[]);

changePassword.controller('changePwd',['$scope','$http',function($scope,$http){
    $scope.submiting = '确认';
    var clear = function(){
        $scope.user={
            'password':'',
            'newPassword':'',
            'repeatPassword':''
        };
        $scope.submiting = '确认';
    }


    $scope.submitPWD = function(data){
        $scope.submiting = '提交中';
        var url ='/changepwd'
        $http.post(url,data).
        success(function(data){
            if(data.success===true){
               // window.location.href='/';

                clear();
                $scope.showMsg(data.msg);
            }else{
                clear();
                $scope.showMsg(data.err);
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error");
        });
    }
}]);
