import logo from '../images/aqua.png'
import '../css/Navbar.css'

export default function Navbar() {
  return (
    <div>
            <nav className="navbar">
    
    <span className="navbar-toggle" id="js-navbar-toggle">
            <i className="fas fa-bars"></i>
        </span>
   
    <a style={{marginTop:'-10vh', marginLeft:'-5vw' ,height:'20vh', width:'20vw'}}  href="#"className="logo">
      <img sizes='5' src={logo} alt=""  />
    </a>
    <ul className="main-nav" id="js-menu">
      <li>
        <a href="/" className="nav-links">Home</a>
      </li>
      <li>
        <a href="/analysis" className="nav-links">Analysis</a>
      </li>
      <li>
        <a href="/table" className="nav-links">Table</a>
      </li>
      {/* <li>
        <a href="#" className="nav-links">Contact Us</a>
      </li> */}
    
    </ul>
   
  </nav>
    </div>
  )
}
