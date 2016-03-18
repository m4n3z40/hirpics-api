# HirPics API #

The API server for the hirpics mobile app

### Requirements

1. Node.js >= 4.2.x
2. A google maps geocoder API key (https://developers.google.com/maps/documentation/geocoding/get-api-key)

### Getting Started

1. ```npm install```
2. Config the API
    - Rename ```config/database-default.json``` to ```config/database.json``` and configure as needed
    - Edit ```config/geocoder.js``` by placing your Google Maps key
3. ```npm run migrate-up``` to setup the database structure
4. ```npm start``` to start the server
