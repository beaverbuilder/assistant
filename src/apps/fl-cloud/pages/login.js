import React, {useState, useEffect} from 'fl-react'

import {Page, Button, Icon} from 'assistant/lib'

import {Redirect, withRouter} from 'react-router-dom';

import {useSystemState, getSystemActions} from "assistant/store"

import cloud from 'assistant/cloud';

export const LoginPage = (props) => {

    const {doLogin, loginErrors} = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doingLogin, setDoingLogin] = useState(false);

    const handleSubmit = (event) => {

        event.preventDefault();

        setDoingLogin(true);

        doLogin(email, password);

        setDoingLogin(false);
    }


    return (
        <Page className="fl-app-cloud">
            <Icon.Pencil size={75}/>
            {doingLogin && (<p>Authenticating...</p>)}
            {!doingLogin && (
                <form onSubmit={handleSubmit}>
                    <p className="center-text">You are not currently connected to Assistant Cloud</p>
                    {(loginErrors.length > 0) && (
                        <div class="errors">
                            {
                                loginErrors.map((error) => {
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
                        <Button type="submit" className="fl-asst-cloud-connect-button">Connect</Button>
                    </div>
                </form>
            )}
        </Page>
    )

};
