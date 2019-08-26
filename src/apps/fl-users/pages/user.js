import {__} from "@wordpress/i18n";
import React, {useContext, useEffect, useState} from 'fl-react'
import {getSystemConfig} from 'assistant/data'
import {App, Page, Button} from 'assistant/lib'
import {getWpRest} from "assistant/utils/wordpress"
import {CancelToken} from "axios"

import {Summary} from "../components/user/summary"
import {GeneralTab} from "../components/user/general"
import {PreferencesTab} from "../components/user/preferences"
import {PostsTab} from "../components/user/posts"

export const User = ({match}) => {
    // const { handle } = useContext( App.Context )

    const wordpress = getWpRest()
    const userId = match.params.id

    const {currentUser} = getSystemConfig()

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({})
    const [title, setTitle] = useState('User Profile')
    const [currentTab, setCurrentTab] = useState(0)

    const source = CancelToken.source()

    useEffect(() => {

        setLoading(true)
        wordpress.users().findById(userId, {cancelToken: source.token})
            .then((response) => {
                setUser(response.data)
                setLoading(false)
            })

        if (parseInt(userId) === parseInt(currentUser.id)) {
            setTitle('Your Profile')
        }

        return () => {
            source.cancel()
        }

    }, [])

    const showTab = (tabIndex) => {
        switch (tabIndex) {
            case 2:
                return (<PostsTab user={user}/>)
            case 1:
                return (<PreferencesTab user={user}/>)
            case 0:
            default:
                return (<GeneralTab user={user}/>)
        }
    }


    if (loading) {
        return (<p>Loading...</p>)
    } else {
        return (
            <Page shouldPadSides={false} title={title}>
                <Summary user={user}/>
                <Button.Group>
                    <Button isSelected={currentTab == 0} onClick={e => setCurrentTab(0)}>General</Button>
                    <Button isSelected={currentTab == 1} onClick={e => setCurrentTab(1)}>Preferences</Button>
                    <Button isSelected={currentTab == 2} onClick={e => setCurrentTab(2)}>Posts</Button>
                </Button.Group>
                {showTab(currentTab)}
            </Page>
        )
    }
}
