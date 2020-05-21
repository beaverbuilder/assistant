import { __ } from '@wordpress/i18n'

export const defaultState = {
	type: 'hold',
}

export const defaultStatus = 'hold'

export const statuses = {
	all: __( 'All' ),
	hold: __( 'Pending ' ),
	approve: __( 'Approved' ),
	spam: __( 'Spam' ),
	trash: __( 'Trashed' ),
}
