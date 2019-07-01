import {
	Appearance,
	Form,
	Error,
	Control,
	Icon,
} from 'shared-lib'

export * from './app'
export * from './lists'
export * from './pages'
export * from './nav'
export * from './window'

export {
	Appearance,
	Form,
	Error,
	Control,
	Icon,
}

// Docs is export from lib, but not included in public API
export * from './docs'

// Public API
import { App } from './app'
import { Button } from './button'
import { List } from './lists'
import { Page } from './pages'
import { Nav } from './nav'
import { Window } from './window'

export const api = {
	Appearance,
	App,
	Button,
	Icon,
	Window,
	Form,
	Control,
	List,
	Page,
	Error,
	Nav,
}
