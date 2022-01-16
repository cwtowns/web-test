## Wisely Web Test - Take home programming assignment

# Steps

- run `docker-compose up`

# Executing tests

- docker exec -ti web-test_api_1 yarn test

# Coments
- I have not added indexes to the backend models.  We would want them to be added based on the common query columns from the API.
- Retrieving a restaurant configuration would benefit from having the count of available slots left.  It was not obvious how to do this correctly using Sequelize ORM.  
- There is a postman collection in the api folder.