document.addEventListener('DOMContentLoaded', async () => {
	const url = location.href;
	const BASE_URL = 'https://api.github.com/repos'
	const repo = url.replace('https://github.com', '')
	const token = await fetch(browser.runtime.getURL('tk.txt')).then(async r => await r.text());

	const headers = {
		Authorization: `token ${token}`,
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0'
	}

	const req = new Request(`${BASE_URL}${repo}`, { headers: new Headers(headers) })
	const res = await fetch(req).then(async r => await r.json())

	const parsed_size = parseSize(res.size)

	const repo_title_section = document.querySelector('div#repo-title-component') as HTMLDivElement;
	if (repo_title_section) {
		const new_section = document.createElement('section', {})
		Object.assign(new_section.style, {
			marginLeft: '1rem',
			display: 'flex',
			alignItems: 'center',
		});
		new_section.innerHTML = `
<img src="${browser.runtime.getURL('package.png')}" width="24"/>
&nbsp;
<span id="repo-size-result">${parsed_size}<span>
`;
		repo_title_section.appendChild(new_section)
	}
})

// https://stackoverflow.com/a/14919494
function parseSize(bytes: number) {
	const thresh = 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(1) + ' ' + units[u];
}
