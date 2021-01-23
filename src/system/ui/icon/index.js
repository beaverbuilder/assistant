import * as FLUID_Icon from '@beaverbuilder/icons'
import Document from './document'
import DownCaretSmall from './down-caret-small'
import DragHandle from './drag-handle'
import Safely from './safely'
import Video from './video'

const Icon = {
	...FLUID_Icon,
	Document,
	DownCaretSmall,
	DragHandle,
	Safely, // Render a user-generated icon safely with Suspense and Error.Boundary
	Video
}

export default Icon
