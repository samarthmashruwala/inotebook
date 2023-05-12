import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {

  const host = 'http://localhost:5000'
  let initalnote = []
  const [notes, setNotes] = useState(initalnote);

  // get all Note
  const getNotes = async () => {
    // API calls:
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json)
  }


  // Add a Note
  const addNote = async (title, description, tag) => {
    // API calls:
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });

    // Logic for add a new Note
    const note = await response.json();
    setNotes(notes.concat(note));

  }

  // delete a Note
  const deleteNote = async (id) => {
    // API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    console.log(json);


    // Logic for delete Note
    console.log("delete" + id);
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
  }

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API calls:
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    // Logic to edit in Client:
    let updatedNote = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < notes.length; index++) {
      const element = updatedNote[index];
      if (element._id === id) {
        updatedNote[index].title = title;
        updatedNote[index].description = description;
        updatedNote[index].tag = tag;
        break;
      }
    }
    console.log(id);
    setNotes(updatedNote);
  }

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;