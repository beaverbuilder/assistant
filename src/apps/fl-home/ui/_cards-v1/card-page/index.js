import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon } from 'assistant/ui'
import Card from '../card'
import useCards from '../use-cards'
import useCardTypes from '../use-card-types'
import './style.scss'

import SortableList from '../sortable-list'

const CardPage = ( {
	page = 'home',
	isEditing = false
} ) => {
	const { cards, setPage, setCards } = useCards( page )

	// Listen for page prop changing and update hook
	useEffect( () => setPage( page ), [ page ] )

	return (
		<>
			<SortableList
				items={ cards }
				setItems={ setCards }
				className="fl-asst-card-list"
			>
				{ card => {
					const {
						id,
						actions,
						moveUp,
						moveDown,
						isFirst,
						isLast,
						render: Render,
						edit: Edit
					} = card

					const EditActions = () => (
						<>
							{ ! isFirst && <Button
								appearance="transparent"
								onClick={ moveUp }
							>
								<Icon.UpCaret />
							</Button> }
							{ ! isLast && <Button
								appearance="transparent"
								onClick={ moveDown }
							>
								<Icon.DownCaret />
							</Button> }
						</>
					)

					return (
						<Card
							key={ id }
							isEditing={ isEditing }
							actions={ isEditing ? <EditActions /> : actions }
							{ ...card }
						>{ isEditing ? <Edit { ...card }/> : <Render { ...card } /> }</Card>
					)
				}}
			</SortableList>

			{ isEditing && (
				<div style={ { padding: '0 var(--fluid-lg-space)' } }>
					<h2 style={ { marginTop: 'var(--fluid-lg-space)' } }>{__( 'Available Cards' )}</h2>
					<CardTypesList page={ page } />
				</div>
			)}
		</>
	)
}

const CardType = ( {
	label,
	icon: TypeIcon  = () => {},
	insert = () => {},
	page,
	...rest
} ) => {

	return (
		<Button
			className="fl-asst-card-type"
			status="primary"
			onClick={ () => insert( page ) }
			{ ...rest }
		>
			<span className="fl-asst-card-type-title">
				<TypeIcon />
				{ label }
			</span>
			<span className="fl-asst-card-type-actions">
				<Icon.Plus />
			</span>
		</Button>
	)
}

const CardTypesList = ( { page } ) => {
	const types = useCardTypes()
	return (
		<ul className="fl-asst-card-type-list">
			{ types.map( ( type, i ) => {
				return (
					<li
						key={ i }
					>
						<CardType { ...type } page={ page } />
					</li>
				)
			} )}
		</ul>
	)
}

export default CardPage
