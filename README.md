# COMPS381F Group Project(2024 Autumn Term)
**Nutrition Database Web application**

This project is a web application for managing nutrition information. It allows users to create, read, update, and delete nutrition data. The application uses Node.js, Express, MongoDB, and EJS for templating.

## Group Members (Group 27)
- Chang Yiu Hei (12782440 )
- Kong Cho Kiu Louisa (12756783)
- Guan Wai Nam (12894713 )

## Features

- User authentication with Facebook
- CRUD operations for nutrition data
- Search functionality
- User login and logout

## Installation

### Access the web application via local host:

1. Clone the repository:
    ```bash
    gh repo clone louisakck/381gp_project
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:8080/`.

***Note: OAUTH function of login via facebook will be unavailable for localhost access***


### Access via cloud URL:

1. Open your browser and navigate to `https://three81project-27.onrender.com`.


## Usage

### Authentication

- Login with your username and password or use Facebook authentication.
- name: `admin`, password: `Iamadmin`
- name: `userabc`, password: `abc`

### Nutrition Management

- View the list of nutrition items on the homepage.
- Search for nutrition items by name.
- Add a new nutrition item by clicking the "Insert" button.
- Edit an existing nutrition item by clicking the "Edit" button next to the item.
- Delete a nutrition item by clicking the "Delete" button next to the item.

### API Endpoints

- `GET /api/list` - Retrieve all nutrition items.
- `POST /api/create` - Create a new nutrition item.
- `PUT /api/update/:id` - Update an existing nutrition item.
- `DELETE /api/delete/:id` - Delete a nutrition item.

## Test Example
### Read
- curl -X GET https://three81project-27.onrender.com/api/list
### Create
- curl -X POST -H "Content-Type: application/json" --data '{"name": "french fries" , "calories": "300", "protein": "10", "total_fat": "50", "sodium": "200"}' https://three81project-27.onrender.com/api/create
### Update
- curl -X PUT -H "Content-Type: application/json" --data '{"name": "french fries" , "calories": "300", "protein": "10", "total_fat": "50", "sodium": "200"}' https://three81project-27.onrender.com/api/update/**id**

### Delete
- curl -X DELETE https://three81project-27.onrender.com/api/delete/**id**

**replace the id part with the created record id**

## File Structure
- server.js
- package.json
- views
    - change.ejs
    - details.ejs
    - homepages.ejs
    - login.ejs
- models
    - nutrition.js

- `server.js` - Main server file.
- `models/nutrition.js` - Mongoose schema for nutrition data.
- `views/` - EJS templates for the frontend.

## Dependencies

- express
- mongoose
- ejs
- passport
- passport-facebook
- body-parser
- express-session

## License

This project is licensed under the MIT License.