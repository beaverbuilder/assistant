import React, {useState, useEffect} from 'fl-react'
import {Switch, Route, Redirect, Link, withRouter} from 'fl-react-router-dom'
import {App, Page, Icon} from 'assistant/lib'

import assistantCloud from 'assistant/cloud'
import './style.scss'


export const Cloud = ({match}) => {
    const {url} = match
    return (
        <Switch>
            <Route exact path={`${url}/`} component={NotConnectedScreen}/>
            <Route path={`${url}/connected`} component={ConnectedScreen}/>
        </Switch>
    )
}

Cloud.Icon = () => {
    return (
        <svg width="32px" height="20px" viewBox="0 0 32 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="currentColor" strokeWidth="2">
                <path
                    d="M5.7447619,18.7928571 C8.11714286,18.7928571 22.3514286,18.7928571 24.7238095,18.7928571 C27.0961905,18.7928571 30.6547619,16.9522167 30.6547619,12.6573892 C30.6547619,8.36256158 26.5030952,7.74901478 25.3169048,7.74901478 C25.3169048,4.06773399 22.3514286,1 19.3859524,1 C16.4204762,1 13.455,3.45418719 13.455,5.29482759 C11.6757143,4.06773399 6.93095238,5.29482759 6.93095238,8.97610837 C3.96547619,8.36256158 1,10.8167488 1,13.8844828 C1,16.9522167 3.37238095,18.7928571 5.7447619,18.7928571 Z"></path>
            </g>
        </svg>
    )
}

const LoginForm = withRouter(({history}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();

            assistantCloud.auth.login(email, password)
                .then((user) => {
                    console.log(user, 'logged in user');
                    history.push('/fl-cloud/connected')
                })
                .catch((err) => {
                    console.log(err, 'problem logging in');
                });

        }
    }

    return (
        <form onSubmit={handleSubmit}>
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
});

const NotConnectedScreen = () => {

    return assistantCloud.auth.isConnected() ? (
        <Redirect to="/fl-cloud/connected"></Redirect>
    ) : (
        <Page className="fl-app-cloud">
            <Icon.Pencil size={75}/>
            <p className="center-text">You are not currently connected to Assistant Cloud</p>
            <LoginForm/>
        </Page>
    )

	return (
		<Page className="fl-app-cloud">
			<Icon.Pencil size={75} />
			<p className="center-text">You are not currently connected to Assistant Cloud</p>
			<Nav.AppLink to="/connected" className="fl-asst-cloud-connect-button">Connect</Nav.AppLink>
		</Page>
	)
}

const ConnectedScreen = withRouter(({history}) => {

    const [user, setUser] = useState({})
    const [auth, setAuth] = useState({})

    const disconnect = () => {
        assistantCloud.auth.logout().then(() => {
            history.push('/fl-cloud/');
        })
    }

    useEffect(() => {

        const auth = assistantCloud.auth.getToken()
        const user = assistantCloud.auth.getUser()

        setAuth(auth);
        setUser(user);

    }, []);

    return (
        <Page className="fl-app-cloud">
            <p className="center-text">Congrats! You're connected now.</p>
            <div style={{maxWidth: '90%', margin: 'auto'}}>
                <pre>{JSON.stringify(user, null, 4)}</pre>
                <pre>{JSON.stringify(auth, null, 4)}</pre>
            </div>
            <button className='fl-asst-cloud-connect-button' onClick={disconnect}>Disconnect</button>
        </Page>
    )
});
