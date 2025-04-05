import { connect } from 'react-redux';


const Home = (props) => {
  return (<>
     <h1 className="text-3xl font-bold underline">
        Hello world!
    </h1>
    </>)
}
const mapStateToProps = (state) => ({
  user: state.user
  });
  
export default connect(
    mapStateToProps,
    {  }
)(Home);
  

