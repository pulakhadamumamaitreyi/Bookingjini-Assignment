import request from "supertest";
import app from "../src/app";

describe("Rate Limiter", () => {

    it("should allow first request", async () => {

        const response = await request(app)
            .post("/check")
            .send({
                apiKey: "test-user",
                endpoint: "/users"
            });

        expect(response.status).toBe(200);

        expect(response.body.allowed).toBe(true);

    });

});import request from "supertest";
import app from "../src/app";

describe("Rate Limiter", () => {

    it("should allow first request", async () => {

        const response = await request(app)
            .post("/check")
            .send({
                apiKey: "test-user",
                endpoint: "/users"
            });

        expect(response.status).toBe(200);

        expect(response.body.allowed).toBe(true);

    });

});
