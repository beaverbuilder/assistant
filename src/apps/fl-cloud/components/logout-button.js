import React from 'fl-react'
import {useSystemState, getSystemActions} from "assistant/store"
import cloud from 'assistant/cloud';

export default function LogoutButton(props) {
    const {setCloudToken, setCloudUser, setDoingLogin, setIsCloudConnected} = getSystemActions();

    const disconnect = () => {
        cloud.auth.logout().then(() => {
            setDoingLogin(true);
            setCloudToken(null);
            setCloudUser(null);
            setIsCloudConnected(false);
            setDoingLogin(false);
        })
    }

    return (
        <button className='fl-asst-cloud-connect-button' onClick={disconnect}>Disconnect</button>
    )
}
