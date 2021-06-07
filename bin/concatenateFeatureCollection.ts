#!/usr/bin/env node

import { stdin } from "./lib";

const parseConcatenatedGeojson = (data: string) => {
    const geojsons = data.replace(/\}[\r\n\s]*\{/g, "}%SEPARATOR%{").split("%SEPARATOR%")
    return geojsons.map(geojson => {
        try {
            return JSON.parse(geojson)
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })

}

stdin().then(data => {
    const geojsonObjects = parseConcatenatedGeojson(data)
    const concatenated = geojsonObjects.reduce((prev, geojsonObject) => {
        prev.features.push(...geojsonObject.features)
        return prev
    }, {
        type: "FeatureCollection",
        features: []
    })

    process.stdout.write(JSON.stringify(concatenated, null, 2))
})
