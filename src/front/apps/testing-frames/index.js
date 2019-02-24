import React, { Fragment, useState } from 'react'
import { getSystemActions } from 'store'
import {
	SplitView,
	OptionGroup,
	OptionGroupItem,
	Separator,
	EmptyMessage,
	Heading,
} from 'components'

const { registerApp } = getSystemActions()

const App = () => {
	const [isShowingNew, setIsShowingNew] = useState( false )
	const [fruit, setFruit] = useState( null )
	const items = ['Apples', 'Oranges', 'Bananas']

	return (
		<Fragment>
			<SplitView>
				<SplitView.Master title="Fruit">
					<OptionGroup title="Fruit">
						{ items.map( item => {
							return (
								<OptionGroupItem
									key={item}
									isSelected={ fruit === item && ! isShowingNew }
									onClick={ () => {
										setFruit(item)
										setIsShowingNew( false )
									}}
									>
										{item}
									</OptionGroupItem>
							)
						})}
					</OptionGroup>
					<Separator />
					<OptionGroup>
						<OptionGroupItem
							onClick={ () => setIsShowingNew( true ) }
						>Add Fruit</OptionGroupItem>
					</OptionGroup>

				</SplitView.Master>
				<SplitView.Detail>
					{ isShowingNew && <EmptyMessage>Add New</EmptyMessage> }
					{ !isShowingNew && <EmptyMessage>{fruit}</EmptyMessage> }
				</SplitView.Detail>
			</SplitView>
		</Fragment>
	)
}


registerApp( 'testing', {
	label: 'Testing',
	content: () => <App />
} )
