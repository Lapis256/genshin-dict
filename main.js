const url = "https://script.google.com/macros/s/AKfycbzfuH8TEwajGUIb48aq2HgIGudigKfPAB-7Na6ulFMv9eSgjJsXnpYwsQ/exec";
const GOOGLE = 0;
const MICROSOFT = 1;
const GBOARD = 2;
let data;

async function createBlob(ime,str) {
	switch (ime) {
		case GOOGLE:
			break;
		case MICROSOFT:
			break;
		case GBOARD:
			let zip = new JSZip();
			zip.file("dictionary.txt",str);
			return await zip.generateAsync({ type: "blob" });
	}

	return new Blob([str]);
}

function strToUint8Arr(str) {
	var str = btoa(unescape(encodeURIComponent(str))),
		charList = str.split(''), uintArray = [];
	for (var i = 0; i < charList.length; i++) {
	  uintArray.push(charList[i].charCodeAt(0));
	}
	return new Uint8Array(uintArray);
  }

function stringToByteArray(str) {
	var array = new (window.Uint8Array !== void 0 ? Uint8Array : Array)(str.length);
	var i;
	var il;

	for (i = 0,il = str.length; i < il; ++i) {
		array[i] = str.charCodeAt(i) & 0xff;
	}

	return array;
}

function createInput(value) {
	let input = document.createElement("input")
	input.type = "checkbox";
	input.name = "type";
	input.value = value;
	input.checked = true;
	return input;
}

function createLabel(type) {
	let label = document.createElement("label");
	let input = createInput(type);
	label.appendChild(input);
	label.append(type);
	return label;
}

function loadData() {
	fetch(url).then(r => {
		r.json().then(d => {
			data = d;

			let form = document.createElement("form");
			form.name = "typeForm";
			let types = [...new Set(d.map(ar => ar[3].split("_")[0]))];
			for (type of types) {
				let label = createLabel(type);
				form.appendChild(label);
			}
			let form_div = document.getElementById("form");
			form_div.innerHTML = "";
			form_div.appendChild(form);
		});
	});
}

function getSelectedType() {
	return [...document.typeForm.type].filter(x => x.checked);
}

function formattingData(ime,type) {
	let text = ""
	data.filter(d => type.filter(t => d[3].startsWith(t.value)).length)
		.forEach(d => {
			switch (ime) {
				case MICROSOFT:
					d[2] = d[2].replace("地名","地名その他");
					break;
				case GBOARD:
					d[2] = "ja-JP";
					break;
			}
			text += (d.join("	") + "\n");
		});
	return text
}

function download(ime) {
	if (!data) {
		alert("スプレッドシートを読み込んでください。");
		return;
	}

	let type = getSelectedType();
	if (type.length <= 0) {
		alert("一つ以上選択してください。");
		return;
	}

	let dict_str = formattingData(ime,type);
	let aTag = document.createElement("a");
	createBlob(ime,dict_str).then((blob) => {
		let name = (ime == GBOARD) ? "dict.zip" : "dict.txt";
		saveAs(blob,name);
	});
}
