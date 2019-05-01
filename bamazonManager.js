

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"

});
//connect to mysql
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    managerPrompt();
})

function managerPrompt() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "option",
            message: "Please choose an option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            filter: function(val) {
                if (val === "View Products for Sale") {
                    return "sale";
                }
                else if (val === "View Low Inventory") {
                    return "low inventory";
                }
                else if (val === "Add to Inventory") {
                    return "add to inventory";
                }
                else if (val === "Add New Product") {
                    return "new product added";
                }
                else {
                    console.log("Error! Invalid Operation");
                }
            }
        }
    ])
    .then(function(userInput) {
        if (userInput.option === "sale") {
            inventoryDisplay();
        }
        else if (userInput.option === "low inventory") {
            displayLowQuantity();
        }
        else if (userInput.option === "add to inventory") {
            addItemQuantity();
        }
        else if (userInput.option === "new product added") {
            addNewProduct();
        }
        else {
            console.log("Invalid operation!");
            exit(1);
        }
    })
   
}
// Display the items in the inventory
function inventoryDisplay() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("item_id: " + res[i].item_id + " | " + "product_name: " + res[i].product_name + " | " + "department_name: " + res[i].department_name + " | " + "price: " + res[i].price + " | " + "stock_quantity: " + res[i].stock_quantity);
        }
       
    });
    connection.end();
}
// Display items with quantity under 5
function displayLowQuantity() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("--------------------------------------");
        console.log("Items less than 5 remaining: ")
        console.log(" ")
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                
                console.log("item_id: " + res[i].item_id + " | " + "product_name: " + res[i].product_name + " | " + "department_name: " + res[i].department_name + " | " + "price: " + res[i].price + " | " + "stock_quantity: " + res[i].stock_quantity);
                console.log("---------------------------------------");
            }
        }
        
    })
    connection.end();
    
}

// < -------------- Incomplete Part -------------- >
// add more quantity to an item in inventory 
function addItemQuantity() {
    inquirer
    .prompt([
        {
            name: "newItem",
            message: "Using the item_id number, what item would you like to update?",
            type: "input"
        },
        {
            name: "itemQuantity",
            message: "How many quantity are you adding to this item?",
            type: "input"
        }
    ])
    .then(function(managerInput) {
        var item = managerInput.newItem;
        var newItemQuantity = managerInput.itemQuantity;

        connection.query("SELECT * FROM products WHERE ? ", {item_id: item}, function(err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("Invalid! Sorry, there was an error in your request!");
                addToInventory();
            }
            else{
                console.log("Please wait while inventory is updating.....");
                var updateInventory = "UPDATE products SET stock_quantity = " + (res[0].stock_quantity + newItemQuantity) + "WHERE item_id = " + item;

                console.log()

                connection.query( updateInventory+ ".");
            }
        })
    })
}

//Adding New Item to Inventory
function addNewProduct() {
    inventoryDisplay();
    inquirer.prompt([
        {
            name: "product_name",
            message: "What would you like to add into the inventory?",
            type: "input"
        },
        {
            name: "department_name",
            message: "What department categorized this item?",
            type: "input"
        },
        {
            name: "price",
            message: "What is the price of this item per unit?",
            type: "input"
        },
        {
            name: "stock_quantity",
            message: "How many stocks of this item are you adding in the inventory?",
            type: "input"
        }
    ])
    .then(function(managerInput) {
        console.log("Adding new item: product_name: " + managerInput.product_name + " department_name "  + managerInput.department_name + " price " + managerInput.price + " stock_quantity: " + managerInput.stock_quantity);
        
        connection.query("INSERT INTO products SET ?", managerInput, function (err, res, fields) {
            if (err) throw err;

            console.log("New item has been added to the inventory under Item Id: " + res.insertID + ".");

            
        })
        connection.end();
    });


}

// 