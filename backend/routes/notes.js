const express = require('express');
const router = express.Router();
const Notes = require("../models/Notes")
const fetchuser = require("../middleware/fetchuser")
// for validating the credentials
const { body, validationResult } = require('express-validator');

//ROUTE 1: get all notes using: GET '/api/notes/fetchallnotes'. log in require notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.send(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error")
    }

})
//ROUTE 2: adding a note using: POST '/api/notes/addnote'. log in require notes
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const { title, description, tag } = req.body;

    // if there are errors,return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.send(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error")
    }

})

//ROUTE 3: updating the existing note using: PUT '/api/notes/updatenote'. log in require notes
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create a new note
        const newNote = {}; 
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        // if there no note exist with the given id.
        if (!note) { return res.status(404).send("not found") }
        // if the user id not matched with given id.
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error")
    }
})
//ROUTE 4: deleting the existing note using: DELETE '/api/notes/deletenote'. log in require notes
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find note to be deleted and delete it.
        let note = await Notes.findById(req.params.id);
        // if there no note exist with the given id.
        if (!note) { return res.status(404).send("not found") }
        // if the user id not matched with given id.
        // allow deletion if the user own particular note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error")
    }
})

module.exports = router