import '../css/HomePage.css'
// import logo from '../images/aqua.png'
import Prediction from '../components/prediction'
import Navbar from '../components/Navbar'
const HomePage = () => {


  return (
    <>
      <div className="header">
        <div className="container">
          <Navbar />
        </div>


        <div className="inner-header flex">
          <h1 className='head'>Revolutionalizing Shrimp Farming with IOT Based Monitoring.</h1>
        </div>

      </div>

      <Prediction />

    </>
  );
};

export default HomePage;
