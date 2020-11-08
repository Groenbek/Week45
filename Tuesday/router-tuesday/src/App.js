import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  NavLink,
  Prompt,
} from "react-router-dom";
import { useState } from "react";

function Header() {
  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/products">
            Products
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/add-book">
            Add Book
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/find-book">
            Find Book
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/company">
            Company
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
function AddBook({ bookFacade }) {
  const emptyBook = { id: "", title: "", info: "" };
  const [book, setBook] = useState({ ...emptyBook });
  let [isBlocking, setIsBlocking] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBook({ ...book, [id]: value });
    setIsBlocking(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    bookFacade.addBook(book);
    setBook({ ...emptyBook });
    setIsBlocking(false);
  };
  return (
    <div>
      <h2>Add Book</h2>
      <form>
        <input
          id="title"
          value={book.title}
          placeholder="Add title"
          onChange={handleChange}
        />
        <br />
        <input
          id="info"
          value={book.info}
          placeholder="Add info"
          onChange={handleChange}
        />
        <br />
        <button onClick={handleSubmit}>Save</button>
      </form>
      {
        <Prompt
          when={isBlocking}
          message={(location) =>
            `You have unsaved changes, are you sure you want to go to  ${location.pathname}`
          }
        />
      }
    </div>
  );
}

const style = {
  borderRadius: 2,
  width: 400,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "darkGray",
  padding: 2,
};

function FindBook({ bookFacade }) {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState(null);

  const findBook = () => {
    const foundBook = bookFacade.findBook(bookId);
    setBook(foundBook);
  };
  const deleteBook = (id) => {
    bookFacade.deleteBook(id);
    setBook(null);
  };
  return (
    <div style={{ margin: 44 }}>
      <input
        id="book-id"
        placeholder="Enter a book ID"
        onChange={(e) => {
          setBookId(e.target.value);
        }}
      />
      <button onClick={findBook}>Find book</button>
      {book && (
        <div>
          <p>ID: {book.id} </p>
          <p>Title: {book.title} </p>
          <p>Info: {book.info} </p>
          <div>
            <button onClick={() => deleteBook(book.id)}>Delete book</button>
          </div>
        </div>
      )}
      {!book && <p>Enter id for book to see </p>}
    </div>
  );
}

function Details({ bookFacade }) {
  const { bookId } = useParams();
  const book = bookFacade.findBook(bookId);

  const showBook = book ? (
    <div style={style}>
      <p>Title: {book.title}</p>
      <p>ID: {book.id}</p>
      <p>Info: {book.info} </p>
    </div>
  ) : (
    <p>Book not found</p>
  );
  return <div>{showBook}</div>;
}

function Products({ bookFacade }) {
  const books = bookFacade.getBooks();
  let { path, url } = useRouteMatch();

  const lis = books.map((book) => {
    return (
      <li key={book.id}>
        {book.title}
        &nbsp;
        <Link to={`${url}/${book.id}`}>details</Link>
      </li>
    );
  });
  return (
    <div>
      <h2>Products</h2>
      <ul>{lis}</ul>
      <p>-----------------------------------</p>
      <Switch>
        <Route exact path={path}>
          <h3>Please select a book!</h3>
        </Route>
        <Route path={`${path}/:bookId`}>
          <Details bookFacade={bookFacade} />
        </Route>
      </Switch>
    </div>
  );
}
function Company() {
  return (
    <div>
      <h2>Company</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>No Match found for this URL</h2>
    </div>
  );
}

function App({ bookFacade }) {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products">
          <Products bookFacade={bookFacade} />
        </Route>
        <Route path="/company">
          <Company />
        </Route>
        <Route path="/add-book">
          <AddBook bookFacade={bookFacade} />
        </Route>
        <Route path="/find-book">
          <FindBook bookFacade={bookFacade} />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
