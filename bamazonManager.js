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
                    return "add inventory";
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
    // incomplete.......
    .then(function(userInput) {
        if (userInput.option === "sale") {
            
        }
    })

}