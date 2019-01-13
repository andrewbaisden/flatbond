import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        background: #bada55;
    }
    .hide {
        display: none;
    }
`
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataMemberFee: '',
            dataMemberFeeAmount: '',
            memberFeeCalc: 10,
            rent: 0,
            postcode: ''
        }

        this.paymentSelectRef = React.createRef()
        this.weeklyPayRef = React.createRef()
        this.monthlyPayRef = React.createRef()
    }
    componentDidMount(){
        this.getFlatbondAPI();
        this.onSelectedOption();
        // this.calcMemberFee();
    }
   async getFlatbondAPI(){
    try {
        const response = await axios.get('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/config');
        console.log('Response', response);
        console.log('Data', response.data);
        this.setState({dataMemberFee: response.data.fixed_membership_fee_amount});
        this.setState({dataMemberFeeAmount: response.data.fixed_membership_fee});
        console.log('Member Fee', this.state.dataMemberFee);
        console.log('Member Fee Amount', this.state.dataMemberFeeAmount);

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
            console.log('Week is selected');
            this.weeklyPayRef.current.classList.remove('hide');
            this.monthlyPayRef.current.classList.add('hide');
        } else {
            console.log('Month is selected');
            this.weeklyPayRef.current.classList.add('hide');
            this.monthlyPayRef.current.classList.remove('hide');
        }

    }
    calcMemberFee(){
        console.log('test')
        console.log('Rent', this.state.rent)
        
        const rent = this.state.rent;
        const membershipFee = this.state.dataMemberFee;
        const membershipFeeAmount = this.state.dataMemberFeeAmount;
        const VAT = 20;

        let calcMembersFee = membershipFee + rent / 100 * VAT + 100;
        const minMembersFee = 120 * VAT;

        if(rent < 120) {
            calcMembersFee = 120;
        }

        if(membershipFee === true) {
            calcMembersFee = membershipFeeAmount;
        }

        console.log('Calculated members Fee', calcMembersFee)
       
    }
    render() {
        return(
            <React.Fragment>
                <GlobalStyle />
                <h1>Flatbond</h1>
                <div>
                    <form onSubmit={this.onFormSubmit}>
                        <label>Rent</label>
                        <select ref={this.paymentSelectRef} onChange={this.onSelectedOption}>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </select>
                        <input ref={this.weeklyPayRef} type="number" placeholder="Weekly Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} onBlur={this.calcMemberFee()} />
                        <input ref={this.monthlyPayRef} type="number" placeholder="Monthly Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} />
                        <label>Membership Fee</label>
                        <p>{this.state.memberFeeCalc}</p>
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