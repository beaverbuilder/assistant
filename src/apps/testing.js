import React, { Fragment } from '@assistant/react'
import { getSystemActions } from '@assistant/store'
import { ScreenHeader } from '@assistant/components'
const { registerApp } = getSystemActions()

registerApp( 'different-test', {
	label: 'Testing Screen',
	content: () => (
        <Fragment>
            <ScreenHeader />
            Howdy!
        </Fragment>
    ),
} )
