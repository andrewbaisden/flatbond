import React, { Component } from 'react';
import axios from 'axios';
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
            memberFeeCalc: 0,
            rent: 0,
            postcode: '',
            canSubmit: false
        }

        this.paymentSelectRef = React.createRef();
        this.weeklyPayRef = React.createRef();
        this.monthlyPayRef = React.createRef();
        this.flatbondFormRef = React.createRef();
    }
    componentDidMount(){
        this.getFlatbondAPI();
        this.onSelectedOption();
        
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
        this.flatbondFormRef.current.classList.remove('hide');

    } catch(err) {
        console.log(err)
    }
    }
    onFormSubmit = (e) => {
        e.preventDefault()
        console.log('Clicked Form Submit Button');
        console.log(this.state.rent);
        console.log(this.state.postcode);
        console.log(this.state.memberFeeCalc);

      if(this.state.canSubmit === false) {
          console.log('Cant submit form until you put in the correct data')
      } else {
        axios.post('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/flatbond', {
            rent: this.state.rent,
            postcode: this.state.postcode
        })
        .then(response => {
            console.log(response)
            console.log(response.data.status)
            const status = response.data.status;

            if(status === 'created') {
                console.log('The flatbond was created');
                this.props.history.push({
                    pathname: '/created-flatbond',
                    state: { rent: this.state.rent, postcode: this.state.postcode, memberFee: this.state.memberFeeCalc }
                });
            }
        })
        .catch(error => {
            console.log(error)
        })
      }

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
    calcMemberFee = () => {
        console.log('Rent', this.state.rent);
        
        const rent = this.state.rent;
        const membershipFee = this.state.dataMemberFee;
        const membershipFeeAmount = this.state.dataMemberFeeAmount;
        const VAT = 20;

        let calcMembersFee = membershipFee + rent / 100 * VAT + 100;
        const minMembersFee = 120 * VAT;

        if(rent < 120) {
            calcMembersFee = 120;
            console.log('Its less than 120')
        }

        if(membershipFee === true) {
            calcMembersFee = membershipFeeAmount;
        }

        const select = this.paymentSelectRef.current;
        const selectedPayment = select.options[select.selectedIndex].value;

        if(selectedPayment === 'week' && rent < 25){
            console.log('The minimum weekly, rent amount is £25');
            this.weeklyPayRef.current.style.border = '2px solid red';
            this.setState({canSubmit: false});
            
        } else if(selectedPayment === 'week' && rent > 2000) {
            console.log('The maximum weekly, rent amount is £2000');
            this.weeklyPayRef.current.style.border = '2px solid red';
            this.setState({canSubmit: false});
            
        } else if(selectedPayment === 'month' && rent < 110) {
            console.log('The minimum monthly, rent amount is £110');
            this.monthlyPayRef.current.style.border = '2px solid red';
            this.setState({canSubmit: false});

        } else if(selectedPayment === 'month' && rent > 8660){
            console.log('The maximum monthly, rent amount is £8660');
            this.monthlyPayRef.current.style.border = '2px solid red';
            this.setState({canSubmit: false});
        } else {
            this.setState({canSubmit: true});
        }

        this.setState({memberFeeCalc: calcMembersFee});

        console.log('Calculated members Fee', calcMembersFee);

        
       
    }
    render() {
        return(
            <React.Fragment>
                <GlobalStyle />
                <h1>Flatbond</h1>
                <div ref={this.flatbondFormRef} className="hide">
                    <form onSubmit={this.onFormSubmit}>
                        <label>Rent</label>
                        <select ref={this.paymentSelectRef} onChange={this.onSelectedOption}>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </select>
                        <input ref={this.weeklyPayRef} type="number" placeholder="Weekly Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} onBlur={this.calcMemberFee} />
                        <input ref={this.monthlyPayRef} type="number" placeholder="Monthly Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} onBlur={this.calcMemberFee} />
                        <label>Membership Fee</label>
                        <p>{this.state.memberFeeCalc}</p>
                        <label>Postcode</label>
                        <input type="text" placeholder="Postcode" value={this.state.postcode} onChange={e => this.setState({postcode: e.target.value})} />
                        <input type="submit" value="Submit" onClick={this.onFormSubmit} />
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default App;