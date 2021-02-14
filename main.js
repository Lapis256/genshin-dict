URl = "https://script.google.com/macros/s/AKfycbzfuH8TEwajGUIb48aq2HgIGudigKfPAB-7Na6ulFMv9eSgjJsXnpYwsQ/exec";
GOOGLE = 0;
MICROSOFT = 1;
GBOARD = 2;

async function createBlob (type) {
	let res = await fetch(URL, {mode: "cors"});
	let data = await res.json();
	console.log(JSON.stringify(data));

	switch (type) {
		case GOOGLE:
			break;
		case MICROSOFT:
			break;
		case GBOARD:
			break;
	}

	return new Blob([JSON.stringify(data)])
}

function download(type) {
	let aTag = document.createElement("a");
	createBlob(type).then((blob) => {
		aTag.href = window.URL.createObjectURL(blob);
		aTag.click()
	});
}
