var classManage = angular.module('classManage',[]);

classManage.controller('classManage',['$scope','$http','TipService','$location',
    function ($scope,$http,TipService,$location) {
        $scope.items = [];
        $scope.pageItems = [];
        $scope.currentPage = 0;
        $scope.perPage = 10;
        $scope.typename={
        };
        $scope.userName={

        }
        $scope.query={
            type:"default"
        };
        $scope.selfId=null;
        $scope.recentDepartmentId=null;

        $scope.$watch('query.type',function(value){
            if(value != 'default'){
                $scope.getClass(value);
            }
        });

        $scope.getClass = function(id){
            var url ='/teacher/getClass';
            $scope.recentDepartmentId = id;
            $http.post(url,{id:id}).
            success(function(data, status, headers, config){
                if(data.success==false){
                    TipService.setMessage('获取班级失败!','danger')
                }else {
                    $scope.items = data.items;
                    for(var key in data.user){
                        $scope.userName[data.user[key].username]=data.user[key].nickname;
                    }
                    $scope.selfId = data.self;
                    $scope.groupToPages($scope.items);
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }


        $scope.manageClass = function(x){
            var url ='/teacher/manageClass';
            $http.post(url,{
                toggle: x.counselor==$scope.selfId,
                id: x.id
            }).
            success(function(data, status, headers, config){
                if(data.success==false){
                    TipService.setMessage('获取班级失败!','danger')
                }else {
                    $scope.getClass($scope.recentDepartmentId);
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }

        $scope.nextPage = function(){
            if( $scope.currentPage + 1 < $scope.pageItems.length)
                $scope.currentPage+=1;
        }

        $scope.prevPage = function(){
            if( $scope.currentPage - 1 >= 0)
                $scope.currentPage-=1;
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

        $scope.getDepartment = function(){
            var url ='/teacher/getDepartment';
            $http.post(url,{}).
            success(function(data, status, headers, config){
                if(data.success==false){
                    TipService.setMessage('获取专业失败!','danger')
                }else {
                    for(var keys in data){
                        $scope.typename[data[keys].id] = data[keys].name;
                    }
                    $scope.typename['default']='----请选择专业----';
                }

            }).
            error(function(data, status, headers, config) {
                console.log("error");
            });
        }();
    }]) ;
