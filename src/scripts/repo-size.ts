document.addEventListener('DOMContentLoaded', async () => {
	const url = location.href;
	const BASE_URL = 'https://api.github.com/repos'
	const repo = url.replace('https://github.com/', '')
	const [org, project,] = repo.split('/')

	const token = await fetch(browser.runtime.getURL('tk.txt')).then(async r => await r.text());

	const headers = {
		Authorization: `token ${token}`,
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0'
	}

	const req = new Request(`${BASE_URL}/${org}/${project}`, { headers: new Headers(headers) })
	const res = await fetch(req).then(async r => await r.json())

	const parsed_size = parseSize(res.size)

	const repo_details_section = document.querySelector('div#repository-details-container>ul') as HTMLDivElement;
	if (repo_details_section) {
		const new_item = document.createElement('li', {})
		Object.assign(new_item.style, {
			height: '1.75rem',
			marginRight: '1rem',
			display: 'flex',
			alignItems: 'center',
			filter: 'grayscale(1)'
		});
		new_item.innerHTML = `<img src="${browser.runtime.getURL('package.png')}" width="20"/>&nbsp;<span id="repo-size-result">${parsed_size}<span>`;
		repo_details_section.prepend(new_item)
	}
})

// https://stackoverflow.com/a/14919494
function parseSize(bytes: number) {
	const thresh = 1024;

	if (Math.abs(bytes) < thresh) {
		return `${bytes} B`;
	}

	const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10;

	let b = bytes;
	do {
		b /= thresh;
		++u;
	} while (Math.round(Math.abs(b) * r) / r >= thresh && u < units.length - 1);

	return `${b.toFixed(1)} ${units[u]}`;
}
