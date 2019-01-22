import { registerApp, setActiveApp } from 'store/actions'
import { Icon } from 'components'
import { ScreenHeader } from 'components/panel-parts'

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
