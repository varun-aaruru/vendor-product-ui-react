import { Menu } from "antd";
import Axios from "axios";
import React from "react";
import People from "./People";
import Product from "./products";

class MainPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentlyVisble: "people",
      people: [],
      products: [],
      status: "",
    }
  }

  componentDidMount = () => {
    // we're fetching both people and data here. Status is loading if data fetch
    // is in progress.
    // Ideally, we should fetch people and products separately. But since this
    // is a simple app, we can fetch them together. In future, in complicated
    // apps, we will fetch people in People component and store them in a store,
    // fetch products in Product component and store them in a store. We are not
    // implementing store here, so we are up leveling the data fetching into
    // this parent component and passing the required data as props to child
    // components.
    this.fetchData();
  }

  fetchData = () => {
    // we'll have to make api calls to fetch people and products. For now, lets
    // just set dummy data.
    this.setState({status: "loading"})
    Axios.get('/api/vendors')
        .then(res => {
          //console.log(res);
          this.setState({
            people : res.data
          });
          return Axios.get('/api/products')
        }).then(response => {
          //console.log("products are",response)
          this.setState({
            products : response.data,
            status: "fetched"  
          });
        }).catch(err => this.setState({ 
          errorMessage : err.message,
          status: "rejected"
        }))
  }

  renderSideDrawer = () => {
    let menu = (
      <Menu 
        onClick={(info) => this.setState({currentlyVisble: info.key})} 
        selectedKeys={[this.state.currentlyVisble]} 
        mode="vertical"
      >
        <Menu.Item key="products"> Products </Menu.Item>
        <Menu.Item key="people"> People </Menu.Item>
      </Menu>
    );
    return menu;
  }

  render = () => {
    let errorMessage = null;
    //console.log("error message", this.state.errorMessage);
    if(this.state.status === "rejected"){
      errorMessage = (
        <p>error</p>
      )

    }
    let contentToShow = null;
    if (this.state.currentlyVisble === "people"){
      contentToShow = (
        <People 
          people={this.state.people}
          products={this.state.products}
          status={this.state.status}
          fetchData={this.fetchData}
        />
      );
    } else {
      contentToShow = (
        <Product 
          products={this.state.products}
          vendors={this.state.people}
          status={this.state.status}
          fetchData={this.fetchData}
        />
      )
    }
    return (
      <div
        style={{
          display: "flex"
        }}
      >
        {this.renderSideDrawer()}
        <div
          style={{
            flexGrow: 1
          }}
        >
          {contentToShow}
          {errorMessage}
        </div>
      </div>
    )
  }

}

export default MainPage;
