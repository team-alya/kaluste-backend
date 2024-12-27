# kaluste-backend

⚠️ **WARNING: This documentation is outdated and corresponds to git TAG v1.0. The codebase has evolved significantly since this version. Please refer to the latest code for current implementation details.**

Älyä-hankkeessa KalusteArvio-projektin palvelin ja tekoälyliittymät

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Docker Instructions](#docker-instructions)
- [Cache](#cache)
- [Database](#database)

## Technologies

- TypeScript
- Node.js
- Express.js
- OpenAI API
- MongoDB
- Docker
- Memcached

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

1. Send the image to /api/image 🠊 2. If the properties of the received result object have incorrect values, fix them. Send the furnitureDetails object to /api/price 🠊 3. Make a request to /api/location 🠊 4. Send all further user chat questions to /api/chat 🠊 5. After the converstation is done, send a user review to /api/review

### Route details

| HTTP | Route | Description                                      |
| ---- | ----- | ------------------------------------------------ |
| GET  | /ping | Send a request to validate the server is running |

| HTTP | Route      | Description                                                                                                                                                  |
| ---- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST | /api/image | Send an image in raw binary format using HTML multipart/form-data. Key must be "image" and the image itself as value to recieve an analysis of the furniture |

| HTTP | Route      | Description                                                           |
| ---- | ---------- | --------------------------------------------------------------------- |
| POST | /api/price | Send furniture details in the request body to receive price estimates |

| HTTP | Route     | Description                                                                                                   |
| ---- | --------- | ------------------------------------------------------------------------------------------------------------- |
| POST | /api/chat | Send an open question regarding the piece of furniture and the AI will answer it to the best of its abilities |

| HTTP | Route         | Description                                                                                                                                                                                    |
| ---- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST | /api/location | Send the user location and a single source, either "donation" or "recycle" or "repair", and the AI will find locations where the user can perform the given activity to the piece of furniture |

| HTTP | Route       | Description                                                                                                                                                |
| ---- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST | /api/review | Send a review that includes a rating (between 1 and 5) and an optional comment. Prior to using this route, you must have sent a request to the `/api/chat` |

### Requests and Responses

> #### /api/image
>
> ![api_image_postman](./screenshots/api_image_postman.PNG)

> #### /api/price
>
> ![api_price_postman](./screenshots/api_price_postman.PNG)

> #### /api/chat
>
> ![api_chat_postman](./screenshots/api_chat_postman.PNG)

> #### /api/location
>
> ![api_location_postman](./screenshots/api_location_postman.PNG)

> #### /api/review
>
> ![api_review_postman](./screenshots/api_review_postman.PNG)

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

## Vision Pipeline

The system uses multiple AI vision models in sequence to identify furniture from images. Below is the flow diagram of the process:

```mermaid
flowchart TD
    User([User]) --> FrontendUI[Frontend UI]
    FrontendUI -->|Upload image| ImageProcess[Image Processing]

    subgraph AsyncPipeline[Async Vision Pipeline]
        ImageProcess --> |Start All Models| AsyncModels[Async Vision Models]

        subgraph AsyncModels[Running in Parallel]
            direction LR
            GPT4[GPT-4 Vision]
            Gemini[Gemini Vision]
        end

        AsyncModels --> |As Results Complete| ResultCheck{Check Each Result<br>Brand Found?}

        ResultCheck -->|Yes| StopAndUse[Return First<br>Valid Result]
        ResultCheck -->|No & More Results<br>Pending| WaitNext[Wait for Next<br>Result]
        WaitNext --> ResultCheck

        ResultCheck -->|No & All Results<br>Processed| CombineResults[Combine Best<br>Partial Results]

        CombineResults --> CheckBrand{Brand Found?}
        CheckBrand -->|Yes| EditableForm
        CheckBrand -->|No| FinalGPT4[GPT-4 Vision<br>Final Attempt]
        FinalGPT4 --> EditableForm
    end

    StopAndUse --> EditableForm[Editable Form]

    EditableForm -->|User verifies/edits| PriceAnalysis[Price Analysis]
    PriceAnalysis --> ResponseUI[Response to User]
    ResponseUI --> User

    style AsyncPipeline fill:#f0f8ff
    style AsyncModels fill:#e6ffe6
    style ResultCheck fill:#fff0f0
    style EditableForm fill:#90EE90
    style StopAndUse fill:#98FB98
    style FinalGPT4 fill:#FFB6C1
    style CheckBrand fill:#fff0f0
```

flowchart TD
User([User]) --> FrontendUI[Frontend UI]
FrontendUI -->|Upload image| ImageProcess[Image Processing]

    subgraph AsyncPipeline[Async Vision Pipeline]
        ImageProcess --> |Start All Models| AsyncModels[Async Vision Models]

        subgraph AsyncModels[Running in Parallel]
            direction LR
            GPT4[GPT-4 Vision]
            Gemini[Gemini Vision]
        end

        AsyncModels --> |As Results Complete| ResultCheck{Check Each Result<br>Brand Found?}

        ResultCheck -->|Yes| StopAndUse[Return First<br>Valid Result]
        ResultCheck -->|No & More Results<br>Pending| WaitNext[Wait for Next<br>Result]
        WaitNext --> ResultCheck

        ResultCheck -->|No & All Results<br>Processed| CombineResults[Combine Best<br>Partial Results]

        CombineResults --> CheckBrand{Brand Found?}
        CheckBrand -->|Yes| EditableForm
        CheckBrand -->|No| FinalGPT4[GPT-4 Vision<br>Final Attempt]
        FinalGPT4 --> EditableForm
    end

    StopAndUse --> EditableForm[Editable Form]

    EditableForm -->|User verifies/edits| PriceAnalysis[Price Analysis]
    PriceAnalysis --> ResponseUI[Response to User]
    ResponseUI --> User

    style AsyncPipeline fill:#f0f8ff
    style AsyncModels fill:#e6ffe6
    style ResultCheck fill:#fff0f0
    style EditableForm fill:#90EE90
    style StopAndUse fill:#98FB98
    style FinalGPT4 fill:#FFB6C1
    style CheckBrand fill:#fff0f0
