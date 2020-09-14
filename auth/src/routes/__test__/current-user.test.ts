import request from "supertest";
import app from "../../app";

it("gets the current user when signed in", async () => {
  const agent = await global.signin();

  const response = await agent.get("/api/users/currentuser").send().expect(200);

  expect(response.body.currentUser.email).toBe("test@test.com");
});

it("responds null when not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toBe(null);
});
