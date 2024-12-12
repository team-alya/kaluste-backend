# kaluste-backend
Älyä-hankkeessa KalusteArvio-projektin palvelin ja tekoälyliittymät

## Table of Contents
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Testing with Postman](#testing-with-postman)
- [Docker Instructions](#docker-instructions)

## Installation

### Enviromental variables
Create an .env file in the root folder with the following values (use the .env.template file for reference):
- OPENAI_API_KEY
- MONGODB_URI
- RAHTI_URL
- LOCAL_URL
- PORT
- MEMCACHED_HOST
- MEMCACHED_PORT

### Initialize server
```
npm run i
```
#### Run in development mode
```
npm run dev
```
#### Run in production mode
```
npm run build
npm run start
```

## API Documentation

### Roadmap
1. Send the image to /api/image 🠊 2. If the properties of the received result object have incorrect values, fix them. Send the object as furnitureDetails to /api/price 🠊 3. Send requestId, user's location and chat tab to /api/location 🠊 4. Send requestId and question to /api/chat for all further chatbot requests

### Route details

| HTTP | Route      | Description | Response |
| ---- | ---------- | ----------- | -------- |
| POST | /api/image | Send an image in raw binary format using HTML multipart/form-data. Key must be "image" and the image itself as value. | The response is a JSON object containing the furniture details |
> Response example:
```json
{
      "type": "Sofa",
      "brand": "West Elm",
      "model": "Hamilton",
      "color": "Gray",
      "dimensions": {
        "length": 218,
        "width": 94,
        "height": 90
      },
      "age": 3,
      "condition": "Excellent"
}
```


| HTTP | Route      | Description | Response |
| ---- | ---------- | ----------- | -------- |
| POST | /api/price | Send furniture details as JSON. The key is "furnitureDetails" for the JSON object. | The response is a JSON object containing the price estimates and places to sell furniture.|
> Response example:
```json
{
    "message": "Price estimate was analyzed",
    "result": {
        "korkein_hinta": 150,
        "alin_hinta": 100,
        "myyntikanavat": [
            "Tori",
            "Mjuk",
            "Huuto.net"
        ]
    }
}
```

| HTTP | Route | Description | Response |
| ---- | ----- | ----------- | -------- |
| POST | /api/chat | Send a request to /api/image, then copy id from the response. Then send a request to /api/price with the copied id in the request body. After that send a JSON object to this route with the request body containing requestId and question as strings. | The response is a JSON object containing the answer to sent question. |
> Response example:
```json
{
    "answer": "Kun myyt kalustetta verkossa, huomioi hyvä tuotekuvaus, jossa kerrot selkeästi merkin, mitat, materiaalit, kunnon ja värin. Käytä laadukkaita kuvia eri kulmista. Aseta kilpailukykyinen hinta perustuen kuntoon ja markkinahintoihin. Valitse sopiva myyntikanava, kuten Tori tai Mjuk, ja varmista turvallinen maksutapa. Ole rehellinen ja vastaa ostajien kysymyksiin nopeasti."
}
```

| HTTP | Route | Description | Response |
| ---- | ----- | ----------- | ---------|
| POST | /api/location | Send an an object with "requestId", "location" (eg. "Kamppi, Helsinki") and "source" ("donation" or "recycle" or "repair") | The response is a JSON object containing information about various stores in the given location that can help the user donate/recycle/repair their furniture |
> Response example:

```json
{
    "result": "Helsingin Kamppi-alueella ja sen läheisyydessä on useita paikkoja, joissa voit kierrättää huonekaluja. Tässä on muutamia ehdotuksia:\n\n1. **Kierrätyskeskus**: Helsingin seudun       ympäristöpalvelut (HSY) tarjoaa kierrätyskeskusten palveluita, joissa voit viedä käytettyjä huonekaluja. Lähin sijaitsee Kalasatamassa, hieman matkan päässä Kampista.\n\n2. **Fida Lähetystori**: Fidan myymälöihin voi lahjoittaa käytettyjä huonekaluja. Kampista lyhyen matkan päässä on Fida Itäkeskuksessa.\n\n3. **Uff**: Vaikka UFF keskittyy pääasiassa vaatekierrätykseen, kannattaa tarkistaa heidän verkkosivuiltaan, ottavatko he vastaan pieniä huonekaluja tai muuta kuin vaatteita.\n\n4. **Kontti (Punainen Risti)**: Kontti-kierrätystavaratalot vastaanottavat lahjoituksina huonekaluja sekä kodin tavaroita. Lähin Kontti löytyy Vantaalta, mutta se on helposti saavutettavissa julkisilla liikennevälineillä.\n\n5. **Tori.fi tai Facebook Marketplace**: Nämä eivät ole fyysisiä paikkoja, mutta niiden kautta voit myydä tai lahjoittaa huonekaluja paikallisesti, ja ne voivat usein löytää uuden kodin nopeasti.\n\n6. **Helsingin kaupungin sorttiasemat**: Joissakin sorttiasemissa voit jättää käyttökelpoisia huonekaluja uudelleen käytettäväksi. Lähin sijaitsee Konalassa.\n\nEnnen kuin viet huonekalun kierrätykseen, kannattaa tarkistaa kyseisen paikan lahjoitusehdot tai ottaa yhteyttä ja varmistaa, että he vastaanottavat kyseisiä tavaroita."
}
```

| HTTP | Route | Description | Response |
| ---- | ----- | ----------- | ---------|
| POST | /api/review | Send a request containing `request_id` and `review` as an object. The `review` object should include a `rating` (between 1 and 5) and an optional `comment`. Prior to using this route, you must have sent a request to the `/api/chat` route with the same `request_id`. | A message indicating whether the review was successfully logged or not. |
> Response example:

```json
{
    "message": "Review logged successfully"
}
```

## Testing with Postman

### /api/image
![api_image_postman](./screenshots/api_image_postman.PNG)

### /api/price
![api_price_postman](./screenshots/api_price_postman.PNG)

### /api/chat
![api_chat_postman](./screenshots/api_chat_postman.PNG)

### /api/location
![api_location_postman](./screenshots/api_location_postman.PNG)

### /api/review
![api_review_postman](./screenshots/api_review_postman.PNG)


## Docker Instructions

### Using Dockerfile

#### Build Docker Image
To build the Docker image, run the following command in the root directory:
```sh
docker build -t kaluste-backend .
```

#### Run Docker Container
```sh
docker run -d --name kaluste-backend -p 3000:3000 --env-file .env kaluste-backend
```

#### Stop Docker Container
To stop the Docker container, use the following command:
```sh
docker stop kaluste-backend
```

#### Remove Docker Container
To remove the Docker container, use the following command:
```sh
docker rm kaluste-backend
```

### Using Docker Compose

#### docker-compose-be-cache.yml
This file is used to set up and run both the backend and Memcached services.

To build and run the containers, use the following command:
```sh
docker-compose -f docker-compose-be-cache.yml up
```

To stop the running containers, use the following command:
```sh
docker-compose -f docker-compose-be-cache.yml down
```

#### docker-compose-local-cache.yml
This file is used to set up and run only the Memcached service. Note: Remove `MEMCACHED_HOST` from `.env` or set it to `localhost` for this to work.

To build and run the Memcached container, use the following command:
```sh
docker-compose -f docker-compose-local-cache.yml up
```

After the Memcached container is running, run the backend locally:
```sh
npm run dev
```

To stop the running Memcached container, use the following command:
```sh
docker-compose -f docker-compose-local-cache.yml down
```
## Cache

We use [Memcached](https://memcached.org/) for caching in development.

### Key Features
- Caches furniture price data using `brand+model` as key
- 24 hour cache expiration
- Checks cache before new price scrapes
- Cache clears on server restart

### Setup
- Follow Docker Instructions to setup Memcached.

Note: Caching is currently disabled in production.

## Database

This project uses [MongoDB](https://www.mongodb.com/) as its database solution and [mongoose](https://mongoosejs.com/) to interact with MongoDB.

### Main Functionalities
1. Conversation Logging
    - Stores chat interactions between users and AI
    - Endpoint: `/api/chat`
    - Records full conversation history

2. Review Logging
    - Stores user feedback and reviews
    - Endpoint: `/api/review`

### Database Schema

The schema for the database documents is declared in the [log.ts](/src/models/log.ts) file.
