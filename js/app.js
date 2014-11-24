"use strict";

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('ToDoApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'LjOfeD1PY6BuHu4VyWrzkCS0sMwdBkbpylrVVPma';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'YVvwqK3xNnkwrhULiE6b3bwgUY4StHZ8caDIDgsr';
    })
    .controller('CommentsController', function($scope, $http){
        $scope.sortCol = 'votes';
        //refreshs the newest list which adds or deletes the newest comments
        $scope.refreshComments = function () {
            $scope.loading = true;
            $http.get(commentsUrl + '?where={"done":false}')
                .success(function (data) {
                    $scope.comments = data.results;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.loading = false;
                });
        };

        //intializes the list
        $scope.refreshComments();

        //intializes a new comment to the list
        $scope.newComment = {done: false};

        //adds a new comment to the list and to the api
        $scope.addComment = function () {
            $scope.inserting = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.newComment.votes = 0;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {done: false};
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.inserting = false;
                });
        };

        //adds the user inputted comment to the comment section
        $scope.updateComment = function (comment) {
            $scope.updating = true;
            $http.delete(commentsUrl + '/' + comment.objectId, comment)
                .success(function () {

                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };

        //updates the vote if vote is greater than zero
        $scope.incrementVotes = function (comment, amount) {
            comment.downvote = true;
            if (comment.votes == 0 && amount == -1) {
                comment.downvote = false;
            } else if (comment.downvote) {
                $scope.incrementVotes2(comment, amount);
            }
        };

        //adds one or subtracts one from the score depending on whether or not the
        //user clicks thumbs up or thumbs down
        $scope.incrementVotes2 = function (comment, amount) {
            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
            .success(function (responseData) {
                comment.votes = responseData.votes;
            })
            .error(function (err) {
                console.log(err);
            })
            .finally(function () {
                $scope.updating = false;
            });
        };
    });


