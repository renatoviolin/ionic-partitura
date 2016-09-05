angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

   $scope.loginData = {};

   $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
   }).then(function(modal) {
      $scope.modal = modal;
   });

   $scope.closeLogin = function() {
      $scope.modal.hide();
   };

   $scope.login = function() {
      $scope.modal.show();
   };

   $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $timeout(function() {
         $scope.closeLogin();
      }, 1000);
   };
})

.controller('PlaylistsCtrl', function($scope, $ionicListDelegate, httpPartitura) {

   $scope.playlists = [];
   $scope.showAdd = false;
   $scope.icon = 'ion-ios-checkmark-outline';

   $scope.toggleAdd = function() {
      $scope.showAdd = !$scope.showAdd;
   }

   $scope.addFavorites = function(id) {
      $scope.icon = 'ion-ios-checkmark';
      console.log(id);
   }

   httpPartitura.query(function(res) {
      for (var i = 0; i < res.length; i++)
         $scope.playlists.push(res[i]);
   });
})

.controller('PartituraCtrl', function($scope, $stateParams, $interval, $ionicScrollDelegate, httpPartitura) {
   var position = 0;
   var max_scroll = 0;
   var scroll_interval = null;
   var incremento = 1;
   var icon_play = 'button button-icon icon ion-ios-play-outline';
   var icon_pause = 'button button-icon icon ion-ios-pause-outline';
   var status = "reset";
   $scope.interval = 100;
   $scope.velocidade = 100;

   $scope.scroll_icon = icon_play;

   $scope.partitura = {
      titulo: "",
      conteudo: ""
   };

   httpPartitura.get({ id: $stateParams.id }, function(res) {
      $scope.partitura = res;
   });

   $scope.updateScrollPosition = function() {
      position = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
   }
   $scope.btnStartScroll = function() {
      max_scroll = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().__maxScrollTop;

      console.log("STATUS: " + status);
      console.log("MAX: " + max_scroll);

      if (status == "play") {
         stopInterval();
      } else
      if (status == "stop") {
         startScroll(getPosicaoAtual());
      } else
      if (status == "reset") {
         startScroll(1);
      }
   }

   $scope.btnReduzirVelocidade = function() {
      if ($scope.interval < 200) {
         $scope.interval += 20;
         $scope.velocidade -= 20;
         stopInterval();
         startScroll(getPosicaoAtual());
      }
   }

   $scope.btnAumentarVelocidade = function() {
      if ($scope.interval > 20) {
         $scope.interval -= 20;
         $scope.velocidade += 20;
         stopInterval();
         startScroll(getPosicaoAtual());
      }
   }

   function startScroll(startPosition) {
      status = "play";
      $scope.scroll_icon = icon_pause;
      position = startPosition || position;
      scroll_interval = $interval(
         function() {
            if (position < max_scroll) {
               position += incremento;
               $ionicScrollDelegate.scrollTo(0, position);
            } else {
               resetScroll();
            }
         }, $scope.interval);
   }

   function stopInterval() {
      $scope.scroll_icon = icon_play;
      $interval.cancel(scroll_interval);
      status = "stop";
   }

   function resetScroll() {
      stopInterval();
      status = "reset";
   }

   function getPosicaoAtual() {
      return $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
   }

})
