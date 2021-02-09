import { createContext, useContext } from 'react'

const defaultFrameContext = {
	size: 'compact'
}

const FrameContext = createContext( defaultFrameContext )

export default {
	defaults: defaultFrameContext,
	Context: FrameContext,
	use: () => useContext( FrameContext )
}
