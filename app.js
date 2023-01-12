/*
- add a dark mode
- have some input validation, if the book is already in the library, then don't add it
*/

const numBookEl = document.getElementById("num-books");
const numReadEl = document.getElementById("num-read");
const numUnreadEl = document.getElementById("num-unread");
const numGenresEl = document.getElementById("num-genres");

const alertEl = document.querySelector(".alert-modal");
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
const readFilterBtns = document.querySelectorAll(".filter-btn");

let myLibrary = JSON.parse(localStorage.getItem("books"));
if (!myLibrary) {
  myLibrary = [];
}

class Book {
  constructor(title, author, genre, numPages, is_read) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.numPages = numPages;
    this.is_read = is_read;
  }
}

// Updating and filtering section
function updateLibraryInfo() {
  let readCount = 0;
  let unreadCount = 0;
  let genresList = ["all"];
  localStorage.setItem("books", JSON.stringify(myLibrary));

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

function filterBooks() {
  let newLibrary = [];
  let readStatus = "";
  // Get the genre and read status

  const genre = genreDropSelect.value;
  readFilterBtns.forEach((btn) => {
    if (btn.classList.contains("filter-btn-selected")) {
      readStatus = btn.dataset.id;
    }
  });
  // Filter read or unread books, if there is no filter then nothing will happen
  // Regardless though, it must also be filtered by genre

  if (readStatus == "read") {
    newLibrary = myLibrary.filter((book) => {
      if (book.is_read) {
        return book;
      }
    });
  } else if (readStatus == "unread") {
    newLibrary = myLibrary.filter((book) => {
      if (!book.is_read) {
        return book;
      }
    });
  } else {
    //read and unread were not selected at all, which makes the variable an empty string
    newLibrary = myLibrary;
  }

  // if 'all' wasn't selected, then a specific genre was selected, so we will filter our books
  // Else if all was selected, then we won't filter any further
  if (genre !== "all") {
    // call function of rendering at this point
    newLibrary = newLibrary.filter((book) => {
      if (book.genre == genre) {
        return book;
      }
    });
  }

  return newLibrary;
}

genreDropSelect.addEventListener("change", renderBooks);
readFilterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const btnID = e.currentTarget.dataset.id;
    // Iterate over the buttons again
    readFilterBtns.forEach((item) => {
      // If the button ID is equal to the id of the button clicked, then select it, else deselect it
      if (item.dataset.id == btnID) {
        // if the button is not already selected then select it, else the user is clicking on a selected button to deselect it
        if (!item.classList.contains("filter-btn-selected")) {
          item.classList.add("filter-btn-selected");
        } else {
          item.classList.remove("filter-btn-selected");
        }
      } else {
        item.classList.remove("filter-btn-selected");
      }
    });
    // The last thing for the event listener is to call the filter books function
    renderBooks();
  });
});

// Rendering Section
function renderBooks() {
  // Turn all selected books into html and set them on the grid
  // The ternary operator means if the book has already been read, put the text "finished", else put the text "read"
  // on the button

  const selectedBooks = filterBooks();
  const bookCardsHTML = selectedBooks
    .map((book) => {
      //get the index of the book in the myLibrary array,
      const index = myLibrary.indexOf(book);
      return `<article class="book-card" data-book-id="${index}">
              <section class="book-info">
                <h2>Title: ${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Genre: ${book.genre}</p>
                <p>Pages: ${book.numPages}</p>
              </section>
              <div class="card-btn-container">
                <button class="toggle-read-btn">${book.is_read ? "Finished" : "Read"}</button>
                <button class="remove-btn">Remove</button>
              </div>
            </article>`;
    })
    .join("");
  bookGrid.innerHTML = bookCardsHTML;

  // Captured the button elements from DOM and are going to add event listeners to them
  const toggleReadBtns = document.querySelectorAll(".toggle-read-btn");
  const removeBookBtns = document.querySelectorAll(".remove-btn");
  toggleReadBtns.forEach((btn) => {
    btn.addEventListener("click", toggleRead);
  });
  removeBookBtns.forEach((btn) => {
    btn.addEventListener("click", removeBook);
  });
}

// Gets the bookcard, from the event target, which was the book card's button
function toggleRead(e) {
  const bookIndex = e.currentTarget.parentElement.parentElement.dataset.bookId;
  // Okay we want to change the read status, in myLibrary and change it on the button was well
  if (myLibrary[bookIndex].is_read) {
    myLibrary[bookIndex].is_read = false;
    e.currentTarget.textContent = "Read";
  } else {
    myLibrary[bookIndex].is_read = true;
    e.currentTarget.textContent = "Finished";
  }
}
function removeBook(e) {
  const bookIndex = e.currentTarget.parentElement.parentElement.dataset.bookId;
  // Remove the book from the original or main library
  // Then call the function to update the log or library info that's displayed
  // Because the books have changed, call a function that filters the books again
  // and then the function calls the rendering function
  myLibrary.splice(bookIndex, 1);
  updateLibraryInfo();
  renderBooks();
}

// Form or adding books section
exitFormBtn.addEventListener("click", hideForm);
addBookBtn.addEventListener("click", ShowForm);
bookForm.addEventListener("submit", addBookToLibrary);

function hideForm() {
  formModal.classList.add("content-hidden");
  modalOverlay.classList.add("content-hidden");
  clearForm();
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
}

// Checks whether an entered title and author for a book has already been put into the library.
// Returns true if the book is a duplicate, and false if it is a unique/new book
function validateBook(title, author) {
  let is_duplicate = false;
  for (let i = 0; i < myLibrary.length; i++) {
    const { title: currentTitle, author: currentAuthor } = myLibrary[i];
    if (title === currentTitle && author === currentAuthor) {
      is_duplicate = true;
      break;
    }
  }
  return is_duplicate;
}

//
function displayAlert(message) {
  alertEl.textContent = message;
  alertEl.classList.remove("content-hidden");
  setTimeout(() => {
    alertEl.textContent = "";
    alertEl.classList.add("content-hidden");
  }, 7000);
}

// Gets data from form, if the form is not a duplicate then we are going to add
// update the library's data and render the new books.
function addBookToLibrary(e) {
  e.preventDefault();
  const title = bookTitleEl.value;
  const author = bookAuthorEl.value;
  const numPages = parseInt(numPagesEl.value);
  const genre = genreEl.value.toLowerCase();
  const is_read = bookReadEl.checked;

  // If the book is not a duplicate
  if (!validateBook(title, author)) {
    const newBook = new Book(title, author, genre, numPages, is_read);
    myLibrary.push(newBook);
    updateLibraryInfo();
    renderBooks();

    displayAlert(`Successfully added '${title}' by ${author} `);
  } else {
    displayAlert(`Could not add '${title}' by ${author} since already in library`);
  }

  clearForm();
}

window.addEventListener("DOMContentLoaded", () => {
  updateLibraryInfo();
  renderBooks();
});
