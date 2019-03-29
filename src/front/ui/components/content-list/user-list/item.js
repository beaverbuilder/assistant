import React, { useContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { UserDetail } from './detail'
import {
	ContentListItem,
	ItemContext,
	StackContext
} from 'components'

export const UserListItem = ( { className, ...props } ) => {
	const context = useContext( ItemContext )
	const { present } = useContext( StackContext )
	const classes = classname( className )

	return (
		<ContentListItem
			className={ classes }
			onClick={ () => present( {
				label: __( 'Edit User' ),
				content: <UserDetail />,
				appearance: 'form',
				context,
			} ) }
			{ ...props }
		/>
	)
}
