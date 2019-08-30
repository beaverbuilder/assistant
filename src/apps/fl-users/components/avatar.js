import React from 'fl-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import md5 from 'md5'
import './avatar.scss'

const gravatar = ( email = null, size = 75 ) => {
	if ( null === email || '' === email ) {
		return 'https://gravatar.com/avatar/avatar.jpg'
	}
	const emailHash = md5( email )
	return `http://www.gravatar.com/avatar/${emailHash}.jpg?s=${size}`
}

export const Avatar = ( props ) => {
	const { email = null, size = 50 } = props

	const classes = classnames(
		'fl-asst-avatar',
		props.className
	)

	const sizeStyle = {
		height: `${size}px`,
		width: `${size}px`
	}

	return (
		<div className={ classes }>
			<img src={ gravatar( email, size ) } style={ sizeStyle }/>
		</div>
	)
}

Avatar.propTypes = {
	email: PropTypes.string,
	size: PropTypes.number
}
