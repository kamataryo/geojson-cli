import { stdin } from './lib'

stdin().then(data => {
    const geojsonObject = JSON.parse(data) as GeoJSON.FeatureCollection
    const filtered = {
        ...geojsonObject,
        features: geojsonObject.features.filter(feature => feature.geometry.type === 'LineString')
    }
    process.stdout.write(JSON.stringify(filtered, null, 2))
})