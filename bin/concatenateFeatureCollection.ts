#!/usr/bin/env node

import { isatty } from "tty"
import process from 'process'

process.stdin.resume();
process.stdin.setEncoding("utf8");

let data = "";

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

const onEnd = () => {
    const geojsonObjects = parseConcatenatedGeojson(data)
    const concatenated = geojsonObjects.reduce((prev, geojsonObject) => {
        prev.features.push(...geojsonObject.features)
        return prev
    }, {
        type: "FeatureCollection",
        features: []
    })

    process.stdout.write(JSON.stringify(concatenated, null, 2))
};

if (isatty(0)) {
    onEnd();
} else {
    process.stdin.on("data", chunk => (data += chunk));
    process.stdin.on("end", onEnd);
}