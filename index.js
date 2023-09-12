// const http = require("http") // build into node

// // How to create a simple server
// //res.statusCode = 404
// const server = http.createServer((req, res) => {
//     console.log(req.url)
//     console.log(req.method)
//     res.setHeader("Content-Type", "text/html") //Telling browser to use html
//     res.end("<img src='https://pbs.twimg.com/media/Dj8XlmjV4AEzsvr.jpg'>")
// }) // req - request, res - response. Creates the server and sends the response

// server.listen(3000, () => {
//     console.log("Server Ready")
// }) // start server port 3000

// Above code is redundant because of express.

// ------------------------------------------


// app.get('/', (req, res) => {
//     res.send("Hello World!")
// }) // forward slash means the root directory. If we have a website called helloworld.com it will be the base directory (home essentially).

// app.get('/chicken', (req, res) => {
//     res.send("Hello Chicken")
// }) 

// app.get('/chicken/:name', (req, res) => {
//     res.send(req.params)
// }) // To set a parameter need /: then parameter name. In this case by typing in /chicken/bob, returns a json with name: bob. 

// app.get('/example', (req, res) => {
//     res.sendStatus(418) // send status directly
// }) // good practice to add a status code where you can

// -------------------------------------------

// MiddleWare
//app.use((req, res, next) => {
//     console.log("I am a piece of Middleware")
//     next()
// })

// app.use((req, res, next) => {
//     console.log("I am also a piece of Middleware")
//     next()
// })
// -----------------------------------------

// Fruit APi
require('dotenv').config() //access to env file
const fruits = require("./fruits.json")
const express = require("express")
const app = express() // by convention server called app
const port = process.env.PORT //using env file

app.use(express.json()) // by convention use goes before the get statements. Get is also middleware just without the next keyword.

app.get('/', (req, res) => {
    res.send("Hello Fruit API")
})

app.get('/fruits', (req, res) => {
    res.send(fruits)
})

const getFruitindex = name => {
    //Take a lowercase fruitname and returns the index of the fruit or -1

    return fruits.findIndex((fruit) => fruit.name.toLowerCase() == name)
}

app.post('/fruits', (req, res) => {
    // Check if the fruit exists

    const fi = getFruitindex(req.body.name.toLowerCase())
    if (fi > -1) {
        res.status(409).send("The fruit already exists")
    } else {
        // Create an array of all ids
        const ids = fruits.map((fruit) => fruits.id)
        // Get the maximum ID
        let maxId = Math.max(...ids)
        // Increment the ID by one
        maxId++
        //Adjust ID to new maxID
        req.body.id = maxId

        fruits.push(req.body)
        res.status(201).send(req.body)
    }

    const fruit = req.body
    console.log(fruit) // This is good for debug
    res.send("New Fruit Created")
})

app.delete('/fruits/:name', (req, res) => {
    const fi = getFruitindex(req.params.name.toLowerCase())
    if (fi == -1) {
        // Fruit can not be found
        res.status(404).send("Fruit can not be found")
    } else {
        fruits.splice(fi, 1)
        res.sendStatus(200)
    }
})

app.get('/fruits/:name', (req, res) => {
    // res.send(`Return a fruit with ${req.params.name} name`)
    const name = req.params.name.toLowerCase() //Get the name of what I am searching for.

    // Search Fruits.json (fruit) to return fruit if the names match
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() == name)
    if (fruit == undefined) {
        // there is NO fruit
        res.status(404).send("The fruit doesn't exist")
    } else {
        // If the fruit is there
        res.send(fruit)
    }
})

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})



