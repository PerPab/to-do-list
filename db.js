
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
    if (note_title.trim() === '' || note_detail.trim() === '') {
        Swal.fire({
            title: 'Complete the title and details before save!',
            background: '#f5f5f5',
            color: '#364F6B',
            timer: 2000,
            showConfirmButton: false,
            position: 'top'
        })
        return;
    }
    let note_date = new Date().toLocaleDateString()
    let transaction = bd.transaction(['notes'], 'readwrite');
    let notes = transaction.objectStore('notes')
    transaction.addEventListener('complete', print);


    notes.add({
        id: note_ID,
        title: note_title,
        detail: note_detail,
        date: note_date,
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

function printNotes(event) {


    let cursor = event.target.result
    if (cursor) {
        notesContainer.innerHTML += `<div id="card-container" class="card card-note animate__animated " style="width: 18rem;">
        <div class="card-header-note btn-bg-3">
        <div class="container-title"><h6 id="color-title" class="card-title">${cursor.value.title}</h6></div>
        <div class="container-trash"><img src='/img/delete-icon-2.png' type="button" id="btn-delete-note" class="btn delete-icon" onclick = deleteNote(${cursor.value.id}) ></img></div>
        </div>
        <div class="card-body">
            <p id="color-text" class="card-text">${cursor.value.detail}</p>
        </div>
            <div class="card-footer-note text-muted"><p class="text-date">${cursor.value.date}</p></div>
        </div>`
    }

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

function check() {
    let note_title = document.getElementById('note-title').value;
    let note_detail = document.getElementById('note-detail').value;
    let btnSave = document.getElementById('btn-save-note')
    if (note_title && note_detail != '') {
        btnSave.classList.add('btn-success')
    }
}

function removeClass() {
    let btnSave = document.getElementById('btn-save-note')
    btnSave.classList.remove('btn-success')
}


window.addEventListener('load', startBD);
