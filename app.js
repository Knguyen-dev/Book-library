/*
- store all book objects in an array
- add a function that takes input and stores new books into an array 
- write function that loops through array and displays books on screen, each book can be it's own card
- Have a new book button that prompts the form again and let's the user enter a new book; do the prevent default to solve the form issue
- Add a button to each book's display to remove the book from the library; you need a way to associate the dom elements from book objects; a suggestion is using data attribute with the index 
of the book in the library array
- Add a button to change a book's read status; function that toggles the boolean variable on the Book prototype instance (means the single instance of book prototype/construcotr/class)
- Add local storage so that you can persist the amount of books on screen
- add a library log, to show the amount of books, the amount read and not read.
- Add a filter by genre, now with drop down
- add a dark mode
- have some input validation, if the book is already in the library, then don't add it
*/

const numBookEl = document.getElementById("num-books");
const numReadEl = document.getElementById("num-read");
const numUnreadEl = document.getElementById("num-unread");
const numGenresEl = document.getElementById("num-genres");

const bookForm = document.querySelector(".book-form");
const bookTitleEl = document.getElementById("input-title");
const bookAuthorEl = document.getElementById("input-author");
const numPagesEl = document.getElementById("input-pages");
const genreEl = document.getElementById("input-genre");
const bookReadEl = document.getElementById("input-book-read");

const exitFormBtn = document.querySelector(".form-exit-btn");
const addBookBtn = document.querySelector(".add-book-btn");
const formModal = document.querySelector(".form-modal");
const modalOverlay = document.querySelector(".modal-overlay");

const bookGrid = document.querySelector(".book-grid");

const genreDropSelect = document.getElementById("select-genre");

let genresList = ["All"];
let selectedGenre;
let myLibrary = [];
class Book {
  constructor(title, author, genre, numPages, is_read) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.numPages = numPages;
    this.is_read = is_read;
  }
}

exitFormBtn.addEventListener("click", hideForm);
addBookBtn.addEventListener("click", ShowForm);
bookForm.addEventListener("submit", addBookToLibrary);

function hideForm() {
  formModal.classList.add("content-hidden");
  modalOverlay.classList.add("content-hidden");
}
function ShowForm() {
  formModal.classList.remove("content-hidden");
  modalOverlay.classList.remove("content-hidden");
}
function clearForm() {
  bookTitleEl.value = "";
  bookAuthorEl.value = "";
  numPagesEl.value = null;
  genreEl.value = "";
  bookReadEl.checked = false;
  console.log("Clear form triggered");
}

function updateLibraryInfo() {
  let readCount = 0;
  let unreadCount = 0;

  // Clear the genresList; genresList is only appended to
  // so when we remove something, the genre will not be taken out of the list
  // By resetting, the genresList can always be accurate. Always going to start and reset
  // To "All" because selecting all genres will be an option, but the option "All" won't count as a genre such as fantasy
  // If there are no genres we are still going to have 'all'
  genresList = ["All"];

  // loop through all books to get genres, num read, and unread
  for (let i = 0; i < myLibrary.length; i++) {
    const currentBook = myLibrary[i];
    if (currentBook.is_read) {
      readCount += 1;
    } else {
      unreadCount += 1;
    }

    // Update the amount of genres we have
    if (!genresList.includes(currentBook.genre)) {
      genresList.push(currentBook.genre);
    }

    numBookEl.textContent = myLibrary.length;
    numReadEl.textContent = readCount;
    numUnreadEl.textContent = unreadCount;
    numGenresEl.textContent = genresList.length - 1; //minus one to not include 'all' option
  }

  // Update the html of the genre select dropdown
  genreDropSelect.innerHTML = genresList
    .map((genre) => {
      return `<option value="${genre}">${genre}</option>`;
    })
    .join("");
}

function addBookToLibrary(e) {
  e.preventDefault();
  hideForm();

  const title = bookTitleEl.value;
  const author = bookAuthorEl.value;
  const numPages = parseInt(numPagesEl.value);
  const genre = genreEl.value.toLowerCase();
  const is_read = bookReadEl.checked;
  const newBook = new Book(title, author, genre, numPages, is_read);
  myLibrary.push(newBook);

  // Don't forget to clear form after
  updateLibraryInfo();

  clearForm();
}
