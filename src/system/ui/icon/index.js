import * as FLUID_Icon from '@beaverbuilder/icons'
import Dashboard from './dashboard'
import Document from './document'
import DownCaretSmall from './down-caret-small'
import DragHandle from './drag-handle'
import Safely from './safely'
import Video from './video'
import PencilOutline from './pencil-outline'
import LockClosed from './lock-closed'
import LockOpen from './lock-open'
import WordPress from './wordpress'

// ArrowRight - Temp fix util I fix it in @beaverbuilder/icons
import ArrowRight from './arrow-right-fix'

const Icon = {
	...FLUID_Icon,
	Dashboard, // Moved to icons package
	Document,
	DownCaretSmall,
	DragHandle,
	Safely, // Render a user-generated icon safely with Suspense and Error.Boundary
	Video,
	PencilOutline,
	LockClosed,
	LockOpen,
	ArrowRight, // Fixed in icons package
	WordPress, // moved to icons package
}

export default Icon
