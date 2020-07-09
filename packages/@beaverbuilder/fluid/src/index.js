// Imported first before component styles
import './style.scss'

// Components
import * as Icon from './icon'
import * as Text from './text'
import * as Layout from './layout'
import Error from './error'
import Page from './page'
import Button from './button'
import Menu from './menu'
import * as List from './list'

// Styleguide content
import * as Docs from './docs'

export {
	Text,
	Error,
	Page,
	Button,
	Icon,
	Layout,
	List,
	Menu, // Planning to have menu subsumed by button
	
	// Docs - probably won't stay forever
	Docs,
}
