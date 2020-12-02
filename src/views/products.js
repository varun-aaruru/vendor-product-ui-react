import React from "react";

import {Modal, Button, Divider, Table, Input, Select} from "antd";
import Axios from "axios";

class Product extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          modal: {
            showEditProductModal: false,
            showAddProductModal: false,
            name: "",
            price: "",
            vendor: "",
            editable: true,
            status: "",
          }
        }
      }
      deleteproduct = (productid) => {
        this.setState({
          modal: {
            ...this.state.modal,
            status: "loading"
          }
        })
       // console.log("id is ....",this.state.modal.key)
        let deleteapistring = '/api/products/'+productid;
        //console.log("final delete api string is...", deleteapistring)
        Axios.delete(deleteapistring)
        .then(response => {
         // console.log(response);
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
      updateproduct =() => {
        this.setState({
          modal: {
            ...this.state.modal,
            status: "loading"
          }
        })
        let venNames = this.state.modal.vendor
        //console.log("id is ....",this.state.modal.key)
        let updateapistring = '/api/products/'+this.state.modal.key;
        //console.log("final update api string is...", updateapistring)
        console.log(venNames)
        Axios.put(updateapistring,{
          name : this.state.modal.name,
          price : Number(this.state.modal.price),
          vendor_name : venNames
        })
        .then(response => {
          console.log(response);
          this.setState({
            modal: {
              ...this.state.modal,
              status: "fetched",
              showEditProductModal : false
            }
          })
          this.props.fetchData()
        })
        .catch(function(err) {
          console.log(err);
        })
      }
      addproduct = () => {
        this.setState({
          modal: {
            ...this.state.modal,
            status: "loading"
          }
        })
        let venNames = this.state.modal.vendor
        Axios.post('/api/products',{
          name :this.state.modal.name,
          price: Number(this.state.modal.price),
          vendor_name : venNames
        })
        .then(response => {
          //console.log(response);
          this.setState({
            modal: {
              ...this.state.modal,
              status: "fetched",
              showAddProductModal : false
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
          this.state.modal.showAddProductModal ||
          this.state.modal.showEditProductModal;
        if (!visible){
          return null;
        }
        //console.log(this.props)
        let vendorOptions = (this.props.vendors || []).map(product => (
            <Select.Option key={product.vendorname}>{product.vendorname}</Select.Option>)
          );
        let title = "Add product";
        //("name", this.state.modal.name);
        let name = this.state.modal.name || "";
        let footer = [
          <Button key="addButton" onClick={() => this.addproduct()}>
            Add product
          </Button>
        ];
        if (this.state.modal.showEditProductModal){
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
            <Button key="saveButton" onClick={() => this.updateproduct()}>
              Save
            </Button>
          ]
        }
        let content = (
          <div>
            <div>
              <p>Name:</p>
              <Input
                value={this.state.modal.name}
                disabled={!this.state.modal.editable}
                onChange={(event) => {
                  this.setState(prevState => ({
                    modal: {
                      ...prevState.modal,
                      name: event.target.value
                    }
                  }))
                }}
                placeholder={"Enter name"} 
              />
            </div>
            <Divider />
            <div>
              <p>Price:</p>
              <Input 
                placeholder={"Enter price"}
                value={this.state.modal.price}
                disabled={!this.state.modal.editable}
                onChange={(event) => {
                  this.setState(prevState => ({
                    modal: {
                      ...prevState.modal,
                      price: event.target.value
                    }
                  }))
                }}
              />
            </div>
            <Divider />
            <div>
              <p>Vendors:</p>
              <Select
                disabled={!this.state.modal.editable}
                style={{ width: '100%' }}
                placeholder="Please select vendor"
                onChange={(value) => this.setState(prevState => ({
                  modal: {
                    ...prevState.modal,
                    vendor: value
                  }
                }))}
                value={this.state.modal.vendor}
              >
                {vendorOptions}
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
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "price",
            title: "price",
            dataIndex: "price"
          },
          {
            key: "vendor",
            title: "vendor",
            dataIndex: "vendor"
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
                      showEditProductModal: true,
                      ...action
                    }
                  })}
                > 
                  Update
                </Button>
                <Button 
                  type="link" 
                  onClick={() => this.deleteproduct(action.key)}
                > 
                  Delete
                </Button>
                </div>
              )
            }
          }   
        ];
        let data = this.props.products || [];
        //console.log(data)
        data = data.map(products => ({
          key: products._id,
          price: products.price || "-",
          name: products.name || "-",
          vendor: products.vendor_name,
          action: products._id
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
            <h1> products </h1>
            <Divider />
            <Button
              style={{float: "right"}}
              type="primary"
              onClick={() => {
                this.setState({
                  modal: {
                    showAddProductModal: true,
                    editable: true
                  }
                })
              }}
            >
              Add Product
            </Button>
            {this.renderTable()}
            {this.renderModal()}
          </div>
        )
      }
}

export default Product;