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
                name: "ID",
                
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "Quantity",
                
            },

        ])
        .then(function (customerSelect) {
            connection.query("SELECT * FROM products WHERE item_id = " + customerSelect.item_id, function (err, res) {
                
                if (err) throw err;
                
                if (customerSelect.quantity <= res[0].stock_quantity) {
                    console.log("Congratulations! Your order was placed.")
                    console.log("Your total cost for " + customerSelect.quantity + " " + res[0].product_name + " is " + totalCost + "Thank you!");
                    console.log("Thank you for your purchase. Come shop with us again.")
                    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + customerSelect.quantity + "WHERE item_id = " + ID);
                }
                else {
                    
                    var totalCost = res[0].price * customerSelect.quantity
                    console.log("Purchase incomplete. Insufficient quantity. Sorry, we no longer have that item in stock.");
                    console.log("Please select a valid quantity.");
                    inventoryDisplay();
                }
        });
    });
         
    

}

