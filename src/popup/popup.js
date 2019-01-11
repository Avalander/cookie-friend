const autoclick = {
	interval: document.querySelector('#autoclick-interval'),
	set: document.querySelector('#set-autoclick'),
	clear: document.querySelector('#clear-autoclick'),
}
const test = document.querySelector('#test')


autoclick.set.onclick = () =>
	getActiveTab()
		.then(enableAutoclick(autoclick.interval.value || 500))
		.then(() => browser.storage.local.set({
			autoclick: { interval: autoclick.interval.value || 500 }
		}))

autoclick.clear.onclick = () =>
	getActiveTab()
		.then(disableAutoclick)
		.then(() => browser.storage.local.remove('autoclick'))

init()

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

function init() {
	browser.storage.local.get('autoclick')
		.then(value => {
			test.textContent = JSON.stringify(value, null, 2)
			return value
		})
		.then(value => value
			? autoclick.interval.value = value.autoclick.interval
			: null
		)
}
