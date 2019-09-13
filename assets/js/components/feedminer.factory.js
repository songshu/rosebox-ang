'use strict'

/**
 * FeedMiner - demo resource for getting google images.
 * @returns {FeedMiner} - object.
 */
app.factory("FeedMiner", function($http) {
    /*************************************************************************************************************************
     * PRIVATE METHODS BEGIN (EXCEPT CONSTRUCTOR).
     **************************************************************************************************************************/

    /**
     * FeedMiner()
     * @param start_url - our starting url where to get the data.
     * @param result_callback_fn - callback function (after async operation).
     * @constructor
     */
    function FeedMiner ($scope, start_url, result_callback_fn) {
        this.obj_scope = $scope;                //Store the instance of app scope within the object.
        var self = this;                        //Reference to current object.

        if (start_url != undefined && result_callback_fn != undefined) {        //If start_url & callback are defined, let's get the content.
            this.url = start_url;
            get_raw_content.call(this, start_url, function (response) {
                result_callback_fn(filter_gimage_search.call(self, response));        //Pass results to the requesting object / routine.
            });
        }
    }



    /**
     * get_raw_content(): get content via JSONP.
     * @param this_url - source url.
     * @param result_callback_fn - callback function (after async operation).
     */
    function get_raw_content (this_url, result_callback_fn) {
        //Angular JS $http object doesn't like to accept JSON input without setting off CORS same origin-policy so we'll stick to $.ajax here.

        $.ajax({
            url: this_url,
            dataType: "jsonp",
            data: {},
            success: result_callback_fn
        });
    }



    /**
     * filter_gimage_search(): google image search (used for demo source).
     * @param response
     * @returns {{}}
     */
    function filter_gimage_search (response) {
        var result_obj = {};

        if (response["responseStatus"] == 200)
            result_obj = response["responseData"]["results"];

        return result_obj;
    }


    return FeedMiner;
});