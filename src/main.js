const Game = window.wrappedJSObject.Game

let autoclick = null

const delay = time => new Promise((resolve) =>
	setTimeout(resolve, time)
)

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
		browser.storage.local.remove('autoclick')
	}
}

const getHandler = action =>
	(actions[action]
		? actions[action]
		: () => console.warn(`No handler found for action '${action}'.`)
	)

delay(500)
	.then(() => {
		console.log('Running Cookie Friend!')

		browser.runtime.onMessage.addListener(message => {
			console.debug('Message', JSON.stringify(message, null, 2))

			const { action, ...props } = message
			getHandler(action)(props)
		})

		browser.storage.local.get('autoclick')
			.then(x => {
				if (x) getHandler('enableAutoclick')(x.autoclick)
			})
	})
