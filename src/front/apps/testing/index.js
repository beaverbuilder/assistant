import React, { Fragment } from 'react'
import { Separator, Padding, Heading } from 'components'
import { getSystemActions } from 'store'
const { registerApp } = getSystemActions()

registerApp( 'testing', {
    content: () => {
        return (
            <Fragment>
                <Padding>
                    <Heading>Dots</Heading>
                    <p>Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.</p>
                </Padding>
                <Separator appearance="dots" />
                <Padding>
                    <Heading>Dots Compact</Heading>
                    <p>Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.</p>
                </Padding>
                <Separator appearance="dots-compact" />
                <Padding>
                    <Heading>Stripes</Heading>
                    <p>Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.</p>
                </Padding>
                <Separator appearance="stripes" />
                <Padding>
                    <Heading>Stripes Compact</Heading>
                    <p>Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.</p>
                </Padding>
                <Separator appearance="stripes-compact" />
            </Fragment>
        )
    }
})
