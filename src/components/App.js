import React, { Component } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Sarabun:400,700');
    :root {
    --grey: #343436;
    }
    html {
    font-size: 62.5%; /* font-size 1em = 10px on default browser settings */
    }
    body {
            /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#31bca6+0,03ba9b+100 */
        background: #31bca6; /* Old browsers */
        background: -moz-linear-gradient(45deg, #31bca6 0%, #03ba9b 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(45deg, #31bca6 0%,#03ba9b 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(45deg, #31bca6 0%,#03ba9b 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#31bca6', endColorstr='#03ba9b',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        font-family: 'Sarabun', sans-serif;
        font-size: 1.6rem;
        color: var(--grey);
    }
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
    .bond-form {
        background: white;
    }
`
class App extends Component {
    constructor(props) {
        super(props);

        // Form data state
        this.state = {
            dataMemberFee: '',
            dataMemberFeeAmount: '',
            memberFeeCalc: 0,
            rent: 0,
            postcode: '',
            canSubmit: false,
            weeklyRentError: 'The miniumum weekly rent is £25, and the maximum is £2000.',
            monthlyRentError: 'The miniumum monthly rent is £110, and the maximum is £8660.',
            submitError: 'Please input valid information, to create your flatbond.',
            formLoadingFail: 'Error: Failed to load Flatbond form data'
        }

        // DOM element references
        this.paymentSelectRef = React.createRef();
        this.weeklyPayRef = React.createRef();
        this.monthlyPayRef = React.createRef();
        this.flatbondFormRef = React.createRef();
        this.postcodeRef = React.createRef();
        this.errorWeeklyRef = React.createRef();
        this.errorMonthlyRef = React.createRef();
        this.errorFormSubmitRef = React.createRef();
        this.errorLoadFormRef = React.createRef();
    }
    componentDidMount(){
        this.getFlatbondAPI();
        this.onSelectedOption();
    }
   async getFlatbondAPI(){
    try {
        // Calls the flatbond API and returns the data, holds it in state
        const response = await axios.get('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/config');
        console.log('Response', response);
        console.log('Data', response.data);
        this.setState({dataMemberFee: response.data.fixed_membership_fee_amount});
        this.setState({dataMemberFeeAmount: response.data.fixed_membership_fee});
        console.log('Member Fee', this.state.dataMemberFee);
        console.log('Member Fee Amount', this.state.dataMemberFeeAmount);

        // Shows the form after a success 200 reponse from the flatbond API
        this.flatbondFormRef.current.classList.remove('hide');

        // Hides the error in the front end form after a failed 404 reponse from the flatbond API
        this.errorLoadFormRef.current.classList.add('hide');

    } catch(err) {
        console.log(err);

        // Shows the error in the front end form after a failed 404 reponse from the flatbond API
        this.errorLoadFormRef.current.classList.remove('hide');
    }
    }
    onFormSubmit = (e) => {
        e.preventDefault()

        // Logs form input data to the console
        console.log('Clicked Form Submit Button');
        console.log(this.state.rent);
        console.log(this.state.postcode);
        console.log(this.state.memberFeeCalc);

        // Only submits the form and redirects to the create-flatbond page if the fields have the correct validation input
      if(this.state.canSubmit === false) {
          console.log(this.state.submitError);
          this.errorFormSubmitRef.current.classList.add('show');
      } else {
        this.errorFormSubmitRef.current.classList.add('hide');
        axios.post('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/flatbond', {
            rent: this.state.rent,
            postcode: this.state.postcode
        })
        .then(response => {
            console.log(response)
            console.log(response.data.status)
            const status = response.data.status;

            // Checks for a created response from the server before recirecting to the create-flatbond page
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

        // Checks to see which option is selected and then shows/hide the week/month text input
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
        
        // Buiness logic calculation for the rent
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

        // Input validation for the rent fields
        if(selectedPayment === 'week' && rent < 25){
            console.log(this.state.weeklyRentError);
            this.weeklyPayRef.current.style.border = '2px solid red';
            this.errorWeeklyRef.current.classList.add('show');
            this.setState({canSubmit: false});
            
        } else if(selectedPayment === 'week' && rent > 2000) {
            console.log(this.state.weeklyRentError);
            this.weeklyPayRef.current.style.border = '2px solid red';
            this.errorWeeklyRef.current.classList.add('show');
            this.setState({canSubmit: false});
            
        } else if(selectedPayment === 'month' && rent < 110) {
            console.log(this.state.monthlyRentError);
            this.monthlyPayRef.current.style.border = '2px solid red';
            this.errorMonthlyRef.current.classList.add('show');
            this.setState({canSubmit: false});

        } else if(selectedPayment === 'month' && rent > 8660){
            console.log(this.state.monthlyRentError);
            this.monthlyPayRef.current.style.border = '2px solid red';
            this.errorMonthlyRef.current.classList.add('show');
            this.setState({canSubmit: false});
        } else {
            this.weeklyPayRef.current.style.border = '2px solid green';
            this.monthlyPayRef.current.style.border = '2px solid green';
            this.errorWeeklyRef.current.classList.remove('show');
            this.errorWeeklyRef.current.classList.add('hide');
            this.errorMonthlyRef.current.classList.remove('show');
            this.errorMonthlyRef.current.classList.add('hide');
            this.setState({canSubmit: true});
        }

        this.setState({memberFeeCalc: calcMembersFee});

        console.log('Calculated members Fee', calcMembersFee);
       
    }
    validatePostCode = () => {
        console.log('Postcode', this.state.postcode);

        // Regex validation for a UK postcode
        const postcode = this.state.postcode;
        const re = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/;

        if(!re.test(postcode)){
            this.postcodeRef.current.style.border = '2px solid red';
            this.setState({canSubmit: false});
        } else {
            this.postcodeRef.current.style.border = '2px solid green';
            this.setState({canSubmit: true});
        }

    }
    render() {
        return(
            <React.Fragment>
                <GlobalStyle />
                <div className="hide" ref={this.errorLoadFormRef}><h1>{this.state.formLoadingFail}</h1></div>
                <div ref={this.flatbondFormRef} className="bond-form hide">
                <div><h1>Create Flatbond</h1></div>
                    <form onSubmit={this.onFormSubmit}>
                        <div>
                        <div><label>Rent</label></div>
                        <div><select ref={this.paymentSelectRef} onChange={this.onSelectedOption}>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </select></div>
                        </div>
                        <div><input ref={this.weeklyPayRef} type="number" placeholder="Weekly Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} onBlur={this.calcMemberFee} />
                        <input ref={this.monthlyPayRef} type="number" placeholder="Monthly Rent" value={this.state.rent} onChange={e => this.setState({rent: e.target.value})} onBlur={this.calcMemberFee} /></div>
                        <p className="hide" ref={this.errorWeeklyRef}>{this.state.weeklyRentError}</p>
                        <p className="hide" ref={this.errorMonthlyRef}>{this.state.monthlyRentError}</p>
                        <div>
                        <label>Membership Fee</label>
                        <p>{this.state.memberFeeCalc}</p>
                        </div>
                        <div>
                        <div><label>Postcode</label></div>
                        <div><input ref={this.postcodeRef} type="text" placeholder="Postcode" value={this.state.postcode} onChange={e => this.setState({postcode: e.target.value})} onBlur={this.validatePostCode} /></div>
                        </div>
                        <div><input type="submit" value="Submit" onClick={this.onFormSubmit} /></div>
                        <div><p className="hide" ref={this.errorFormSubmitRef}>{this.state.submitError}</p></div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default App;