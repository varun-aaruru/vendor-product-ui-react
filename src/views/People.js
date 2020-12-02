import React from "react";

import {Modal, Button, Divider, Table, Input, Select} from "antd";
import Axios from "axios";

class People extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      modal: {
        showEditPersonModal: false,
        showAddPersonModal: false,
        name: "",
        age: "",
        products: "",
        editable: true,
        status: "",
      }
    }
  }
  //function for deleting a vendor
  deleteperson = (personid) => {
    this.setState({
      modal: {
        ...this.state.modal,
        status: "loading"
      }
    })
    //console.log("id is ....",this.state.modal.key)
    let deleteapistring = '/api/vendors/'+personid;
    //console.log("final delete api string is...", deleteapistring)
    Axios.delete(deleteapistring)
    .then(response => {
      //console.log(response);
      this.setState({
        modal: {
          ...this.state.modal,
          status: "fetched"
        }
      })
      this.props.fetchData()
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  updateperson = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        status: "loading"
      }
    })
    let produNames = this.state.modal.products
    console.log("testing",this.state.modal.products, produNames)
    //console.log("id is ....",this.state.modal.key)
    let updateapistring = '/api/vendors/'+this.state.modal.key;
    //console.log("final update api string is...", updateapistring)
    Axios.put(updateapistring,{
      vendorname : this.state.modal.vendorname,
      age : Number(this.state.modal.age),
      product_names : produNames
    })
    .then(response => {
      //console.log(response);
      this.setState({
        modal: {
          ...this.state.modal,
          status: "fetched",
          showEditPersonModal : false
        }
      })
      this.props.fetchData()
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  addperson = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        status: "loading"
      }
    })

    let produNames = this.state.modal.products
    Axios.post('/api/vendors',{
      vendorname :this.state.modal.vendorname,
      age: Number(this.state.modal.age),
      product_names : produNames
    })
    .then(response => {
      //console.log(response);
      this.setState({
        modal: {
          ...this.state.modal,
          status: "fetched",
          showAddPersonModal : false
        }
      })
      this.props.fetchData()
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  renderModal = () => {
    let visible = 
      this.state.modal.showAddPersonModal ||
      this.state.modal.showEditPersonModal;
    if (!visible){
      return null;
    }
    let title = "Add person";
    //console.log("name", this.state.modal.vendorname);
    let name = this.state.modal.vendorname || "";
    let footer = [
      <Button key="addButton" onClick={() => this.addperson()}>
        Add person
      </Button>
    ];
    if (this.state.modal.showEditPersonModal){
      title = `Update details for ${name}`;
      footer = [
        <Button key="editButton" onClick={() => this.setState(prevState => ({
          modal: {
            ...prevState.modal,
            editable: true
          }
        }))}>
          Edit
        </Button>,
        <Button key="saveButton" onClick={() => this.updateperson()}>
          Save
        </Button>
      ]
    }
    let productOptions = (this.props.products || []).map(product => (
      <Select.Option key={product.name}>{product.name}</Select.Option>)
    );
    //console.log("test", this.state.modal.products)
    let content = (
      <div>
        <div>
          <p>Name:</p>
          <Input
            value={this.state.modal.vendorname}
            disabled={!this.state.modal.editable}
            onChange={(event) => {
              this.setState(prevState => ({
                modal: {
                  ...prevState.modal,
                  vendorname: event.target.value
                }
              }))
            }}
            placeholder={"Enter name"} 
          />
        </div>
        <Divider />
        <div>
          <p>Age:</p>
          <Input 
            placeholder={"Enter Age"}
            value={this.state.modal.age}
            disabled={!this.state.modal.editable}
            onChange={(event) => {
              this.setState(prevState => ({
                modal: {
                  ...prevState.modal,
                  age: event.target.value
                }
              }))
            }}
          />
        </div>
        <Divider />
        <div>
          <p>Products:</p>
          <Select
            mode="multiple"
            disabled={!this.state.modal.editable}
            style={{ width: '100%' }}
            placeholder="Please select product"
            onChange={(value) => this.setState(prevState => {
              console.log(value);
              return {
              modal: {
                ...prevState.modal,
                products: value
              }
            }})}
            value={this.state.modal.products || []}
          >
            {productOptions}
          </Select>
        </div>

      </div>
    );
    return (
      <Modal
        title={title}
        footer={footer}
        visible={visible}
        onCancel={() => this.setState({modal: {}})}
      >
        {content}
      </Modal>
    )
  }

  renderTable = () => {
    const columns = [
      {
        key: "vendorname",
        title: "Name",
        dataIndex: "vendorname",
      },
      {
        key: "age",
        title: "Age",
        dataIndex: "age"
      },
      {
        key: "products",
        title: "Products",
        dataIndex: "products",
        render: (data) => data.join()
      },
      {
        key: "action",
        title: "Action",
        render: (action) => {
          //console.log("action",action);
          return (
            <div>
            <Button 
              type="link" 
              onClick={() => this.setState({
                modal: {
                  showEditPersonModal: true,
                  ...action
                }
              })}
            > 
              Update
            </Button>
            <Button 
              type="link" 
              onClick={() => this.deleteperson(action.key)}
            > 
              Delete
            </Button>
            </div>
          )
        }
      }   
    ];
    let data = this.props.people || [];
    console.log(data)
    data = data.map(person => ({
      key: person._id,
      age: person.age || "-",
      vendorname: person.vendorname || "-",
      products: person.product_names || [],
      action: person._id
    }));
    return (
      <Table
        size="small"
        columns={columns}
        dataSource={data}
      />
    )
  }

  render = () => {
    return (
      <div style={{margin: "5px"}}>
        <h1> People </h1>
        <Divider />
        <Button
          style={{float: "right"}}
          type="primary"
          onClick={() => {
            this.setState({
              modal: {
                showAddPersonModal: true,
                editable: true
              }
            })
          }}
        >
          Add Person
        </Button>
        {this.renderTable()}
        {this.renderModal()}
      </div>
    )
  }
}

export default People;
