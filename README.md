# kaluste-backend
Älyä-hankkeessa KalusteArvio-projektin palvelin ja tekoälyliittymät

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
