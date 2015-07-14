angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
  
  // $rootScope.FLiQFetcherIP = "localhost";
  // Define FLiQFetcher IP below, myQServer IP defined at the FLiQFetcher config file
  // Store the FLiQFetcher IP in the rootScope to make it visible to all controller
  $rootScope.FLiQFetcherIP = "192.168.1.143";

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('selFrontCtrl', function($scope, $http, $ionicLoading, $location, $rootScope, $state, IPSvc){
  console.log("FLiQFetcherIP: ", $rootScope.FLiQFetcherIP);
  var ipData = IPSvc.getMyQIP();
  // console.log("ipData: ", ipData);
  // Change loader color using CSS in js object notation
  $scope.loader = {'background-color': 'red'};

  // Hide segment display
  $scope.hideSegment = true;

  if($rootScope.qNum || $rootScope.qNum != null)
  {
    // View ionic loading
    $ionicLoading.show({template: "<ion-spinner icon='ios-medium'></ion-spinner>"});
    console.log("rootScope.qNum: " + $rootScope.qNum);
    // get qNum from rootscope
    $scope.qNum = $rootScope.qNum;
    $scope.hideForm = true;
    $scope.hideRes = false;
    $scope.getRes();
    var display = new SegmentDisplay("display");
    display.pattern         = "####";
    display.displayAngle    = 6;
    display.digitHeight     = 20;
    display.digitWidth      = 14;
    display.digitDistance   = 2.5;
    display.segmentWidth    = 2;
    display.segmentDistance = 0.3;
    display.segmentCount    = 7;
    display.cornerType      = 3;
    display.colorOn         = "#9966FF";
    display.colorOff        = "#000020";
    display.draw();
    display.setValue(""+$rootScope.qNum+"");
    $scope.hideSegment = false;
    $scope.loader = {'background-color': 'green'};
  }
  else
  {
    $scope.hideRes = true;
    $scope.hideForm = false;
    // $scope.hideSegment = true;
    $scope.loader = {'background-color': 'red'};
  }

  $scope.agName = $rootScope.agName;

  $ionicLoading.hide();

  $scope.reEnterQnum = function(){
    $scope.hideForm = false;
  }

  $scope.formData = {};
  $scope.chckQueue = function(){
    $scope.result = "";
    $scope.loader = {'background-color': 'blue'};
    $ionicLoading.show({template: "<ion-spinner icon='ios-medium'></ion-spinner>"});

    var qNum = $scope.formData.qNum;
    $rootScope.qNum = qNum;
    var jData = {"qNum": qNum};

    // Check the queue number tstus using jquery
    $http.post('http://'+ $rootScope.FLiQFetcherIP +'/FLiQFetcher/WS/checkQNum.php', jData)
      .success(function(data, status, header, config){
        console.log("status: " + status);
        console.log("data: " + data.qNumber);
        var res = " ";
        if(!data.qNumber)
        {
          // alert("Queue Number: " + qNum + " Not Found");
          res = "<center> Queue Number " + qNum + " Not Found </center>";
          $scope.loader = {'background-color': 'red'};
          $scope.hideSegment = true;
        }
        else
        {
          $scope.hideForm = true;
          $scope.hideRes = false;
          res = "Queue Number: <b>" + data.qNumber + "</b><br/>" +
                "Main Service: " + data.mainSvc + "<br/>" +
                "Issued on: " + data.issueTime + "<br/>" +
                "Wait Duration: " + data.waitDur + "<br/>" +
                "Estimated Call Time: --:--:--" + "<br/>";
          $scope.loader = {'background-color': 'green'};

          // Segment Display Instantiation
          var display = new SegmentDisplay("display");
          display.pattern         = "####";
          display.displayAngle    = 6;
          display.digitHeight     = 20;
          display.digitWidth      = 14;
          display.digitDistance   = 2.5;
          display.segmentWidth    = 2;
          display.segmentDistance = 0.3;
          display.segmentCount    = 7;
          display.cornerType      = 3;
          display.colorOn         = "#9966FF";
          display.colorOff        = "#000020";
          display.draw();
          display.setValue(""+$rootScope.qNum+"");
          $scope.hideSegment = false;
        }
        $scope.hideRes = false;
        $scope.result = res;
        // Hide ionic loading after finish process the page content
        $ionicLoading.hide();
      })
      .error(function(data, status, headers, config){
        console.log("status: " + status);
        console.log("data: " + data);
      });
  };

  $scope.getRes = function(){
    $scope.result = "";
    var jData = {"qNum": $rootScope.qNum};

    $scope.loader = {'background-color': 'blue'};

    $http.post('http://'+ $rootScope.FLiQFetcherIP +'/FLiQFetcher/WS/checkQNum.php', jData)
      .success(function(data, status, header, config){
        console.log("status: " + status);
        console.log("data: " + data.qNumber);
        var res = " ";
        if(!data.qNumber)
        {
          // alert("Queue Number: " + qNum + " Not Found");
          res = "Queue Number Not Found";
          $scope.loader = {'background-color': 'red'};
        }
        else
        {
          $scope.hideForm = true;
          $scope.hideRes = false;
          res = "Queue Number: <b>" + data.qNumber + "</b><br/>" +
                "Main Service: " + data.mainSvc + "<br/>" +
                "Issued on: " + data.issueTime + "<br/>" +
                "Wait Duration: " + data.waitDur + "<br/>" +
                "Estimated Call Time: --:--:--" + "<br/>";
          $scope.loader = {'background-color': 'green'};
        }
        $scope.hideRes = false;
        $scope.result = res;
      })
      .error(function(data, status, headers, config){
        console.log("status: " + status);
        console.log("data: " + data);
      });
  };

})

.controller('FrontCtrl', function($scope, $http, $ionicLoading, $location, $rootScope, $state){

  // Bind the dropdown using jquery-chained
  $("#yyy").chained("#xxx");
  $rootScope.yyy = null;
  $rootScope.qNum = null;
  $rootScope.agName = null;
  $scope.formData = {};

  $scope.submitNext = function(){
    $rootScope.yyy = null;
    $rootScope.qNum = null;
    $rootScope.agName = "";
    var xxx = $scope.formData.xxx;
    var yyy = $scope.formData.yyy;
    
    if(yyy == 1)
    {
      $rootScope.agName = "Hospital Umum Sarawak";
    }
    else if(yyy == 2)
    {
      $rootScope.agName = "Hospital Umum Miri";
    }
    else if(yyy == 3)
    {
      $rootScope.agName = "Hospital Umum Bintulu";
    }
    else if(yyy == 4)
    {
      $rootScope.agName = "JPJ Wangsamaju";
    }
    else if(yyy == 5)
    {
      $rootScope.agName = "JPJ Bangi";
    }
    else if(yyy == 6)
    {
      $rootScope.agName = "JPJ Padang Jawa";
    }
    else if(yyy == 7)
    {
      $rootScope.agName = "JPJ UTC KL";
    }

    $rootScope.yyy = yyy;
    console.log("xxx: " + xxx);
    console.log("yyy: " + yyy);
    console.log("agName from submitNext: " + $rootScope.agName);


    // $location.path('#/sel/selFront/');
    // Redirect using state.go()
    $state.go('sel.selFront');
  }
})

.controller('cStatusCtrl', function($state, $scope, $http, $ionicLoading, $interval, $rootScope){

  // Displaying title for the page
  $scope.agName = $rootScope.agName;
  $scope.loader = {'background-color': 'red'};
  // Counter Refresh-Interval Destroyer
  // Prevent the refresh occur when the page is not loaded/active
  $scope.$on("$destroy", function(event){
    if(counterRefresh) {
      $interval.cancel(counterRefresh);
    }
  });

  $ionicLoading.show({template: "<ion-spinner icon='ios-medium'></ion-spinner>"});

  // Retrieve the counter status from fetcher using jquery
  $http.get('http://'+ $rootScope.FLiQFetcherIP +'/FLiQFetcher/WS/getCStatus.php').then(function(response){
    // console.log(response);
    if(response == "")
    {
      // alert("No Counter Found");
      console.log("No Counter Found");
      // Nothing returned from WS
    }
    else
    {
      // Json returned from WS
      // console.log("response: " + response.data);
      $scope.datas = response.data;
      $scope.loader = {'background-color': 'green'};
    }
    $ionicLoading.hide();
  });

  var counterRefresh;
  // $scope.loader = false;
  counterRefresh = $interval(function() {
    // $scope.loader = true;
    $scope.loader = {'background-color': 'blue'};
    $http.get('http://'+ $rootScope.FLiQFetcherIP +'/FLiQFetcher/WS/getCStatus.php').then(function(response){
      // console.log(response);
      if(response == "")
      {
        // alert("No Counter Found");
        console.log("No Counter Found");
        // Nothing returned from WS
      }
      else
      {
        // Json returned from WS
        console.log("Counter refreshed");
        $scope.datas = response.data;
        $scope.loader = {'background-color': 'green'};
      }
      // $scope.loader = false;
      
    });
  }, 4000);

})

.controller('svcStatusCtrl', function($state, $scope, $http, $ionicLoading, $interval, $rootScope){

  $scope.agName = $rootScope.agName;
  $scope.loader = {'background-color': 'red'};
  // Service Refresh-Interval Destroyer
  $scope.$on("$destroy", function(event){
    if(svcRefresh) {
      $interval.cancel(svcRefresh);
    }
  });

  $ionicLoading.show({template: "<ion-spinner icon='ios-medium'></ion-spinner>"});

  $http.get('http://'+ $rootScope.FLiQFetcherIP +'/FLiQFetcher/WS/getSvcStatus.php').then(function(response){
    // console.log(response);
    if(response == "")
    {
      // alert("No Counter Found");
      console.log("No Service Found");
      // Nothing returned from WS
    }
    else
    {
      // Json returned from WS
      // console.log("response: " + response.data);
      $scope.datas = response.data;
      $scope.loader = {'background-color': 'green'};
    }
    $ionicLoading.hide();
  });

  var svcRefresh;
  svcRefresh = $interval(function(){
    $scope.loader = {'background-color': 'blue'};
    $http.get('http://'+ $rootScope.FLiQFetcherIP +'/FLiQFetcher/WS/getSvcStatus.php').then(function(response){
      // console.log(response);
      if(response == "")
      {
        // alert("No Counter Found");
        console.log("No Service Found");
        // Nothing returned from WS
      }
      else
      {
        // Json returned from WS
        // console.log("response: " + response.data);
        console.log("Service refreshed");
        $scope.datas = response.data;
        $scope.loader = {'background-color': 'green'};
      }
      // $ionicLoading.hide();
    });
  }, 4000);

})

// Services declared in the .factory currently not used.
.factory('IPSvc', function($http, $rootScope) {
  return {
    getMyQIP: function() {
        return $http.get("http://"+ $rootScope.FLiQFetcherIP +"/FLiQFetcher/WS/getMyQIP.php").then(function(response) {
          console.log("myQServer: ", response.data);
          return response.data;
        });
    },
    postApe: function(){
        return $http.get().then(function(ape) {
          return ape;
        });
    },
  }
});