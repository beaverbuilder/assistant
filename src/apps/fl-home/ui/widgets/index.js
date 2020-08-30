import React, { useRef, useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { motion } from 'framer-motion'
import { Layout, Icon, Widget } from 'assistant/ui'
import AppsWidget from './apps'
import RecentContentWidget from './recent-content'
import CurrentlyViewingWidget from './currently-viewing'
import SubscribeWidget from './subscribe'
import Welcome from './welcome'

//import Welcome from './welcome'
import './style.scss'

const Cap = () => {
	return (
		<Layout.Row padY={ true }>
			<Icon.Pencil size={ 50 } />
		</Layout.Row>
	)
}

// Spring configs
const onTop = {
	zIndex: 9,
	scale: 1.04,
}
const flat = {
	zIndex: 0,
	scale: 1,
}

const Item = ( { id, size, title, content, wrap } ) => {
	const [ dragging, setDragging ] = useState( false )
	const ref = useRef( null )

	useEffect( () => {
		const box = {
			width: ref.current.offsetWidth,
			height: ref.current.offsetHeight,
			top: ref.current.offsetTop,
			left: ref.current.offsetLeft,
		}
	} )

	return (
		<motion.li
			key={ id }
			ref={ ref }
			className={ `fl-asst-widget-${size}` }
			layout
			animate={ dragging ? onTop : flat }
			drag={ 'sm' === size ? true : 'y' }
			dragConstraints={ wrap }
			dragElastic={ 1 }
			onDragStart={ () => {
				setDragging( true )
			} }
			onDragEnd={ () => {
				setDragging( false )
			} }
		>
			<Widget title={ title }>{content}</Widget>
		</motion.li>
	)
}

const Widgets = () => {
	const ref = useRef( null )
	const items = [
		{
			id: 1,
			size: 'sm',
			title: 'Small Item One',
			content: () => <>Test</>
		},
		{
			id: 2,
			size: 'sm',
			title: 'Small Item Two',
			content: () => <>Test Two</>
		},
		{
			id: 3,
			size: 'med',
			title: 'Medium Item',
			content: () => <>Test Three</>
		},
		{
			id: 4,
			size: 'lg',
			title: 'Large Item',
			content: () => <>Test Four</>
		}
	]
	const [ order, setOrder ] = useState( items.map( item => item.id ) )

	return (
		<ul className="fl-asst-widget-list" ref={ ref }>
			<li>
				<Welcome />
			</li>

			{ order.map( itemID => {
				const item = items.find( item => item.id === itemID )
				return (
					<Item
						key={ item.id }
						wrap={ ref }
						{ ...item }
					/>
				)
			} ) }

			<li>
				<CurrentlyViewingWidget />
			</li>
			<li>
				<RecentContentWidget />
			</li>
			<li>
				<RecentContentWidget title={ __( 'Recent Pages' ) } type='page' />
			</li>
			<li>
				<AppsWidget />
			</li>
			<li>
				<SubscribeWidget />
			</li>
			<li>
				<Cap />
			</li>
		</ul>
	)
}

export default Widgets
