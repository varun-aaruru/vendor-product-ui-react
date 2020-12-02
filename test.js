<!DOCTYPE html>
<html>
<head>
    <meta chrset="UTF 8">
    <title>Event Registration</title>
</head>
<body>
<script src="https://code.angularjs.org/1.6.9/angular.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>

<h1> Guru99 Global Event</h1>
<div ng-app="DemoApp" ng-controller="DemoController">
    <input type="button" value="Hide Angular" ng-click="ShowHide()"/>
    <br><br><div ng-hide="IsVisible">Angular</div>
</div>
<script type="text/javascript">
    var app = angular.module('DemoApp',[]);
    app.controller('DemoController',function($scope){
        $scope.IsVisible = false;
        $scope.ShowHide = function(){
            $scope.IsVisible = $scope.IsVisible = true;
        }
        });
</script>
</body>
</html>