import "./styles/styles.css";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs , addDoc, updateDoc, deleteDoc, doc, Firestore, where, query, getDoc} from 'firebase/firestore/lite';

//Book Object
let Book = function(title,author,pages,read,ref){
    this.title=title;
    this.author=author;
    this.pages=pages;
    this.read=read;
    this.index;
    this.ref=ref;
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

Book.prototype.changeReadStatus = async function(Library){
    //toggle read status
    this.read==true ? this.read=false : this.read=true;
    //update cloudstorage
    updateDoc(doc(db,'books',this.ref),{
        title: this.title,
        author: this.author,
        pages: this.pages,
        read: this.read,
        index: this.index,
        ref: this.ref,
    });
    //clear bookArray
    Library.bookArray=[];
    //clear library div
    Library.libraryDiv.innerHTML="";
    //get books
    await getBooks();
    //update array indexes
    Library.updateArrayIndexes();
    //update the library display
    Library.updateLibraryDisplay();
};

//Library object
let Library = function(){
    this.bookArray = [];
    this.messageArray=[];
    this.messageDiv=document.querySelector('.book-form-messages');
    this.bookForm = document.querySelector('.book-form');
    this.bookFormAddButton = document.querySelector('.add-book-button');
    this.libraryDiv = document.querySelector('.library');
};

Library.prototype.addBook = async function(Book){
    //update the cloudstorage
    await storeBook(Book);
    //clear bookArray
    this.bookArray=[];
    //clear library div
    this.libraryDiv.innerHTML="";
    //get books
    getBooks();
    //update array indexes
    this.updateArrayIndexes();
    //update the library display
    this.updateLibraryDisplay();
};

//executes when the add-book-button is pressed
Library.prototype.addBookFormValidate = function (title,author,pages,read){
    //check to see if any field has been left empty
    if (title==='' || author==='' || pages==='' || read===''){
        this.messageArray.push("One or more fields were left blank!");
        return false;
    };
    //return true or false if the form is validated
    return true;
};

Library.prototype.addButtonListeners = function (){
    //set the event listener for the book form's, add book button.
    this.bookFormAddButton.addEventListener('click',()=>{
        //clear the error message field
        this.messageDiv.textContent="";
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
            this.messageDiv.textContent=this.messageArray.join(', ');
            //clear the message array after its been displayed
            this.messageArray=[];
        };
    });
};
Library.prototype.removeBook = function(Book){
    //remove book from firebase
    deleteBook(Book);
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

let deleteBook = async function(Book){
    await deleteDoc(doc(db,'books',Book.ref));
}

let storeBook = async function({title, author, pages, read, index}){
    let docRef;
    try {
        docRef = await addDoc(collection(db, "books"), {
            title: title,
            author: author,
            pages: pages,
            read: read,
        });
        console.log("Document written with ID: ", docRef.id);
        } catch (e) {
        console.error("Error adding document: ", e);
    }
    await updateDoc(docRef,{ref: docRef._key.path.segments[1]});
};

let getBooks = async function(){
    //add books to array from cloud
    const snapshot = await getDocs(collection(db,"books"));
    snapshot.forEach((bookItem)=>{
        //get book from snapshot item
        let tempBook = bookItem._document.data.value.mapValue.fields;
        let title = tempBook.title.stringValue;
        let author = tempBook.author.stringValue;
        let pages = tempBook.pages.stringValue;
        let read = tempBook.read.booleanValue;
        LIBRARYCONTROLLER.bookArray.push(new Book(title,author,pages,read,bookItem._key.path.segments[6]));
    });
    //update array indexes
    LIBRARYCONTROLLER.updateArrayIndexes();
    //update the library display
    LIBRARYCONTROLLER.updateLibraryDisplay();
};

//initalize the library controller
let LIBRARYCONTROLLER = new Library();

//add the event listeners to the form
LIBRARYCONTROLLER.addButtonListeners();


//using firebase config from project
const firebaseConfig = {
    apiKey: "AIzaSyBSfxJU1sZsdUNCq91BVjCn38lYku81rcM",
    authDomain: "odin-library-ba8fb.firebaseapp.com",
    projectId: "odin-library-ba8fb",
    storageBucket: "odin-library-ba8fb.appspot.com",
    messagingSenderId: "198765589818",
    appId: "1:198765589818:web:d288825bce3e5690b7cc03",
    measurementId: "G-E1G2CMY5J9"
};
//initalize the firebase app with the config
const app = initializeApp(firebaseConfig);
//get the current database
const db = getFirestore(app);
//get initial books on load
getBooks(LIBRARYCONTROLLER);