import React from "react"
import ReactPlayer from 'react-player'
import {
  Card, CardBody, Badge, Button, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import { Star, X, ShoppingCart, List } from "react-feather"
import { Link } from "react-router-dom"
import Breacrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import "../../assets/scss/pages/app-ecommerce-shop.scss"
import ReactPaginate from "react-paginate"
import { ChevronLeft, ChevronRight } from "react-feather"
import "../../assets/scss/plugins/extensions/react-paginate.scss"
import axios from "axios"
import ReactStars from "react-rating-stars-component";
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';



class Wishlist extends React.Component {
  state = {
    modal: false,
    sel: [],
    items: [],
    pageCount: 0,
    perPage: 8,
    isLoading: true,
    enablePagination: true,
    type: "All assets",
    currentData: []
  }

  // Get all the assets & slice per page
  async componentDidMount() {
    await axios.get(process.env.REACT_APP_API_URL + "/assets").then(response => {
      let rowData = response.data
      this.setState({ items: rowData, pageCount: Math.ceil(rowData.length / this.state.perPage), isLoading: false, currentData: rowData.slice(0, this.state.perPage) })
    })
  }

  toggleModal = (item) => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      sel: item
    }))
  }

  handlePageClick = (data) => {
    let a = data.selected * this.state.perPage
    let b = a + this.state.perPage
    this.setState({ currentData: this.state.items.slice(a, b) })
  };

  showTop = () => {
    axios.get(process.env.REACT_APP_API_URL + "/assets").then(response => {
      for (let a of response.data){a.med = a.totalRating/a.totalVotes} 
      let sorted = response.data.sort((a, b) => b.med - a.med);
      this.setState({ currentData: sorted.slice(0, 10), enablePagination: false, type: "Top 10 assets" })
    })
  };

  showAll = () => {
    this.setState({ currentData: this.state.items.slice(0, this.state.perPage), type: "All assets", enablePagination: true })
  };

  ratingChanged = (newRating, id) => {
    axios.post(process.env.REACT_APP_API_URL + "/assets/" + id + "/vote/" + newRating).then(response => {
      toast.success("Voted successfully!")
    })

  };

  render() {
    let renderList = this.state.currentData.map((item, i) => {
      let med = Math.round((item.totalRating / item.totalVotes) * 10) / 10
      let id = item.id
      if (!med) { med = "-" }
      return (
        <Card
          className={`ecommerce-card ${this.state.items.includes(i) ? "d-none" : ""
            }`}
          key={i}
        >
          <div className="card-content">
            <div className="item-img text-center">
              <Link onClick={e => {
                this.toggleModal(item)
                e.stopPropagation()
              }}>
                <img className="img-fluid" src={item.previewUrl} alt={item.title} />
              </Link>
            </div>
            <CardBody>
              <div className="item-wrapper">
                <div className="item-rating">
                  <Badge color="primary" className="badge-md">
                    <span className="mr-50 align-middle">{med}</span>
                    <Star size={14} />
                  </Badge>
                  <ReactStars
                    count={5}
                    onChange={(e) => this.ratingChanged(e, id)}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
                <div className="product-price">
                  <h6 className="item-price"><Badge pill color="primary">{item.mediaType}</Badge></h6>
                </div>
              </div>
              <div className="item-name">
                <span>{item.title}</span>
              </div>
              <div className="item-desc">
                <p className="item-description">{item.description}</p>
              </div>
            </CardBody>
          </div>
        </Card>
      )
    })
    return (
      <React.Fragment>
        <Breacrumbs
          breadCrumbTitle={this.state.type}
          breadCrumbParent="Assets"
          breadCrumbActive={this.state.type}
        />
        <div className='demo-inline-spacing text-center'>
          <Button.Ripple color='warning' onClick={() => this.showTop()}>
            <Star size={14} />
            <span className='align-middle ml-25'>Top 10</span>
          </Button.Ripple>&nbsp;&nbsp;
          <Button.Ripple color='primary' onClick={() => this.showAll()}>
            <List size={14} />
            <span className='align-middle ml-25'>All</span>
          </Button.Ripple>
        </div>

        <ToastContainer />

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="modal-dialog-centered modal-xl"
        >
          <ModalHeader toggle={this.toggleModal}>
            {this.state.sel.title}
          </ModalHeader>

          <ModalBody>

            {this.state.sel.mediaType == "video" &&
              <div className='player-wrapper'>
                <ReactPlayer playing={true} controls={true}
                  light={this.state.sel.previewUrl}
                  className='react-player'
                  url={this.state.sel.contentUrl}
                  width='100%'
                  height='100%'
                />
              </div>
            }

            {this.state.sel.mediaType == "image" &&
              <div class="card-body text-center"><img src={this.state.sel.contentUrl} alt="Social Card" class="img-fluid"></img></div>
            }

          </ModalBody>
          <ModalFooter>
            {this.state.sel.description}
          </ModalFooter>
        </Modal>

        <br></br>
        <div className="ecommerce-application">
          <div className="grid-view wishlist-items">{renderList}</div>
        </div>
        {this.state.enablePagination &&

          <ReactPaginate
            previousLabel={<ChevronLeft size="15" />}
            nextLabel={<ChevronRight size="15" />}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            onPageChange={this.handlePageClick}
            pageRangeDisplayed={2}
            containerClassName={
              "vx-pagination separated-pagination pagination-center mt-3"
            }
            activeClassName={"active"}
          />
        }

      </React.Fragment>
    )
  }
}
export default Wishlist
