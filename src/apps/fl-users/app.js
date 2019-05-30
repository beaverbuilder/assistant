import React, { Fragment, useContext, useLayoutEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getSystemConfig } from 'store'
import {
	UserList,
	Header,
	Padding,
	Heading,
	StackContext,
	UserDetail,
} from 'components'
import { UserListFilter } from './filter'

export const App = () => {
	const { query } = useAppState()
	const { currentUser } = getSystemConfig()
	const { dismissAll, present } = useContext( StackContext )

	useLayoutEffect( () => {
		present( {
			label: __( 'Your Profile' ),
			content: <UserDetail />,
			appearance: 'form',
			context: currentUser,
			shouldAnimate: false,
			shouldShowTitle: false,
		} )
	}, [] )

	return (
		<Fragment>
			<Header.Expanded>
				<Padding>
					<Heading>{__( 'Filters' )}</Heading>
					<UserListFilter dismissAll={dismissAll} />
				</Padding>
			</Header.Expanded>

			<UserList
				query={ query }
				pagination={ true }
			/>
		</Fragment>
	)
}

export const PrevIcon = () => {
	return (
		<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
				<path d="M6,22 L3,22 C1.8954305,22 1,21.1045695 1,20 L1,3 C1,1.8954305 1.8954305,1 3,1 L3,1 L25,1 C26.1045695,1 27,1.8954305 27,3 L27,20 C27,21.1045695 26.1045695,22 25,22 L22,22" />
				<path d="M18.5727171,12.6099031 C18.9438269,11.8883126 19.1538462,11.0664726 19.1538462,10.1944444 C19.1538462,7.32563199 16.8808303,5 14.0769231,5 C11.2730159,5 9,7.32563199 9,10.1944444 C9,13.0632569 11.2730159,15.3888889 14.0769231,15.3888889 C15.6336013,15.3888889 21,15.5 22,22" />
				<path d="M6,22 C6,19.1518555 7,18 8,17" />
			</g>
		</svg>
	)
}

export const AppIcon = () => {
	return (
		<svg width="23px" height="25px" viewBox="0 0 23 25" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none">
				<path d="M16.7818057,11.4004686 C17.2385562,10.509092 17.4970414,9.49387788 17.4970414,8.41666667 C17.4970414,4.87283952 14.6994834,2 11.2485207,2 C7.79755801,2 5,4.87283952 5,8.41666667 C5,11.9604938 7.79755801,14.8333333 11.2485207,14.8333333 C13.1644323,14.8333333 19.7692308,14.9705882 21,23" strokeLinejoin="bevel" fillRule="nonzero"></path>
				<path d="M2,23 C2,19.5822266 3,18.2 4,17"></path>
			</g>
		</svg>
	)
}
