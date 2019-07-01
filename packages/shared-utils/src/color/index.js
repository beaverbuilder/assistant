export const isColor = color => {
	const el = new Option()
	el.style.color = color
	return el.style.color !== ''
}
