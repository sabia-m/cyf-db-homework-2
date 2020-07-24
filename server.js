const dotenv = require('dotenv')
const express = require('express')
const mongodb = require('mongodb')

const { getPutBodyIsAllowed } = require('./util')

dotenv.config()

console.log(process.env)

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

const uri = process.env.DATABASE_URI

app.post('/api/books', function(request, response) {
  const client = new mongodb.MongoClient(uri);
  
  client.connect(function () {
    const db = client.db("literature");
    const collection = db.collection("books");
      const newObject = {}

      var ObjectId = mongodb.ObjectID
      var id = new ObjectId();
      console.log(id)
      newObject._id = id

        console.log(newObject._id)

      if (request.query.title === ""){
        newObject.title = request.query.title }
        else {
          response.send(400)
        }
    
      if (request.query.author === ""){
        newObject.author = request.query.author}
        else {
          response.send(400)
        }

      if (request.query.author_birth_year === ""){
      newObject.author_birth_year = Number(request.query.author_birth_year)
    }
    else {
      response.send(400)
    }

    if (request.query.author_death_year === ""){
    newObject.author_death_year = Number(request.query.author_death_year)
  } else {
    response.send(400)
  }

  if (request.query.url === ""){
  newObject.url = request.query.url
} else {
  response.send(400)
}

  console.log(newObject)
    collection.insertOne(newObject, function (error, result) {
      response.send(error || result.ops[0]);
      console.log("Book has been added!")
      client.close();
    });
  });
});
  // Make this work!

app.delete('/api/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri);
  
  client.connect(function () {
    const db = client.db("literature");
    const collection = db.collection("books");
    let id = undefined
    let checkID = request.params.id

    if (mongodb.ObjectId.isValid(checkID)) {
      id = new mongodb.ObjectId(checkID)
    } else {
      response.status(400).send("This ID is invalid")
    }
    const searchObject = { _id : id };

    collection.deleteOne(searchObject, function (error, result) {
       if (result.deletedCount) {
        response.status(204).send("Successfully deleted!");
      } else if(result._id !== id) {
        response.status(404).send("Sorry, this ID does not exist.");
      }
      client.close();
    });
  });
})
 
app.put('/api/books/:id', function(request, response) {
  // Also make this work!
})

app.get('/api/books', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('literature')
    const collection = db.collection('books')

    const searchObject = {}

    if (request.query.title) {
      searchObject.title = request.query.title
    }

    if (request.query.author) {
      searchObject.author = request.query.author
    }

    collection.find(searchObject).toArray(function(error, books) {
      response.send(error || books)
      client.close()
    })
  })
})

app.get('/api/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  let id
  try {
    id = new mongodb.ObjectID(request.params.id)
  } catch (error) {
    response.sendStatus(400)
    return
  }

  client.connect(function() {
    const db = client.db('literature')
    const collection = db.collection('books')

    const searchObject = { _id: id }

    collection.findOne(searchObject, function(error, book) {
      if (!book) {
        response.sendStatus(404)
      } else {
        response.send(error || book)
      }

      client.close()
    })
  })
})

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
})

app.get('/books/new', function(request, response) {
  response.sendFile(__dirname + '/new-book.html')
})

app.get('/books/:id', function(request, response) {
  response.sendFile(__dirname + '/book.html')
})

app.get('/books/:id/edit', function(request, response) {
  response.sendFile(__dirname + '/edit-book.html')
})

app.get('/authors/:name', function(request, response) {
  response.sendFile(__dirname + '/author.html')
})

app.listen(port || 3000, function() {
  console.log(`Running at \`http://localhost:${port}\`...`)
})
