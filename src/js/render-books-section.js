import { CONSTANTS } from './constants';
import { urlCreator } from './api-service';

const booksSection = document.querySelector('.main-page-books-section');
const bestBooksSection = document.querySelector('.best-sellers-books-section');

let bookShelfContainer = null;

//Just export this function to your code and call it
export async function markupPopularBooks() {
  return await urlCreator(CONSTANTS.POPULAR_BOOKS_ALL_CATEGORIES)
    .then(({ data }) => {
      console.log(data);
      //receiving the responce from api and marking the result
      booksSection.innerHTML = createBookShelf(data);
      bookShelfContainer = document.querySelectorAll('.book-shelf-container');
      bookShelfContainer.forEach((container, index) => {
        const categoryData = data[index]; // Get the data for the current category
        container.innerHTML = fillBookShelf([categoryData]);
        return data;
      });
    })
    // .then(data => {
    //   booksSection.addEventListener('click', e => {
    //     console.log(e.target.getAttribute('data-category'));
    //     if (
    //       e.target.nodeName === 'BUTTON' &&
    //       e.target.hasAttribute('data-category')
    //     ) {
    //       e.stopPropagation();
    //       urlCreator(
    //         CONSTANTS.SELECTED_CATEGORY,
    //         e.target.getAttribute('data-category')
    //       ).then(({ data }) => {
    //         console.log(data);
    //         booksSection.innerHTML = '';
    //         booksSection.innerHTML = afterSeeMoreBtnPressed(data);

    //         console.log(data);
    //       });
    //     }
    //   });
    // })
    .catch(error => console.log(error));
}

// Calling api service to deliver popular books

function createBookShelf(array) {
  // function creates div wrapper with name of the books category
  return array
    .map(
      book => `<div class="book-shelf">
      <p class="book-shelf-category">${book.list_name}</p>
      <div class="book-shelf-container"></div>
      <button class="see-more-btn" type="button" data-category="${book.list_name}">SEE MORE</button>
    </div>`
    )
    .join('');
}
// this function fills previously created bookshelves
function fillBookShelf(array) {
  return array.map((book, index) => {
    return book.books
      .map((bookdata, innerIndex) => {
        let numElements;
        if (window.innerWidth < 768) {
          numElements = 1; // For less than 768px, show only 1 element
        } else if (window.innerWidth < 1440) {
          numElements = 3; // For less than 1440px, show 3 elements
        } else {
          numElements = 5; // For more than 1440px, show 5 elements
        }

        const isMarked = window.innerWidth < 768 && innerIndex === 0; // Mark the first item for less than 768px

        const isDisplayed = innerIndex < numElements; // Display only required number of elements based on screen width

        return `<div class="book-card-container${
          isMarked ? ' marked' : ''
        }" style="display: ${
          isDisplayed ? 'block' : 'none'
        };"><a class="book-item-link" href="#" data-bookid="${bookdata._id}">
            <img class="book-card-img" src="${bookdata.book_image}" alt="" />
            <h2 class="book-card-title">${bookdata.title}</h2>
            <p class="book-card-author">${bookdata.author}</p>
        </div>`;
      })
      .join('');
  });
}

function afterSeeMoreBtnPressed(array) {
  return array.map(
    (
      bookdata,
      innerIndex
    ) => `<div class="book-card-container"><img class="book-card-img" src="${bookdata.book_image}" alt="" />
                <h2 class="book-card-title">${bookdata.title}</h2>
                <p class="book-card-author">${bookdata.author}</p></div>`
  ).join('');
}

// function fillBookShelf(array) {
//   return array.map(book =>
//     book.books
//       .map(bookdata => {
//         return `<div class="book-card-container ">
//     <a class="book-item-link" href="#" data-bookid="${bookdata._id}">
//   <img class="book-card-img" src="${bookdata.book_image}" alt="" />
//   <h2 class="book-card-title">${bookdata.title}</h2>
//   <p class="book-card-author">${bookdata.author}</p>
// </div>`;
//       })
//       .join('')
//   );
// }
markupPopularBooks();
