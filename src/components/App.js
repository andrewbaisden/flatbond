import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: '',
            rent: '',
            postcode: ''
        }

        this.paymentSelectRef = React.createRef()
    }
    componentDidMount(){
        this.getFlatbondAPI()
        this.onSelectedOption()
    }
   async getFlatbondAPI(){
    try {
        const response = await axios.get('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/config');
        console.log('Response', response);
        console.log('Data', response.data);
        this.setState({data: response.data.fixed_membership_fee_amount});

    } catch(err) {
        console.log(err)
    }
    }
    onFormSubmit = (e) => {
        e.preventDefault()
        console.log('Clicked Form Submit Button');
        console.log(this.state.rent);
        console.log(this.state.postcode);
    }
    onSelectedOption = () => {
        const select = this.paymentSelectRef.current;
        const selectedPayment = select.options[select.selectedIndex].value;
        console.log(selectedPayment);

        if(selectedPayment === 'week'){
            console.log('Week is selected')
        }
    }
    render() {
        return(
            <React.Fragment>
                <h1>Flatbond</h1>
                <div>
                    <form onSubmit={this.onFormSubmit}>
                        <label>Rent</label>
                        <select ref={this.paymentSelectRef} onChange={this.onSelectedOption}>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </select>
                        <input type="number" placeholder="Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} />
                        <label>Postcode</label>
                        <input type="text" placeholder="Postcode" value={this.state.postcode} onChange={e => this.setState({postcode: e.target.value})} />
                        <Link to={{ pathname: '/created-flatbond', state: { rent: this.state.rent, postcode: this.state.postcode } }}>Submit</Link>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default App;