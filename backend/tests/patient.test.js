const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");


beforeEach(async () => {
    await mongoose
    .connect('mongodb://localhost:27017/fyp-test-project');
});

/* Test Case for patient signup with valid credentials */

describe("POST /patient/create", () => {
    it("should create an account for patient", async () => {

        const name="patient"
        const email="patient@gmail.com"
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/patient/create")
        .send(body);

        expect(response.statusCode).toBe(200);

    });
});

/* Test Case for patient signup with empty username */

describe("POST /patient/create", () => {
    it("should return an error that name is required", async () => {

        const name=""
        const email="patient@gmail.com"
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/patient/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Name is required");

    });
});

/* Test Case for patient signup with empty email */

describe("POST /patient/create", () => {
    it("should return an error that email is required", async () => {

        const name="patient"
        const email=""
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/patient/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Email is required");

    });
});

/* Test Case for patient signup with empty password */

describe("POST /patient/create", () => {
    it("should return an error that password is required", async () => {

        const name="patient"
        const email="patient@gmail.com"
        const password=""

        const body = {name, email, password }

        const response = await request(app)
        .post("/patient/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password is required");

    });
});

/* Test Case for patient signup with password length less than 6 */

describe("POST /patient/create", () => {
    it("should return an error that password length should be atleast 6 characters", async () => {

        const name="patient"
        const email="patient@gmail.com"
        const password="1234"

        const body = {name, email, password }

        const response = await request(app)
        .post("/patient/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password Length should be atleast 6 characters");

    });
});

/* Test Case for patient signup with already registered email */

describe("POST /patient/create", () => {
    it("should return an error that email is already registered", async () => {

        const name="patient"
        const email="patient@gmail.com"
        const password="123456"

        const body = {name, email, password }

        const response = await request(app)
        .post("/patient/create")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("This email is already registered");

    });
});

/* Test Case for patient signin with valid credentials */

describe("POST /patient/signin", () => {
    it("should login patient", async () => {

        const email="patient@gmail.com"
        const password="123456"

        const body = { email, password }

        const response = await request(app)
        .post("/patient/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(200);

    });
});

/* Test Case for patient signin with empty email */

describe("POST /patient/signin", () => {
    it("should return an error that email is required", async () => {

        const email=""
        const password="123456"

        const body = { email, password }

        const response = await request(app)
        .post("/patient/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Email is required");

    });
});

/* Test Case for patient signin with empty password */

describe("POST /patient/signin", () => {
    it("should return an error that password is required", async () => {

        const email="patient@gmail.com"
        const password=""

        const body = { email, password }

        const response = await request(app)
        .post("/patient/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password is required");

    });
});

/* Test Case for patient signin with password length less than 6 */

describe("POST /patient/signin", () => {
    it("should return an error that password length should be atleast 6 characters", async () => {

        const email="patient@gmail.com"
        const password="1234"

        const body = { email, password }

        const response = await request(app)
        .post("/patient/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Password Length should be atleast 6 characters");

    });
});


/* Test Case for patient signin with invalid credentials */

describe("POST /patient/signin", () => {
    it("should return an error that password length should be atleast 6 characters", async () => {

        const email="patient@gmail.com"
        const password="12345678"

        const body = { email, password }

        const response = await request(app)
        .post("/patient/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Incorrect Email/Password");

    });
});

/* Test Case for patient signin with email not registered */

describe("POST /patient/signin", () => {
    it("should return an error that email is not registered", async () => {

        const email="patientnotregistred@gmail.com"
        const password="123456"

        const body = { email, password }

        const response = await request(app)
        .post("/patient/signin")
        .send(body);

        const error = JSON.parse(response.text)
        
        expect(response.statusCode).toBe(401);
        expect(error.error).toBe("Patient Email not registered");

    });
});

afterAll(async () => {
    await mongoose.connection.close();
});