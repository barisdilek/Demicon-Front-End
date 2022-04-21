import {React,Component} from 'react'
import './Users.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

export class Country extends Component {
  render() {
    return (
      <header id="country">
        <br/>{"  "}
        <div className="container">
           <h4><b>{this.props.name}</b></h4>
           <div className="row">
                <div className="col-2" ><b>Title</b></div>
                <div className="col-3"><b>First Name</b></div>
                <div className="col-3"><b>Last Name</b></div>
                <div className="col-1"><b>Gender</b></div>
                <div className="col-3"><b>Email</b></div>
            </div>
            {this.props.data.filter(d => d.name ===this.props.name)[0].users.map((user,i) => {
              return (
                  <div className="row" key={i}>
                      <div className="col-2">{user.name.title}</div>
                      <div className="col-3">{user.name.first}</div>
                      <div className="col-3">{user.name.last}</div>
                      <div className="col-1">{user.gender}</div>
                      <div className="col-3">{user.email}</div>
                  </div>
              )
            })}          
        </div>
      </header>
  )}
}

export class Countries extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      country: "",
      showList: false,     
    };

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect (e){
    this.setState({ 
      country : e,
      showList: true
    });
  }
  
  render() {
    return (
          <header id="countries">
            <div className="container">
              <div className="row">
                  <div className="col-12">
                    <DropdownButton
                      title="Please select a Country"
                      id="countries"
                      onSelect={this.onSelect}
                      >
                        {this.props.data.users
                        ? this.props.data.users.map((d, i) => (
                            <Dropdown.Item key={i} eventKey={d.name}>{d.name}</Dropdown.Item>
                        ))
                        : "Countries not loaded"}
                      </DropdownButton>

                  </div>
                  { 
                    this.state.showList ?
                    <div className="col-12">
                        <Country name={this.state.country} data={this.props.data.users}/>
                    </div>:
                    null
                  }
                </div>
              </div>
            </header>
    );
  }
}


export class Users extends Component {
  state = {
    refreshData: false,
    data: {},
    showList: false,    
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    if(this.state.refreshData)
    { 
      this.getData();
    }
  }
  
  getData() {
    fetch('http://localhost:8888/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
                {users{
                    name
                    users{
                        name {
                        title
                        first
                        last
                        }
                        gender
                        email
                    }
                }}
            `,
          variables: {
            now: new Date().toISOString(),
          },
        }),
      })
        .then((res) => res.json())
        .then((result) => {
            this.setState({
              data : result.data,
              refreshData:false,
              showList:true
            }) 
      });
  }

  render() {
    const refreshData=(e) => {
      this.setState({refreshData: true})
    }
    return (
        <header id="users">
          <br/>{"  "}
          <div className="container">
            <div className="row">
              <div className="col-11">
                { this.state.showList ? <Countries data={this.state.data}/> : null }
              </div>
              <div className="col-1">
                <button
                  className="btn btn-primary"
                  type="submit" 
                  value="Refresh"
                  onClick={refreshData}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>
    )}
}

export default Users;