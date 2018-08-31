
/**
 * simulate a JSOn config file
 */
var config = {
    layers: [
        { name: "", id: "GARDA_STATIONS_IRELAND_4142", url: "https://services2.arcgis.com/7PnQ6FpwxNXZjOqd/arcgis/rest/services/GARDA_STATIONS_IRELAND/FeatureServer/0" },
        { name: "", id: "GARDA_STATIONS_IRELAND_41d2", url: "https://services2.arcgis.com/7PnQ6FpwxNXZjOqd/arcgis/rest/services/GARDA_STATIONS_IRELAND/FeatureServer/0" },
        { name: "", id: "GARDA_STATIONS_IRELAND_7444", url: "https://services2.arcgis.com/7PnQ6FpwxNXZjOqd/arcgis/rest/services/GARDA_STATIONS_IRELAND/FeatureServer/0" }
    ]
};
// constants and globals
var map;
var findAddressUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson";
var layersToQuery = [];

/**
 * PRIVATE
 * Will verify the layer defined in config.layers exist in the webmap and return them
 * Check if they exist by comparing id and url
 * @param {Array} mapLayers layer found inside WebMap Obcjet
 * @param {Array} configLayers layer defined in config.layers
 * @return {Array <Layer>} return only the "layerObject"
 */
var getLayerFromConfig = function (mapLayers, configLayers) {
    return configLayers.map(function (element) {
        return mapLayers.filter(function (layer) {
            return layer.id === element.id && layer.url === element.url
        }, this)[0];
    }, this).filter(function (item) {
        return item && item.layerObject
    }, this).map(function (layer) {
        return layer.layerObject
    }, this)
}

/**
 * PRIVATE
 * Will create an event on Map extent update-change
 */
var addExtentListener = function (callback, layersToQuery) {
    map.on('extent-change', function (e) {
        console.log('extent has changed', e);
        callback(e.extent, layersToQuery);
    })
}
/**
 * PRIVATE
 * @param {extent} extent new map extent to be used as geometry for Spatial Query
 * @param {Array <layer>} layers layer on which to perform the query
 */
var queryLayerExtent = function (extent, layers) {
    require([
        "esri/tasks/query",
        "esri/layers/FeatureLayer"
    ], function (Query, FeatureLayer) {
        var query = new Query();
        query.geometry = extent;
        layers.forEach(function (layer) {
            layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (res) {
                console.log(res)
            }, function (err) {
                console.log(err)
            });
        }, this)

    });

    /**
            createLabel: function(geom, index) {
                var graphic = new Graphic();
                var _symbolLabel = new TextSymbol();
                _symbolLabel.setColor(new Color([0, 0, 255]));
                _symbolLabel.setHorizontalAlignment('right');
                _symbolLabel.setVerticalAlignment('top');
                _symbolLabel.setText(this.labels[index][0]);
                _symbolLabel.setOffset(-3, this.offsetLabel);
                _symbolLabel.setFont(this._getFont());
                graphic.geometry = geom;
                graphic.symbol = _symbolLabel;
                return graphic;
            },

            this._lablay = new GraphicsLayer({ id: '_labelLayer' });
            var label = this.createLabel(res.geometries[r], r);
            this._lablay.add(label);


            _getFont: function() {
                var font = new Font(this.config.fontSize, Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, this.config.fontFamily);
                return font;
            }
       
     */
}
/**
 * PUBLIC 
 * Load the Webmap
 */
var esriInit = function () {
    require([
        "esri/arcgis/utils",
        "dojo/domReady!"
    ], function (arcgisUtils) {
        arcgisUtils.createMap("3477b63b84fb4c81b49ba825ca051f34", "map").then(function (response) {
            map = response.map;
            layersToQuery = getLayerFromConfig(response.itemInfo.itemData.operationalLayers, config.layers);
            layersToQuery && addExtentListener(queryLayerExtent, layersToQuery);
            console.log(layersToQuery);
        });
    });
}

/**
 * PUBLIC
 * call geocoder endpoint to find a location
 * @param {String} value input text value used to search for an address
 * @return {Promise}
 */
var esriSearch = function (value) {
    var url = findAddressUrl + "&address=" + value;
    return new Promise(function (resolve, reject) {
        require([
            "esri/request",
            "esri/geometry/Extent"
        ], function (esriRequest, Extent) {
            var layersRequest = esriRequest({
                url: url,
                content: { f: "json" },
                handleAs: "json"
            }).then(function (response) {
                // if results, return only first one
                if (response.candidates.length) {
                    map.setExtent(new Extent(response.candidates[0].extent))
                    resolve(response.candidates[0]);
                } else {
                    reject('no result found for this term: "' + value + '"');
                }
            }, function (error) {
                reject(error.message)
            });

        });
    })

}

/**
 * expose as public
 */
var esriapi = {
    esriSearch: esriSearch,
    esriInit: esriInit
}