# Description

This is an Event Scheduling RESTful API that deals with authentication, user management, events, and event attendance.
## Features

- **Create and Manage Events**: Easily create new events, update their details, and delete them as needed.

- **Event Attendees**: Keep track of event attendees, manage their statuses, and handle participant information.

- **Search and Filter**: Efficiently search and filter events based on various criteria such as date, category, location, etc.

- **GraphQL API**: Utilize the power of GraphQL to fetch precisely the data you need, optimizing API performance.


## Technologies Used

- **Nest.js**: A progressive Node.js framework for building efficient, scalable, and maintainable server-side applications.

- **TypeORM**: An Object-Relational Mapping (ORM) that simplifies database interactions with strong TypeScript support.

- **Postgres**: A powerful relational database system known for its performance and reliability.

- **GraphQL**: A query language for APIs that enables precise data retrieval and reduces over-fetching.

- **Apollo Server**: A GraphQL server implementation that works seamlessly with Node.js and provides essential features for building GraphQL APIs.

- **Jest**: A widely-used testing framework for JavaScript and TypeScript applications, ensuring code reliability through unit and integration tests.

- **Docker**: A containerization platform that allows for easy deployment and scaling of applications.

## Installation
Project is using `pnpm` as package manager, but you can use `npm` or `yarn` as well.
```bash
$ pnpm install
```

## Running the app

1. Host the Database.

  You can host PostgreSQL for local development using Docker:

  ```bash
  docker-compose up -d
  ```
2. Fill `dev.env` file. Here is an example:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=example
  DB_DATABASE=nest-events
  JWT_SECRET=secret
  PORT=3000
  ```
3. Run the app.
  ```bash
  # development
  $ pnpm run start

  # watch mode
  $ pnpm run start:dev

  # production mode
  $ pnpm run start:prod
  ```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```


## API Endpoints

Here is the updated API routes documentation with descriptions:

### *Auth & Users*

### Authenticate
- Method: **POST**
- URL: `{{URL}}/auth/login`
- Data: 
  ```
  {
      "username": "mister1",
      "password": "password"
  }
  ```
- Requires Auth: **No**
- Description: This endpoint allows users to authenticate by sending a POST request with their username and password. After successful authentication, the server responds with a JSON object containing a token.

### Current User Profile
- Method: **GET**
- URL: `{{URL}}/auth/profile`
- Requires Auth: **Yes**
- Description: This endpoint allows authenticated users to retrieve their own profile information.

### Register
- Method: **POST**
- URL: `{{URL}}/users`
- Data: 
  ```
  {
      "username": "mister1",
      "password": "password",
      "retypedPassword": "password",
      "firstName": "John",
      "lastName": "Terry2",
      "email": "mister@gmail.com"
  }
  ```
- Requires Auth: **No**
- Description: This endpoint allows users to register by sending a POST request with their desired username, password, first name, last name, and email.

### *Events Attendance*

### Event Attendees
- Method: **GET**
- URL: `{{URL}}/events/:id/attendees`
- Requires Auth: **No**
- Description: This endpoint allows users to retrieve the list of attendees for a specific event with ID.

### Attend Event
- Method: **PUT**
- URL: `{{URL}}/current-user-event-attendance/:id`
- Data: 
  ```
  {
      "answer": 1
  }
  ```
- Requires Auth: **Yes**
- Description: This endpoint allows authenticated users to mark their attendance for a specific event with ID. Users can provide their response using the "answer" field in the request body.

### Specific Event Attendance By Current User
- Method: **GET**
- URL: `{{URL}}/current-user-event-attendance/:id`
- Requires Auth: **Yes**
- Description: This endpoint allows authenticated users to retrieve their attendance status for a specific event with ID.

### All Events Attendance By Current User
- Method: **GET**
- URL: `{{URL}}/current-user-event-attendance`
- Requires Auth: **Yes**
- Description: This endpoint allows authenticated users to retrieve their attendance status for all events.

### *Events*

### Create Event
- Method: **POST**
- URL: `{{URL}}/events`
- Data: 
  ```
  {
      "name": "Interesting Party",
      "description": "That is a crazy event, must go there!",
      "address": "Local St 101",
      "when": "2023-06-15 21:00:00"
  }
  ```
- Requires Auth: **Yes**
- Description: This endpoint allows authenticated users to create new events by sending a POST request with event details like name, description, address, and time.

### Event List
- Method: **GET**
- URL: `{{URL}}/events`
- Requires Auth: **No**
- Description: This endpoint allows authenticated users to retrieve a list of events.

### Delete Event
- Method: **DELETE**
- URL: `{{URL}}/events/:id`
- Requires Auth: **Yes**
- Description: This endpoint allows users with appropriate permissions to delete an event with ID.

### Events Organized By User
- Method: **GET**
- URL: `{{URL}}/events-organized-by-user/:id`
- Requires Auth: **No**
- Description: This endpoint allows users to retrieve a list of events organized by the user with ID.

### Get Single Event
- Method: **GET**
- URL: `{{URL}}/events/:id`
- Requires Auth: **No**
- Description: This endpoint allows users to retrieve information about a specific event with ID.

