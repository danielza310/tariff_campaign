import { connect } from 'react-redux';


const SignIn = () => {
  return (<>
     <h1 class="text-3xl font-bold underline">
        Sign In
    </h1>
    </>)
}

const mapStateToProps = (state) => ({
    data: state.data
  });
  
export default connect(
    mapStateToProps,
    {  }
)(SignIn);
  

