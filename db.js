
let db;
let notesContainer;

function startBD() {
    notesContainer = document.getElementById('note-container');
    let btnSaveNote = document.getElementById('btn-save-note');
    btnSaveNote.addEventListener('click', saveNote)
    let connection = indexedDB.open("data-base");
    connection.addEventListener('error', errorEvent);
    connection.addEventListener('success', successEvent);
    connection.addEventListener('upgradeneeded', upgradeEvent);

}

function errorEvent(event) {
    console.log(event.code, event.message);
}

function successEvent(event) {
    bd = event.target.result;
    print()
}

function upgradeEvent(event) {
    let noteDb = event.target.result;
    let notes = noteDb.createObjectStore('notes', { keyPath: 'id' });
    notes.createIndex('findID', 'id', { unique: false });
}

function saveNote() {
    let note_ID = Date.now()
    let note_title = document.getElementById('note-title').value;
    let note_detail = document.getElementById('note-detail').value;
    let note_date = new Date().toLocaleDateString()
    let transaction = bd.transaction(['notes'], 'readwrite');
    let notes = transaction.objectStore('notes')
    transaction.addEventListener('complete', print);

    notes.add({
        id: note_ID,
        title: note_title,
        detail: note_detail,
        date: note_date
    })
    document.getElementById('note-title').value = ''
    document.getElementById('note-detail').value = ''
}

function print() {
    notesContainer.innerHTML = ''
    let transaction = bd.transaction(['notes'], 'readonly')
    let notes = transaction.objectStore('notes')
    let cursor = notes.openCursor()
    cursor.addEventListener('success', printNotes)
}


/*function changeTextColor(value) {
    let textColor = document.getElementById('color-text')
    textColor.classList.add(`btn-text-${value}`)
    let textColorTitle = document.getElementById('color-title')
    textColorTitle.classList.add(`btn-text-${value}`)

}*/


function printNotes(event) {

    let cursor = event.target.result
    if (cursor) {
        notesContainer.innerHTML += `<div id="card-container" class="card card-note animate__animated" style="width: 18rem;">
        <div class="card-header-note">
        <div class="container-title"><h6 id="color-title" class="card-title">${cursor.value.title}</h6></div>
        <div class="container-trash"><img src='/public/img/delete-icon-2.png' type="button" id="btn-delete-note" class="btn delete-icon" onclick = deleteNote(${cursor.value.id}) ></img></div>
        </div>
        <div class="card-body">
            <p id="color-text" class="card-text">${cursor.value.detail}</p>
        </div>
            <div class="card-footer-note text-muted"><p class="text-date">${cursor.value.date}</p></div>
        </div>`
    } /*else {

        notesContainer.innerHTML = `<div class="container-icon">
                                    <img class="icon-notes" src="/public/img/happy-1.png">
                                    <p class="text-icon">not notes found</p>
                                    </div>`

    }*/



    if (cursor != null) {
        cursor.continue()
    }



}

function deleteNote(key) {

    let transaction = bd.transaction(["notes"], 'readwrite');
    let notes = transaction.objectStore('notes');
    transaction.addEventListener('complete', print);
    let request = notes.delete(key);

}





window.addEventListener('load', startBD);
