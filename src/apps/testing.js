import React, { Fragment } from '@assistant/react'
import { getSystemActions } from '@assistant/store'
import { ScreenHeader, Padding, Branding } from '@assistant/components'
const { registerApp } = getSystemActions()

registerApp( 'branding-test', {
	label: 'Branding Tests',
	content: () => (
		<Fragment>
			<ScreenHeader />
			<Padding>
				<Branding />
			</Padding>
			<Padding>
				<Branding name="outline" />
			</Padding>
			<Padding style={{ color: 'var(--fl-accent-color)' }}>
				<Branding name="outline" />
			</Padding>
		</Fragment>
	),
} )
