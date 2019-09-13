'use strict'

/**
 * WorldController: main interaction controller.
 */
app.controller('WorldController', ['$scope', '$sce', 'CubeSet', 'FeedMiner', function ($scope, $sce, CubeSet, FeedMiner) {
    var cube_set = new CubeSet($scope);

    /**
     * Controller start_up().
     */
    var start_up = function () {
        //Starting positions for each row (hardcoded for this implementation).
        $scope.cubes_start_x = 0;
        $scope.cubes_start_y = parseInt(window.innerHeight / 2);                       //Middle of the browser window.  We will use it for laying out our rows of cubes.
        $scope.cubes_start_z = -300;
        $scope.cube_margin = 300;                                                      //Spacing in px between cubes.

        //Control movement.
        $scope.controls_move_x_by = 200;
        $scope.controls_move_y_by = 200;
        $scope.controls_move_z_by = 200;

        //Default demo state.
        $scope.demo_state = false;
    };



    /**
     * cube_click(): called when cube is clicked.
     * @param this_cube - cube that just got clicked.
     */
    $scope.cube_click = function (this_cube) {
        this_cube.show_next_side();
    };



    /**
     * cubeset_cmd(): group performance commands.
     * @param cube_cmd - command received to be performed by the group of cubes.
     */
    $scope.cubeset_cmd = function (cube_cmd) {
        if (cube_cmd == "demo_toggle") {
            $scope.demo_state = ! $scope.demo_state;
            var demo_cmd = ($scope.demo_state)? "demo_start" : "demo_stop";
            cube_set.perform_group_action(demo_cmd);
        } else
            cube_set.perform_group_action(cube_cmd);
    };



    /**
     * search(): perform search using query_txt.
     * @param query_txt - search engine query text.
     */
    $scope.search = function(query_txt) {
        if (query_txt != undefined && query_txt.length > 0) {         //We have some input, let's run search on it.
            var my_feed = new FeedMiner($scope, "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&as_filetype=jpg&safe=active&q=" + encodeURIComponent(query_txt),
                function(results) {
                    $scope.display_search_results(results);
                });
        }
    };



    /**
     * display_search_results(): async callback that receives search results from $scope.search() and publishes them to the cube faces.
     * @param results - accepts result data from the async call.
     */
    $scope.display_search_results = function (results) {
        if (results.length > 0) {
            //Let's show group rotation buttons as well now.
            if (cube_set.len() == 0)
                $(".btn-info").fadeIn(3000);

            for (var ri = 0; ri < results.length; ri++) {
                var this_cube = cube_set.create_cube($scope, null, $scope.cubes_start_x + (ri * $scope.cube_margin), $scope.cubes_start_y, $scope.cubes_start_z);

                this_cube.show_backsides(false);    //Solid cube.
                this_cube.set_content("front", '<img src="' + results[ri].url + '" width="100%" height="100%">');
                this_cube.set_content("back", '<img src="' + results[ri].url + '" width="100%" height="100%">');
                this_cube.set_content("left", '<img src="' + results[ri].url + '" width="100%" height="100%">');
                this_cube.set_content("right", '<img src="' + results[ri].url + '" width="100%" height="100%">');
                this_cube.set_content("top", '<h2>' + results[ri].content + '</h2>');
                this_cube.set_content("bottom", '<h2>' + results[ri].title + '</h2>');
            }

            //Clean up.
            this_cube = null;
            $scope.cubes_start_z += $scope.cube_margin;     //Where the next row of cubes starts.
        }
    };



    /**
     * update_cube_info(): synchronizes the (parent) CubeSet data whenever a cube (child) reports changes.
     * Called by individual cubes to notify app of changes.
     */
    $scope.update_cube_info = function() {
        $scope.cubes = cube_set.get_cubes();
    };

    start_up();
}]);
