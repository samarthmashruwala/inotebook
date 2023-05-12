import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    let navigate = useNavigate();
    const [creds, setCreds] = useState({name:"", email: "", password: "", cpassword:"" })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:creds.name, email: creds.email, password: creds.password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // save the auth token and redict to notes
            localStorage.setItem('token', json.authToken);
            navigate("/")
            props.showAlert("Account created successfully.","success");
        }
        else {
            props.showAlert("invalid details","danger");
        }
    }

    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-3'>
                <h2 className='my-2'>create an account to use iNoteook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">name</label>
                    <input type="text" className="form-control" id="name" name="name" value={creds.name} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={creds.email} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={creds.password} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" value={creds.cpassword} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
