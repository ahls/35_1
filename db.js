const {Client} = require("pg");
let DB_URI;

if (process.env.NODE_ENV ==="test")
{
    DB_URI = "postgresql:///biztime_test";
}
else
{
    DB_URI = "postgresql:///biztime"
}

let db = new Client(
    {
        connectionString: DB_URI
    }
);

db.connect();


// CREATE TABLE companies (
//     code text PRIMARY KEY,
//     name text NOT NULL UNIQUE,
//     description text
// );

// CREATE TABLE invoices (
//     id serial PRIMARY KEY,
//     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
//     amt float NOT NULL,
//     paid boolean DEFAULT false NOT NULL,
//     add_date date DEFAULT CURRENT_DATE NOT NULL,
//     paid_date date,
//     CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
// );



module.exports = db;    