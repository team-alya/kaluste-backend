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
| POST | /api/image | Send an image in raw binary format using HTML multipart/form-data. Key must be "image" and the image itself as value. | The response is a JSON object containing the values shown in the example below 
```
{
      "request_id": "1eb766f2-b72f-473c-bb53-ab45d5d66433",
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

### Testing with Postman
![api_image_postman](https://github.com/user-attachments/assets/538d506f-8d67-4b6b-af5b-67b7f1b1fabf)

| HTTP | Route      | Description | Response |
| ---- | ---------- | ----------- | -------- |
| POST | /api/price | Send an image in raw binary format along with furniture details. The key must be "image" for the image and "furnitureDetails" for the JSON object. | The response is a JSON object containing the price estimates, description and sell probality.

````
{
    "message": "Price estimate was analyzed",
    "result": {
        "highest_price": 500,
        "lowest_price": 300,
        "average_price": 400,
        "description": "Aeron chairs are popular and      sought-after in the second-hand market.  A 5-year-old chair in good condition is likely to sell well, especially if it comes with all the original features. The gray color is a classic and versatile choice. The price range is based on similar listings on popular online marketplaces in Finland.",
        "sell_probability": "High"
    }
}
````
