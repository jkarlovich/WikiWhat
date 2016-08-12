var app = angular.module('wikiWhatApp', ['ui.router', 'ngResource', 'rzModule', 'ngSanitize']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/404');
  $stateProvider
  .state('Main', {
    url: '/',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .state('404', {
    url: '/404',
    template: '<h1>404 Unfound</h1>'
  });
  $locationProvider.html5Mode(true);
}]);

app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
  // set variables
  $scope.results = [];
  $scope.wikiparsed =[];
  $scope.slider = {
    value: 0,
    options: {
      hideLimitLabels: true,
      hidePointerLabels: true
    }
  };
  $scope.searchTerm = '';
  var newVal = $scope.slider.value+1;
  var oldVal = $scope.slider.value;
  $scope.hideStart = false;   // hides/shows the instructions
  $scope.loading = false;     // shows when content loading
  $scope.comparing = false;   // supposed to show when diffs take too long
 
  // search for the search term
   $scope.search = function() {
    
    // reset variables
    $scope.head = '';   // title of search term
    $scope.results = [];  //results as objects
    $scope.difference = [];
    $scope.wikiparsed = []; //just the content of the objects parsed
    $scope.slider = {   // slider has no value again
      value: 0,
      options: {
        hideLimitLabels: true,
        hidePointerLabels: true
      }
    };

    // hide the instructions and show loading
    $scope.hideStart = true;
    $scope.loading = true;

    // hide initial state of info
    $scope.start = false;

    if ($scope.searchTerm === 'Hanami+') {
      Kolvescript.forEach(function(foo) {
        $scope.wikiparsed.push(foo.content);
      });
      timestamps.forEach(function(timestamp) {
         $scope.results.push(timestamp);
      });
      $scope.slider = {
        value: 0,
        options: {
          floor: 0,
          ceil: $scope.results.length-1,
          hideLimitLabels: true,
          hidePointerLabels: true
        }
      }
      // capture search term in variable for title of page
      $scope.head = $scope.searchTerm;

      // reset searchTerm
      $scope.searchTerm = '';

      // turn off loading
      $scope.loading = false; 

      //show initial content
      $scope.start = true;

    } else if($scope.searchTerm.length === 0) {
      $scope.loading = false;
      $scope.hideStart = false;
    } else {
    // the actual query call
      $http.post('/results', {searchTerm: $scope.searchTerm
      }).then(function success(res) {
        $scope.start = true;
        $scope.results = res.data.data.revisions;
        //$scope.timestamps = res.data.timestamps;
        $scope.wikiparsed = res.data.content;
        // set the slider to the length of the results array
          $scope.slider = {
            value: 0,
            options: {
              floor: 0,
              ceil: $scope.results.length-1,
              hideLimitLabels: true,
              hidePointerLabels: true
            }
          }
        // capture search term in variable for title of page
        $scope.head = $scope.searchTerm;

        // reset searchTerm
        $scope.searchTerm = '';

        // turn off loading
        $scope.loading = false;

      }), function error(res) {
        console.log(res.data);
      };
    };
    // query mediawiki on the front end - other option but slower
    // $http.jsonp('https://en.wikipedia.org/w/api.php', {
    //   headers: {
    //     'Content-Type': 'application/json; charset=UTF-8'
    //   },
    //   params: {
    //     'action': 'query',
    //     'titles': $scope.searchTerm,
    //     'prop': 'revisions',
    //     'rvprop': 'timestamp|content',
    //     'format': 'json',
    //     'rvlimit': 'max',
    //     'callback': 'JSON_CALLBACK'
    //   }
    // }).then(function success(res) {
    //   //console.log($scope.searchTerm);
    //   if(res.status = 200) {
    //     var number = res.data.query.pages[Object.keys(res.data.query.pages)];
    //     $scope.results = number.revisions;
    //     // parse the wikitext and push it to wikiparsed variable
    //     $scope.results.forEach(function(wiki) {
    //       $scope.wikiparsed.push(wiky.process(wiki['*']));
    //     });

    //     // set the slider to the length of the array
    //     $scope.slider = {
    //       value: 0,
    //       options: {
    //         floor: 0,
    //         ceil: $scope.results.length-1,
    //         hideLimitLabels: true,
    //         hidePointerLabels: true
    //       }
    //     }
    //   }
    //   // console.log(res.data.query.pages);
    //   // reset searchTerm
    //   $scope.searchTerm = '';

    // }, function error(res) {
    //   console.log(res.data);
    // });

  }; // end of search function

  // watch for the slider value to change
  $scope.$watch('slider.value', function(newVal, oldVal){
    // supposed to show comparing content when diff takes too long
    $scope.comparing = true;
    // hide initial content
    $scope.start = false;
    // check the difference in the revision content, if there is content in string1 and string2
    var string1 = $scope.wikiparsed[oldVal];
    var string2 = $scope.wikiparsed[newVal];
    if (string1 && string2) {
      $scope.difference =JsDiff.diffWords(string1, string2);
    }

    // supposed to hide comparing content
    $scope.comparing = false;
  });

$scope.slider = {
          value: 0,
          options: {
            floor: 0,
            ceil: $scope.results.length-1,
            hideLimitLabels: true,
            hidePointerLabels: true
          }
        }
}]); // end of main controller