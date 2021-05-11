import React from 'react'
import ReactDOM from 'react-dom'
import classname from 'classnames'
import Button from '../../button'
import './style.scss'

const Dialog = ( {
	className,
	title = '',
	message = '',
	buttons = [],
	isShowing = false,
	setIsShowing = () => {}
} ) => {

	if ( ! isShowing ) {
		return null
	}

	const getRoot = () => {
		const root = document.getElementById( 'fluid-dialog-root' )
		return root ? root : document.body
	}

	return ReactDOM.createPortal( (
		<div className={ classname( 'fl-asst-dialog', className ) }>
			<div className='fl-asst-dialog-window'>
				{ title &&
					<div className='fl-asst-dialog-title'>
						{ title }
					</div>
				}
				<div className='fl-asst-dialog-message'>
					{ message }
				</div>
				<div className='fl-asst-dialog-buttons'>
					{ buttons.map( ( { label, onClick, ...rest }, i ) =>
						<Button
							key={ i }
							onClick={ () => {
								if ( onClick ) {
									onClick( {
										closeDialog: () => setIsShowing( false )
									} )
								}
							} }
							{ ...rest }
						>
							{ label }
						</Button>
					) }
				</div>
			</div>
		</div>
	), getRoot() )
}

export default Dialog
