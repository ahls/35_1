process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

beforeEach(async()=>
{
    await db.query(`DELETE FROM companies;
    DELETE FROM invoices;`)
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

afterEach(async ()=>{
    await db.query(`DELETE FROM invoices;
                    TRUNCATE TABLE companies RESTART IDENTITY CASCADE;`);
})
afterAll(async()=>{
    await db.end();
})

describe("name",()=>{
    test("get all",async ()=>
    {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
        expect(res.body.length === 4);
    })
    test("get using code", async ()=>
    {
        const res1 = await request(app).get('/invoices')
        console.log(res1.body);
        const res = await request(app).get('/invoices/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.invoice.code).toBe("apple");
        expect(res.body.invoice.name).toBe("Apple Computer");
        expect(res.body.invoice.description).toBe("Maker of OSX.");
        expect(res.body.invoice.amt).toBe(100);
        expect(res.body.invoice.paid).toBe(false);
    })
    test("post a new invoice",async()=>
    {
        const newInvoice = {
            comp_code: 'apple',
            amt: 11,
            paid: false,
            paid_date: null
        }
        const res = await request(app).post('/invoices').send(newInvoice);
        expect(res.statusCode).toBe(201);
        expect(res.body.invoice.comp_code).toBe('apple')
        expect(res.body.invoice.amt).toBe(11)
        expect(res.body.invoice.paid).toBe(false)
    })
    test("delete an invoice",async()=>
    {
        const res = await request(app).delete('/invoices/2');
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('deleted');
        
        
        const res2 = await request(app).get('/invoices')
        expect(res2.statusCode).toBe(200);
        expect(res2.body.length === 1);
    })
})