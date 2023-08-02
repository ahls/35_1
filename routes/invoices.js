const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const result = await db.query('SELECT id, comp_code FROM invoices');
  res.json({invoices: result.rows});
});

router.get('/:id', async (req, res, next) => {
  const result = await db.query('SELECT i.id, i.amt, i.paid,i.add_date, c.code, c.name, c.description \
                                FROM invoices i \
                                JOIN companies c ON i.comp_code = c.code \
                                WHERE i.id = $1',                                                       
                                [req.params.id]);
  if (result.rows.length == 0)                                                                                              
    return res.status(404).json({error: 'Not Found'});
  res.json({invoice: result.rows[0]});
});

router.post('/', async (req, res, next) => {
  const result = await db.query('INSERT INTO invoices (comp_code, amt) \
                                VALUES ($1, $2) \
                                RETURNING id, comp_code, amt, paid, add_date, paid_date',
                                [req.body.comp_code, req.body.amt]);
  res.status(201).json({invoice: result.rows[0]});
});

router.put('/:id', async (req, res, next) => {
  const result = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 \
                                RETURNING id, comp_code, amt, paid, add_date, paid_date', 
                                [req.body.amt, req.params.id]);
  if (result.rows.length == 0) 
    return res.status(404).json({error: 'Not Found'});
  res.json({invoice: result.rows[0]});
});

router.delete('/:id', async (req, res, next) => {
  const result = await db.query('DELETE FROM invoices WHERE id=$1', [req.params.id]);
  if (result.rowCount == 0) 
    return res.status(404).json({error: 'Not Found'});
  res.json({status: 'deleted'});
});

module.exports = router;
