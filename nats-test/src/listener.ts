import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected ");

  stan.on("close", () => {
    console.log("connection closed");
    process.exit();
  });
  // manual acknowledge to process the message
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // gimme all events that has been sent
    .setDurableName("accounting-service"); // which I did't recieved
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log("sequence number", msg.getSequence(), JSON.parse(data));
    }

    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
