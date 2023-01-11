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
let myLibrary = [];
class Book {
  constructor(title, author, numPages, already_read) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.already_read = already_read;
  }
}

function toggleBookRead() {
  console.log("Book read status toggled");
}

function addBookToLibrary() {
  console.log("book added");
}
