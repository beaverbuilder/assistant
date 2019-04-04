import React from 'react'

export const Icon = ( { name } ) => {
	switch ( name ) {
	case 'close':
		return (
			<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g fill="currentColor" transform="translate(-407.000000, -25.000000)">
					<path d="M414,33.2071068 L408.658051,38.7071068 C408.278749,39.0976311 407.663779,39.0976311 407.284477,38.7071068 C406.905174,38.3165825 406.905174,37.6834175 407.284477,37.2928932 L412.425271,32 L407.284477,26.7071068 C406.905174,26.3165825 406.905174,25.6834175 407.284477,25.2928932 C407.663779,24.9023689 408.278749,24.9023689 408.658051,25.2928932 L414,30.7928932 L419.341949,25.2928932 C419.721251,24.9023689 420.336221,24.9023689 420.715523,25.2928932 C421.094826,25.6834175 421.094826,26.3165825 420.715523,26.7071068 L415.574729,32 L420.715523,37.2928932 C421.094826,37.6834175 421.094826,38.3165825 420.715523,38.7071068 C420.336221,39.0976311 419.721251,39.0976311 419.341949,38.7071068 L414,33.2071068 Z"></path>
				</g>
			</svg>
		)
	case 'more':
		return (
			<svg width="6px" height="19px" viewBox="0 0 6 19" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path fill="currentColor" d="M3.25,13.5 C1.83246521,13.5 0.684326172,14.61875 0.684326172,16 C0.684326172,17.38125 1.83246521,18.5 3.25,18.5 C4.66753479,18.5 5.81567383,17.38125 5.81567383,16 C5.81567383,14.61875 4.66753479,13.5 3.25,13.5 Z"></path>
				<path fill="currentColor" d="M3.25,0 C1.83246521,0 0.684326172,1.11875 0.684326172,2.5 C0.684326172,3.88125 1.83246521,5 3.25,5 C4.66753479,5 5.81567383,3.88125 5.81567383,2.5 C5.81567383,1.11875 4.66753479,0 3.25,0 Z"></path>
				<path fill="currentColor" d="M3.25,6.75 C1.83246521,6.75 0.684326172,7.86875 0.684326172,9.25 C0.684326172,10.63125 1.83246521,11.75 3.25,11.75 C4.66753479,11.75 5.81567383,10.63125 5.81567383,9.25 C5.81567383,7.86875 4.66753479,6.75 3.25,6.75 Z"></path>
			</svg>
		)
	case 'blue-dot':
		return (
			<svg width="5px" height="5px" viewBox="0 0 5 5" version="1.1">
				<circle fill="#3AA4CC" cx="2.5" cy="2.5" r="2.5"></circle>
			</svg>
		)
	case 'small-spinner':
		return (
			<svg width="16px"  height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={ { background: 'none' } }>
				<circle cx="50" cy="50" fill="none" stroke="#8a8a8a" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(299.801 50 50)">
					<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
				</circle>
			</svg>
		)
	case 'spinner':
		return (
			<svg width="32px"  height="32px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={ { background: 'none' } }>
				<circle cx="50" cy="50" fill="none" stroke="#8a8a8a" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(299.801 50 50)">
					<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
				</circle>
			</svg>
		)
	case 'star-outline':
		return (
			<svg width="18px" height="19px" viewBox="0 0 18 19" version="1.1" xmlns="http://www.w3.org/2000/svg" >
				<g transform="translate(-371.000000, -375.000000)">
					<polygon stroke="currentColor" strokeWidth="2" fill="transparent" points="380 389.466316 385.562 393 384.086 386.34 389 381.858947 382.529 381.281053 380 375 377.471 381.281053 371 381.858947 375.914 386.34 374.438 393"></polygon>
				</g>
			</svg>
		)
	case 'asterisk':
		return (
			<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2">
					<path d="M7,1 L7,13" id="Line-5"></path>
					<path d="M7,1 L7,13" id="Line-5-Copy" transform="translate(7.000000, 7.000000) rotate(-60.000000) translate(-7.000000, -7.000000) "></path>
					<path d="M7,1 L7,13" id="Line-5-Copy-2" transform="translate(7.000000, 7.000000) scale(-1, 1) rotate(-60.000000) translate(-7.000000, -7.000000) "></path>
				</g>
			</svg>
		)
	case 'trigger-button':
		return (
			<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g fill="transparent" transform="translate(-145.000000, -145.000000)" fillRule="nonzero" strokeWidth="2" stroke="currentColor">
					<circle cx="158.5" cy="155.5" r="5.5"></circle>
					<path d="M172.014075,163 L172.014075,148 C172.014075,146.895431 171.118644,146 170.014075,146 L148,146 C146.895431,146 146,146.895431 146,148 L146,165.010842 C146,166.115411 146.895431,167.010842 148,167.010842 L170.014075,167.010842 L162.5,159.5" strokeLinecap="round" strokeLinejoin="round"></path>
				</g>
			</svg>
		)
	case 'default-app':
		return (
			<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2" fill="transparent" fillRule="evenodd" strokeLinecap="round">
					<rect x="1" y="1" width="26" height="21" rx="2" stroke="currentColor" strokeWidth="2"></rect>
					<path d="M2,21 L26,2"></path>
					<path d="M1,21 L25,2" transform="translate(13.500000, 12.000000) scale(-1, 1) translate(-13.500000, -12.000000) "></path>
				</g>
			</svg>
		)
	case 'apps-app':
		return (
			<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					<path d="M18,22 L3,22 C1.8954305,22 1,21.1045695 1,20 L1,3 C1,1.8954305 1.8954305,1 3,1 C3.88888889,1 4.55555556,1 5,1 M10,1 C12.5336712,1 17.7158001,1 25,1 C26.1045695,1 27,1.8954305 27,3 L27,20 C27,21.1045695 26.1045695,22 25,22 L23,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
					<path d="M21,13 C19.895,13 19,13.895 19,15 C19,16.105 19.895,17 21,17 C22.105,17 23,16.105 23,15 C23,13.895 22.105,13 21,13 Z" fill="currentColor" transform="translate(21.000000, 15.000000) rotate(-90.000000) translate(-21.000000, -15.000000) "></path>
					<path d="M7,13 C5.895,13 5,13.895 5,15 C5,16.105 5.895,17 7,17 C8.105,17 9,16.105 9,15 C9,13.895 8.105,13 7,13 Z" fill="currentColor" transform="translate(7.000000, 15.000000) rotate(-90.000000) translate(-7.000000, -15.000000) "></path>
					<path d="M14,13 C12.895,13 12,13.895 12,15 C12,16.105 12.895,17 14,17 C15.105,17 16,16.105 16,15 C16,13.895 15.105,13 14,13 Z" fill="currentColor" transform="translate(14.000000, 15.000000) rotate(-90.000000) translate(-14.000000, -15.000000) "></path>
					<path d="M21,6 C19.895,6 19,6.895 19,8 C19,9.105 19.895,10 21,10 C22.105,10 23,9.105 23,8 C23,6.895 22.105,6 21,6 Z" fill="currentColor" transform="translate(21.000000, 8.000000) rotate(-90.000000) translate(-21.000000, -8.000000) "></path>
					<path d="M7,6 C5.895,6 5,6.895 5,8 C5,9.105 5.895,10 7,10 C8.105,10 9,9.105 9,8 C9,6.895 8.105,6 7,6 Z" fill="currentColor" transform="translate(7.000000, 8.000000) rotate(-90.000000) translate(-7.000000, -8.000000) "></path>
					<path d="M14,6 C12.895,6 12,6.895 12,8 C12,9.105 12.895,10 14,10 C15.105,10 16,9.105 16,8 C16,6.895 15.105,6 14,6 Z" fill="currentColor" transform="translate(14.000000, 8.000000) rotate(-90.000000) translate(-14.000000, -8.000000) "></path>
				</g>
			</svg>
		)
	case 'back':
		return (
			<svg width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path fill="currentColor" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L8.41421356,7 L1.70710678,13.7071068 C1.31658249,14.0976311 0.683417511,14.0976311 0.292893219,13.7071068 C-0.0976310729,13.3165825 -0.0976310729,12.6834175 0.292893219,12.2928932 L5.58578644,7 L0.292893219,1.70710678 Z" transform="translate(4.207107, 7.000000) scale(-1, 1) translate(-4.207107, -7.000000) "></path>
			</svg>
		)
	case 'forward':
		return (
			<svg width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path fill="currentColor" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L8.41421356,7 L1.70710678,13.7071068 C1.31658249,14.0976311 0.683417511,14.0976311 0.292893219,13.7071068 C-0.0976310729,13.3165825 -0.0976310729,12.6834175 0.292893219,12.2928932 L5.58578644,7 L0.292893219,1.70710678 Z" transform="translate(4.207107, 7.000000) translate(-4.207107, -7.000000) "></path>
			</svg>
		)
	case 'menu':
		return (
			<svg width="20px" height="14px" viewBox="0 0 20 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
					<path d="M1,1 L19,1" ></path>
					<path d="M1,7 L19,7" ></path>
					<path d="M1,13 L19,13" ></path>
				</g>
			</svg>
		)
	case 'go':
		return (
			<svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="none" fill="currentColor" fillRule="evenodd">
					<path d="M15.740001,1.26 C17.420001,2.95 17.420001,5.67 15.740001,7.36 L14.210001,8.879999 C13.090001,9.999999 11.510001,10.349999 10.070001,9.969999 L12.690001,7.36 L13.450001,6.59 L14.210001,5.83 C15.050001,4.99 15.050001,3.63 14.210001,2.79 C13.370001,1.94 12.010001,1.94 11.170001,2.79 L10.400001,3.55 L7.020001,6.93 C6.650001,5.49 7.000001,3.91 8.120001,2.79 L9.640001,1.26 C11.330001,-0.42 14.060001,-0.42 15.740001,1.26 Z M6.590001,11.93 L11.930001,6.59 C12.350001,6.17 12.350001,5.49 11.930001,5.07 C11.490001,4.64 10.800001,4.68 10.400001,5.07 L5.070002,10.41 C4.650002,10.83 4.650002,11.51 5.070002,11.93 C5.510002,12.360001 6.200002,12.320001 6.590001,11.93 Z M5.830001,14.22 L9.970001,10.07 C10.350001,11.51 10.000001,13.09 8.880001,14.209999 L7.36,15.74 C5.67,17.42 2.95,17.42 1.26,15.74 C-0.42,14.059999 -0.42,11.32 1.26,9.639999 L2.79,8.12 C3.91,7 5.49,6.65 6.929999,7.02 L2.79,11.169998 C1.94,12.009998 1.94,13.369998 2.79,14.219998 C3.63,15.059998 4.99,15.059998 5.829999,14.219998 L5.830001,14.22 Z"></path>
				</g>
			</svg>
		)
	case 'go-diagonal':
		return (
			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
					<path d="M17.7191582,5.55294782 C16.106692,3.12840994 13.3498259,1.53054204 10.2197577,1.53054204 C5.24919496,1.53054204 1.21975771,5.55997929 1.21975771,10.530542 C1.21975771,15.5011048 5.24919496,19.530542 10.2197577,19.530542 L10.2197577,19.530542 C13.3174715,19.530542 16.0496587,17.9655366 17.6687898,15.5830552" id="Path-Copy-5" transform="translate(9.469458, 10.530542) rotate(-45.000000) translate(-9.469458, -10.530542) "></path>
					<path d="M16.2071068,9.29289322 L4.70710678,9.29289322" transform="translate(10.707107, 9.292893) rotate(-45.000000) translate(-10.707107, -9.292893) "></path>
					<path d="M13.5606602,7.90380592 L9.0502842,3.90380592" transform="translate(11.060660, 5.403806) rotate(-45.000000) translate(-11.060660, -5.403806) "></path>
					<path d="M16.3890873,6.73223305 L11.8890873,10.732233" transform="translate(13.889087, 8.232233) rotate(-45.000000) translate(-13.889087, -8.232233) "></path>
				</g>
			</svg>
		)
	case 'expand-normal':
		return (
			<svg width="32px" height="16px" viewBox="0 0 32 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
					<path d="M30.5,8 L25.989624,4"></path>
					<path d="M6.5,8 L1.98962402,4" transform="translate(4.000000, 5.500000) scale(-1, 1) translate(-4.000000, -5.500000) "></path>
					<path d="M30.5,8 L26,12"></path>
					<path d="M6.5,8 L2,12" transform="translate(4.000000, 9.500000) scale(-1, 1) translate(-4.000000, -9.500000) "></path>
					<rect x="12" y="1" width="8" height="14" rx="2"></rect>
				</g>
			</svg>
		)
	case 'expand-wide':
		return (
			<svg width="32px" height="16px" viewBox="0 0 32 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
					<path d="M30.5,8 L25.989624,4"></path>
					<path d="M6.5,8 L1.98962402,4" transform="translate(4.000000, 5.500000) scale(-1, 1) translate(-4.000000, -5.500000) "></path>
					<path d="M30.5,8 L26,12"></path>
					<path d="M6.5,8 L2,12" transform="translate(4.000000, 9.500000) scale(-1, 1) translate(-4.000000, -9.500000) "></path>
					<rect x="11" y="1" width="10" height="14" rx="2"></rect>
				</g>
			</svg>
		)
	case 'expand-full':
		return (
			<svg width="32px" height="16px" viewBox="0 0 32 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
					<path d="M26.5,8 L21.989624,4" transform="translate(24.000000, 5.500000) scale(-1, 1) translate(-24.000000, -5.500000) "></path>
					<path d="M10.5,8 L5.98962402,4"></path>
					<path d="M26.5,8 L22,12" transform="translate(24.000000, 9.500000) scale(-1, 1) translate(-24.000000, -9.500000) "></path>
					<path d="M10.5,8 L6,12"></path>
					<rect x="1" y="1" width="30" height="14" rx="2"></rect>
				</g>
			</svg>
		)
	case 'plus':
		return (
			<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path fill="currentColor" stroke="none" d="M9,9.01464844 L9,15 C9,15.5522847 8.55228475,16 8,16 L8,16 C7.44771525,16 7,15.5522847 7,15 L7,9.01464844 L0.985379923,9.00206204 C0.440836381,9.00092251 6.66874965e-17,8.55916265 0,8.01461792 L0,8.01461792 C-6.66466866e-17,7.47040642 0.441170584,7.02923584 0.98538208,7.02923584 L7,7.02923584 L7,1 C7,0.44771525 7.44771525,1.01453063e-16 8,0 L8,0 C8.55228475,-1.01453063e-16 9,0.44771525 9,1 L9,7.02923584 L15.0072937,7.02923584 C15.5555503,7.02923584 16,7.47368559 16,8.02194214 L16,8.02194214 C16,8.57019869 15.5555503,9.01464844 15.0072937,9.01464844 L9,9.01464844 Z" />
			</svg>
		)
	default:
		return (
			<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g fill="currentColor" transform="translate(-54.000000, -186.000000)">
					<path d="M62,200 L64,200 L64,198 L62,198 L62,200 Z M63,186 C58.032,186 54,190.032 54,195 C54,199.968 58.032,204 63,204 C67.968,204 72,199.968 72,195 C72,190.032 67.968,186 63,186 Z M63,202 C59.14125,202 56,198.85875 56,195 C56,191.14125 59.14125,188 63,188 C66.85875,188 70,191.14125 70,195 C70,198.85875 66.85875,202 63,202 Z M63,190 C61.3425,190 60,191.392222 60,193.111111 L61.5,193.111111 C61.5,192.255556 62.175,191.555556 63,191.555556 C63.825,191.555556 64.5,192.255556 64.5,193.111111 C64.5,194.666667 62.25,194.472222 62.25,197 L63.75,197 C63.75,195.25 66,195.055556 66,193.111111 C66,191.392222 64.6575,190 63,190 Z"></path>
				</g>
			</svg>
		)
	}
}

export const Pattern = ( { name } ) => {
	switch ( name ) {
	case 'dots-compact':
		return (
			<svg width="100%" height="100%">
				<defs>
					<pattern id="fl-dots-compact" x="0" y="0" width="10" height="14" patternUnits="userSpaceOnUse">
						<g fill="transparent" stroke="currentColor" strokeWidth="1">
							<circle cx="2" cy="2" r="1" />
							<circle cx="2" cy="12" r="1" />
							<circle cx="7" cy="7" r="1" />
						</g>
					</pattern>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" fill="url(#fl-dots-compact)"></rect>
			</svg>
		)
	case 'dots':
		return (
			<svg width="100%" height="100%">
				<defs>
					<pattern id="fl-dots" x="0" y="0" width="12" height="18" patternUnits="userSpaceOnUse">
						<g fill="transparent" stroke="currentColor" strokeWidth="1">
							<circle cx="3" cy="3" r="2" />
							<circle cx="3" cy="15" r="2" />
							<circle cx="9" cy="9" r="2" />
						</g>
					</pattern>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" fill="url(#fl-dots)"></rect>
			</svg>
		)
	case 'stripes':
		return (
			<svg width="100%" height="100%">
				<defs>
					<pattern id="fl-stripes" x="0" y="0" width="12" height="14" patternUnits="userSpaceOnUse">
						<g fill="transparent" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
							<path d="M-1,9 3,13"></path>
							<path d="M-1,3 9,13"></path>
							<path d="M3,1 13,11"></path>
							<path d="M9,1 13,5"></path>
						</g>
					</pattern>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" fill="url(#fl-stripes)"></rect>
			</svg>
		)
	case 'stripes-compact':
		return (
			<svg width="100%" height="100%">
				<defs>
					<pattern id="fl-stripes-compact" x="0" y="0" width="10" height="8" patternUnits="userSpaceOnUse">
						<g fill="transparent" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
							<path d="M-1,4 2,7"></path>
							<path d="M1,1 L7,7"></path>
							<path d="M6,1 11,6"></path>
						</g>
					</pattern>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" fill="url(#fl-stripes-compact)"></rect>
			</svg>
		)
	default:
		return null
	}
}
