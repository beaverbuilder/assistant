import React, { useContext, useMemo } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Nav, Page } from 'ui'
import { useFormData } from '../use-form-data'

export const useForm = ( {
	tabs = {},
	sections = {},
	fields = {},
	values = {},
	...options // See useFormData
} ) => {
	const config = getFieldConfig( tabs, sections, fields )
	const formData = useFormData( config, options, values )
}

const getTabsFieldConfig = tabs => {
	let config = {}
	Object.values( tabs ).map( tab => {
		if ( ! tab.sections ) {
			return
		}
		config = Object.assign( config, getSectionsFieldConfig( tab.sections ) )
	} )
	return config
}

const getSectionsFieldConfig = sections => {
	let config = {}
	Object.values( sections ).map( section => {
		if ( ! section.fields ) {
			return
		}
		config = Object.assign( config, section.fields )
	} )
	return config
}

const getFieldConfig = ( tabs, sections, fields ) => {
	let config = {}

	if ( Object.entries( tabs ).length ) {
		config = Object.assign( config, getTabsFieldConfig( tabs ) )
	} else if ( Object.entries( sections ).length ) {
		config = Object.assign( config, getSectionsFieldConfig( tabs ) )
	} else {
		config = fields
	}

	return config
}
