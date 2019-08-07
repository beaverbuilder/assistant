import React, { useRef } from 'fl-react'
import { List } from './'

export const Scroller = ( {
	loadItems = () => {},
	...rest
} ) => {
	const scrollRef = useRef()
	const { isFetching } = List.useScrollLoader( {
		ref: scrollRef,
		callback: loadItems,
	} )

	return (
		<div className="fl-asst-list-scroller fl-asst-scroller" ref={scrollRef}>
			<List {...rest} />
			{ isFetching && <List.Loading /> }
		</div>
	)
}
