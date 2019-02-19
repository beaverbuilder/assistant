import React, { useContext } from 'react'
import classname from 'classnames'
import { UserDetail } from './detail'
import {
	ContentListItem,
	ItemContext,
	StackContext
} from 'components'

export const UserListItem = ( { className, ...props } ) => {
	const context = useContext( ItemContext )
	const { approved } = context
	const { pushView } = useContext( StackContext )
	const classes = classname( className )

	return (
		<UserListItem
			className={ classes }
			onClick={ () => pushView( <UserDetail />, { context } ) }
			{ ...props }
		/>
	)
}
