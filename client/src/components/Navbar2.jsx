import '../css/Navbar2.css'

export default function Navbar() {
  return (
    <div>
            <nav className="navbar">
    
    <span className="navbar-toggle" id="js-navbar-toggle">
            <i className="fas fa-bars"></i>
        </span>
   
        <a style={{fontSize:'30px', color:'black', fontWeight:'800',marginLeft:'3vw'}}  href="#"className="logo">
     <h1>AquaLizer</h1>
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
