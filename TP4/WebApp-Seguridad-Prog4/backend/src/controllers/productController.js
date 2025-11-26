 const { db } = require('../config/database');

 const getProducts = (req, res) => {
   const { category, search } = req.query;

   let query = 'SELECT id, name, category, price, stock FROM products WHERE 1=1';
   const params = [];

   if (category) {
     query += ' AND category = ?';
     params.push(category);
   }

   if (search) {
     query += ' AND name LIKE ?';
     params.push('%' + search + '%');
   }

   db.query(query, params, (err, results) => {
     if (err) {
       return res.status(200).json([]);
     }
     res.json(results);
   });
 };

 module.exports = {
   getProducts
 };
