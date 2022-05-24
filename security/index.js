const express = require("express");
const fs = require("fs/promises");
const app = express();
app.use(express.json());
const incorrectLogins = {};

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "security",
  brokers: [`${process.env.KAFKA_HOST}:9092`],
});

const consumer = kafka.consumer({ groupId: "security-group" });

app.get("/blocked", async function (req, res) {
  const blockedUsersFile = await fs.readFile("/blockedUsers.json", "utf-8");
  const blockedUsers = JSON.parse(blockedUsersFile);
  res.json({
    "users-blocked": blockedUsers,
  });
});

app.listen(5000, async function () {
  await consumer.connect();
  await consumer.subscribe({ topic: "login", fromBeginning: true });
  console.log("listening in port 5000");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());
      const { timestamp } = message;
      const { user, validation } = value;
      const blockedUsersFile = await fs.readFile("/blockedUsers.json", "utf-8");
      const blockedUsers = JSON.parse(blockedUsersFile);
      if (blockedUsers.find((blockedUser) => blockedUser == user)) {
        return;
      }
      if (!validation) {
        if (!incorrectLogins[user]) {
          incorrectLogins[user] = [Number(timestamp)];
        } else {
          incorrectLogins[user].push(Number(timestamp));
          const incorrectLoginsLength = incorrectLogins[user].length;
          if (incorrectLoginsLength >= 5) {
            if (
              incorrectLogins[user][incorrectLoginsLength - 1] -
                incorrectLogins[user][0] <=
              60 * 1000
            ) {
              blockedUsers.push(user);
              await fs.writeFile(
                "/blockedUsers.json",
                JSON.stringify(blockedUsers)
              );
            } else {
              incorrectLogins[user].shift();
            }
          }
        }
      } else {
        incorrectLogins[user] = [];
      }
    },
  });
});
