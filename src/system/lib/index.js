import * as shared from 'shared-lib'

export * from './groups'
export * from './lists'
export * from './docs'
export * from './pages'

// Public API
import { List } from './lists'
import { Page } from './pages'

export const api = {
	...shared,
	List,
	Page,
}
