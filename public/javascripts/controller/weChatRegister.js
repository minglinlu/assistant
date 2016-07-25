var weChatRegister = angular.module('weChatRegister',[]);

weChatRegister.controller('weChatRg',['$scope','$http','$location',function($scope,$http,$location){
    $scope.submiting = '提交';
    var clear = function(){
        $scope.submiting = '提交';
    }


    $scope.submitRG = function(data){
        $scope.submiting = '提交中';
        var url ='/register'
        $http.post(url,data).
        success(function(data){
            if(data.success===true){
                $location.path('/success');
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
