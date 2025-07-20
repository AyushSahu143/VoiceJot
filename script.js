const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const saveBtn = document.getElementById("save-btn");
const downloadBtn = document.getElementById("download-btn");
const noteArea = document.getElementById("note");
const savedNotesList = document.getElementById("saved-notes");
const status = document.getElementById("status");

let recognition;
let isRecording = false;

// Initialize SpeechRecognition
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    noteArea.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error("Error occurred: ", event.error);
    status.textContent = "Error: " + event.error;
  };
} else {
  alert("Your browser does not support Web Speech API.");
}

// Start recording
startBtn.addEventListener("click", () => {
  if (recognition && !isRecording) {
    recognition.start();
    status.textContent = "Recording... Speak now!";
    isRecording = true;
  }
});

// Stop recording
stopBtn.addEventListener("click", () => {
  if (recognition && isRecording) {
    recognition.stop();
    status.textContent = "Stopped recording.";
    isRecording = false;
  }
});

// Save note to localStorage
saveBtn.addEventListener("click", () => {
  const noteText = noteArea.value.trim();
  if (noteText) {
    const timestamp = new Date().toLocaleString();
    const noteObj = { text: noteText, time: timestamp };
    const notes = JSON.parse(localStorage.getItem("voiceNotes") || "[]");
    notes.push(noteObj);
    localStorage.setItem("voiceNotes", JSON.stringify(notes));
    renderNotes();
    noteArea.value = "";
  }
});

// Download note as .txt
downloadBtn.addEventListener("click", () => {
  const text = noteArea.value.trim();
  if (text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-note.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
});

// Delete individual note
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem("voiceNotes") || "[]");
  notes.splice(index, 1);
  localStorage.setItem("voiceNotes", JSON.stringify(notes));
  renderNotes();
}

// Render saved notes
function renderNotes() {
  const notes = JSON.parse(localStorage.getItem("voiceNotes") || "[]");
  savedNotesList.innerHTML = "";
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${note.time}</strong><br>${note.text} 
      <button onclick="deleteNote(${index})">Delete</button>`;
    savedNotesList.appendChild(li);
  });
}

renderNotes();