import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {

    let navigate = useNavigate();
    const [creds, setCreds] = useState({ email: "", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: creds.email, password: creds.password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // save the auth token and redict to notes
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully.", "success");
            navigate("/")
        }
        else {
            props.showAlert("invalid", "danger");
        }
    }

    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-3'>
            <h2 className='my-2'>Log in to continue to iNoteook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={creds.email} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={creds.password} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
