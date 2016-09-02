angular.module('starter.services', ['ngResource'])

// .constant('baseURL', 'http://localhost:8000/')
.constant('baseURL', 'http://192.168.1.48:8000/')

.factory('httpPartitura', function($resource, baseURL) {
   return $resource(baseURL + 'partitura/:id');
})
