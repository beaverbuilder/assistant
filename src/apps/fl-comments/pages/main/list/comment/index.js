import React from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import LimitContent from '../limit-content'
import { Layout, Button } from 'assistant/ui'
import { motion } from 'framer-motion'
import './style.scss'

const Gutter = ( { isPending = false, isSpam = false, isTrash = false } ) => {
	return (
		<div className="fl-asst-comment-gutter">
			<div className="fl-asst-thread-line" />

			<div className="fl-asst-gutter-dot-area">
				<div className={ classname( {
					'fl-asst-dot': true,
					'is-pending': isPending,
					'is-spam': isSpam,
					'is-trash': isTrash
				} ) } />
			</div>

		</div>
	)
}

const Author = ( { name, avatar, date } ) => {
	return (
		<div className="fl-asst-comment-header">
			<div className="fl-asst-comment-avatar">
				<Layout.AspectBox
					style={ {
						width: 30,
						backgroundImage: `url(${ avatar })`,
						backgroundSize: 'cover'
					} }
				/>
			</div>
			<div className="fl-asst-comment-author-name">
				{name}
				{ date && <span className="fl-asst-comment-since">{date}</span> }
			</div>
		</div>
	)
}

const Meta = ( { url, ip, email } ) => {
	const stopProp = e => e.stopPropagation()
	return (
		<div className="fl-asst-comment-meta" onClick={ stopProp } >
			{ url && (
				<span className="fl-asst-comment-meta-value">
					<strong>{__( 'URL' )}&nbsp;</strong>
					<a href={ url } target="_blank" rel="noopener noreferrer">{url}</a>
				</span>
			) }
			{ ip && (
				<span className="fl-asst-comment-meta-value">
					<strong>{__( 'IP Address' )}&nbsp;</strong>
					<span>{ip}</span>
				</span>
			) }
			{ email && (
				<span className="fl-asst-comment-meta-value">
					<strong>{__( 'Email' )}&nbsp;</strong>
					<a href={ `mailto:${email}` }>{email}</a>
				</span>
			) }
		</div>
	)
}

export default ( {
	content,
	isPending,
	isSpam,
	isTrash,
	author,
	extras: Extras,
	to,
	className
} ) => {
	return (
		<motion.li
			className={ classname( {
				'is-spam': isSpam,
				'is-pending': isPending,
				'is-trash': isTrash,
			}, className ) }
			initial={ { scale: .5 } }
			animate={ { scale: 1 } }
		>
			<Button to={ to } style={ { display: 'flex', flexDirection: 'row', padding: 0 } }>
				<Gutter isPending={ isPending } isSpam={ isSpam } isTrash={ isTrash } />
				<div className="fl-asst-comment-cell">
					<Author { ...author } />
					{ isPending && ! isSpam && ! isTrash && <Meta { ...author } /> }
					<LimitContent>
						<div className="fl-asst-comment-content"
							dangerouslySetInnerHTML={ { __html: content } }
						/>
					</LimitContent>
				</div>
			</Button>
			<Extras />
		</motion.li>
	)
}
