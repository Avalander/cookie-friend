const Game = window.wrappedJSObject.Game

let autoclick = null
let shimmers = []

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
	},
	setShimmers: ({ shimmers: value }) => {
		shimmers = value
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
				.filter(({ type, wrath }) => shimmers.includes(type) && wrath == 0)
				.forEach(x => x.pop())
		}, 500)
	})
