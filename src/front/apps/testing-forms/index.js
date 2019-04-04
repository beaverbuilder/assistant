import React from 'react'
import { __ } from '@wordpress/i18n'
import { FormTest } from 'components'
import { getSystemActions } from 'store'
const { registerApp } = getSystemActions()

registerApp( 'testing-forms', {
	label: __( 'Form Styling' ),
	content: <FormTest />,
	appearance: 'form'
} )
