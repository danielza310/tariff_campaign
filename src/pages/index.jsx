import { connect } from 'react-redux';


const Home = () => {
  return (<>
     <h1 class="text-3xl font-bold underline">
        Hello world!
    </h1>
    </>)
}

const mapStateToProps = (state) => ({
    data: state.data
  });
  
export default connect(
    mapStateToProps,
    {  }
)(Home);
  

