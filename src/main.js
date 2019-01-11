const Game = window.wrappedJSObject.Game

let autoclick = null

const actions = {
	enableAutoclick: ({ interval }) => {
		clearInterval(autoclick)
		autoclick = setInterval(
			Game.ClickCookie,
			interval
		)
	},
	disableAutoclick: () => {
		clearInterval(autoclick)
	}
}

const getHandler = action =>
	(actions[action]
		? actions[action]
		: () => console.warn(`No handler found for action '${action}'.`)
	)

browser.runtime.onMessage.addListener(message => {
	console.debug('Message', JSON.stringify(message, null, 2))

	const { action, ...props } = message
	getHandler(action) (props)
})
