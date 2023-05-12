import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext'
import AddNote from './AddNote';
import Noteitems from './Noteitems';
import { useNavigate } from 'react-router-dom';

function Notes(props) {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){
      console.log(localStorage.getItem('token'));
      getNotes();
    }
    else{
      navigate("/login")
    }
    // eslint-disable-next-line
  }, [])
  const ref = useRef(null);
  const refClose = useRef(null)
  const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""})

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag})
  }


    const handleUpdateNoteclick=(e)=>{
        editNote(note.id,note.etitle,note.edescription,note.etag)
        e.preventDefault();
        refClose.current.click();
        props.showAlert("Updated successfully","success");
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">title</label>
                  <input type="text" className="form-control" id="etitle" name='etitle' value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">description</label>
                  <input type="text" className="form-control" id="edescription" value={note.edescription} name='edescription' onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">tag</label>
                  <input type="text" className="form-control" id="etag" value={note.etag} name='etag' onChange={onChange} minLength={5} required/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleUpdateNoteclick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">
          {notes.length===0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return <Noteitems key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert}/>
        })}
      </div>
    </>
  )
}

export default Notes
