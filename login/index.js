const express = require("express");
const fs = require("fs/promises");
const app = express();
app.use(express.json());
const users = require("./users");

const { Kafka } = require("kafkajs");

console.log("KAFKA_HOST: ", process.env.KAFKA_HOST);
const kafka = new Kafka({
  clientId: "login",
  brokers: [`${process.env.KAFKA_HOST}:9092`],
});

const producer = kafka.producer();

app.post("/login", async function (req, res) {
  const user = req.body.user;
  const pass = req.body.pass;
  const blockedUsersFile = await fs.readFile("/blockedUsers.json", "utf-8");
  const blockedUsers = JSON.parse(blockedUsersFile);
  if (blockedUsers.find((blockedUser) => blockedUser == user)) {
    return res.json({ login: false, error: "user blocked" });
  }

  const validar = validacion(user, pass);

  await producer.connect();
  await producer.send({
    topic: "login",
    messages: [
      {
        value: JSON.stringify({
          user,
          validation: validar,
        }),
      },
    ],
  });

  if (validar) {
    res.json({ login: true });
  } else {
    res.status(401).json({ login: false, error: "incorrect credentials" });
  }
});

function validacion(user, pass) {
  const userData = users.find((x) => x.user == user);
  const passData = userData?.pass;
  if (userData?.user == user && passData == pass) {
    return true;
  } else {
    return false;
  }
}

app.listen(3000);
