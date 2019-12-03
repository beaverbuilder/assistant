import React, { useContext, useMemo } from 'react'
import { Button, Form, Nav, Page } from 'ui'
import { getFieldConfig } from './config'

export const useForm = ( {
	tabs = {},
	sections = {},
	fields = {},
	values = {},
	onSubmit = () => {},
	onChange = () => {},
	onReset = () => {},
	shouldHighlightChanges = true,
} ) => {
	const options = {
		onSubmit,
		onChange,
		onReset,
		shouldHighlightChanges,
	}
	const config = getFieldConfig( tabs, sections, fields )
	const formData = Form.useForm( config, options, values )
}
