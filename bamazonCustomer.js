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
    customerBuy();
})
// Display table
function customerBuy() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("item_id: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        //Ask customer about item
        customerInquirer();
    });


}

// Customer Inquirer
function customerInquirer() {
    inquirer
        .prompt([

            {
                type: "list",
                message: "Using the item id, what would you like to buy",
                name: "item_id",
            },
            {
                type: "quantity",
                message: "How many would you like to buy?",
                name: "stock_quantity"
            },
            {
                type: "confirm",
                message: "Are you ready to check out?",
                name: "confirm",
                default: true
            }
        ])
        .then(function (customerSelect) {
            var boughtItem = customerSelect.item_id;
            var itemQuantity = customerSelect.stock_quantity;
            var queryStr = "SELECT * FROM products where = ?"

            connection.query(queryStr, { item_id }, function (err, res) {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("Error: Invalid item. Please select a valid id.")
                    customerBuy();
                }
                else {
                    var product = res[0];

                    if (product <= product.stock_quantity) {
                        console.log("Your order has been placed.");
                        var updateQueryStr = "Update products Set stock_quantity = " + (product.stock_quantity - quantity) + "WHERE item_id = "


                        connection.query(updateQueryStr, function (err, data) {
                            if (err) throw err;

                            console.log("Your order has been placed! Your total is " + product.price * quantity);
                            console.log("Thanks for choosing Bamazon! Have a Great Day and Shop with Us Again");
                            connection.end();
                        })

                    }
                    else {
                        console.log("Sorry! There are no longer any stocks left of that item.");
                        console.log("Please try choosing another item.");
                        customerBuy();

                    }
                }
            });
    });

}

// incomplete