"use strict"

class Library {
    constructor() {
        this.myLibrary = [];
    }

    addBook = (obj) => {
        this.myLibrary.push(obj);
    }

    removeBook = (index) => {
        this.myLibrary.splice(index, 1, "removed"); // we set removed element to "removed" because when we remove element, index numbers are changing
    }

    getLibrary() {
        return this.myLibrary;
    }
}

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    changeReadStatus(status) {
        this.read = status;
    }
}

// Library Control

const LibraryController = function() {
    const library = new Library();
    
    const addBookToLibrary = (obj) => library.addBook(obj);

    const removeBookFromLibrary = (index) => library.removeBook(index);

    const getMyLibrary = () => library.getLibrary();

    // Default Books

    const pragmaticProgrammer = new Book("Pragmatic Programmer","Andy Hunt", 320, false);
    const networking = new Book("Networking","Jim Kurose", 852, false);
    const recipesForCleanCode = new Book("Recipes for clean code", "Maximiliano Conieri", 428, false);

    // Add Books to library

    addBookToLibrary(pragmaticProgrammer);
    addBookToLibrary(networking);
    addBookToLibrary(recipesForCleanCode);

    return { addBookToLibrary, removeBookFromLibrary, getMyLibrary }
}

// Screen Control

const ScreenFlowControl = (function() {
    const libraryControl = LibraryController();
    const libraryEl = document.querySelector(".library");

    // Update the library UI when we add a new book
    const updateLibrary = (bookTitle, bookAuthor, bookPages, bookRead) => {
        const bookEls = document.querySelectorAll(".library__book");

        const newDefaultBook = bookEls[0].cloneNode(true);

        const newBook = newDefaultBook.cloneNode(true);

        const libraryLength = bookEls.length;

        // Change Book Info values

        newBook.querySelector('.library__book-info-heading').textContent = `${bookTitle}`;
        newBook.querySelector('.library__book-info-pages').textContent = `Pages: ${bookPages}`;
        newBook.querySelector('.library__book-read').checked = bookRead;
        
        const newBookAuthor = bookAuthor.split(' ')
                                        .map((item, index) => index > 0 ? item.split('').map((item, index) => index === 0 ? item.toUpperCase() : item).join('') : item)
                                        .join('');
        
        newBook.querySelector('.library__book-info-author').textContent = `@by${newBookAuthor}`;
        

        // Associate book's read checkbox with label 

        newBook.querySelector('.library__book-read').setAttribute("id", `book-read-${libraryLength}`);
        newBook.querySelector('.library__book-read').previousElementSibling.setAttribute("for", `book-read-${libraryLength}`);
    
        // Add Book index data attribute
        newBook.removeAttribute(`data-book-0`);
        newBook.setAttribute(`data-book-${libraryLength}`, "");
   
        libraryEl.appendChild(newBook);
    }

    // Functionality to open and close Book Details Modal

    // A modal that displays details for books
    const modal = document.querySelector('[data-modal]');

    const bookDetailsOpenBtnEl = document.querySelector('.add-button');
    const bookDetailsCloseBtnEl = document.querySelector('.modal__close-button');

    const bookDetailsOpenBtnClickEventHandler = (e) => {
        // Show modal
        modal.showModal();
    }
    
    const bookDetailsCloseBtnClickEventHandler = (e) => {
        // Close modal
        modal.close();
    }

    bookDetailsOpenBtnEl.addEventListener("click", bookDetailsOpenBtnClickEventHandler);
    bookDetailsCloseBtnEl.addEventListener("click", bookDetailsCloseBtnClickEventHandler);

    // Submit Details Form 

    const bookDetailsFormEl = document.querySelector('.book-details__form');

    // Functionality to check validity of inputs on every input event

    const bookDetailsInputEls = document.querySelectorAll(".book-details__form input[required]");

    const bookDetailsSubmitEventHandler = (e) => {
        e.preventDefault();
        
        // Check validity of all required inputs

        bookDetailsInputEls.forEach(el => {
            if(!el.validity.valid) {
                showError(el);
                return;
            } else {
                el.setCustomValidity("");
            }
        })

        const formTitleInputValue = e.target.querySelector('#title').value;
        const formAuthorInputValue = e.target.querySelector('#author').value;
        const formPagesInputValue = +e.target.querySelector('#pages').value;
        const formReadInputValue = e.target.querySelector('#read').checked;

        // Create Book and put it into library

        const newBook = new Book(formTitleInputValue, formAuthorInputValue, formPagesInputValue, formReadInputValue);
        libraryControl.addBookToLibrary(newBook);
    
        // Reset Input Values
    
        e.target.querySelector('#title').value = '';
        e.target.querySelector('#author').value = '';
        e.target.querySelector('#pages').value = '';
        e.target.querySelector('#read').checked = false;

        // Add book visually
        updateLibrary(formTitleInputValue, formAuthorInputValue, formPagesInputValue, formReadInputValue);
    
        modal.close();
    }

    bookDetailsFormEl.addEventListener("submit", bookDetailsSubmitEventHandler);

    // Show error function that displays input validation error messages

    const showError = (inputEl) => {
        const inputID = inputEl.id;

        console.log("inShowError", inputEl);

        switch(inputID) {
            case "author":
                if(inputEl.validity.valueMissing) {
                    inputEl.setCustomValidity("You must enter an author name");
                } else if(inputEl.validity.tooShort) {
                    inputEl.setCustomValidity(`Author name should be at least ${inputEl.minLength} characters; you entered ${inputEl.value.length}`);
                    console.log("tooShort");
                } else if(inputEl.validity.tooLong) {
                    inputEl.setCustomValidity(`Author name should be maximum ${inputEl.maxLength} characters; you entered ${inputEl.value.length}`);
                }
            break;
            case "title":
                if(inputEl.validity.valueMissing) {
                    inputEl.setCustomValidity("You must enter an title");
                } else if(inputEl.validity.tooShort) {
                    inputEl.setCustomValidity(`Title should be at least ${inputEl.minLength} characters; you entered ${inputEl.value.length}`);
                } else if(inputEl.validity.tooLong) {
                    inputEl.setCustomValidity(`Title should be maximum ${inputEl.maxLength} characters; you entered ${inputEl.value.length}`);
                }
            break;
            case "pages":
                if(inputEl.validity.valueMissing) {
                    inputEl.setCustomValidity("You must enter an pages number");
                } else if(inputEl.validity.stepMismatch) {
                    inputEl.setCustomValidity("Your number step must be in correct format");
                } else if(inputEl.validity.rangeOverflow) {
                    inputEl.setCustomValidity(`Page number should be maximum ${inputEl.max} characters; you entered ${inputEl.value}`);
                } else if(inputEl.validity.rangeUnderflow) {
                    inputEl.setCustomValidity(`Page number should be minimum ${inputEl.min} characters; you entered ${inputEl.value}`);
                }
            break;
        }
    }

    // Remove Book Visually

    const removeBookBtnClickEventHandler = (e) => {
        if(e.target.className === "library__book-close-button" || e.target.className === "library__book-close-button-span") {
            const closestBookEl = e.target.closest(".library__book");
    
            const bookAttributeArray = closestBookEl.getAttributeNames()[1].split('');
            const objectIndex = +(bookAttributeArray[bookAttributeArray.length - 1]);

            libraryControl.removeBookFromLibrary(objectIndex);
    
            closestBookEl.remove(); 
        }
    }

    libraryEl.addEventListener("click", removeBookBtnClickEventHandler);

    // Change read status

    const readStatusBtnClickEventHandler = (e) => {
        if(e.target.className === "library__book-read") {
            const closestBookEl = e.target.closest(".library__book");
    
            const bookAttributeArray = closestBookEl.getAttributeNames()[1].split('');
            const objectIndex = +(bookAttributeArray[bookAttributeArray.length - 1]);
    
            let changedStatusValue = e.target.checked;
            libraryControl.getMyLibrary()[objectIndex].changeReadStatus(changedStatusValue);
        }
    }

    libraryEl.addEventListener("click", readStatusBtnClickEventHandler);
})()