const autoclick = {
	interval: document.querySelector('#autoclick-interval'),
	set: document.querySelector('#set-autoclick'),
	clear: document.querySelector('#clear-autoclick'),
}
const test = document.querySelector('#test')


autoclick.set.onclick = () =>
	getActiveTab()
		.then(enableAutoclick(autoclick.interval.value || 500))

autoclick.clear.onclick = () =>
	getActiveTab()
		.then(disableAutoclick)


function getActiveTab() {
	return browser.tabs.query({ active: true, currentWindow: true })
		.then(([ tab ]) => tab.id)
}

const enableAutoclick = interval => tab_id => {
	browser.tabs.sendMessage(tab_id, {
		action: 'enableAutoclick',
		interval,
	})
}

function disableAutoclick(tab_id) {
	browser.tabs.sendMessage(tab_id, {
		action: 'disableAutoclick'
	})
}
