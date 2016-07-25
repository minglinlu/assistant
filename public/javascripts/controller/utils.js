var utils = angular.module('utils',[]);
utils.directive('checkDate',function(){
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

utils.directive('alertBar',[function(){
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


utils.directive('search',function(){
    return {
        restrict:'A',
        require:'ngModel',
        link:function(scope,ele,attr,ngModelController) {
            scope.$watchGroup([attr.ngModel,attr.search], function (n){
                var tempArray = [];
                for( var x in scope.items)
                {
                    if(scope.searchMatch(scope.items[x][n[1]],n[0])){
                        tempArray.push(scope.items[x]);
                    }
                }
                scope.groupToPages(tempArray);

            });
        }
    }
});

utils.factory('TipService',['$timeout',function($timeout){
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

utils.filter('leaveFormat',function(){
    return function(n){
        if(n==0){
            return '待审批';
        }else if(n==1){
            return '审批通过';
        }else if(n==2){
            return '审批不通过';
        }else{
            return null;
        }
    }
});