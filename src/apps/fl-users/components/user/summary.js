import React from 'fl-react'
import { __ } from 'assistant/i18n'
import { Button } from 'assistant/lib'
import { Panel } from '../panel'
import './summary.scss'


export const Summary = ( props ) => {
	const { user } = props

	return (
		<Panel className="fl-asst-users-summary">
			<div className='circles'>
				<div className="col">
					<div className="circle">
						<img className="avatar" src={ user.thumbnail } alt={ user.displayName }/>
					</div>
				</div>
				<div className="col">
					<div className="circle">
						<div className="count">{user.posts}</div>
						<div className="title">{__( 'Posts' )}</div>
					</div>
				</div>
				<div className="col">
					<div className="circle">
						<div className="count">{user.pages}</div>
						<div className="title">{__( 'Posts' )}</div>
					</div>
				</div>
			</div>
			<div className="info">
				<div className='username'>
					{user.displayName}
				</div>
				<div className='email'>
					{user.email}
				</div>
			</div>
			<div className="actions">
			<Button href={ user.url }>{__( 'Author Page' )}</Button>
			<Button href={ user.editUrl }>{__( 'Edit in Admin' )}</Button>
			</div>
		</Panel>
	)
}
