import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './BestBooks.css';
import { withAuth0 } from '@auth0/auth0-react';
import { Button, Card, Modal, Form } from 'react-bootstrap/';
import axios from 'axios'
class MyFavoriteBooks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      booksArr: [],
      showBooks: false,
      userEmail: '',
      show:false,
      userData: [],
      index: 0,
      NameBook:'',
      bookDis:'',
      bookSta:'',
      showUpdate: false
      
    }
  }

  componentDidMount = async () => {
    const { user } = this.props.auth0;

    await this.setState({
      userEmail: `${user.email}`
    })


    let url = `${process.env.REACT_APP_PORT}/book?userEmail=${this.state.userEmail}`;

    let resData = await axios.get(url);

    await this.setState({
      booksArr: resData.data,
      showBooks: true,
    })

  }
  ///////////////////
  handelClick = () => {
    this.setState({
      show: true,
    });
  }

  handleClose = () => {
    this.setState({
      show: false,
    })
  }

  addBook = async (event) => {
    event.preventDefault();
    //console.log(event.target.bookName.value);
    const server = process.env.REACT_APP_PORT;
    const newBook = {
      name: event.target.bookName.value,
      description: event.target.description.value,
      status: event.target.status.value,
      userEmail: this.state.userEmail,

    }
    console.log('aaaaa',newBook);

    const addBookUrl = await axios.post(`${server}/addBook`, newBook);
    await this.setState({
      booksArr: addBookUrl.data,
    })
  
  }

  deleteBook = async(idx) => {
    const server = process.env.REACT_APP_PORT;
    const deletPara={
      email:this.state.userEmail,
      index:idx,
    }
    const deletURL=await axios.delete(`${server}/deleteBook`,{params:deletPara});
    this.setState({
      booksArr: deletURL.data,
    });
  }

  handelUpdateClick = (inx)=> {
    this.setState({
      showUpdate: true,
      index: inx,
      NameBook: this.state.booksArr[inx].name,
      bookDis: this.state.booksArr[inx].description,
      bookSta: this.state.booksArr[inx].status,
  
    });
  }
  handleUpdateClose = () => {
    this.setState({
      showUpdate: false,
  
    })
  }
  UpdateBook = async (event) => {
    event.preventDefault();
    const server = process.env.REACT_APP_PORT;
    const updateDb = {
      email: this.state.userEmail,
      index: this.state.index,
      name: event.target.NameBook.value,
      description: event.target.bookDis.value,
      status: event.target.bookSta.value,
    }
    let updateURL = await axios.put(`${server}/updateBook/${this.state.index}`, updateDb);
    this.setState({
      booksArr: updateURL.data,
    });
  
  }
  render() {
    return (
      <Jumbotron>
        <h1>My Favorite Books</h1>
        <p>
          This is a collection of my favorite books
        </p>
        <Button variant="warning" onClick={this.handelClick} >Add Book</Button>
        <div className="bookcont">
          {
            this.state.showBooks &&
            this.state.booksArr.map((item, inx)=> {


              return (
                <Card >
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Img src={item.img} alt={item.name} />
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                    <Card.Text>
                      {item.status}
                    </Card.Text>
                    <Button variant="warning" onClick={()=>this.deleteBook(inx)}>Delete</Button>
                    <Button variant="warning" onClick={() => this.handelUpdateClick(inx)}>Update</Button>
                  </Card.Body>
                </Card>
              )

            })

          }
           <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.addBook}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Book name</Form.Label>
                <Form.Control type="text" placeholder="book name" name='bookName' />

              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Book description</Form.Label>
                <Form.Control type="text" placeholder="description" name='description' />
              </Form.Group>
              <Form.Group controlId="status">
                <Form.Label>Book status</Form.Label>
                <Form.Control type="text" placeholder="status" name='status' />
              </Form.Group>
              <button value="submit">submit</button>
            
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        
        <Modal show={this.state.showUpdate} onHide={this.handleUpdateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.UpdateBook}>
            <Form.Group controlId="formBasicEmail2">
              <Form.Label>Book name</Form.Label>
              <Form.Control type="text" placeholder="book name" name='NameBook'defaultValue={this.state.NameBook}/>

            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Book description</Form.Label>
              <Form.Control type="text" placeholder="description" name='bookDis'defaultValue={this.state.bookDis} />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Book status</Form.Label>
              <Form.Control type="text" placeholder="status" name='bookSta' defaultValue={this.state.bookSta}/>
            </Form.Group>
            <Button variant="warning" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleUpdateClose}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
        </div>
      </Jumbotron>
    )
  }
}

export default withAuth0(MyFavoriteBooks);