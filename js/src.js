require( 'angular' );
require( 'angular-local-storage' );
require( 'angular-route' );

var app = angular.module('pantryApp', [ /* angular module object */
    'ngRoute',
    'LocalStorageModule'
]);

/**
  Configure the Routes
**/
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "partials/pantry.html", controller: "PageCtrl"})
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

app.controller('PageCtrl', function ( $scope, $location, $http, localStorageService ) { /* method called controller, registration function, functions handles by the controller for the page */

    $scope.login = login; /* define is in the scope object, that is where angular will look for ng- */
    $scope.logout = logout; /* define is in the scope object, that is where angular will look for ng- */
    $scope.itemSubmit = itemSubmit;
    $scope.itemDelete = itemDelete;

    initialize();

    function initialize() {
        var token = localStorageService.get('AuthToken');
        if (token) { // check if a token already exists
            $http.get('items')
            .then ( function( response ) {
                $scope.items = response.data;
            })
            .catch( errorHandler );
        }
    }

    function login() {
        $http.post('user', {
            email: $scope.email,
            password: $scope.password,
        })
        .then( function( response ) {
            localStorageService.set('AuthToken', response.data); // set token on login
        } )
        .then( function( response ) { console.log( response ); } ) /* will only returns once the server returns the response - success */
        .then( function( response ) {
            // Get items in pantry
            return $http.get('items')
            .then ( function( response ) {
                $scope.items = response.data;
            })
            .catch( errorHandler );
        } )
        .catch( errorHandler ); /* then methods always return their promise, - failure  */
        console.log( $scope.email, $scope.password );
    }

    function logout() {
        localStorageService.remove('AuthToken');
    }

    function itemSubmit() {
        $http.post('items', {
            name: $scope.name,
            desc: $scope.desc,
            exp: $scope.exp,
            category: $scope.category,
            amt: $scope.amount,
            unit: $scope.unit
        })
        .then(function(response){
            $scope.items.push( response.data );
        });
        console.log(this);
    }
    function itemDelete(id) {
        $http.delete('items/' + id)
        .then(function(response){
            $scope.items = $scope.items.filter( function( item ){
                console.log(id + ' ' + item._id);
                return id != item._id;
            });
        });
    }
    function errorHandler(error) {
        console.log( error );
    }
});

/* scope - data binding, http - outbound requests */
/* $http - */
/* promises - objects, they have a then method */
