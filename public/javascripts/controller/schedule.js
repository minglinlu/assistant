var schedule = angular.module('schedule',['ngRoute']);

schedule.controller('schedule',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
    var temp;
    $scope.getUserInfo = function(){
        var url ='/UserInfo';
        $http.post(url,{}).
        success(function(data, status, headers, config){
            $scope.UserInfo = data;
            $scope.UserInfo.curriculum = JSON.parse($scope.UserInfo.curriculum);

        }).
        error(function(data, status, headers, config) {
            console.log("error");
        });
    }();

    $scope.showInput= function(event){
        var input;
        var p;
        if($(event.target).is('p')) {
            p = $(event.target);
            input = $(event.target).next('input');
        }else {
            p = $(event.target).children('p');
            input = $(event.target).children('input');
        }
        $(p).hide();
        $(input).show();
        $(input).focus();
        temp = $(input).val();
    }

    $scope.hideInput = function(event){
        var input = event.target;
        var p = $(input).prev('p');
        $(p).show();
        $(input).hide();
        if($(input).val() != temp){
            $scope.BtnShow=true;
        }

    }

    $scope.submitSchedule = function(data){
        $scope.submiting = '提交中';
        var url ='/saveSchedule'
        var curriculum = JSON.stringify(data.curriculum);
        $http.post(url,{curriculum:curriculum}).
        success(function(data){
            if(data.success===true){
                $location.path('/toSchedule');
            }else {
                $rootScope.showMsg(data.err);
                $scope.submiting = '保存修改';
            }
        }).
        error(function(data, status, headers, config) {
            console.log("error");
        });
    }



}]);
