const express = require('express')
const app = express()
app.use(express.json())
const usersBlocked = []

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'security',
  brokers: [`${process.env.KAFKA_HOST}:9092`]
})
const consumer = kafka.consumer({ groupId: 'security-group' })


app.get ('/blocked',async function(req,res){
    res.json({
        'users-blocked': usersBlocked
    })
})

app.listen (5000, async function(){
    await consumer.connect()
    await consumer.subscribe({ topic: 'login', fromBeginning: true })
    console.log('listening in port 5000')

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value,
          })
        },
      })
})

