import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CartItemDetails extends Component {
  state = {courseDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourseData()
  }

  getCourseData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const apiUrl = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const courseDetails = fetchedData.course_details
      const updatedData = {
        id: courseDetails.id,
        name: courseDetails.name,
        imageUrl: courseDetails.image_url,
        description: courseDetails.description,
      }
      console.log(updatedData)
      this.setState({
        courseDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCoursesView = () => {
    const {courseDetails} = this.state
    const {name, imageUrl, description} = courseDetails
    return (
      <div className="course-details-container">
        <img src={imageUrl} className="image" alt={name} />
        <div className="text-container">
          <h1 className="name">{name}</h1>
          <p className="description">{description}</p>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4656a1" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <div>
        <Link to="/courses/:id">
          <button type="button" className="retry-button">
            Retry
          </button>
        </Link>
      </div>
    </div>
  )

  renderCoursesViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCoursesView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="responsive-container">
          {this.renderCoursesViewBasedOnApiStatus()}
        </div>
      </div>
    )
  }
}

export default CartItemDetails
