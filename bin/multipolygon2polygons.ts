#!/usr/bin/env node

import { stdin } from "./lib";

stdin().then((data) => {
    const geojsonObject = JSON.parse(data) as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>
    const { features } = geojsonObject
    const polygons = features.flatMap(feature => {
        return feature.geometry.coordinates.map(coordinate => {
            return {
                ...feature,
                geometry: {
                    type: 'Polygon',
                    coordinates: coordinate
                }
            }
        })
    })
    const featureCollection = {
        ...geojsonObject,
        features: polygons
    }
    process.stdout.write(JSON.stringify(featureCollection, null, 2))
})
