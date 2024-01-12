import React, {useContext} from 'react';
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { note, updateNote } = props //destructuring
    const { deleteNote } = context //destructuring

    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                  	<i className="fa fa-trash-o mx-2" onClick={()=>{deleteNote(note._id); props.showAlert("Deleted successfully", "success")}}></i>
                    <i className="fa fa-pencil-square-o mx-2" onClick={()=>{updateNote(note); }}></i>
                </div>
            </div>
        </div>
    )
}

export default Noteitem