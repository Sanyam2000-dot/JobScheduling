const express = require('express')
const {Queue}  = require('bullmq')

const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const cors = require('cors');
const bodyParser = require('body-parser')






const app = express()
const port = 3000
const serverAdapter = new ExpressAdapter();
app.use(bodyParser.json());
 

const queue = new Queue("Test", {
    connection: {
        host: "127.0.0.1",
        port: 6379
      },
})

createBullBoard({
    queues: [new BullMQAdapter(queue)],
    serverAdapter: serverAdapter,
  });
serverAdapter.setBasePath('/queues');

app.use('/queues', serverAdapter.getRouter());
app.use(cors({
    origin: 'http://localhost:3001'
}));


app.get('/addToQueue', (req,res) => {
    queue.add("testing",{name: 'sanyam' })
    res.send('queue added')
})


app.get('/fetchQueue', async (req,res) => {
    const jobs =  await queue.getJobs(["active", "waiting", "delayed", "completed"])
    console.log('jobs', jobs)
    res.send(JSON.stringify(jobs))
})

app.post('/addToQueueDelay', async(req, res) => {
    console.log('req here', req.body)
    let targetTimeTemp  = req.body.targetTime
    targetTimeTemp = targetTimeTemp.split("+")[0]
    // const targetTime = new Date('2023-07-23T15:32:00');
    let  targetTime = new Date(targetTimeTemp);

    console.log('target time', targetTime)
    const delay = Number(targetTime) - Number(new Date());
    console.log('delay time', delay)

    await queue.add('testing', { lastName: 'Mehendiratta' }, { delay });
    res.send('queue added with delay')
})


app.post('/addToQueueCrone', async(req, res) => {
    console.log('req here addToQueueCrone', req.body)

    let {daySelected, endDateBool, repeatEvery, endDate,frequency } = req.body
    

   
    // 5 4 * * 3
    await queue.add('testing', { Gadget: 'MacBook Pro' },
     {
        repeat: {
          pattern: '* * * * *',
        },
      },
      );
    res.send('queue added with crone')
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})