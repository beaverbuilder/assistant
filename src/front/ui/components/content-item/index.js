import React from 'react'
import classname from 'classnames'
import './style.scss'

export const ContentItem = ( {
	className,
	children,
	thumbnail,
	title,
	meta,
	...props,
} ) => {
	const classes = classname( className, 'fl-asst-content-item' )

	return (
		<div className={ classes } { ...props }>
			<div className='fl-asst-content-item-visual'>
				<div
					className='fl-asst-content-item-visual-box'
					style={ {
						backgroundImage: thumbnail ? `url(${ thumbnail })` : ''
					} }
				/>
			</div>
			<div className='fl-asst-content-item-text'>
				{ title &&
					<div className='fl-asst-content-item-title'>
						{ title }
					</div>
				}
				{ meta &&
					<div className='fl-asst-content-item-meta'>
						{ meta }
					</div>
				}
			</div>
			{ children }
		</div>
	)
}
