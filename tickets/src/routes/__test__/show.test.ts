import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns 404 when not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns ticket when found", async () => {
  const title = "concert";
  const price = 20;

  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
