import 'Popup/popup.css'

import { app } from 'hyperapp'

import {
	button,
	div,
	input,
	label,
	main,
	pre,
	section,
	span,
} from 'Popup/html'
import {
	Header,
	Switch,
} from 'Popup/components'


// State

const state = {
	autoclick: {
		interval: '',
		enabled: false,
	},
	shimmers: {
		golden: false,
	},
	debug: 'Test',
}


// Actions

const sendMessage = (action, props) =>
	browser.tabs.query({ active: true, currentWindow: true })
		.then(([ tab ]) => tab.id)
		.then(tab_id => browser.tabs.sendMessage(tab_id, {
			action,
			...props
		}))

const saveState = (key, value) =>
	browser.storage.local.set({
		[key]: value,
	})

const removeState = (key) =>
	browser.storage.local.remove(key)

const INTERVAL_PATTERN = /\d+/

const parseInterval = value => {
	if (!value) return Promise.resolve(500)
	return (INTERVAL_PATTERN.test(value) && parseInt(value) > 50
		? Promise.resolve(parseInt(value))
		: Promise.resolve(50)
	)
}

const actions = {
	autoclick: {
		setInterval: event => state =>
			({
				...state,
				interval: event.target.value,
			}),
		setEnabled: enabled => state =>
			({
				...state,
				enabled,
			}),
		startInterval: () => (state, actions) =>
			parseInterval(state.interval)
				.then(interval => Promise.all([
					sendMessage('enableAutoclick', { interval }),
					saveState('autoclick', {
						...state,
						interval,
						enabled: true,
					})
				]))
				.then(() => actions.setEnabled(true)),
		clearInterval: () => (state, actions) =>
			sendMessage('disableAutoclick')
				.then(() => removeState('autoclick'))
				.then(() => actions.setEnabled(false)),
	},
	shimmers: {
		setShimmer: ([ name, value ]) => state =>
			({
				...state,
				[name]: value
			}),
		setShimmers: () => state => {
			const shimmers = Object.entries(state)
				.filter(([ _, enabled ]) => enabled)
				.map(([ name ]) => name)
			return sendMessage('setShimmers', { shimmers })
				.then(() => saveState('shimmers', shimmers))
		},
		toggleGolden: () => (state, actions) => {
			actions.setShimmer([ 'golden', !state.golden ])
			actions.setShimmers([ 'golden' ])
		},
	},
}


// View

const view = (state, actions) =>
	main({ class: 'popup-content' }, [
		div([
			Header('Autoclick'),
			section([
				label('Interval (ms)'),
				input({
					type: 'text',
					placeholder: '500',
					value: state.autoclick.interval,
					oninput: actions.autoclick.setInterval,
				}),
				button(
					{ onclick: actions.autoclick.startInterval },
					'Set'
				),
				button(
					{ onclick: actions.autoclick.clearInterval },
					'Cancel'
				),
			]),
			section({ class: 'control' }, [
				span('Autoclick Golden Cookies'),
				Switch({
					on: state.shimmers.golden,
					onclick: actions.shimmers.toggleGolden,
				}),
			])
		]),
		div([
			Header('Debug'),
			pre(JSON.stringify(state, null, 2)),
		])
	])

browser.storage.local.get([ 'autoclick', 'shimmers' ])
	.then(({ autoclick, shimmers = [] }) => {
		state.autoclick = {
			...state.autoclick,
			...autoclick,
		}
		state.shimmers = {
			...state.shimmers,
			...shimmers.reduce((prev, x) => ({
				...prev,
				[x]: true,
			}), {})
		}
		app(state, actions, view, document.body)
	})
