var leave = angular.module('leave',[]);

leave.controller('leave',['$scope','$http','SharedState','TipService','$location','$routeParams',
    function($scope,$http,SharedState,TipService,$location,$routeParams){

        $scope.toggleMenu = function(event){
            $(event.target).parentsUntil('tbody').toggleClass('active');
            $(event.target).parentsUntil('tbody').next('tr').toggle();
        }

        $scope.submiting = '确认';
        var clear = function(){
            $scope.user={
                'password':'',
                'newPassword':'',
                'repeatPassword':''
            };
            $scope.submiting = '确认';
        }


        $scope.getLeave = function(){
            $scope.submiting = '提交中';
            var url ='/leaveInfo'
            $http.post(url,{}).
            success(function(data){
                if(data.success===false){
                    TipService.setMessage('获取请假信息失败','danger')
                }else{
                    $scope.strips = data;
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }();

        $scope.showLeave=function(x){
            $scope.moduleData = x;
            if(!angular.isObject(x.leaveTime))
                $scope.moduleData.leaveTime = $.parseJSON(x.leaveTime);
            SharedState.turnOn('leaveInfo')
        }

        $scope.delLeave = function(x){
            var url ='/delLeave';
            $http.post(url,x).
            success(function(data){
                if(data.success===false){
                    TipService.setMessage('删除失败','danger')
                    $location.path('/delLeave');
                }else{
                    TipService.setMessage('删除成功','success');
                    $location.path('/delLeave');
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }

        $scope.editLeave = function(x){
            if(!angular.isObject(x.leaveTime))
                x.leaveTime = $.parseJSON(x.leaveTime);
            $location.path('/leave/edit'+JSON.stringify(x));
        }

}]);
leave.controller('leaveAsk',['$scope','$http','$filter','$location','TipService',
    function($scope,$http,$filter,$location,TipService){
        $scope.title = '新的假条';

        var now = new Date();
        var shortNow = $filter('date')(now,'yyyy/MM/dd HH:mm');
        $scope.leaveInfo={
            startTime:shortNow,
            endTime:shortNow,
            reason:''
        }
       /* $('#startTime')
        .datetimepicker({
            format: 'yyyy/mm/dd hh:ii',
            todayBtn:true,
            autoclose:true,
            pickerPosition:'bottom-right',
            todayHighlight:true,
            forceParse:false
         })
        .on('changeDate',function(event){
            $scope.leaveInfo.startTime=$filter('date')(event.date,'yyyy/MM/dd HH:mm');
    /!*        $scope.leaveInfo.sTimeStatus = true;
            $scope.$apply();*!/

        });*/
        /*$('#endTime')
        .datetimepicker({
            format: 'yyyy/mm/dd hh:ii',
            todayBtn:true,
            autoclose:true,
            pickerPosition:'bottom-right',
            todayHighlight:true,
            forceParse:false
        })
        .on('changeDate',function(event){
            $scope.leaveInfo.endTime=$filter('date')(event.date,'yyyy/MM/dd HH:mm');
        });*/

        $scope.submiting = '确认';

        $scope.submitLeave = function(data){
            $scope.submiting = '提交中';
            var url ='/createLeave';
            var obj={
                leaveTime:JSON.stringify({
                  "from":parseInt(new Date(data.startTime).valueOf()/1000),
                    "to":parseInt(new Date(data.endTime).valueOf()/1000)
                }),
                leaveReason:data.reason
            }
            $http.post(url,obj).
            success(function(data){
                if(data.success===true){
                    TipService.setMessage('假条添加成功', 'success');
                    $location.path('/leave');
                }else{
                    TipService.setMessage('假条添加失败','danger');
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }


}]);

leave.controller('leaveEdit',['$scope','$http','$filter','$location','TipService','$routeParams',
    function($scope,$http,$filter,$location,TipService,$routeParams){
        $scope.title = '编辑假条';
        var param = $.parseJSON($routeParams.par);
        var s = param.leaveTime.from * 1000;
        var e = param.leaveTime.to * 1000;
        var now = new Date();
        var shortNow = $filter('date')(now,'yyyy/MM/dd HH:mm');
        $scope.leaveInfo={
            id:param.id,
            startTime:$filter('date')(s,'yyyy/MM/dd HH:mm'),
            endTime:$filter('date')(e,'yyyy/MM/dd HH:mm'),
            reason:param.leaveReason
        }
/*        $('#startTime')
            .datetimepicker({
                format: 'yyyy/mm/dd hh:ii',
                todayBtn:true,
                autoclose:true,
                pickerPosition:'bottom-right',
                todayHighlight:true,
                forceParse:false
            })
            .on('changeDate',function(event){
                $scope.leaveInfo.startTime=$filter('date')(event.date,'yyyy/MM/dd HH:mm');
                /!*        $scope.leaveInfo.sTimeStatus = true;
                 $scope.$apply();*!/

            });
        $('#endTime')
            .datetimepicker({
                format: 'yyyy/mm/dd hh:ii',
                todayBtn:true,
                autoclose:true,
                pickerPosition:'bottom-right',
                todayHighlight:true,
                forceParse:false
            })
            .on('changeDate',function(event){
                $scope.leaveInfo.endTime=$filter('date')(event.date,'yyyy/MM/dd HH:mm');
            });*/

        $scope.submiting = '确认';

        $scope.submitLeave = function(data){
            $scope.submiting = '提交中';
            var url ='/updateLeave';
            var obj={
                id:data.id,
                leaveTime:JSON.stringify({
                    "from":parseInt(new Date(data.startTime).valueOf()/1000),
                    "to":parseInt(new Date(data.endTime).valueOf()/1000)
                }),
                leaveReason:data.reason
            }
            $http.post(url,obj).
            success(function(data){
                if(data.success===true){
                    TipService.setMessage('假条修改成功', 'success');
                    $location.path('/leave');
                }else{
                    TipService.setMessage('假条修改失败','danger');
                    $location.path('/leave');
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }

        $scope.cancelEdit = function(){
            $location.path('/leave');
        }

    }]);

leave.directive('checkDate',function(){
     return {
     restrict:'A',
     require:'ngModel',
     link:function(scope,ele,attr,ngModelController) {
         scope.$watch(attr.ngModel, function (n){
             var date = new Date(n);
             if(date == 'Invalid Date'){
                 ngModelController.$setValidity('date',false);
             }else{
                 ngModelController.$setValidity('date',true);
             }
         });
        }
     }
});

leave.directive('alertBar',[function(){
    return{
        restrict:'EA',
        templateUrl:'/alertBar',
        scope:{
            message:"=",
            type:"="
        },
        link:function(scope,ele,attr){
            scope.hideAlert = function(){
                scope.message=null;
                scope.type=null;
            }
        }
    }
}]);

leave.factory('TipService',['$timeout',function($timeout){
    return {
        message:null,
        type:null,
        /***
         * type:
         *      warning
         *      info
         *      danger
         *      success
         *
         * */
        setMessage : function(msg,type){
            this.message = msg;
            this.type = type;
            var  _self = this;
            $timeout(function(){
                _self.clear();
            },3000);
        },
        clear : function () {
            this.message = null;
            this.type = null;
        }
    }
}]);

leave.filter('leaveFormat',function(){
    return function(n){
        if(n==0){
            return '待审批';
        }else if(n==1){
            return '审批通过';
        }else if(n==2){
            return '审批不通过';
        }else{
            return 'ERR';
        }
    }
});