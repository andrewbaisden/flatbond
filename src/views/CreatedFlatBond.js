import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class CreatedFlatBond extends Component {
    state = {
        rent: '',
        postcode: '',
        memberFee: ''
    }
    componentDidMount(){
        this.getData();
    }
    getData = () => {
        // Gets the form data state which was passed from the App.js component, form page
        const rent = this.props.location.state.rent;
        this.setState({rent: rent})

        const postcode = this.props.location.state.postcode;
        this.setState({postcode: postcode})

        const memberFee = this.props.location.state.memberFee;
        this.setState({memberFee: memberFee})
    }
    render(){
        return(
            <React.Fragment>
                <h1>Created Flatbond</h1>
                <p>{this.state.rent}</p>
                <p>{this.state.postcode}</p>
                <p>{this.state.memberFee}</p>
                <Link href='/' to='/'>Create a Flatbond</Link>
            </React.Fragment>
        )
    }
}

export default CreatedFlatBond;