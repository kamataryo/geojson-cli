#!/usr/bin/env node

import { isatty } from "tty"
import process from 'process'

process.stdin.resume();
process.stdin.setEncoding("utf8");

let data = "";

const onEnd = () => {
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
};

if (isatty(0)) {
    onEnd();
} else {
    process.stdin.on("data", chunk => (data += chunk));
    process.stdin.on("end", onEnd);
}