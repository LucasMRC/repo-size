enum Actions {
	REQUESTED_TOKEN = 'REQUESTED_TOKEN',
}

document.addEventListener('DOMContentLoaded', () => {
	let { href } = location
	const observer = new MutationObserver(() => {
		const url = location.href
		if (url !== href) {
			href = url
			handle_repo_size(url)
		}
	})

	observer.observe(document.body, { childList: true, subtree: true })

	handle_repo_size(href)
})

// https://stackoverflow.com/a/14919494
function parseSize(bytes: number) {
	const thresh = 1024

	if (Math.abs(bytes) < thresh) {
		return `${bytes} B`
	}

	const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
	let u = -1
	const r = 10

	let b = bytes
	do {
		b /= thresh
		++u
	} while (Math.round(Math.abs(b) * r) / r >= thresh && u < units.length - 1)

	return `${b.toFixed(1)} ${units[u]}`
}

function handle_repo_size(url: string) {
	const BASE_URL = 'https://api.github.com/repos'
	const repo = url.replace('https://github.com/', '')
	const [org, project,] = repo.split('/')

	browser.runtime.sendMessage({ action: Actions.REQUESTED_TOKEN }).then(async ({data: token}) => {
		if (!token) return
		const repo_details_section = document.querySelector('div#repository-details-container>ul') as HTMLDivElement
		if (!repo_details_section) return

		const headers = {
			Authorization: `token ${token}`,
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0'
		}

		const req = new Request(`${BASE_URL}/${org}/${project}`, { headers: new Headers(headers) })
		const res = await fetch(req).then(async r => await r.json())

		const parsed_size = parseSize(res.size)

		if (repo_details_section) {
			const repo_size_details = repo_details_section.querySelector("li#repo-size-info")
			if (repo_size_details) return
			const new_item = document.createElement('li', {})
			Object.assign(new_item.style, {
				height: '1.75rem',
				marginRight: '1rem',
				display: 'flex',
				alignItems: 'center',
				filter: 'grayscale(1)'
			})
			new_item.id = 'repo-size-info'
			new_item.innerHTML = `<img src="${browser.runtime.getURL('package.png')}" width="20"/>&nbsp<span id="repo-size-result">${parsed_size}<span>`;
			repo_details_section.prepend(new_item)
		}
	})

}
