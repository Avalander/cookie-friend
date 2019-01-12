const Game = window.wrappedJSObject.Game

const state = {
	autoclick: null,
	shimmers: []
}

const delay = time => new Promise((resolve) =>
	setTimeout(resolve, time)
)

const actions = {
	enableAutoclick: ({ interval }) => {
		clearInterval(state.autoclick)
		state.autoclick = setInterval(
			Game.ClickCookie,
			interval
		)
	},
	disableAutoclick: () => {
		clearInterval(state.autoclick)
		browser.storage.local.remove('autoclick')
	},
	setShimmers: ({ shimmers: value }) => {
		state.shimmers = value
	}
}

const getHandler = action =>
	(actions[action]
		? actions[action]
		: () => console.warn(`No handler found for action '${action}'.`)
	)

delay(800)
	.then(() => {
		console.log('Running Cookie Friend!')

		browser.runtime.onMessage.addListener(message => {
			console.debug('Message', JSON.stringify(message, null, 2))

			const { action, ...props } = message
			getHandler(action)(props)
		})

		browser.storage.local.get([ 'autoclick', 'shimmers' ])
			.then(({ autoclick, shimmers}) => {
				if (autoclick) getHandler('enableAutoclick') (autoclick)
				if (shimmers) getHandler('setShimmers') ({ shimmers })
			})
		
		setInterval(() => {
			Array.from(Game.shimmers)
				.filter(({ type, wrath }) => state.shimmers.includes(type) && wrath == 0)
				.forEach(x => x.pop())
		}, 500)
	})
