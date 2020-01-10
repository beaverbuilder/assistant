import React from 'react'
import { useSystemState, getSystemActions } from 'assistant/data'
import { Page } from 'assistant/ui'

import { ProfilePage, LoginPage } from './pages'

import './style.scss'

export const CloudApp = () => {

	const {
		loginErrors = [],
		cloudToken = {},
		currentUser,
		isCloudConnected = false
	} = useSystemState()

	const {
		attemptLogin,
		attemptLogout
	} = getSystemActions()


	const doLogin = ( email, password ) => {
		attemptLogin( email, password )
	}

	const doLogout = () => {
		attemptLogout()
	}

	return (
		<Page className="fl-app-cloud" padX={ false }>
			{isCloudConnected ? (
				<ProfilePage doLogout={ doLogout } token={ cloudToken } user={ currentUser }/>
			) : (
				<LoginPage doLogin={ doLogin } errors={ loginErrors }/>
			)}
		</Page>
	)
}

CloudApp.Icon = ( { windowSize } ) => {
	const size = 'mini' === windowSize ? 32 : 45
	return (
		<svg width={ size } viewBox="0 0 32 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g fill="none" stroke="currentColor" strokeWidth="2">
				<path
					d="M5.7447619,18.7928571 C8.11714286,18.7928571 22.3514286,18.7928571 24.7238095,18.7928571 C27.0961905,18.7928571 30.6547619,16.9522167 30.6547619,12.6573892 C30.6547619,8.36256158 26.5030952,7.74901478 25.3169048,7.74901478 C25.3169048,4.06773399 22.3514286,1 19.3859524,1 C16.4204762,1 13.455,3.45418719 13.455,5.29482759 C11.6757143,4.06773399 6.93095238,5.29482759 6.93095238,8.97610837 C3.96547619,8.36256158 1,10.8167488 1,13.8844828 C1,16.9522167 3.37238095,18.7928571 5.7447619,18.7928571 Z"></path>
			</g>
		</svg>
	)
}
