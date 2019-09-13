'use strict'

/**
 * CubeSet: group of cubes.
 * @returns {CubeSet} - set of cubes.
 */
app.factory('CubeSet', ['Cube', function (Cube) {
    /*************************************************************************************************************************
     * PRIVATE METHODS BEGIN (EXCEPT CONSTRUCTOR).
     **************************************************************************************************************************/

    /**
     * CubeSet()
     * @constructor.
     */
    function CubeSet ($scope) {
        this.obj_scope = $scope;
        this.cubes = [];        //Holds cubes inside.
    }


    /*************************************************************************************************************************
     * PRIVATE METHODS END.  PUBLIC METHODS BEGIN.
     **************************************************************************************************************************/


    /**
     * create_new_cube(): create a new cube within the set (wrapper for Cube.create_cube()).
     * @param {int} cube_id - new id for the new cube.
     * @param {int} x, y, z - coordinates of where the cube should be initially placed.
     * @returns {Cube} - returns cube object after creation.
     */
    CubeSet.prototype.create_cube = function ($scope, cube_id, x, y, z) {
        this.cubes.push(new Cube($scope, cube_id, x, y, z));
        return this.cubes[this.cubes.length - 1];                   //Return the pointer to the last cube created.
    };



    /**
     * len(): get number of cubes in this set.
     * @returns {int} number of cubes.
     */
    CubeSet.prototype.len = function () {
        return this.cubes.length;
    };



    /**
     * perform_group_action(): get all the cubes to do something as a group.
     * @param action - group action to be performed by all cubes.
     * @param params - for action "set_face_side", params.new_side contains the side of the cube all cubes should switch to.
     *               - for action "move_by", params.x, params.y, params.z contain coordinates for cubes to be moved by.
     */
    CubeSet.prototype.perform_group_action = function(action, params) {
        if (action.length > 0) {
            var cubes = this.cubes;

            if (cubes.length > 0) {
                for (var ci = 0; ci < cubes.length; ci++) {
                    var this_cube = cubes[ci];

                    switch(action) {
                        case "set_face_side":
                            this_cube.set_face_side(params.new_side);
                            break;

                        case "show_next_side":
                            this_cube.show_next_side();
                            break;

                        case "show_prev_side":
                            this_cube.show_prev_side();
                            break;

                        case "demo_start":
                            this_cube.demo();
                            break;

                        case "demo_stop":
                            this_cube.demo(true);
                            break;
                    }
                }
            }

            //Clean up.
            cubes = this_cube = null;
        }
    };



    /**
     * get_cubes(): return 1 or all cubes.
     * @param cube_index - optional index of cube to return.  If omitted, all cubes are returned to the caller.
     * @returns {Cube} or array of {Cubes}.
     */
    CubeSet.prototype.get_cubes = function (cube_index) {
        if (cube_index != undefined)                //Requesting single cube?
            return this.cubes[cube_index];          //Return single cube.
        else
            return this.cubes;                      //Return them all.
    };



    return CubeSet;
}]);