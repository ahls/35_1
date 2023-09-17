process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

beforeEach(async()=>
{
    const result = db.query(
        `INSERT INTO companies
         VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
            ('ibm', 'IBM', 'Big blue.');
    
         INSERT INTO invoices (comp_Code, amt, paid, paid_date)
         VALUES ('apple', 100, false, null),
            ('apple', 200, false, null),
            ('apple', 300, true, '2018-01-01'),
            ('ibm', 400, false, null);`)
})

afterEach(async()=>{
    await db.query(`DELETE FROM companies;
                    DELETE FROMinvoices;`)
})
afterAll(async()=>{
    await db.end();
})

describe("name",()=>{
    test("testName",()=>
    {

    })
})