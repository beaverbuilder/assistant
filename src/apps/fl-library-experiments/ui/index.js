import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import cloudTest from '@beaverbuilder/cloud'

export const Main = () => {

    cloudTest()

    return (
        <Page
            title={__('Libraries yo')}
        >Main yo</Page>
    )
}
