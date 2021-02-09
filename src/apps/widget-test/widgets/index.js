import React from 'react'
import { motion } from 'framer-motion'
import { Frame } from 'assistant/ui'

const Widget = ( { children, ...rest } ) => {
	const { isDragging } = Frame.use()
	return (
		<motion.div
			layout={ isDragging }
			whileHover={ {
				scale: 1.02,
			} }
			className="widget"
			{ ...rest }
		>
			{ children }
		</motion.div>
	)
}

const ThumbAndText = ( { title = 'Sample Item', subtitle, thumbSize = 40, style, ...rest } ) => {
	return (
		<div style={ { display: 'flex', flexDirection: 'row', alignItems: 'center', ...style } } { ...rest } >
			<div
				style={ {
					flexGrow: 0,
					flexShrink: 0,
					flexBasis: thumbSize,
					width: thumbSize,
					height: thumbSize,
					background: 'white',
					borderRadius: 5,
					marginRight: 10
				} }
			/>
			<div style={ { display: 'flex', flexDirection: 'column', gap: 5 } }>
				<div>{title}</div>
				{ subtitle && <div style={ { fontSize: 12, color: 'var(--fluid-opaque-6)' } }>{subtitle}</div> }
			</div>
		</div>
	)
}

const ThumbList = ( { thumbSize = 40, gap = 10, style, ...rest } ) => {
	return (
		<div style={ { flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap, justifyContent: 'space-evenly', ...style } } { ...rest }>
			<ThumbAndText
				thumbSize={ thumbSize }
				title="A great post you've never read"
				subtitle="/whatever"
			/>
			<ThumbAndText
				thumbSize={ thumbSize }
				title="Sample Page"
				subtitle="/sample-page"
			/>
			<ThumbAndText
				thumbSize={ thumbSize }
				title="About Us"
				subtitle="/about-who"
			/>
			<ThumbAndText
				thumbSize={ thumbSize }
				title="127 things we think you should think are important"
				subtitle="/127-things-that-arent-really-important"
			/>
			<ThumbAndText
				thumbSize={ thumbSize }
				title="Hey"
				subtitle="/hey"
			/>
		</div>
	)
}

const BigListWidget = ( { ...rest } ) => {
	return (
		<Widget
			style={ { gridRow: 'span 3' } }
			{ ...rest }
		>
			<div style={ { minHeight: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 10 } }>
				<div style={ { margin: 0, fontSize: 18 } }>Big Widget</div>
			</div>
			<ThumbList />
		</Widget>
	)
}

const SinglePostWidget = () => {
	return (
		<Widget>
			<ThumbAndText
				thumbSize={ 60 }
				title="That Post That You're Working on"
				subtitle="/some-great-post"
				style={ { margin: 'auto 0' } }
			/>
		</Widget>
	)
}

export { Widget, BigListWidget, SinglePostWidget }
