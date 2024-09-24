# kaluste-backend
Älyä-hankkeessa KalusteArvio-projektin palvelin ja tekoälyliittymät

## API Documentation
| HTTP | Route      | Description | Response |
| ---- | ---------- | ----------- | -------- |
| POST | /api/image | Send an image in raw binary format using HTML multipart/form-data. Key must be "image" and the image itself as value. | The response for now is only a string to notify whether upload was successful/unsuccessful.

### Examples
![api_image_postman](https://github.com/user-attachments/assets/538d506f-8d67-4b6b-af5b-67b7f1b1fabf)
