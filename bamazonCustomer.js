var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
    inventoryDisplay();
})
// Display table
function inventoryDisplay() {
    connection.query("SELECT * FROM products", function (err, res) {
        var displayTable = new Table({
            head: ["item", "Product Name", "Category", "Price", "Quantity"],
            colWidths: [10, 25, 25, 10, 14]
        });
        for (var i = 0; i < res.length; i++) {
            
            displayTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(displayTable.toString());

        //Ask customer about item
        customerInquirer();
    });


}

// Customer Inquirer
function customerInquirer() {
    inquirer
        .prompt([

            {
                type: "input",
                message: "Using the item id, what would you like to purchase?",
                name: "itemId",
                
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "Quantity",
                
            },

        ])
        .then(function(input) {
            var itemId = input.itemId;
            var itemQuantity = parseInt(input.Quantity);
            
            connection.query("SELECT * FROM products WHERE item_id = " + itemId, function (err, res) {

                if (err) throw err;
                if (res[0].stock_quantity < itemQuantity) {

                    console.log("Purchase incomplete. Insufficient quantity. Sorry, we no longer have that item in stock.");
                    console.log("Please select a valid quantity.");
                    
                }
                else {
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: (res[0].stock_quantity - itemQuantity)}, {item_id: itemId}], function(err, result) {
                        console.log("Congratulations! Your order was placed.")
                        console.log(" ");
                        console.log("Your total cost for " + itemQuantity + " of the " + "Item id: " + itemId + " is " + (res[0].price * itemQuantity) + "." + " Thank you!");
                        console.log("Thank you for your purchase. Come shop with us again.");
                    });
                    connection.end();
                }
        });
    });
         
    

}

