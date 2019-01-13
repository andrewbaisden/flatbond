import React, { Component } from 'react';
class CreatedFlatBond extends Component {
    state = {
        rent: '',
        postcode: ''
    }
    componentDidMount(){
        this.getData();
    }
    getData = () => {
        const rent = this.props.location.state.rent;
        this.setState({rent: rent})

        const postcode = this.props.location.state.postcode;
        this.setState({postcode: postcode})
    }
    render(){
        return(
            <React.Fragment>
                <h1>Created Flatbond</h1>
                <p>{this.state.rent}</p>
                <p>{this.state.postcode}</p>
            </React.Fragment>
        )
    }
}

export default CreatedFlatBond;