//import React, { useState } from 'react'
//import classname from 'classnames'
//import { sprintf } from '@wordpress/i18n'
//import { AnimatePresence, motion } from 'framer-motion'
//import { List, Button, Layout, Filter } from 'assistant/ui'
//import { useAppState } from 'assistant/data'
//import './style.scss'

/*
const Caret = () => (
	<svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.86603 6.5C4.48113 7.16667 3.51887 7.16667 3.13397 6.5L0.535899 2C0.150999 1.33333 0.632124 0.499999 1.40192 0.499999L6.59808 0.5C7.36788 0.5 7.849 1.33333 7.4641 2L4.86603 6.5Z" fill="currentColor" />
	</svg>
)

const PostSection = ({
	title,
	thumbnail,
	children,
	totalComments = 0,
	totalPending = 0
}) => {
	const [isExpanded, setIsExpanded] = useState( true )
	return (
		<AnimatePresence>
			<li className="fl-asst-comment-list-header">
				<Button
					className={classname({
						'fl-asst-comment-list-post-header': true,
						'fluid-sticky-element': true,
						isExpanded
					})}
					onClick={ () => setIsExpanded( ! isExpanded )}
				>
					<Layout.Row style={{
							minHeight: 40,
							flex: '1 1 auto',
							justifyContent: 'flex-start',
							alignItems: 'center'
						}}>
						<motion.div
							className='fl-asst-comment-list-caret'
							initial={false}
							animate={ isExpanded ? 'down' : 'right' }
							variants={{
								down: { rotate: '0deg' },
								right: { rotate: '-90deg' }
							}}
						>
							<Caret />
						</motion.div>
						<div style={{ padding: 10, paddingLeft: 0 }}>
							<Layout.AspectBox
								style={{
									width: 40,
									borderRadius: 3,
									backgroundImage: `url(${ thumbnail })`,
									backgroundSize: 'cover'
								}}/>
						</div>
						<div className="fl-asst-comment-list-post-header-title">{title}</div>
					</Layout.Row>

					{ ! isExpanded && (
						<motion.div
							className="fl-asst-comment-list-post-header-details"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
						>
							{ sprintf('%s Comments', totalComments ) }
							&nbsp;&nbsp;
							{ sprintf('%s Pending', totalPending ) }
						</motion.div>
					)}
				</Button>

				<motion.div
					className="fl-asst-sublist-wrap"
					initial={false}
					animate={ isExpanded ? 'visible' : 'hidden' }
					variants={{
						visible: {
							scaleY: 1,
							height: 'auto',
							transition: {
								staggerChildren: 0.05,
								ease: 'easeInOut',
								duration: .1,
							},
						},
						hidden: {
							scaleY: 0,
							height: 0,
							transition: {
								staggerChildren: 0,
								ease: 'easeInOut',
								duration: .25,
							},
						},
					}}
				>
					{children}
				</motion.div>

			</li>
		</AnimatePresence>
	)
}

const CommentMeta = ({ url, ip, email }) => {
	return (
		<div className="fl-asst-comment-meta">
			<div>{url}</div>
			<div>{ip}</div>
			<div>{email}</div>
		</div>
	)
}

const Comment = ({
	id,
	author,
	content,
	isPending,
	isSpam,
	formattedDate
}) => {

	return (
		<motion.li
			key={`comment-${id}`}
			className="fl-asst-threaded-comment"

			variants={{
				visible: {
					x: 0,
					opacity: 1,
					scale: 1,
					y: 0,
				},
				hidden: {
					opacity: 0,
					scale: .5,
					y: 50
				},
			}}
		>
			<div className="fl-asst-comment-gutter">
				<div className="fl-asst-thread-line" />
				{ ( isPending || isSpam ) && (
					<div className="fl-asst-gutter-dot-area">
						<div className={classname({
							'fl-asst-dot' : true,
							'is-pending' : isPending,
							'is-spam' : isSpam
						})} />
					</div>
				) }
			</div>
			<div className="fl-asst-comment-content-area">
				<div>
					<div className="fl-asst-comment-header">
						<div className="fl-asst-comment-avatar">
							<Layout.AspectBox
								style={{
									width: 30,
									backgroundImage: `url(https://secure.gravatar.com/avatar/665a3a4a774a6266d6cc9a2579f6f59c?s=96&d=mm&r=g)`,
									backgroundSize: 'cover'
								}}
							/>
						</div>
						<div className="fl-asst-comment-author-name">
							{author.name}
							<span className="fl-asst-comment-since">{formattedDate}</span>
						</div>
					</div>
					{ isPending && <CommentMeta {...author} /> }
				</div>
				<div className="fl-asst-comment-content"
					dangerouslySetInnerHTML={ { __html: content } }
				/>
			</div>
		</motion.li>
	)
}

const TreeTab = ({ handle }) => {
	const { posts } = useAppState( handle )

	return (
		<List.Scroller
			items={ posts }

			loadItems={ endFetching => endFetching() }
			hasMoreItems={ false }

			className="fl-asst-comment-thread-list"

			getItemComponent={ ( item, isSection, defaultComp ) => {
				return isSection ? PostSection : Comment
			}}

			getItemProps={ ( item, defaultProps ) => {
				return {
					...defaultProps,
					...item,
				}
			}}

			isListSection={ item => 'comments' in item }

			getSectionItems={ section => section.comments }

			getSectionProps={ ( section, defaultProps ) => {
				return {
					...defaultProps,
					...section
				}
			}}
		/>
	)
}
*/
