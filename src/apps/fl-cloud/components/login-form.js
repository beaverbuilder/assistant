import React, {useState} from 'fl-react'

import {useSystemState, getSystemActions} from "assistant/store"

import cloud from 'assistant/cloud';

export default function LoginForm(props) {

    const [errors, setErrors] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {doingLogin} = useSystemState();
    const {setDoingLogin, setCloudToken, setIsCloudConnected} = getSystemActions();

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();

            setDoingLogin(true);

            cloud.auth.login(email, password)
                .then((token) => {
                    setCloudToken(token);
                    setIsCloudConnected(true);
                })
                .catch(error => {

                    const errorMessages = [];

                    if(error.status == 401 ) {
                        errorMessages.push("Invalid Credentials");
                    }

                    setErrors(errorMessages);
                    setIsCloudConnected(false);
                })
                .finally(() => setDoingLogin(false));

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
