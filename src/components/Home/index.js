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

class Home extends Component {
  state = {coursesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCoursesData()
  }

  getFormattedData = data => ({
    id: data.id,
    name: data.name,
    logoUrl: data.logo_url,
  })

  getCoursesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.courses.map(eachCourse =>
        this.getFormattedData(eachCourse),
      )
      console.log(updatedData)
      this.setState({
        coursesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCoursesView = () => {
    const {coursesList} = this.state
    return (
      <ul className="courses-list-container">
        {coursesList.map(eachCourse => {
          const {name, id, logoUrl} = eachCourse

          return (
            <Link to={`/courses/${id}`} className="links">
              <li key={id} className="course-item-container">
                <img src={logoUrl} className="logo" alt={name} />
                <p className="name">{name}</p>
              </li>
            </Link>
          )
        })}
      </ul>
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
        <Link to="/">
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
          <h1 className="heading">Courses</h1>
          {this.renderCoursesViewBasedOnApiStatus()}
        </div>
      </div>
    )
  }
}

export default Home
