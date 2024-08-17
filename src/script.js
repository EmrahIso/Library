// All Book Objects will be within myLibrary Array.
const myLibrary = [];


const addBookBtnEl = document.querySelector('.add-button');
const libraryEl = document.querySelector('.library');
const bookDetailsFormEl = document.querySelector('.book-details__form');
const bookDetailsCloseBtnEl = document.querySelector('.modal__close-button');
const bookDetailsSubmitButtonEl = document.querySelector('.modal__submit-button')

// A modal that displays details for books
const modal = document.querySelector('[data-modal]');

function showBookDetails() {
    // Show modal
    modal.showModal();
}

function closeBookDetails() {
    // Close modal
    modal.close();
}

/* Book Constructor */ 

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read
}

Book.prototype.remove = function(index) {
    myLibrary.splice(index, 1, "removed"); // we set removed element to "removed" because when we remove element, index numbers are changing
}

Book.prototype.changeStatus = function(status) {
    this.read = status;
}

// Functions

function bookDetailsSubmitted(e) {
    e.preventDefault();

    let formTitleInputValue = e.target.querySelector('#title').value;
    let formAuthorInputValue = e.target.querySelector('#author').value;
    let formPagesInputValue = +e.target.querySelector('#pages').value;
    let formReadInputValue = e.target.querySelector('#read').checked;
    
    addBookToLibrary(formTitleInputValue, formAuthorInputValue, formPagesInputValue, formReadInputValue);

    // Reset Input Values

    e.target.querySelector('#title').value = '';
    e.target.querySelector('#author').value = '';
    e.target.querySelector('#pages').value = '';
    e.target.querySelector('#read').checked = false;

    closeBookDetails();
}

// Every new book "default"

let bookEls = libraryEl.querySelectorAll('.library__book');
let newDefaultBook = bookEls[0].cloneNode(true);

function addBookToLibrary(bookTitle, bookAuthor, bookPages, bookRead) {
    
    // CamelCase bookAuthor
    let newBookAuthor = bookAuthor.split(' ')
                                  .map((item, index) => index > 0 ? item.split('').map((item, index) => index === 0 ? item.toUpperCase() : item).join('') : item)
                                  .join('');

    // Add Book Object into myLibrary array.

    myLibrary.push(new Book(bookTitle, bookAuthor, bookPages, bookRead));

    // Add Book Element into LibraryEl

    let newBook = newDefaultBook.cloneNode(true);
    
    // Change Book Info values
    newBook.querySelector('.library__book-info-heading').textContent = `${bookTitle}`;
    newBook.querySelector('.library__book-info-author').textContent = `@by${newBookAuthor}`;
    newBook.querySelector('.library__book-info-pages').textContent = `Pages: ${bookPages}`;
    newBook.querySelector('.library__book-read').checked = bookRead;

    // Associate book's read checkbox with label 

    newBook.querySelector('.library__book-read').setAttribute("id", `book-read-${myLibrary.length - 1}`);
    newBook.querySelector('.library__book-read').previousElementSibling.setAttribute("for", `book-read-${myLibrary.length - 1}`);
    
    // Add Book index data attribute
    newBook.removeAttribute(`data-book-0`);
    newBook.setAttribute(`data-book-${myLibrary.length - 1}`, "");
   
    libraryEl.appendChild(newBook);
}


const pragmaticProgrammer = new Book("Pragmatic Programmer","Andy Hunt", 320, false);
const networking = new Book("Networking","Jim Kurose", 852, false);
const recipesForCleanCode = new Book("Recipes for clean code", "Maximiliano Conieri", 428, false);

myLibrary.push(pragmaticProgrammer);
myLibrary.push(networking);
myLibrary.push(recipesForCleanCode);


// Removing books and Changing Read Status

// We use this function to detect object of book that will be removed and to remove that book from UI.
function detectBookObject(e) {
    if(e.target.className === "library__book-close-button" || e.target.className === "library__book-close-button-span" || e.target.className === "library__book-read") {
        
        let closestBookEl =  e.target.closest(".library__book");

        let bookAttributeArray = closestBookEl.getAttributeNames()[1].split('');
        let objectIndex = +(bookAttributeArray[bookAttributeArray.length - 1]);

        if(e.target.className === "library__book-close-button" || e.target.className === "library__book-close-button-span") {
            //Remove Book Object
            myLibrary[objectIndex].remove(objectIndex);
            //Remove Book Card
            closestBookEl.remove();
        } else if(e.target.className === "library__book-read") {
            let changedStatus = e.target.checked;
            myLibrary[objectIndex].changeStatus(changedStatus);
        }   
    }
}


//////////////////////////////////////////////////////////////////////////
// Event Listeners
//////////////////////////////////////////////////////////////////////////


addBookBtnEl.addEventListener("click", showBookDetails);
bookDetailsCloseBtnEl.addEventListener("click", closeBookDetails);
bookDetailsFormEl.addEventListener("submit", bookDetailsSubmitted);
libraryEl.addEventListener('click', detectBookObject);