var leaveManage = angular.module('leaveManage',[]);

leaveManage.controller('leaveManage',['$scope','$http','TipService','$location',
    function ($scope,$http,TipService,$location) {
        $scope.items = [];
        $scope.pageItems = [];
        $scope.currentPage = 0;
        $scope.perPage = 10;
        $scope.typename={
            total:'全部',
            unChecked:'待审核',
            checked:'已审核'
        };
        $scope.statusType={
            '0':'待审批',
            '1':'已通过',
            '2':'未通过'
        };
        $scope.userName={

        };
        $scope.query={
            type:"total"
        };
        $scope.selfId=null;
        $scope.recentDepartmentId=null;

        $scope.$watch('query.type',function(value){
            var tempArray=[];
            if(value=='total'){
                $scope.groupToPages($scope.items);
                return;
            }else if(value == 'unChecked'){
                for( var x in $scope.items)
                {
                    if($scope.items[x].submitResult == 0){
                        tempArray.push($scope.items[x]);
                    }
                }
            }else if(value =='checked'){
                for( var x in $scope.items)
                {
                    if($scope.items[x].submitResult !=0){
                        tempArray.push($scope.items[x]);
                    }
                }
            }
            $scope.groupToPages(tempArray);
        });



        $scope.nextPage = function(){
            if( $scope.currentPage + 1 < $scope.pageItems.length)
                $scope.currentPage+=1;
        }

        $scope.prevPage = function(){
            if( $scope.currentPage - 1 >= 0)
                $scope.currentPage-=1;
        }


        $scope.groupToPages = function(tempArray){
            /*var length = parseInt(tempArray.length/$scope.perPage);*/
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

        $scope.editLeave = function(x){
            $location.path('/leaveEdit'+JSON.stringify(x));
        }

        $scope.getLeaveInfo = function(){
            var url ='/teacher/leaveInfo';
            $http.post(url,{}).
            success(function(data){
                if(data.success==false){
                    TipService.setMessage('获取假条失败!','danger')
                }else {
                    for(var x in data){
                        if(data[x].submitResult==0){
                            $scope.items.unshift(data[x]);
                        }else{
                            $scope.items.push(data[x]);
                        }
                    }
                    $scope.groupToPages($scope.items);
                }

            }).
            error(function() {
                console.log("error");
            });
        }();
    }]) ;


leaveManage.controller('leaveEdit',['$scope','$http','TipService','$routeParams','$location',
    function ($scope,$http,TipService,$routeParams,$location) {
        $scope.UserInfo = $.parseJSON($routeParams.par);
        $scope.UserInfo.leaveTime = $.parseJSON($scope.UserInfo.leaveTime);
        $scope.typename={
            '1':'审批通过',
            '2':'审批不通过'

        };
        $scope.info={
            submitResult:'1',
            submitRemark:$scope.UserInfo.submitRemark

        };

        $scope.saveLeave = function(x){
            var url ='/teacher/saveLeave';
            var tempData = {};
            for(var key in $scope.UserInfo)
            {
                tempData[key] = $scope.UserInfo[key];
            }
            tempData.submitRemark = x.submitRemark;
            tempData.submitResult = x.submitResult;

            $http.post(url,tempData).
            success(function(data){
                if(data.success==false){
                    TipService.setMessage('保存失败!','danger');
                }else {
                    TipService.setMessage('保存成功!','danger');
                    $location.path('/leaveManage');
                }

            }).
            error(function() {
                console.log("error");
            });
        }
    }]) ;


