import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'ui'

const ErrorPage = props => (
    <Page.Error
        message={__('There seems to be an issue with this app.')}
        {...props}
    />
)

export default ErrorPage
