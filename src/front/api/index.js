import { getDispatch } from 'store'
import { Icon } from 'components'
import { ScreenHeader } from 'components/panel-parts'

const {
	registerApp,
	setActiveApp,
} = getDispatch()

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
