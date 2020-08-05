import { __ } from '@wordpress/i18n'

export const getSections = ( item, sections ) => {
	return {
		...sections,
	}
}

export const getActions = ( item ) => {

	const importImage = () => {

	}

	const replaceImage = () => {

	}

	return [
		{
			label: __( 'Import' ),
			onClick: importImage,
		},
		{
			label: __( 'Replace File' ),
			onClick: replaceImage,
		}
	]
}

export const getDefaults = ( item, defaults ) => {
	return {
		...defaults,
	}
}

export const getData = ( item, values, data ) => {
	return data
}
