'use strict'

/**
 * Cube: Individual cube.
 * @returns {Cube} - cube object.
 */
app.factory('Cube', function (cube_const, $interval) {
    /*************************************************************************************************************************
     * PRIVATE METHODS BEGIN (EXCEPT CONSTRUCTOR).
     **************************************************************************************************************************/

    /**
     * Cube()
     * @param cube_id - new cube ID.
     * @param x - initial x position.
     * @param y - initial y position.
     * @param z - initial z position.
     * @constructor
     */
    function Cube ($scope, cube_id, x, y, z) {
        //Set defaults.
        this.obj_scope = $scope;
        this.cube_id = cube_id || Math.floor((Math.random() * 100000) + 1000);
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.backsides_visible = true;                                      //Default: transparency for back-sides.
        this.width = 0;
        this.height = 0;
        this.cube_transform_str = "";

        this.move_to(x, y, z);                                              //Move cube to initial x, y, z position.
        this.demo_timer = null;                                             //Holds demo timer for the object.
        this.face_side = "front";                                           //Default face side (front of the cube) is "front".

        //Set up initial content.
        this.content = [];
        this.content["front"] = this.content["back"] = this.content["left"] = this.content["right"] = this.content["top"] = this.content["bottom"] = "";
    }



    /**
     * transform_cube(): render the cube transformations based on the object properties set.
     */
    function transform_cube() {
        var x_pos = 0, y_pos = 0, z_pos = 0, rot_str = "";

        switch(this.face_side) {
            case "front":
                x_pos = this.x;
                y_pos = this.y;
                break;

            case "back":
                x_pos = this.x;
                y_pos = this.y;
                rot_str = "rotateX(-180deg)";
                break;

            case "right":
                x_pos = this.x;
                y_pos = this.y;
                rot_str = "rotateY(-90deg)";
                break;

            case "left":
                x_pos = this.x;
                y_pos = this.y;
                rot_str = "rotateY(90deg)";
                break;

            case "top":
                x_pos = this.x;
                y_pos = this.y;
                rot_str = "rotateX(-90deg)";
                break;

            case "bottom":
                x_pos = this.x;
                y_pos = this.y;
                rot_str = "rotateX(90deg)";
                break;

            default:
                x_pos = this.x;
                y_pos = this.y;
                break;
        }

        z_pos = cube_const.Z_POSITION + this.z;
        var transform_str = "translateZ(" + z_pos + "px) translateX(" + x_pos + "px) translateY(" + y_pos + "px)" + rot_str;
        this.cube_transform_str = transform_str;
        this.obj_scope.update_cube_info();              //Inform the parent CubeSet about the update.

        //Clear up references.
        x_pos = y_pos = z_pos = rot_str = null;
    }


    /**
     * render(): Apply the transformation changes.
     */
    function render () {
        transform_cube.call(this);
    }


    /*************************************************************************************************************************
    * PRIVATE METHODS END.  PUBLIC METHODS BEGIN.
    **************************************************************************************************************************/


    /**
     * move_to(): move cube to position x, y, z.
     * @param x - new x coordinate.
     * @param y - new y coordinate.
     * @param z - new z coordinate.
     */
    Cube.prototype.move_to = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        render.call(this);
    };



    /**
     * show_face_side(): set face to new side.
     * @param new_side - cube will rotate to face this new side (see CUBE_SIDES).
     */
    Cube.prototype.set_face_side = function(new_side) {
        this.face_side = new_side;
        render.call(this);
    };



    /**
     * show_next_side(): rotate to next side from the current face.
     */
    Cube.prototype.show_next_side = function() {
        this.set_face_side(cube_const.CUBE_SIDES[(cube_const.CUBE_SIDES.indexOf(this.face_side) + 1) % cube_const.CUBE_SIDES.length]);
    };



    /**
     * show_prev_side(): rotate to previous side from current face.
     */
    Cube.prototype.show_prev_side = function() {
        this.set_face_side(cube_const.CUBE_SIDES[(cube_const.CUBE_SIDES.indexOf(this.face_side) + 1) % cube_const.CUBE_SIDES.length]);
    };



    /**
     * demo(): dancing cube demo - keep rotating cubes until stop parameter is set to false.
     * @param stop - stop parameter to determine if demo should continue.
     */
    Cube.prototype.demo = function (stop) {
        if (stop != undefined)                  //Stop demo.
            $interval.cancel(this.demo_timer);
        else {                                  //Start demo.
            var self = this;
            var next_side_index = 0;        //Start demo with front side.

            this.demo_timer = $interval(function () {
                self.set_face_side(cube_const.CUBE_SIDES[next_side_index]);
                next_side_index = (next_side_index + 1) % cube_const.CUBE_SIDES.length;      //Go to the next one.
            }, 1000);
        }
    };



    /**
     * get_x(): return x-coord.
     * @returns {int} x-coordinate.
     */
    Cube.prototype.get_x = function() {
        return this.x;
    };



    /**
     * get_y(): return y-coord.
     * @returns {int} y-coordinate.
     */
    Cube.prototype.get_y = function() {
        return this.y;
    };



    /**
     * get_z(): return z-coord.
     * @returns {int} z-coordinate.
     */
    Cube.prototype.get_z = function() {
        return this.z;
    };



    /**
     * get_width(): get cube width.
     * @returns {int} width.
     */
    Cube.prototype.get_width = function() {
        return $(this.cube_elem).find("figure").css("width");
    };



    /**
     * get_height(): get cube height.
     * @returns {int} width.
     */
    Cube.prototype.get_height = function() {
        return $(this.cube_elem).find("figure").css("height");
    };



    /**
     * set_content(): set html content to specific side.
     * @param side - which side should have content added.
     * @param html_content - html content to be displayed on the side specified.
     */
    Cube.prototype.set_content = function (cube_side, content) {
        var my_cube = this;

        this.obj_scope.$apply(function () {
            my_cube.content[cube_side] = content;          //Add content.
        });
    };



    /**
     * show_backsides(): show backsides (transparency).
     * @param flag - show or hide back sides of the cube.
     */
    Cube.prototype.show_backsides = function(flag) {
        (! flag)? $(this.cube_elem).addClass("backsides_invisible"): $(this.cube_elem).removeClass("backsides_invisible");
        this.backsides_visible = flag;
    };

    return Cube;
});