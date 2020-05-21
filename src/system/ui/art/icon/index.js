import React from 'react'
import { Icon as FLUID_Icon } from 'fluid/ui'
import Loading from './loading'
import Error from './error'
import Safely from './safely'
import Pencil from './pencil'
import Beaver from './beaver'

const Icon = { ...FLUID_Icon }

Icon.Loading = Loading
Icon.Error = Error
Icon.Pencil = Pencil
Icon.Beaver = Beaver

// Render a user-generated icon safely with Suspense and Error.Boundary
Icon.Safely = Safely

Icon.DragHandle = () => {
	return (
		<svg width="7px" height="14px" viewBox="0 0 7 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
				<path d="M1,1 L6,1"></path>
				<path d="M1,5 L6,5"></path>
				<path d="M1,9 L6,9"></path>
				<path d="M1,13 L6,13"></path>
			</g>
		</svg>
	)
}
Icon.DragHandle.displayName = 'Icon.DragHandle'

Icon.Close = () => {
	return (
		<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round">
				<path d="M13,1 L1,13"></path>
				<path d="M1,1 L13,13"></path>
			</g>
		</svg>
	)
}
Icon.Close.displayName = 'Icon.Close'

Icon.CloseCompact = () => {
	return (
		<svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(-2.000000, -2.000000)" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
				<path d="M11,3 L3,11"></path>
				<path d="M3,3 L11,11"></path>
			</g>
		</svg>
	)
}
Icon.CloseCompact.displayName = 'Icon.CloseCompact'

Icon.Expand = () => {
	return (
		<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="1 5 1 1 5 1"></polyline>
				<polyline points="9 1 13 1 13 5"></polyline>
				<polyline points="13 9 13 13 9 13"></polyline>
				<polyline points="5 13 1 13 1 9"></polyline>
			</g>
		</svg>
	)
}
Icon.Expand.displayName = 'Icon.Expand'

Icon.Collapse = () => {
	return (
		<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="1 5 5 5 5 1"></polyline>
				<polyline points="9 1 9 5 13 5"></polyline>
				<polyline points="13 9 9 9 9 13"></polyline>
				<polyline points="5 13 5 9 1 9"></polyline>
			</g>
		</svg>
	)
}
Icon.Collapse.displayName = 'Icon.Collapse'

Icon.SmallSpinner = () => {
	return (
		<svg width="16px"  height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={ { background: 'none' } }>
			<circle cx="50" cy="50" fill="none" stroke="#8a8a8a" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(299.801 50 50)">
				<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
			</circle>
		</svg>
	)
}
Icon.SmallSpinner.displayName = 'Icon.SmallSpinner'

Icon.Spinner = () => {
	return (
		<svg width="32px"  height="32px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={ { background: 'none' } }>
			<circle cx="50" cy="50" fill="none" stroke="#8a8a8a" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(299.801 50 50)">
				<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
			</circle>
		</svg>
	)
}
Icon.Spinner.displayName = 'Icon.Spinner'

Icon.Search = () => {
	return (
		<svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinejoin="round">
				<path d="M6.5,12 C3.46243388,12 1,9.53756612 1,6.5 C1,3.46243388 3.46243388,1 6.5,1 C9.53756612,1 12,3.46243388 12,6.5 C12,9.53756612 9.53756612,12 6.5,12 Z M15.8568331,15.8587942 L10.4910728,10.4930339 L15.8568331,15.8587942 Z"></path>
			</g>
		</svg>
	)
}
Icon.Search.displayName = 'Icon.Search'

Icon.Brightness = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10.0029 7C11.6398 7 13 8.35749 13 9.99706C13 11.6366 11.6398 13 10.0029 13C8.36016 13 7 11.6366 7 9.99706C7 8.35749 8.36016 7 10.0029 7Z" stroke="currentColor" strokeWidth="2" fill="none" />
		<rect x="9" y="1" width="2" height="3" rx="1" fill="currentColor"/>
		<rect x="15.6567" y="2.92896" width="2" height="3" rx="1" transform="rotate(45 15.6567 2.92896)" fill="currentColor"/>
		<rect x="9" y="16" width="2" height="3" rx="1" fill="currentColor"/>
		<rect x="5.05029" y="13.5356" width="2" height="3" rx="1" transform="rotate(45 5.05029 13.5356)" fill="currentColor"/>
		<rect x="16" y="9" width="3" height="2" rx="1" fill="currentColor"/>
		<rect x="14.9497" y="13.5356" width="3" height="2" rx="1" transform="rotate(45 14.9497 13.5356)" fill="currentColor"/>
		<rect x="1" y="9" width="3" height="2" rx="1" fill="currentColor"/>
		<rect x="4.34326" y="2.92896" width="3" height="2" rx="1" transform="rotate(45 4.34326 2.92896)" fill="currentColor"/>
	</svg>
)
Icon.Brightness.displayName = 'Icon.Brightness'

Icon.Moon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M12.5454 11.8065C13.3007 11.8065 14.05 11.6973 14.6727 11.5571C13.6062 13.4684 11.1995 15 8.3852 15C4.14468 15 1 12.0208 1 7.87097C1 5.15153 2.46609 2.59685 4.64661 1.36934C4.46112 2.1296 4.35226 3.01956 4.35226 3.70161C4.35226 6.10561 5.1287 8.15603 6.60223 9.60594C8.07382 11.0539 10.1423 11.8065 12.5454 11.8065Z" stroke="currentColor" strokeWidth="2" fill="none" />
	</svg>
)

Icon.RightCaret = () => (
	<svg width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<path fill="currentColor" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L8.41421356,7 L1.70710678,13.7071068 C1.31658249,14.0976311 0.683417511,14.0976311 0.292893219,13.7071068 C-0.0976310729,13.3165825 -0.0976310729,12.6834175 0.292893219,12.2928932 L5.58578644,7 L0.292893219,1.70710678 Z"></path>
	</svg>
)
Icon.RightCaret.displayName = 'Icon.RightCaret'

Icon.LeftCaret = () => (
	<svg width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<path fill="currentColor" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L8.41421356,7 L1.70710678,13.7071068 C1.31658249,14.0976311 0.683417511,14.0976311 0.292893219,13.7071068 C-0.0976310729,13.3165825 -0.0976310729,12.6834175 0.292893219,12.2928932 L5.58578644,7 L0.292893219,1.70710678 Z"  transform="scale(-1, 1) translate(-9, 0)"></path>
	</svg>
)
Icon.LeftCaret.displayName = 'Icon.LeftCaret'

Icon.DownCaretSmall = () => (
	<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
)
Icon.DownCaretSmall.displayName = 'Icon.DownCaretSmall'

Icon.Plus = () => (
	<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<path fill="currentColor" stroke="none" d="M9,9.01464844 L9,15 C9,15.5522847 8.55228475,16 8,16 L8,16 C7.44771525,16 7,15.5522847 7,15 L7,9.01464844 L0.985379923,9.00206204 C0.440836381,9.00092251 6.66874965e-17,8.55916265 0,8.01461792 L0,8.01461792 C-6.66466866e-17,7.47040642 0.441170584,7.02923584 0.98538208,7.02923584 L7,7.02923584 L7,1 C7,0.44771525 7.44771525,1.01453063e-16 8,0 L8,0 C8.55228475,-1.01453063e-16 9,0.44771525 9,1 L9,7.02923584 L15.0072937,7.02923584 C15.5555503,7.02923584 16,7.47368559 16,8.02194214 L16,8.02194214 C16,8.57019869 15.5555503,9.01464844 15.0072937,9.01464844 L9,9.01464844 Z" />
	</svg>
)

Icon.More = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 15C8.895 15 8 15.895 8 17C8 18.105 8.895 19 10 19C11.105 19 12 18.105 12 17C12 15.895 11.105 15 10 15Z" fill="currentColor" stroke="none" />
		<path d="M10 1C8.895 1 8 1.895 8 3C8 4.105 8.895 5 10 5C11.105 5 12 4.105 12 3C12 1.895 11.105 1 10 1Z" fill="currentColor" stroke="none" />
		<path d="M10 8C8.895 8 8 8.895 8 10C8 11.105 8.895 12 10 12C11.105 12 12 11.105 12 10C12 8.895 11.105 8 10 8Z" fill="currentColor" stroke="none" />
	</svg>
)
Icon.More.displayName = 'Icon.More'

Icon.Ellipsis = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M5 10C5 8.895 4.105 8 3 8C1.895 8 1 8.895 1 10C1 11.105 1.895 12 3 12C4.105 12 5 11.105 5 10Z" fill="currentColor"/>
		<path d="M19 10C19 8.895 18.105 8 17 8C15.895 8 15 8.895 15 10C15 11.105 15.895 12 17 12C18.105 12 19 11.105 19 10Z" fill="currentColor"/>
		<path d="M12 10C12 8.895 11.105 8 10 8C8.895 8 8 8.895 8 10C8 11.105 8.895 12 10 12C11.105 12 12 11.105 12 10Z" fill="currentColor"/>
	</svg>
)
Icon.Ellipsis.displayName = 'Icon.Ellipsis'

Icon.Audio = () => (
	<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M16.9212 13.8832C17.2882 14.1074 17.7572 14.0019 18.0086 13.6261C19.2728 11.7668 20 9.45924 20 7C20 4.54736 19.2592 2.23976 18.0086 0.373903C17.7572 -0.00190514 17.2882 -0.107395 16.9212 0.116771C16.527 0.354124 16.4658 0.822236 16.7377 1.2442C17.8047 2.85951 18.4572 4.86383 18.4572 7C18.4572 9.13617 17.8251 11.1669 16.7377 12.7624C16.4658 13.1778 16.527 13.6459 16.9212 13.8832ZM1.67872 10.0328H3.66328C3.72445 10.0328 3.77203 10.046 3.81281 10.0856L6.84402 12.7162C7.23142 13.0525 7.53726 13.2173 7.93145 13.2173C8.51595 13.2173 8.95092 12.7888 8.95092 12.2284V1.80461C8.95092 1.2376 8.51595 0.789271 7.92466 0.789271C7.53726 0.789271 7.2586 0.954099 6.84402 1.31672L3.81281 3.9276C3.76523 3.96716 3.72445 3.98035 3.66328 3.98035H1.67872C0.577698 3.98035 0 4.55395 0 5.68137V8.33181C0 9.46583 0.577698 10.0328 1.67872 10.0328ZM13.8356 12.0108C14.2094 12.2284 14.658 12.136 14.9095 11.78C15.8406 10.4614 16.3707 8.77355 16.3707 7C16.3707 5.22645 15.8474 3.53201 14.9095 2.21998C14.658 1.86395 14.2094 1.77165 13.8356 1.98922C13.4346 2.22657 13.3871 2.70128 13.6657 3.12983C14.3861 4.20451 14.8143 5.5627 14.8143 7C14.8143 8.4373 14.3861 9.80208 13.6657 10.8702C13.3871 11.2987 13.4346 11.7734 13.8356 12.0108ZM1.86902 8.6351C1.65833 8.6351 1.54279 8.52961 1.54279 8.32522V5.69456C1.54279 5.49017 1.65833 5.37809 1.86902 5.37809H4.0235C4.22739 5.37809 4.37011 5.34512 4.53323 5.19348L7.19744 2.84633C7.22462 2.81336 7.2654 2.79358 7.30618 2.79358C7.36735 2.79358 7.40813 2.83314 7.40813 2.89907V11.1075C7.40813 11.1735 7.36735 11.213 7.30618 11.213C7.2722 11.213 7.23142 11.1932 7.19744 11.1603L4.53323 8.8197C4.37011 8.67466 4.22739 8.6351 4.0235 8.6351H1.86902ZM10.7636 10.1449C11.1102 10.3625 11.5588 10.2834 11.7967 9.95372C12.388 9.17573 12.7346 8.10765 12.7346 7C12.7346 5.89235 12.388 4.83086 11.7967 4.04628C11.5588 3.71662 11.1102 3.6441 10.7636 3.85508C10.3626 4.10562 10.2879 4.56054 10.6005 5.04184C10.9607 5.5561 11.1782 6.26816 11.1782 7C11.1782 7.73184 10.9539 8.45049 10.6005 8.96475C10.2879 9.44605 10.3626 9.89438 10.7636 10.1449Z" fill="currentColor"/>
	</svg>
)

Icon.Video = () => {
	return (
		<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fillRule="evenodd" clipRule="evenodd" d="M2.05173 14.228L12.1897 8.21476C12.3506 8.11931 12.3506 7.88069 12.1897 7.78524L2.05173 1.77204C1.89081 1.6766 1.68966 1.7959 1.68966 1.9868L1.68966 14.0132C1.68966 14.2041 1.8908 14.3234 2.05173 14.228ZM13.0345 9.71806C14.3218 8.95448 14.3218 7.04552 13.0345 6.28194L2.89655 0.268744C1.6092 -0.494838 1.22544e-06 0.459639 1.15869e-06 1.9868L6.32995e-07 14.0132C5.66241e-07 15.5404 1.6092 16.4948 2.89655 15.7313L13.0345 9.71806Z" fill="currentColor"/>
		</svg>
	)
}

Icon.Document = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M5.04179 20H14.9485C16.8795 20 17.8403 19.0205 17.8403 17.0802V8.61007C17.8403 7.40672 17.7004 6.88433 16.9541 6.1194L11.8142 0.886194C11.1052 0.158582 10.5175 0 9.47276 0H5.04179C3.12015 0 2.15 0.988806 2.15 2.9291V17.0802C2.15 19.0298 3.11082 20 5.04179 20ZM5.10709 18.4981C4.14627 18.4981 3.65187 17.9851 3.65187 17.0522V2.95709C3.65187 2.03358 4.14627 1.50187 5.11642 1.50187H9.26754V6.92164C9.26754 8.09701 9.85522 8.67537 11.0213 8.67537H16.3384V17.0522C16.3384 17.9851 15.844 18.4981 14.8739 18.4981H5.10709ZM11.1892 7.26679C10.816 7.26679 10.6761 7.11754 10.6761 6.7444V1.79104L16.0493 7.26679H11.1892Z" fill="currentColor"/>
	</svg>
)

Icon.DownCaret = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M16 7L10 13L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
		</svg>
	)
}

Icon.UpCaret = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M16 13L10 7L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
		</svg>
	)
}

Icon.Return = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M6.79004 17.0781C7.29102 17.0781 7.61621 16.7354 7.61621 16.2607C7.61621 16.0059 7.51953 15.8301 7.37012 15.6807L5.71777 14.0723L4.54883 13.1143L6.15723 13.1934H14.5068C16.3262 13.1934 17.0732 12.3936 17.0732 10.6182V6.56641C17.0732 4.74707 16.3262 4 14.5068 4H10.8682C10.3584 4 10.0068 4.37793 10.0068 4.84375C10.0068 5.30078 10.3584 5.67871 10.8682 5.67871H14.4717C15.1484 5.67871 15.4121 5.94238 15.4121 6.61914V10.5654C15.4121 11.2422 15.1484 11.5059 14.4717 11.5059H6.15723L4.54883 11.585L5.71777 10.627L7.37012 9.02734C7.51953 8.87793 7.61621 8.69336 7.61621 8.44727C7.61621 7.96387 7.29102 7.62988 6.79004 7.62988C6.58789 7.62988 6.35059 7.72656 6.18359 7.88477L2.26367 11.7256C2.08789 11.8926 2 12.1211 2 12.3496C2 12.5781 2.08789 12.8066 2.26367 12.9736L6.18359 16.8145C6.35059 16.9814 6.58789 17.0781 6.79004 17.0781Z" fill="currentColor" stroke="none" />
	</svg>
)

export default Icon
