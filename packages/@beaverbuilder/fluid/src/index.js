// Imported first before component styles
import './style.scss'
import './forms.scss'

// Components
import * as Icon from './icon'
import * as Text from './text'
import * as Layout from './layout'
import Page from './page'
import Button from './button'
import Menu from './menu'
import * as List from './list'

// Styleguide content
import * as Docs from './docs'

export {
	Text,
	Page,
	Button,
	Menu, // Planning to have menu subsumed by button
	Icon,
	Layout,
	List,

	// Docs - probably won't stay forever
	Docs,
}
