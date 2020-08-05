import { __ } from '@wordpress/i18n'

export const getSections = ( sections ) => {
	return {
		...sections,
	}
}

export const getActions = () => {

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

export const getDefaults = ( defaults ) => {
	return {
		...defaults,
	}
}

export const getData = ( values, data ) => {
	return data
}
