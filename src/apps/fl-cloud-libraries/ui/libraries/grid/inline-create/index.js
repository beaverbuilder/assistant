import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { ENTER } from '@wordpress/keycodes'
import { Form, Button, Icon } from 'assistant/ui'

const InlinePlusIcon = () => (
	<span style={{
		display: 'flex',
		minWidth: 36,
		justifyContent: 'center',
		color: 'var(--fluid-blue-7)' }}
	>
        <span style={{
            width: 20,
            height: 20,
            background: 'var(--fluid-blue-7)',
            color: 'var(--fluid-blue-14)',
            borderRadius: '50%'
        }}>
		      <Icon.PlusSmall />
        </span>
	</span>
)

const LibraryInlineCreate = ({ name, onInput = () => {}, create = () => {} }) => {
	useEffect( () => {
		const el = document.querySelector('.fl-asst-inline-library-create input')
		if ( el ) el.focus()
	}, [])

	return (
		<Form.Input
			className="fl-asst-inline-library-create"
			type='text'
			placeholder={ __( 'Create Library' ) }
			value={ name }
			onInput={ onInput }
			onKeyPress={ e => e.which === ENTER && create() }
			before={ <InlinePlusIcon /> }
			after={ '' !== name && (
                <Button
                    onClick={ create }
                    appearance="transparent"
                    status="primary"
                    icon="return"
                    title={__('Click or ENTER to Create Library')}
                />
            ) }
		/>
	)
}

export default LibraryInlineCreate
