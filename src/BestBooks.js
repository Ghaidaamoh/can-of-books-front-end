import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './BestBooks.css';
import { withAuth0 } from '@auth0/auth0-react';
import Card from 'react-bootstrap/Card'
import axios from 'axios'
class MyFavoriteBooks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      booksArr: [],
      showBooks: false,
      userEmail: ''
    }
  }


  componentDidMount = async () => {
    const { user } = this.props.auth0;

    await this.setState({
      userEmail: `${user.email}`
    })


    let url = `${process.env.REACT_APP_PORT}/book?userEmail=${this.state.userEmail}`;

    let responseData = await axios.get(url);

    await this.setState({
      booksArr: responseData.data,
      showBooks: true,
    })
    console.log('Email : ' + this.state.userEmail);
    console.log('show state : ' + this.state.showBooks);
    console.log(this.state.booksArr);
  }



  render() {
    return (
      <Jumbotron>
        <h1>My Favorite Books</h1>
        <p>
          This is a collection of my favorite books
        </p>
        <div className="bookcont">
          {
            this.state.showBooks &&
            this.state.booksArr.map(book => {


              return (
                <Card className="book" style={{ width: '18rem', backgroundColor: 'lightgrey', boxShadow: '2px 2px 2px black' }} >

                  <Card.Body>
                    <Card.Title>{book.name}</Card.Title>
                    <Card.Img style={{ boxShadow: '2px 2px 2px #ccc' }} variant="top" src={book.img} alt={book.name} />

                    <Card.Text>
                      {book.description}
                    </Card.Text>
                    <Card.Text>
                      {book.status}
                    </Card.Text>
                  </Card.Body>
                </Card>
              )

            })

          }
        </div>



      </Jumbotron>
    )
  }
}

export default withAuth0(MyFavoriteBooks);