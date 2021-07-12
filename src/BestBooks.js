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

    let resData = await axios.get(url);

    await this.setState({
      booksArr: resData.data,
      showBooks: true,
    })
    
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
            this.state.booksArr.map(item => {


              return (
                <Card >

                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Img  src={item.img} alt={item.name} />

                    <Card.Text>
                      {item.description}
                    </Card.Text>
                    <Card.Text>
                      {item.status}
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