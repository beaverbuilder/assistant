import { __ } from '@wordpress/i18n'

export const getSections = ( sections ) => {
	return {
		...sections,
	}
}

export const getActions = () => {

	const importImage = () => {

	}

	return [
		{
			label: __( 'Import' ),
			onClick: importImage,
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
