/* REQUIRE MONGOCLIENT */
const {MongoClient} = require('mongodb');
/* THE DB CONNECTION */
let dbConnection;

/* EXPORT TWO FUNCTIONS */
module.exports = 
{
/* FUNCTION CONNECT TO DB */
connect_db: async (cb) => {
/* CB IS AN CALLBACK FUNCTION */
try {
      /* CONNECTION TO DB BOOKSTORE */
const client=await MongoClient.connect('mongodb://localhost:5000/bookstore');  
/* GET THE CONNECTION / INSTANCE */
dbConnection = client.db(); 
return cb();
} catch (error) {
/* RETRIEVE THE ERROR */
console.log(error);
return cb(error);    
}




},
/* RETURN THE VARIABLE dbConnection */
get_db: () => dbConnection

}