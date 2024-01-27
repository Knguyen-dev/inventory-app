# inventory-app

A simple inventory application

1. npm uninstall cookie-parser debug ejs express http-errors morgan
2. npm install cookie-parser debug ejs express http-errors morgan mongoose compression express-async-handler express-rate-limit express-validator helmet luxon
3. npm install --save-dev nodemon



- BOOK MARK: 

1. Add functionality: Have an add button on every 'list' page. This button leads to a "form"
    page, where you can add a new item.

  - Adding a category should be easy as it shouldn't depend on other models.
  - For adding a item, the user must choose an existing category and an existing
    seller for that item. We 
  - For adding a seller, it should be easy as it doesn't depend on other models

2. Update functionality: On Every 'details' page we will have an update button. Where
  you can update an existing model.
  - Updating a category should be easy. We shouldn't need to update the info of other 
    models if we're updating its info because other models only depend on its id.
  - Updating a product, the user should pick an existing category or seller. 
  - Updating a seller should be easy as well as we shouldn't have to update the 
    the info of other objects since others only depend on its object id.

- NOTE: For the forms when adding and updating a model object, we make those reusable components
  or partials, so that we can reuse htem on the 'add' route and the 'update' route. Now for 
  adding, the form fields should be empty, but when updating we fill the form fields with the
  info of the things we are updating.

3. Delete functionality: Keeping it simple, on every 'details' page put a delete button so that we can 
  delete that individual document. 
  - To delete a category, ensure all items in that category are deleted, or not using that category.
  - Deleting an item should be easy, as even when an item is deleted, the category and seller are 
    still able to exist normally.
  - To delete a seller, make it so we have to delete all items that a seller is selling, or 
    switch it off of the seller being deleted.




# Credits:

1. Inspiration: https://inventory-cat-cafe.fly.dev/inventory
