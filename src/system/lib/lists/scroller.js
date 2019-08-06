import React, { useRef } from 'fl-react'
import classname from 'classnames'
import { List } from './'

export const Scroller = ( { ...rest } ) => {
	const scrollRef = useRef()
	const { isFetching, resetIsFetching } = List.useScrollLoader( {
		ref: scrollRef,
		callback: ( reset ) => {
			console.log( 'Load stuff!' )
			reset()
		}
	} )

	return (
		<div className="fl-asst-scroller" ref={scrollRef}>
			<List {...rest} />
			{ isFetching && <List.Loading /> }
		</div>
	)
}
