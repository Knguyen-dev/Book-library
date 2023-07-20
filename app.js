/*
- Doesn't look the best. Definitely could have added some responsiveness to it. Could have added better styling
- Not the best work, but it's alright.

*/

/*
+ Library DOM Elements:
- numBookEl: Span element that represents the number of books in library
- numReadEl: Span element that represents the number of books that have already been read
- numUnreadEl: Span element that represents the number of books that haven't been read yet
- numGenresEl: Span element that represents the number of book genres in the library
*/
const numBookEl = document.getElementById("num-books");
const numReadEl = document.getElementById("num-read");
const numUnreadEl = document.getElementById("num-unread");
const numGenresEl = document.getElementById("num-genres");

/*
+ Form related DOM Elements:
- alertEl: Div element with text that will temporarily appear to indicate if the user has successfully entered a book or not 
- bookForm: Form that the user will enter book data in, and submit to add books
- bookTitleEl: Input element where the user puts the book's title 
- bookAuthorEl: Input element where user puts the book's author
- numPagesEl: Input element where user puts the number of pages in the book
- genreEl: Input element where user enters the genre of the book
- bookReadEl: Input element where user indicates if they've read the book already or not
- exitFormBtn: Button that will exit the form and make it disappear
- formContainer: Container for the form 
- modalOverlay: Dark overlay that will appear when user triggers the form
 addBookBtn: Button that triggers the book form
*/
const alertEl = document.querySelector(".alert-modal");
const bookForm = document.querySelector(".book-form");
const bookTitleEl = document.getElementById("input-title");
const bookAuthorEl = document.getElementById("input-author");
const numPagesEl = document.getElementById("input-pages");
const genreEl = document.getElementById("input-genre");
const bookReadEl = document.getElementById("input-book-read");
const exitFormBtn = document.querySelector(".form-exit-btn");
const formContainer = document.querySelector(".form-container");
const modalOverlay = document.querySelector(".modal-overlay");
const addBookBtn = document.querySelector(".add-book-btn");

/*
+ Library functions and the book grid
- bookGrid: Grid section that contains the book cards.
- genreDropSelect: Input dropdown element that contains the genres of the books in the library.
- readFilterBtns: Two buttons "read" and "unread" that will show only books that the user has read 
or hasn't already read respectively
*/
const bookGrid = document.querySelector(".book-grid");
const genreDropSelect = document.getElementById("select-genre");
const readFilterBtns = document.querySelectorAll(".filter-btn");

/*
+ Script variables
- myLibrary: Array that contains book objects. We check localStorage because we will save books in this
array from past sessions or refreshes. If there is nothing in localStorage then myLibrary will just be an empty array
- class Book: Object that contains book data. The Book object is created everytime the user 
successfully submits the form and adds the book to the librar .
*/
let myLibrary = JSON.parse(localStorage.getItem("books"));
class Book {
  constructor(title, author, genre, numPages, is_read) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.numPages = numPages;
    this.is_read = is_read;
  }
}

/*
+ Section for updating library's info that the user sees, and for filtering the books so that they will be rendered later
*/

// Function updates visually updates the HTML elements in 'library-info' section to update the user on
// the amount of books they have, genres, etc. This is triggered when books are removed or added into the library
function updateLibraryInfo() {
  let readCount = 0;
  let unreadCount = 0;
  let genresList = ["all"]; // initialize with 'all' because the all 'genre' category will always be there for the user

  // Books have been removed/added, save the library to localStorage so these changes can persist across sessions
  localStorage.setItem("books", JSON.stringify(myLibrary));

  // loop through all books to get genres, num read, and unread
  for (let i = 0; i < myLibrary.length; i++) {
    const currentBook = myLibrary[i];
    if (currentBook.is_read) {
      readCount += 1;
    } else {
      unreadCount += 1;
    }

    // If the genre is not in our genresList already, then it's new so add it in there
    if (!genresList.includes(currentBook.genre)) {
      genresList.push(currentBook.genre);
    }
  }

  numBookEl.textContent = myLibrary.length; // Update the values of the html span elements
  numReadEl.textContent = readCount;
  numUnreadEl.textContent = unreadCount;
  numGenresEl.textContent = genresList.length - 1; //minus one to not include 'all' option

  genreDropSelect.innerHTML = genresList // Update the html of the genre select dropdown
    .map((genre) => {
      return `<option value="${genre}">${genre}</option>`;
    })
    .join("");
}

// Will obtain desired books the user wants to see based on the genre they selected, and whether they want to see books that have been already
// read or not. After, this filter function will call a function to render those desired books
function filterBooks() {
  let newLibrary = [];
  let readStatus = "";

  // Get the genre selected
  const genre = genreDropSelect.value;
  // If the button has the 'selected' class, then the user wants to select that filter button, so get the ID so we can use it later
  readFilterBtns.forEach((btn) => {
    if (btn.classList.contains("filter-btn-selected")) {
      readStatus = btn.dataset.id;
    }
  });

  if (readStatus == "read") {
    // If the ID or readStatus is read, then they want finished books, so is_read = true
    newLibrary = myLibrary.filter((book) => {
      if (book.is_read) {
        return book;
      }
    });
  } else if (readStatus == "unread") {
    // If it's unread then get the books where they haven't read yet, or when is_read = false
    newLibrary = myLibrary.filter((book) => {
      if (!book.is_read) {
        return book;
      }
    });
  } else {
    // Neither of the filter buttons were selected, which makes readStatus an empty string. So get all books regardess of is_read's value
    newLibrary = myLibrary;
  }

  // if 'all' wasn't selected, then a specific genre was selected, so we will get all books will that genre
  // Else if all was selected, then we won't filter any further
  if (genre !== "all") {
    // call function of rendering at this point
    newLibrary = newLibrary.filter((book) => {
      if (book.genre == genre) {
        return book;
      }
    });
  }

  // Returns newLibrary to our renderBooks() function, so that these desired books can be rendered on the screen
  return newLibrary;
}


/*
 + Section for rendering books and handling changes on the book cards; more visual portion
 */

// For the select HTML element, when they change the value, then we will render with that selected genre in mind
genreDropSelect.addEventListener("change", renderBooks);

// Add a click eventlistener for both of the filter buttons so that we can show whether they were selected or not visually, and render the
// the books with in respect to whether they wants to see books they've already read or not.
readFilterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const btnID = e.currentTarget.dataset.id;
    // Iterate over the buttons again
    readFilterBtns.forEach((item) => {
      // If the button ID is equal to the id of the button clicked, then select it.
      if (item.dataset.id == btnID) {
        // if the button is not already selected then select it, else the user is clicking on a selected button to deselect it so we remove "filter-btn-selected"
		item.classList.toggle("filter-btn-selected");
      } else {
        // Else visually deselect from all other buttons since they aren't the one the user is trying to select/deselect
        item.classList.remove("filter-btn-selected");
      }
    });

    renderBooks();
  });
});

//  Gets and displays the desired books on the screen
function renderBooks() {
  // Generates a string of html for all book objects
  const bookCardsHTML = filterBooks() // filterBooks returns the books we want to render in regards to the filters
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

			  	<button class="toggle-read-btn" data-is-read="${book.is_read ? "true" : "false"}">${book.is_read ? "Finished" : "Read"}</button>
                <button class="remove-btn">Remove</button>
              </div>
            </article>`;
    })
    .join("");
  // The ternary operator means if the book has already been read (is_read = true), put the text "finished" on the button to indicate
  // the user has already finished the book. Else put the text "read" because (is_read = false) so the user hasn't read the book yet
  bookGrid.innerHTML = bookCardsHTML; // Update the HTML of the grid to show the new books

  // Select the newly created buttons from the DOM and add event listeners to them
  const toggleReadBtns = document.querySelectorAll(".toggle-read-btn");
  const removeBookBtns = document.querySelectorAll(".remove-btn");
  toggleReadBtns.forEach((btn) => {
    btn.addEventListener("click", toggleRead);
  });
  removeBookBtns.forEach((btn) => {
    btn.addEventListener("click", removeBook);
  });
}

// Alters the is_read boolean on the book object, and visually show the alteration on book card buttons
function toggleRead(e) {
  const bookIndex = e.currentTarget.parentElement.parentElement.dataset.bookId; // Gets the bookcard, from the event target, which was the book card's button
  const currentToggleBtn = e.currentTarget;
 
  // Okay we want to change the read status, in myLibrary and change it on the button was well
  // Then change the data attribute's value, which in turn will affect how the button appear in the css
  if (myLibrary[bookIndex].is_read) {
    myLibrary[bookIndex].is_read = false;
    currentToggleBtn.textContent = "Read";
	currentToggleBtn.setAttribute("data-is-read", "false");
  } else {
    myLibrary[bookIndex].is_read = true;
    currentToggleBtn.textContent = "Finished";
	currentToggleBtn.setAttribute("data-is-read", "true");
  }
  updateLibraryInfo();
}

// Removes the book from the library, update library info such as num books, number of genres on the drop down, and then render the new books
// after the selected book has been deleted
function removeBook(e) {
  const bookIndex = e.currentTarget.parentElement.parentElement.dataset.bookId;
  const { title, author } = myLibrary[bookIndex]; // Get the title and author of the book we are going to remove

  myLibrary.splice(bookIndex, 1); // Remove the book from the original or main library, then call updateLibraryInfo() to update the library info on the user's screen
  updateLibraryInfo(); // This will also save the newly changed array into the localStorage, so changes will persist
  renderBooks(); // render the books again since the user's library was altered
  displayAlert(`'${title}' by ${author} was successfully removed`); // Display an alert that shows the user that the book was successfully removed
}

/*
+ Form functionality section:
*/

exitFormBtn.addEventListener("click", hideForm); // Exit the form windwo when you click the exit form button
addBookBtn.addEventListener("click", ShowForm); // Show the form window on screen when users click on the add book button
bookForm.addEventListener("submit", addBookToLibrary); // Add an event listener when the user submits the form, so that the book is added to the library

// Hide or exit the form window and hides the dark overlay that appears when the window shows up
function hideForm() {
  formContainer.classList.add("content-hidden");
  modalOverlay.classList.add("content-hidden");
}

// Shows the form for adding new books and shows the dark overlay that usually appears along with it.
function ShowForm() {
  formContainer.classList.remove("content-hidden");
  modalOverlay.classList.remove("content-hidden");
}

// Clears all input fields in the form
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

// Shows an alert that will indicate whether a book submission was successful or not
// Message disappears after a set amount of time
function displayAlert(message) {
  alertEl.textContent = message;
  alertEl.classList.remove("content-hidden");
  setTimeout(() => {
    alertEl.textContent = "";
    alertEl.classList.add("content-hidden");
  }, 7000);
}

// Gets data from form, if the form is not a duplicate then we are going to add a new book to the library.
// Update the library's info section or data, and then render the new books.
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
    displayAlert(`Successfully added '${title}' by ${author} `); // Call alert function to show whether or not their submission was successful
  } else {
    displayAlert(`Could not add '${title}' by ${author} since already in library`);
  }

  // Clear form regardess on whether or not the submission was successful or not
  clearForm();
}

// Window loads by getting book data and updating book data
// Then renders those books
window.addEventListener("DOMContentLoaded", () => {
  updateLibraryInfo();
  renderBooks();
});
