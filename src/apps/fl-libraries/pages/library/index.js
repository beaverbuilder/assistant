import React from 'react'
import { Page } from 'assistant/ui'
import { useParams } from 'react-router-dom'
import { useLibrary } from '../../data'
import cloud from 'assistant/utils/cloud'

export default () => {
    const { id } = useParams()
    const { name } = useLibrary( id )

    if ( '' === name ) return <Page.Loading />

    return (
        <Page title={name}>
            <p>I am a library. I'll have stuff here later.</p>
        </Page>
    )
}
