import {
	header,
	h3,
	input,
	label,
	span,
} from 'Popup/html'


export const Header = title =>
	header([
		h3(title),
	])

export const Switch = ({ on, onclick }) =>
	label({ class: 'switch' }, [
		input({
			type: 'checkbox',
			checked: on
		}),
		span({
			class: 'slider',
			onclick,
		}),
	])
