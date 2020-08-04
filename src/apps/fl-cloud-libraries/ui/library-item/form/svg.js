import { __ } from '@wordpress/i18n'

export const getSections = ( sections ) => {
	return {
		...sections,
	}
}

export const getActions = () => {

	const importSvg = () => {

	}

	return [
		{
			label: __( 'Import' ),
			onClick: importSvg,
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
