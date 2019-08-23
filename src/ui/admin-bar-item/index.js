import { getSystemStore, getSystemActions } from 'assistant/data'

const store = getSystemStore()
const { window } = store.getState()

if ( 'admin_bar' === window.hiddenAppearance ) {

    document.addEventListener( 'DOMContentLoaded', () => {

        const el = document.querySelector('#wp-admin-bar-fl_assistant_toggle_ui')
        const { toggleIsShowingUI } = getSystemActions()

        if ( el ) {
            el.addEventListener( 'click', () => {
                toggleIsShowingUI()
            } )
        }
    })
}
