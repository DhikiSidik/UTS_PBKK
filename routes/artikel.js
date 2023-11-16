const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

// Menampilkan data
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM artikel ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Artikel',
                data: rows
            })
        }
    });
});

// Input Data
router.post('/store', [

    body('tittle').notEmpty(),
    body('date').notEmpty(),
    body('image').notEmpty(),
    body('content').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        tittle: req.body.tittle,
        date: req.body.date,
        image: req.body.image,
        content: req.body.content
    }

    // insert query
    connection.query('INSERT INTO artikel SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            })
        }
    })

});

// Menampilkan data berdasarkan ID
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM artikel WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Artikel Not Found!',
            })
        }
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data Artikel',
                data: rows[0]
            })
        }
    })
})

// Update data
router.patch('/update/:id', [

    //validation
    body('tittle').notEmpty(),
    body('date').notEmpty(),
    body('image').notEmpty(),
    body('content').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id mahasiswa
    let id = req.params.id;

    //data mahasiswa
    let formData = {
        tittle: req.body.tittle,
        date: req.body.date,
        image: req.body.image,
        content: req.body.content
    }

    // update query
    connection.query(`UPDATE artikel SET ? WHERE id = ${id}`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!'
            })
        }
    })

});

// Delete data
router.delete('/delete/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`DELETE FROM artikel WHERE id = ${id}`, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    })
});

module.exports = router;
