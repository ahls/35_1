const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/',async (req,res,next)=>
{
    const result = await db.query(
        'SELECT * FROM companies'
    ); 
    return res.json(result.rows);
})
router.get('/:code',async (req,res,next)=>
{
    const result = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [req.params.code]);
    if (result.rows.length == 0)
        return res.status(404).json({error: 'Not Found'});
    res.json({company: result.rows[0]});
})
router.post('/',async (req,res,next)=>
{  
    const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
    [req.body.code, req.body.name, req.body.description]);
    res.status(201).json({company: result.rows[0]});

})
router.put('/:code', async (req, res, next) => {
    const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', 
      [req.body.name, req.body.description, req.params.code]);
    if (result.rows.length == 0) 
        return res.status(404).json({error: 'Not Found'});
    res.json({company: result.rows[0]});
  });
router.delete('/:code',async (req,res,next)=>
{
    const result = await db.query('DELETE FROM companies WHERE code=$1 RETURNING code', [req.params.code]);
    if (result.rows.length == 0) 
        return res.status(404).json({error: 'Not Found'});
    res.json({msg: 'deleted'});
})

module.exports=router;
