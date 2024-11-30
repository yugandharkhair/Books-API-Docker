# Books API with Express and MongoDB

A RESTful API for managing books built with Node.js, Express, and MongoDB.

Docker Image: `docker pull yugkhair/books-api`

## Features
- RESTful endpoints for CRUD operations on books
- MongoDB for data persistence
- Docker containerization
- Initial seed data with sample books

## Quick Start with Docker Compose
The easiest way to run this application is using Docker Compose:

1. Save this `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    image: yourusername/books-api:latest
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/booksdb
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

2. Run the application:
```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/books | Get all books |
| GET    | /api/books/:id | Get a specific book |
| POST   | /api/books | Create a new book |
| PUT    | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |

## Example API Usage

### Get all books
```bash
curl http://localhost:3000/api/books
```

### Create a new book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925
  }'
```

### Update a book
```bash
curl -X PUT http://localhost:3000/api/books/[book-id] \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1926
  }'
```

### Delete a book
```bash
curl -X DELETE http://localhost:3000/api/books/[book-id]
```

## Book Schema
```json
{
  "title": "String (required)",
  "author": "String (required)",
  "year": "Number (required)"
}
```

## Running Without Docker
If you want to run without Docker, you'll need:
1. Node.js installed
2. MongoDB installed and running locally
3. Clone the repository
4. Run `npm install`
5. Update MONGODB_URI in src/index.js to point to your MongoDB instance
6. Run `npm start`

## Contributing
Feel free to open issues and submit pull requests!

## License
MIT
