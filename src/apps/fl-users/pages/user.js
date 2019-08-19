import {__} from "@wordpress/i18n";
import React, { useContext, useEffect, useState } from 'fl-react'
import {getSystemConfig} from 'assistant/data'
import { App, Page, List } from 'assistant/lib'
import { getWpRest } from "assistant/utils/wordpress";
import { CancelToken } from "axios";

import { Summary } from "../components/user/summary";

export const User = ({match}) => {
    // const { handle } = useContext( App.Context )

    const wordpress = getWpRest()
    const userId = match.params.id

    const { currentUser } = getSystemConfig()

    const [user, setUser] = useState({
        id: match.params.id,
        email: null
    })

    const [title, setTitle] = useState('User Profile')

    const source = CancelToken.source()

    useEffect(() => {
        wordpress.users().findById(userId, { cancelToken: source.token })
            .then((response) => {
                setUser(response.data)
            })

        if (parseInt(userId) === parseInt(currentUser.id)) {
            setTitle('Your Profile')
        }

        return () => {
            source.cancel()
        }

    }, [])

    return (
        <Page shouldPadSides={ false } title={title}>
            <Summary user={user}/>

        </Page>
    )
}
