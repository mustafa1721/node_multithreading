const express = require('express')
const { Worker, workerData } = require('worker_threads')
const port = 3000
const app = express()
const THREAD_COUNT = 2

app.use(express())

app.get('/non-blocking', (req, res) => {
    res.status(200).send("Non blocking page")
});

function createWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./one_worker.js', {
            workerData: { thread_count: THREAD_COUNT }
        })
        worker.on('message', (data) => {
            resolve(data)
        })
        worker.on('error', (error) => {
            reject(error)
        })
    });
}
app.get('/blocking', async (req, res) => {

    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker())
    }
    const thread_results = await Promise.all(workerPromises)
    const total = thread_results[0] + thread_results[1]
    res.status(200).send(`result is ${total}`)
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})