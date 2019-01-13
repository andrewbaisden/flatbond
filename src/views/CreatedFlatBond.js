import React, { Component } from 'react';
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
            </React.Fragment>
        )
    }
}

export default CreatedFlatBond;