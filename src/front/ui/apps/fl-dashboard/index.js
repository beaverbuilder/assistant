import React, { Fragment } from 'react'
import { CurrentlyViewing } from './currently-viewing'
import { Separator } from 'components'

export const DashboardTab = props => {
    return (
        <Fragment>
			<CurrentlyViewing />
            <Separator />
		</Fragment>
    )
}
