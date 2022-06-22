/* REQUIRE THE FUNCTIONS THAT HANDLE THE CONNECTION TO MONGODB SERVER */
const {connect_db,get_db} = require('./db');
/* REQUIRE EXPRESS */
const express = require('express');
/* REQUIRE OBJECT ID TYPE FROM MONGODB */
const { ObjectId } = require('mongodb');
const db = require('./db');
/* INITIALIZE OUR APP */
const app = express();
/* USE JSON IN THE REQUESTS ON THE APP */
app.use(express.json());
/* DB INSTANCE */
let db_instance;

/* CONNECT DB FUNCTION WHICH IF THERES AN ERROR THE ARGUMENT WILL HAVE AN OBJECT , HOWEVER IF IT DOESNT HAVE ONE , THE ARGUMENT WILL BE NULL */
connect_db((err)=>{
/* IF THE ERR IS NULL */
if(!err){
console.log("No errors in the connection to db");
/* LISTENING IN THE PORT */
app.listen(3000,()=>{
console.log("Server is listening in the 3000 port");
});
/* GET THE INSTANCE OF THE CONNECTION */
db_instance=get_db();
}else{
/* TROWN AN ERROR */
console.log("Theres an error in the db connection");    
}
})




/* ROUTES */
app.get('/books',async (req,res)=>{
   /* GET THE PAGE SLOT */
   const page = req.query.p || 0
   /* NUMBER OF BOOKS PER PAGE */
   const booksPerPage = 3;
    /* ARRAY OF BOOKS */
    let books=[];
    /* GRAB COLLECTION OF BOOKS */
    
    try {
    /* IT RETURNS AN cursor THAT WILL RETURN UNTIL 101 ITEMS UNTIL YOU PASS TO NEXT "BADGE" */ 
    await db_instance.collection('books')
    /* FIND WITHOUT FILTERS */
    .find()
    /* SORT BY AUTHOR */
    .sort({author:1})
    /* SKIP METHOD WILL SKIP page * booksPerPage , this way we will hang out slot by slot */
    .skip(page * booksPerPage)
    /* THE ACTUAL BOOKS PER PAGE */
    .limit(booksPerPage)
    /* MAPPING THE BOOK */
    .forEach(book => {
    /* ADD THE BOOKS TO THE ARRAY OF BOOKS */
    books.push(book);    
    }); 
    /* SEND THE ANSWER */
    res.status(200).json(books);
    } catch (error) {
      /* SEND THE ANSWER */
    res.status(500).json("Theres some kind of error");  
    }
    
    
});

/* GET BOOKS BY ID */
app.get("/book/:id",(req,res)=>{
if(ObjectId.isValid(req.params.id)){    
/* GRABBING AN BOOK WITH THE ID */
db_instance.collection('books')
/* MAKE THE QUERY */
.findOne({_id: ObjectId(req.params.id)})
/* AWAIT STATEMENT */
.then((doc)=>{
if(doc===null){
res.status(200).json("No records match that id");
}else{
/* RETURN THE DOC */
res.status(200).json(doc);
}
})
.catch(()=>{
/* RETURN AN STATUS ERROR */
res.status(500).json("Theres some kind of error");
})}else{
    /* ERROR MSG */
    res.status(500).json("The id is not valid");
}

});

/* POST NEW BOOKS */
app.post('/books',(req,res)=>{
/* GET THE BODY */
const book = req.body;
/* MAKE THE REQUEST */
db_instance.collection('books')
/* INSERT ONE */
.insertOne(book)
/* GRAB THE RESULT */
.then((result) =>{
/* ANWSER THE REQUEST */
res.status(200).json(result);
})
/* GRAB AN ERROR */
.catch((err)=>{
console.log(err);
/* ANSWER THE REQUEST */
res.status(500).json({err:'Could not post'});
})
    
})

/* DELETE BOOKS */
app.delete('/books/:id',(req,res)=>{
  /* VERIFY THE ID */
  if(ObjectId.isValid(req.params.id)){
    /* GRAB THE COLLECTION */
  db_instance.collection('books')
  /* DELETE METHOD */
  .deleteOne({_id: ObjectId(req.params.id) })
  /* RESULT */
  .then((result)=>{
    /* SEND SUCESS MESSAGE */
  res.status(200).json({response:"Sucess"});
  /* ERROR */
  }).catch((err)=>{
  /* ERROR MESSAGE */
  res.status(500).json(err);
  })

  }else{
    /* ERROR MESSAGE IN CASE THE ID ISNT VALID */
  res.status(500).json({response: "That id is not valid"});  
  }
});
/* AN UPDATE */
app.put('/books/:id',(req,res)=>{
  /* THE BODY */
  const updates = req.body;
  /* CHECK IF THE ID IS VALID */
  if(ObjectId.isValid(req.params.id)){
    /* GRAB THE COLLECTION */
  db_instance.collection('books')
  /* UPDATE IT */
  .updateOne({_id: ObjectId(req.params.id)},{$set: updates})
  /* RESULT */
  .then((result)=>{
  /* RESPONSE */
  res.status(200).json(result);
  }).catch((err)=>{
    /* RESPONSE */
  res.status(500).json({error: 'Could not update the document right now'});
  })
}else{
  /* RESPONSE */
  res.status(500).json({error: 'The id is not valid'});
}
})