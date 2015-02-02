angular.module('app', ['ngRoute'])
// .controller('appCtrl', function($rootScope) {
//   $rootScope.$on("$routeChangeStart",
//                    function (event, current, previous, rejection) {
//       console.log('started route change');
//     });
//     $rootScope.$on("$routeChangeSuccess",
//                    function (event, current, previous, rejection) {
//       console.log('finished route change');
//     });
//     $rootScope.$on("$routeChangeError",
//                    function (event, current, previous, rejection) {
//       console.log('error on route change');
//     });
// })
.directive('routeLoadingIndicator', function($rootScope){
  return {
    // restrict:'E',
    template:"<h1 ng-if='isRouteLoading'>Loading...</h1>",
    link:function(scope, elem, attrs){
      scope.isRouteLoading = false;

      $rootScope.$on('$routeChangeStart', function(){
        scope.isRouteLoading = true;
      });

      $rootScope.$on('$routeChangeSuccess', function(){
        scope.isRouteLoading = false;
      });

      $rootScope.$on('$routeChangeError', function(){
        scope.isRouteLoading = false;
      });
    }
  };
})
.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push(interceptor);
    $routeProvider
      .when('/old', {
          templateUrl: 'templates/old.html'
      })
      .when('/new', {
          templateUrl: 'templates/new.html',
          resolve: {
            data: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function () {
                defer.resolve('success');
              }, 2000);
              return defer.promise;
            }
          }
      })
      .when('/redirect', {
          templateUrl: 'templates/redirect.html',
          resolve: {
            data: function($q, $timeout, $location) {
              var defer = $q.defer();
              $timeout(function () {
                $location.path('/new');
                defer.reject('success');
              }, 2000);
              return defer.promise;
            }
          }
      })
      .when('/routeError', {
          template: '<div style="background-color:yellow"><a href="#/old">URL</a></div',
          resolve: {
            data: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function () {
                defer.reject('error');
              }, 2000);
              return defer.promise;
            }
          }
      })
      .when('/templateError', {
          templateUrl: 'templates/doesNotExist.html',
          resolve: {
            data: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function () {
                defer.reject('error');
              }, 2000);
              return defer.promise;
            }
          }
      })
      .when('/globalError', {
          template: '<div style="background-color:blue">GLOBAL ERROR PAGE<a href="#/old">URL</a></div'
      })
      .otherwise({
          redirectTo: '/old'
      });
});

var routeLoadingIndicator = function($rootScope){
  return {
    restrict:'E',
    template:"<h1 ng-if='isRouteLoading'>Loading...</h1>",
    // link:function(scope, elem, attrs){
    //   scope.isRouteLoading = false;
    //
    //   $rootScope.$on('$routeChangeStart', function(){
    //     scope.isRouteLoading = true;
    //   });
    //
    //   $rootScope.$on('$routeChangeSuccess', function(){
    //     scope.isRouteLoading = false;
    //   });
    // }
  };
};

var interceptor = function ($q, $location) {
    return {
        responseError: function (rejection) {
            console.log('Failed with', rejection.status, 'status');
            $location.url('/globalError');
            return $q.reject(rejection);
        }
    }
};
