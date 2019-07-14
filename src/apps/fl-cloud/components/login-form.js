import React, {useState} from 'fl-react'

import {useSystemState, getSystemActions} from "assistant/store"


export default function LoginForm(props) {

    const {doingLogin, errors, notices} = useSystemState();
    const {doLogin} = getSystemActions();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();

            doLogin(email, password);

        }
    }


    return doingLogin ? (
        <p>Loading...</p>
    ) : (
        <form onSubmit={handleSubmit}>
            {(errors.length > 0) && (
                <div class="errors">
                    {errors.map((error) => {
                        return (
                            <li>{error}</li>
                        )
                    })
                    }
                </div>
            )}
            <div>
                <label>Email</label>
                <input type="email"
                       name="email"
                       onChange={e => setEmail(e.target.value)}
                       value={email}
                       required/>
            </div>
            <div>
                <label>Password</label>
                <input type="password"
                       name="password"
                       onChange={e => setPassword(e.target.value)}
                       value={password}/>
            </div>
            <div>
                <button type="submit" className="fl-asst-cloud-connect-button">Connect</button>
            </div>
        </form>
    )

};
