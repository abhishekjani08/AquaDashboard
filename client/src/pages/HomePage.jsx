

import '../css/HomePage.css'
// import logo from '../images/aqua.png'
import Prediction from '../components/prediction'
import Navbar from '../components/Navbar'
const HomePage = () => {


  return (
    <>
       <div className="header">
        <div className="container">
   <Navbar/>
</div>


<div className="inner-header flex">
<h1 className='head'>Water is a critical resource that we monitor and safeguard through IoT technology to ensure its quality and sustainability.</h1>
</div>

{/* <!--Waves Container--> */}
<div>
<svg className="waves" xmlns="http://www.w3.org/2000/svg"
viewBox="0 24 150 27" preserveAspectRatio="none" shapeRendering="auto">
<defs>
<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
</defs>
<g className="parallax">
<use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
<use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
<use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
<use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
</g>
</svg>
</div>
{/* <!--Waves end--> */}

</div>
{/* <!--Header ends--> */}

<Prediction/>

{/* <!--Content ends--> */}
    </>
  );
};

export default HomePage;
