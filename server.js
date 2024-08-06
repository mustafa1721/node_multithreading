const express = require('express')
const { Worker } = require('worker_threads')
const port = 3000
const app = express()
app.use(express())

app.get('/non-blocking', (req, res) => {
    res.status(200).send("Non blocking page")
})

app.get('/blocking', (req, res) => {

    const worker = new Worker('./worker.js')

    worker.on("message", (data) => {
        res.status(200).send(`result is ${data}`)
    });

    worker.on("error", (error) => {
        res.status(400).send(`An error occured:${error}`)
    });

})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})