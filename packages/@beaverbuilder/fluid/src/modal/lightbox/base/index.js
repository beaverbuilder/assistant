import React from 'react'
import ReactDOM from 'react-dom'
import classname from 'classnames'
import './style.scss'

const Lightbox = ( {
	className,
	isShowing = false,
	setIsShowing = () => {},
	content = null
} ) => {

	if ( ! isShowing ) {
		return null
	}

	const getRoot = () => {
		const root = document.getElementById( 'fluid-modal-root' )
		return root ? root : document.body
	}

	return ReactDOM.createPortal( (
		<div className={ classname( 'fluid-lightbox', className ) }>
			<button
				className='fluid-lightbox-close'
				onClick={ () => setIsShowing( false ) }
			>X</button>
			<div
				className='fluid-lightbox-content'
				onClick={ () => setIsShowing( false ) }
			>{ content }</div>
		</div>
	), getRoot() )
}

export default Lightbox
