
const {Worker}  = require('bullmq')


const workerHandler = (job) => {
    console.log('Job running...', job.data);
    return 'Successfully Completed'
}
new Worker("Test", workerHandler, {
    connection:  {
        host: "127.0.0.1",
        port: 6379
      },
})

