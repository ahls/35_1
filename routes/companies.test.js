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
    await db.query(`DELETE FROM companies;
                    DELETE FROM invoices;`)
})
afterAll(async()=>{
    await db.end();
})

describe("name",()=>{
    test("get all",async ()=>
    {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body.length === 2);
    })
    test("get a specific company using code", async ()=>
    {
        const res = await request(app).get('/companies/apple');
        expect(res.statusCode).toBe(200);
        expect(res.body.length === 1);
        expect(res.body.company.code).toBe("apple");
        expect(res.body.company.name).toBe("Apple Computer");
        expect(res.body.company.description).toBe("Maker of OSX.");
        
    })
    test("get a specific company using wrong code", async ()=>
    {
        const res = await request(app).get('/companies/pear');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
        
    })
    test("post a new company",async()=>
    {
        const newCompany = {
            code: 'msft',
            name: 'Microsoft',
            description: 'Maker of Windows.'
        }
        const res = await request(app).post('/companies').send(newCompany);
        expect(res.statusCode).toBe(201);
        expect(res.body.company.code).toBe('msft')
    })
    test("delete a company",async()=>
    {
        const res = await request(app).delete('/companies/apple');
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('deleted');
        
        
        const res2 = await request(app).get('/companies')
        expect(res2.statusCode).toBe(200);
        expect(res2.body.length === 1);
    })
    test("update a company",async()=>
    {
        const newCompany = {
            code: 'apple',
            name: 'rotten apple',
            description: 'rotten.'
        }
        const res = await request(app).put('/companies/apple').send(newCompany);
        expect(res.statusCode).toBe(200);
        
        const res2 = await request(app).get('/companies/apple');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.length === 1);
        expect(res2.body.company.code).toBe("apple");
        expect(res2.body.company.name).toBe("rotten apple");
        expect(res2.body.company.description).toBe("rotten.");
    })
})