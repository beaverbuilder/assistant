import { createHooks } from '@wordpress/hooks'

// Create a new hooks registry
const hooks = createHooks()

export const {
    addAction,
    addFilter,
    removeAction,
    removeFilter,
    hasAction,
    hasFilter,
    removeAllActions,
    removeAllFilters,
    doAction,
    applyFilters,
    currentAction,
    currentFilter,
    doingAction,
    doingFilter,
    didAction,
    didFilter,
    actions,
    filters
} = hooks

export default hooks
