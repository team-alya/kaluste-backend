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
| POST | /api/price | Send an image in raw binary format along with furniture details. The key must be "image" for the image and "furnitureDetails" for the JSON object. | The response is a JSON object containing the price estimates, description and price suggestion with sell probality.

````
{
    "message": "Price estimate was analyzed",
    "result": {
        "highest_price": 550,
        "lowest_price": 400,
        "average_price": 475,
        "description": "The Aeron chair is a popular model known for its ergonomic design and durability. The gray color is a common option, and the chair is in good condition, which is likely to be appealing to buyers. However, it is 5 years old, which may influence the price.",
        "price_suggestion": "The chair is most likely to sell for around 450 euros with a 70% probability."
    }
}
````
