import { h } from 'hyperapp'


const tags = [
	'button',
	'div',
	'header',
	'h3',
	'input',
	'label',
	'main',
	'section',
	'span',
]

const vnode = name => (attrs, children) =>
	(typeof attrs === 'object' && !Array.isArray(attrs)
		? h(name, attrs, children)
		: h(name, {}, attrs)
	)

export const button = vnode('button')
export const div = vnode('div')
export const header = vnode('header')
export const h3 = vnode('h3')
export const input = vnode('input')
export const label = vnode('label')
export const main = vnode('main')
export const pre = vnode('pre')
export const section = vnode('section')
export const span = vnode('span')
