var mysql = require("mysql");
var inquirer = require("inquirer");

//setting up the connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3302,
    user: "root",
    password:"password",
    database:"bamazon"
})

connection.connect(function(err){
    if(err) throw err;
    console.log("Successful connection achieved on Port: 3302");
    makeTable();
})


// mySQL stuff
var makeTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid +" | " +res[i].productname+" | "+ res[i].departmentname+" | "+ res[i].price+" | "+res[i].stockquantity+"\n");
        }    
        promptCustomer(res);
    })
}


// User prompts
var promptCustomer = function(res){
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message:"What would you like to purchase? [quit by pressing q]"
    }]).then(function(answer){
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        }
        var correct = false;
        for(var i=0; i<res.length; i++){
            if(res[i].productname ==answer.choice){
                correct=true;
                var product = answer.choice;
                var id = i;

                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message:"How many would you like to buy?",
                    validate: function(value){
                        if(isNaN(value) ==false){
                            return true
                        }else
                        {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stockquantity - answer.quant) >0){
                        connection.query("UPDATE products SET stockquantity = ' " +(res[id].stockquantity - answer.quant)+ "' WHERE productname = '"+product+"'", function(err, res2){
                            console.log("Item purchased!");
                            makeTable();
                        })
                    }else{
                        console.log("Invalid selection!");
                        promptCustomer(res);
                    }
                })
            }
        }

        if(i==res.length && correct==false){
            console.log("Invalid selection!");
            promptCustomer(res);
        }
    })


}