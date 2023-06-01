const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");


beforeEach(async () => {
    await mongoose
    .connect('mongodb://localhost:27017/fyp-test-project');
});

/* Test Case for doctor signup with valid credentials */

describe("POST /doctor/create", () => {
    it("should create an account for doctor", async () => {

        const name="doctor"
        const email="doctor@gmail.com"
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/doctor/create")
        .send(body);

        expect(response.statusCode).toBe(200);

    });
});

/* Test Case for doctor signup with empty username */

describe("POST /doctor/create", () => {
    it("should return an error that name is required", async () => {

        const name=""
        const email="doctor@gmail.com"
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/doctor/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Name is required");

    });
});

/* Test Case for doctor signup with empty email */

describe("POST /doctor/create", () => {
    it("should return an error that email is required", async () => {

        const name="doctor"
        const email=""
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/doctor/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Email is required");

    });
});

/* Test Case for doctor signup with empty password */

describe("POST /doctor/create", () => {
    it("should return an error that password is required", async () => {

        const name="doctor"
        const email="doctor@gmail.com"
        const password=""

        const body = {name, email, password }

        const response = await request(app)
        .post("/doctor/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password is required");

    });
});

/* Test Case for doctor signup with password length less than 6 */

describe("POST /doctor/create", () => {
    it("should return an error that password length should be atleast 6 characters", async () => {

        const name="doctor"
        const email="doctor@gmail.com"
        const password="1234"

        const body = {name, email, password }

        const response = await request(app)
        .post("/doctor/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password Length should be atleast 6 characters");

    });
});

/* Test Case for doctor signup with already registered email */

describe("POST /doctor/create", () => {
    it("should return an error that email is already registered", async () => {

        const name="doctor"
        const email="doctor@gmail.com"
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/doctor/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("This email is already registered");

    });
});

/* Test Case for doctor signin with valid credentials */

describe("POST /doctor/signin", () => {
    it("should login doctor", async () => {

        const email="doctor@gmail.com"
        const password="123456"

        const body = { email, password }

        const response = await request(app)
        .post("/doctor/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(200);

    });
});

/* Test Case for doctor signin with empty email */

describe("POST /doctor/signin", () => {
    it("should return an error that email is required", async () => {

        const email=""
        const password="123456"

        const body = { email, password }

        const response = await request(app)
        .post("/doctor/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Email is required");

    });
});

/* Test Case for doctor signin with empty password */

describe("POST /doctor/signin", () => {
    it("should return an error that password is required", async () => {

        const email="doctor@gmail.com"
        const password=""

        const body = { email, password }

        const response = await request(app)
        .post("/doctor/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password is required");

    });
});

/* Test Case for doctor signin with password length less than 6 */

describe("POST /doctor/signin", () => {
    it("should return an error that password length should be atleast 6 characters", async () => {

        const email="doctor@gmail.com"
        const password="1234"

        const body = { email, password }

        const response = await request(app)
        .post("/doctor/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password Length should be atleast 6 characters");

    });
});


/* Test Case for doctor signin with invalid credentials */

describe("POST /doctor/signin", () => {
    it("should return an error that password length should be atleast 6 characters", async () => {

        const email="doctor@gmail.com"
        const password="12345678"

        const body = { email, password }

        const response = await request(app)
        .post("/doctor/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Incorrect Email/Password");

    });
});

afterAll(async () => {
    await mongoose.connection.close();
});


/* Test Case for doctor signin with email not registered */

describe("POST /doctor/signin", () => {
    it("should return an error that email is not registered", async () => {

        const email="doctornotregistred@gmail.com"
        const password="123456"

        const body = { email, password }

        const response = await request(app)
        .post("/doctor/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Doctor Email not registered");

    });
});

afterAll(async () => {
    await mongoose.connection.close();
});