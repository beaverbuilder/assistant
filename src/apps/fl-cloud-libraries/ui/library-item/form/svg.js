import { __ } from '@wordpress/i18n'

export const getSections = ( item, sections ) => {
	return {
		...sections,
	}
}

export const getActions = () => {

	const importSvg = () => {}

	const replaceSvg = () => {}

	return [
		{
			label: __( 'Import' ),
			onClick: importSvg,
		},
		{
			label: __( 'Replace File' ),
			onClick: replaceSvg,
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
