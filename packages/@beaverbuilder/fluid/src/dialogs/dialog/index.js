import React from 'react'
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

	return (
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
	)
}

export default Dialog
