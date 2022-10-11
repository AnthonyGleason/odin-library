import "./styles/styles.css";

//Book Object
let Book = function(title,author,pages,read){
    this.title=title;
    this.author=author;
    this.pages=pages;
    this.read=read;
    this.index;
};

Book.prototype.createItem = function(Library){
    //create the book item div
    let bookItem=document.createElement('div');
    bookItem.setAttribute('class', 'book-item');
        //create the book title div
        let bookTitle=document.createElement('div');
        bookTitle.setAttribute('class', 'book-title');
        bookTitle.textContent=this.title;
        //create the book author div
        let bookAuthor=document.createElement('div');
        bookAuthor.setAttribute('class', 'book-author');
        bookAuthor.textContent=this.author;
        //create the book pages div
        let bookPages=document.createElement('div');
        bookPages.setAttribute('class', 'book-pages');
        bookPages.textContent=this.pages;
        //create the book read div
        let bookRead=document.createElement('div');
        bookRead.setAttribute('class', 'book-read');
        //change read text to yes or no
        this.read==true ? bookRead.textContent="Yes" : bookRead.textContent="No";
        //create the book button container
        let bookButtonContainer=document.createElement('div');
        bookButtonContainer.setAttribute('class', 'book-button-container');
            //create the change read status button
            let bookChangeReadButton = document.createElement('button');
            bookChangeReadButton.setAttribute('class', 'book-change-read-status');
            bookChangeReadButton.textContent='Toggle Read';
            //create the remove book button
            let bookRemoveButton = document.createElement('button');
            bookRemoveButton.setAttribute('class', 'book-remove-button');
            bookRemoveButton.textContent='Remove Book';
    
    //add the button event listeners
    bookChangeReadButton.addEventListener('click',()=>{
        this.changeReadStatus(Library);
        
    });
    bookRemoveButton.addEventListener('click',()=>{
        Library.removeBook(this);
    });

    //append all the elements to book item
    bookButtonContainer.appendChild(bookChangeReadButton);
    bookButtonContainer.appendChild(bookRemoveButton);
    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookPages);
    bookItem.appendChild(bookRead);
    bookItem.appendChild(bookButtonContainer);
    //return the finished book item
    return bookItem;
};

Book.prototype.changeReadStatus = function(Library){
    //toggle read status
    this.read==true ? this.read=false : this.read=true;
    //update the display
    Library.updateLibraryDisplay();
};

//Library object
let Library = function(){
    this.bookArray = [];
    this.bookForm = document.querySelector('.book-form');
    this.bookFormAddButton = document.querySelector('.add-book-button');
    this.libraryDiv = document.querySelector('.library');
};

Library.prototype.addBook = function(Book){
    //add to array
    this.bookArray.push(Book);
    //update array indexes
    this.updateArrayIndexes();
    //update the library display
    this.updateLibraryDisplay();
};

//executes when the add-book-button is pressed
Library.prototype.addBookFormValidate = function (title,author,pages,read){
    
    //return true or false if the form is validated
    return true;
};

Library.prototype.addButtonListeners = function (){
    //set the event listener for the book form's, add book button.
    this.bookFormAddButton.addEventListener('click',()=>{
        //get form values
        let title= this.bookForm.title.value;
        let author = this.bookForm.author.value;
        let pages = this.bookForm.pages.value;
        let read = this.bookForm.read.value;

        //convert read to true or false from string
        read=="true" ? read=true: read=false;
        let formValidated=this.addBookFormValidate(title,author,pages,read);
        if (formValidated===true){
            this.addBook(new Book(title,author,pages,read))
        }else{
            //display errors here from a messages array which appends errors to it
        };
    });
};
Library.prototype.removeBook = function(Book){
    //remove from array
    this.bookArray.splice(Book.index,1);
    //update array indexes
    this.updateArrayIndexes();
    //update the library display
    this.updateLibraryDisplay();
};

Library.prototype.updateLibraryDisplay = function(){
    //clear the display
    this.libraryDiv.innerHTML="";

    //reiterate through the array and add book elements to the display
    this.bookArray.forEach((Book)=>{
        this.libraryDiv.appendChild(Book.createItem(this));
    });
};

Library.prototype.updateArrayIndexes = function(){
    let i=0;
    this.bookArray.forEach((Book)=>{
        Book.index=i;
        i++;
    });
};

//initalize the library controller
let LIBRARYCONTROLLER = new Library();

//add the event listeners to the form
LIBRARYCONTROLLER.addButtonListeners();
