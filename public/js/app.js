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
  $scope.wikiparsed = [];
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
  $scope.hideStart = false;
 
   $scope.search = function() {

    // reset variables
    $scope.results = [];
    $scope.wikiparsed = [];
    $scope.slider = {
      value: 0,
      options: {
        hideLimitLabels: true,
        hidePointerLabels: true
      }
    };

    // hide the instructions
    $scope.hideStart = true;

    // query mediawiki
    $http.jsonp('https://en.wikipedia.org/w/api.php', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      params: {
        'action': 'query',
        'titles': $scope.searchTerm,
        'prop': 'revisions',
        'rvprop': 'timestamp|content',
        'format': 'json',
        'rvlimit': 'max',
        'callback': 'JSON_CALLBACK'
      }
    }).then(function success(res) {
      //console.log($scope.searchTerm);
      if(res.status = 200) {
        var number = res.data.query.pages[Object.keys(res.data.query.pages)];
        $scope.results = number.revisions;
        // parse the wikitext and push it to wikiparsed variable
        $scope.results.forEach(function(wiki) {
          $scope.wikiparsed.push(wiky.process(wiki['*']));
        });

        // set the slider to the length of the array
        $scope.slider = {
          value: 0,
          options: {
            floor: 0,
            ceil: $scope.results.length-1,
            hideLimitLabels: true,
            hidePointerLabels: true
          }
        }
      }
      // console.log(res.data.query.pages);
      // reset searchTerm
      $scope.searchTerm = '';

    }, function error(res) {
      console.log(res.data);
    });
  };

  // watch for the slider value to change
  $scope.$watch('slider.value', function(newVal, oldVal){
    var string1 = $scope.wikiparsed[oldVal];
    var string2 = $scope.wikiparsed[newVal];
    // check the difference in the revision content, if there is content in string1 and string2
    if (string1 && string2) {
      $scope.difference =JsDiff.diffWords(string1, string2);
    }
  });


// .replace(/\[|\]|{|}|<img>|<\/img>|\[[|\]]|\{{|\}}|<img([\w\W]+?)>|<\/i>|<i>|<\/b>|<ref>|<\/ref>|\/>|<a([\w\W]+?)>/g, ''));
}]);