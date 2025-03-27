enum Actions {
	PROVIDED_TOKEN = 'PROVIDED_TOKEN',
	REQUESTED_TOKEN = 'REQUESTED_TOKEN',
	SEND_TOKEN = 'SEND_TOKEN',
	TOKEN_EXISTS = 'TOKEN_EXISTS',
}

enum Storage_keys {
	TOKEN = 'TOKEN'
}

browser.runtime.onStartup.addListener(() => {
	browser.storage.local.get(Storage_keys.TOKEN)
		.then(({TOKEN: token}) => {
			browser.runtime.sendMessage({ action: Actions.TOKEN_EXISTS, data: !!token })
		})
		.catch(() => browser.runtime.sendMessage({ action: Actions.TOKEN_EXISTS, data: false }))
})

browser.runtime.onMessage.addListener(({ action, data }: Message) => {
	console.debug('[BG]: Message received', action, data ? { data } : '')
	switch (action) {
		case Actions.PROVIDED_TOKEN:
			return store_token(data as string);
		case Actions.REQUESTED_TOKEN:
			return send_token()
		case Actions.TOKEN_EXISTS:
			return check_token()
		default:
			console.error(`Action ${action} unknown.`)
			return false
	}
})

function send_token(): Promise<Message> {
	return browser.storage.local.get(Storage_keys.TOKEN)
		.then(({TOKEN: token}) => {
			const m: Message = {
				action: Actions.SEND_TOKEN,
				data: token
			}
			console.debug({m})
			return m
		})
}

function store_token(token: string): Promise<boolean> {
	return browser.storage.local.set({[Storage_keys.TOKEN]: token})
		.then(() => true).catch(() => false)
}

function check_token(): Promise<boolean> {
	return browser.storage.local.get(Storage_keys.TOKEN)
		.then(({ TOKEN: token }) => {
			return !!token
		})
}
