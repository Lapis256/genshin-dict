url = "https://script.google.com/macros/s/AKfycbzfuH8TEwajGUIb48aq2HgIGudigKfPAB-7Na6ulFMv9eSgjJsXnpYwsQ/exec";
GOOGLE = 0;
MICROSOFT = 1;
GBOARD = 2;

async function createBlob (type) {
	let res = await fetch(url);
	let data = await res.json();

	let text = ""
	data.forEach(d => {
		switch (type) {
			case MICROSOFT:
				d[2] = d[2].replace("地名","地名その他");
				break;
			case GBOARD:
				d[2] = "ja-JP";
				break;
		}
		text += (d.join("	") + "\n");
	});

	switch (type) {
		case GOOGLE:
			break;
		case MICROSOFT:
			break;
		case GBOARD:
			let zip = new Zlib.Zip();
			zip.addFile(stringToByteArray(text), {
				filename: stringToByteArray("dictionary.txt")
			});
			let compressed = zip.compress();
			return new Blob([compressed], { 'type': 'application/zip' });
	}

	return new Blob([text])
}

function stringToByteArray(str) {
    var array = new (window.Uint8Array !== void 0 ? Uint8Array : Array)(str.length);
    var i;
    var il;

    for (i = 0, il = str.length; i < il; ++i) {
        array[i] = str.charCodeAt(i) & 0xff;
    }

    return array;
}

function download(type) {
	let aTag = document.createElement("a");
	createBlob(type).then((blob) => {
		aTag.download = type == GBOARD ? "dict.zip" : "dict.txt"
		aTag.href = window.URL.createObjectURL(blob);
		aTag.click()
	});
}
