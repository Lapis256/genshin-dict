const url = "https://script.google.com/macros/s/AKfycbzfuH8TEwajGUIb48aq2HgIGudigKfPAB-7Na6ulFMv9eSgjJsXnpYwsQ/exec";
const GOOGLE = 0;
const MICROSOFT = 1;
const GBOARD = 2;
let data;

function createInput(value) {
	let input = document.createElement("input");
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
	let button = document.getElementById("load");
	button.onclick = null;
	button.innerText = "読み込み中…";
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

			button.remove();
		});
	});
}

function getSelectedType() {
	return [...document.typeForm.type].filter(x => x.checked);
}

function formattingData(ime,type) {
	let text = "";
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
	return text;
}

async function createBlob(ime,str) {
	switch (ime) {
		case MICROSOFT:
			let encoder = new TextEncoder("Shift_JIS",{ NONSTANDARD_allowLegacyEncoding: true });
			str = encoder.encode(str);
			break;
		case GBOARD:
			let zip = new JSZip();
			zip.file("dictionary.txt",str);
			return await zip.generateAsync({type: "blob"});
	}

	return new Blob([str]);
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
