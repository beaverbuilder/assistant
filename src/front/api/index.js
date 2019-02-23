import { getSystemDispatch } from 'store'
import { Icon } from 'components'
import { ScreenHeader } from 'components/panel-parts'

const {
	registerApp,
	setActiveApp,
} = getSystemDispatch()

window.FLAssistant = {
	apps: {
		registerApp,
		setActiveApp,
	},
	components: {
		Icon,
		ScreenHeader,
	},
}
