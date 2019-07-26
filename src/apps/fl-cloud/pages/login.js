import React, {useState, Fragment} from 'fl-react'
import PropTypes from 'prop-types';
import {Button, Icon} from 'assistant/lib'

export const LoginPage = (props) => {

    const {doLogin, errors} = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doingLogin, setDoingLogin] = useState(false);


    const handleSubmit = (event) => {

        setDoingLogin(true);

        doLogin(email, password);

        event.preventDefault();
    }

    return (
        <Fragment>
            <Icon.Pencil size={75}/>
            {doingLogin && (<p>Authenticating...</p>)}
            {!doingLogin && (
                <form onSubmit={handleSubmit}>
                    <p className="center-text">You are not currently connected to Assistant Cloud</p>
                    <div className="errors">
                        {
                            (errors !== null && errors.map((error, index) => {
                                return (
                                    <li key={index}>{error}</li>
                                )
                            }))
                        }
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email"
                               name="email"
                               onChange={e => {
                                   setEmail(e.target.value)
                               }}
                               value={email}
                               required/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password"
                               name="password"
                               onChange={e => {
                                   setPassword(e.target.value);
                               }}
                               value={password}/>
                    </div>
                    <div>
                        <Button type="submit" className="fl-asst-cloud-connect-button">Connect</Button>
                    </div>
                </form>
            )}
        </Fragment>
    )

};

LoginPage.propTypes = {
    doLogin: PropTypes.func.isRequired,
    errors: PropTypes.array
}
