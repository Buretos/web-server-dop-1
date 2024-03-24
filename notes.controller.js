const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function removeNote(id) {
  console.log("id:", id);
  const notes = await getNotes();
  const newNotes = notes.filter((item) => item.id !== id);
  await saveNotes(newNotes);
  console.log(chalk.bgYellow(`Remove note by id:, ${id}`));
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgBlue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.blueBright(note.id), chalk.blue(note.title));
  });
}

async function editNote(id, newTitle) {
  const notes = await getNotes();
  const noteIndex = notes.findIndex((note) => note.id === id);

  if(noteIndex === -1) {
    console.log(chalk.bgRed('Note not found'));
    return;
  }

  notes[noteIndex].title = newTitle;
  
  await saveNotes(notes);
  console.log(chalk.bgGreen(`Note with id: ${id} was updated to new title: ${newTitle}`));
}


module.exports = {
  addNote,
  printNotes,
  removeNote,
  editNote,
};
