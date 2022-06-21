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
import Upload from './upload'
import Download from './download'

// ArrowRight - Temp fix util I fix it in @beaverbuilder/icons
import ArrowRight from './arrow-right-fix'

const Icon = {
	...FLUID_Icon,
	Dashboard,
	Document,
	DownCaretSmall,
	DragHandle,
	Safely, // Render a user-generated icon safely with Suspense and Error.Boundary
	Video,
	PencilOutline,
	LockClosed,
	LockOpen,
	ArrowRight,
	WordPress,
	Upload,
	Download,
}

export default Icon
