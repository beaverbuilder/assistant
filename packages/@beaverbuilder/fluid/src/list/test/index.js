import React from 'react'
import Item from '../item'
import Section from '../section'
import * as Icon from '../../icon'

const Test = () => (
    <>
<Section>
	<Item size="lg" title="Photos" thumbnail={ <Icon.View /> } />
	<Item size="lg" title="Music" thumbnail={ <Icon.Edit /> } />
	<Item size="lg" title="Documents" thumbnail={ <Icon.Approve /> } />
</Section>
<Section>
	<Item size="lg" title="I get a little down sometimes" eyebrow="Thinking" thumbnail={ <Icon.Placeholder /> } href="https://www.wpbeaverbuilder.com" />
	<Item size="lg" title="Go Home" thumbnail={ <Icon.Placeholder /> } to="/" />
	<Item size="lg" title="Sometimes It Has A Really Long Title" subtitle="Subtitle!" thumbnail={ <Icon.Placeholder /> } />
	<Item size="sm" thumbnail={ <Icon.View /> } title="Level 1 Item" showChildren={ false } >
		<Item  size="sm" title="Level 2 Item" thumbnail={ <Icon.View /> } >
			<Item size="sm" title="Level 3 Item" thumbnail={ <Icon.View /> } />
			<Item size="sm" title="Level 3 Item" thumbnail={ <Icon.View /> } />
		</Item>
	</Item>
	<Item title="Level 2 Item" />
	<Item title="Level 2 Item">
		<Item size="sm" title="Level 3 Item" >
			<Item size="sm" title="Level 3 Item" />
		</Item>
	</Item>
</Section>
<Section title="Outline">
	<Item size="sm" thumbnail={ <Icon.View /> } title="Row" >
		<Item  size="sm" title="Column" thumbnail={ <Icon.View /> } >
			<Item size="sm" title="Photo" thumbnail={ <Icon.View /> } />
		</Item>
		<Item  size="sm" title="Column" thumbnail={ <Icon.View /> } >
			<Item size="sm" title="Heading: 'Best heading ever'" thumbnail={ <Icon.View /> } />
			<Item size="sm" title="Text: 'Lorem ipsum dolor...'" thumbnail={ <Icon.View /> } />
		</Item>
	</Item>
</Section>
    </>
)

export default Test
