import 'Popup/popup.css'


const autoclick = {
	interval: document.querySelector('#autoclick-interval'),
	set: document.querySelector('#set-autoclick'),
	clear: document.querySelector('#clear-autoclick'),
	golden: document.querySelector('#autoclick-golden'),
}
const test = document.querySelector('#test')


autoclick.set.onclick = () =>
	getActiveTab()
		.then(enableAutoclick(parseInterval(autoclick.interval)))
		.then(() => browser.storage.local.set({
			autoclick: { interval: parseInterval(autoclick.interval) }
		}))

autoclick.clear.onclick = () =>
	getActiveTab()
		.then(disableAutoclick)
		.then(() => browser.storage.local.remove('autoclick'))

autoclick.golden.onclick = () =>
	getActiveTab()
		.then(enableAutoclickCookies)
		.then(() => browser.storage.local.set({
			autoclick_shimmers: [ 'golden' ],
		}))

init()

const INTERVAL_PATTERN = /\d+/

function parseInterval({ value }) {
	if (!value) return 500
	return (INTERVAL_PATTERN.test(value) && parseInt(value) > 50
		? parseInt(value)
		: 50
	)
}

function getActiveTab() {
	return browser.tabs.query({ active: true, currentWindow: true })
		.then(([ tab ]) => tab.id)
}

const enableAutoclick = interval => tab_id => {
	return browser.tabs.sendMessage(tab_id, {
		action: 'enableAutoclick',
		interval,
	})
}

function disableAutoclick(tab_id) {
	return browser.tabs.sendMessage(tab_id, {
		action: 'disableAutoclick'
	})
}

function enableAutoclickCookies(tab_id) {
	return browser.tabs.sendMessage(tab_id, {
		action: 'enableShimmer',
		type: 'golden',
	})
}

const loadAutoclick = value =>
	autoclick.interval.value = value.interval || ''

const loadAutoclickGolden = (shimmers = []) =>
	golden.checked = shimmers.includes('golden')

function init() {
	browser.storage.local.get([ 'autoclick', 'autoclick_shimmers' ])
		.then(value => {
			test.textContent = JSON.stringify(value, null, 2)
			return value
		})
		.then(({ autoclick, autoclick_shimmers }) => {
			loadAutoclick(autoclick)
			loadAutoclickGolden(autoclick_shimmers)
		})
}
