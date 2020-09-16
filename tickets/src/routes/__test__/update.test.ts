import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { Ticket } from "../../models/ticket";

it("returns 401 when not signedin", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).send({}).expect(401);
});

it("returns 404 when ticket not found", async () => {
  const cookie = global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({ title: "test", price: 22.5 })
    .expect(404);
});

it("returns 403 when the owner is not the current user", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 22.5 });

  const newCookie = global.signin();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", newCookie)
    .send({ title: "New Title", price: 30 })
    .expect(403);
});

it("returns 400 with invalid credentials", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 22.5 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 30 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asfg", price: -30 })
    .expect(400);
});

it("returns 200 with valid credentials", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 22.5 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "New Title", price: 30 })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual("New Title");
  expect(ticket.body.price).toEqual(30);
});
