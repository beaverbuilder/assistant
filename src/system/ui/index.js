// Public API
import './style.scss'
import { Text, Collection, Menu } from '@beaverbuilder/fluid'
import { App } from './app'
import Button from './button'
import Icon from './icon'
import Color from './color'
import { List } from './lists'
import Layout from './layout'
import Page from './pages'
import Control from './controls'
import Form from './forms'
import Media from './media'
import Env from './env'
import Notice from './notices'
import Filter from './filter'
import Widget from './widget'

// Export for use inside system bundle - import from 'ui'
export * from './app'
export * from './lists'
export * from './pages'
export * from './button'
export {
	Layout,
	Env,
	Notice,
	Media,
	Color,
	Filter,
	Form,
	Control,
	Button,
	Icon,
	Widget,

	// Straight out of FLUID
	Text,
	Collection,
	Menu,
}

// Export public API for use inside other bundles - import from 'assistant/ui'
export const api = {
	App,
	Button,
	Icon,
	Color,
	Collection,
	Filter,
	Form,
	Control,
	List,
	Layout,
	Page,
	Env,
	Notice,
	Media,
	Menu,
	Text,
	Widget,
}
