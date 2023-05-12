import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const Noteitems = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;

    const handleDeleteClick = () => {
        deleteNote(note._id)
        props.showAlert("Deleted successfully","success");
    }

    const handleUpdateClick=()=>{
        updateNote(note)
    }

    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description} </p>
                    <button style={{ "border": "none", "background": "white" }} onClick={handleDeleteClick}>
                        <i className="fa fa-trash icon1" ></i>
                    </button>
                    <button style={{ "border": "none", "background": "white" }} onClick={handleUpdateClick}>
                        <i className="fa-regular fa-pen-to-square mx-2 icon1"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Noteitems
