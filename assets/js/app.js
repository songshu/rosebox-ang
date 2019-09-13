'use strict'

/**
 * Main Application & related code.
 */

/**
 * app: angular module.
 */
var app = angular.module('app.rosebox', ['ngAnimate', 'ui.bootstrap']);

/**
 * cube_const: cube constants.
 */
app.constant("cube_const", { "CUBE_TEMPLATE" : "div.cube_template",                                 //Template element.
                             "CUBE_WORLD" : "div.world",                                            //3D space element.
                             "Z_POSITION" : -300,                                                   //Initial z-position for cubes (px).
                             "CUBE_SIDES" : ["front", "back", "left", "right", "top", "bottom"]     //Cube sides.
                           }
);


/**
 * trusted_html: filter for trusted HTML to avoid $sce:unsafe error when posting html data to ng-bind-html.
 */
app.filter('trusted_html', ['$sce', function($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
}]);