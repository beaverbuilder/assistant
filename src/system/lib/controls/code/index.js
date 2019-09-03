import React, { useContext } from 'fl-react'
import { Appearance } from 'lib'

import CodeMirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'

// Themes
import 'codemirror/theme/ttcn.css'
import 'codemirror/theme/dracula.css'

// Modes
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'

export const Code = ( { options = {}, ...rest } ) => {
	const { brightness } = useContext( Appearance.Context )

	const defaultOptions = {
		theme: 'dark' === brightness ? 'dracula' : 'ttcn',
		mode: 'css',
		lineNumbers: true,
		indentWithTabs: true,
		lineWrapping: true,
	}

	return (
		<CodeMirror
			options={ { ...defaultOptions, ...options } }
			{ ...rest }
		/>
	)
}
