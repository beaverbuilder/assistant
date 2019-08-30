import React from 'fl-react'
import { Button } from 'assistant/lib'
import { Panel } from '../panel'
import { cssPrefixer } from '../../lib'
import './summary.scss'


export const Summary = ( props ) => {
	const { user } = props

	const c = cssPrefixer( 'fl-asst-users-summary-user-panel' )

	return (
		<Panel className="fl-asst-users-summary-user-panel">
			<div className={ c( 'circles' ) }>
				<div className={ c( 'col' ) }>
					<div className={ c( 'circle' ) }>
						<img className={ c( 'avatar' ) } src={ user.thumbnail } alt={ user.displayName }/>
					</div>
				</div>
				<div className={ c( 'col' ) }>
					<div className={ c( 'circle' ) }>
						<div className="count">{user.posts}</div>
						<div className="title">Posts</div>
					</div>
				</div>
				<div className={ c( 'col' ) }>
					<div className={ c( 'circle' ) }>
						<div className="count">{user.pages}</div>
						<div className="title">Posts</div>
					</div>
				</div>
			</div>
			<div className={ c( 'info' ) }>
				<div className='username'>
					{user.displayName}
				</div>
				<div className='email'>
					{user.email}
				</div>
			</div>
			<div className={ c( 'actions' ) }>
				<Button href={ user.url }>Author Page</Button>
                &nbsp;
				<Button href={ user.editUrl }>Edit in Admin</Button>
			</div>
		</Panel>
	)
}
