# bamazon

## bamazon is an Amazon-like storefront using MySQL concepts. The app takes order from customers and deplete stock from the store's inventory. 

### Technologies Used

* Node.js
* Inquirer NPM Package
* MYSQL NPM Package

### Apps
* customer - "node bamazonCustomer.js"
* manager - "node bamazonManager.js"
* supervisor - "node bamazonSupervisor.js"

### What Each Operation Does

* bamazonCustomer.js
![ALT TEXT] (/images/customer.gif) 
    * display the items in inventory
    * Prompts the customer what they want to buy using the item id
    * Ask how many units of the item the customer wants to buy

* bamazonManager.js
    * opens a list of operations to choose from
        * View Products for Sale - display the inventory
        * View Low Inventory - display the items with less than 5 quantity left in the inventory
        * Add to Inventory - update the quantity of the item adding in the inventory
        * Add New Product - add a NEW item into the inventory
        * End Session

* bamazonSupervisor.js
    * View Product Sales by Deparment - display a summarized table in their terminal/bash window.
    * Create New Department

