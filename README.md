# inventory-app

A simple inventory application

1. npm uninstall cookie-parser debug ejs express http-errors morgan
2. npm install cookie-parser debug ejs express http-errors morgan mongoose compression express-async-handler express-rate-limit express-validator helmet luxon
3. npm install --save-dev nodemon


# Functionalities
1. Add functionality: On every 'list' page there's a button leads to a "form" page, where you can add a new item.
  - Users can add categories without restriction
  - For adding a item, the user must choose an existing category and an existing
    seller for that item. If there no sellers or items, the user has to create them before adding a new item.
  - Users can add sellers without restriction

2. Update functionality: On every 'details' page there's a link that takes the user to the 'update' page. Where they can update an existing model.
  - Categories can be updated without restriction.
  - Updating a product, the user must pick an existing category or seller. 
  - Sellers cna be updated without restriction.

3. Delete functionality: On every 'details' page put a delete button so that we can 
  delete that individual document. 
  - To delete a category, ensure there are no items associated with that category.
  - Items can be deleted without restriction.
  - To delete a seller, there must be no items associated with that seller


# Multipart form data:
- When we upload images and files, we send the data was 'multipart' form data, instead of json.
  This is why we use the Multer package, which helps handle file uploads from the user

# Gridfs:
- A driver specification of MongoDB for storing and getting MongoDB files. So
  you can store files larger than MB. We're not going to be using these here 
  but they're a good thing to be aware of as they're the solution when storing 
  user uploaded files to our database.

# Credits:
1. Inspiration: https://inventory-cat-cafe.fly.dev/inventory
