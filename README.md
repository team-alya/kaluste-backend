# kaluste-backend
Älyä-hankkeessa KalusteArvio-projektin palvelin ja tekoälyliittymät

## Installation

### Enviromental variables
Create an .env file in the root folder with the following values:
- GEMINI_API_KEY

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
| HTTP | Route      | Description | Response |
| ---- | ---------- | ----------- | -------- |
| POST | /api/image | Send an image in raw binary format using HTML multipart/form-data. Key must be "image" and the image itself as value. | The response is a JSON object containing the values shown in the example below |
```
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
```
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
```
{
    "answer": "Kun myyt kalustetta verkossa, huomioi hyvä tuotekuvaus, jossa kerrot selkeästi merkin, mitat, materiaalit, kunnon ja värin. Käytä laadukkaita kuvia eri kulmista. Aseta kilpailukykyinen hinta perustuen kuntoon ja markkinahintoihin. Valitse sopiva myyntikanava, kuten Tori tai Mjuk, ja varmista turvallinen maksutapa. Ole rehellinen ja vastaa ostajien kysymyksiin nopeasti."
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
