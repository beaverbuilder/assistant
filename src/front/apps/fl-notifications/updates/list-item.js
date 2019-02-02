import React, { Fragment } from 'react'
import classname from 'classnames'
import { Button, ContentListItem } from 'components'
import './style.scss'

export const UpdatesListItem = props => {
	const { className } = props
	const classes = classname( className, 'fl-asst-update-item' )
	const updatePlugin = () => console.log( 'Update' )
	return (
		<ContentListItem { ...props } className={ classes }>
			<div className='fl-asst-update-button'>
				<Button onClick={ updatePlugin }>Update</Button>
			</div>
		</ContentListItem>
	)
}
