import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Sarabun:400,700');
    :root {
    --grey: #343436;
    --green: #03BA9B;
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
    .flat-bond {
        display: grid;
        margin: 0 auto;
        width: 100%;
        max-width: 800px;
        text-align: center;
        background: #ffffff;
        border-radius: 20px;
        padding: 20px;

        p {
            font-size: 1.9rem;
        }

        a {
            text-decoration: none;
            font-size: 2rem;
            text-transform: uppercase;
            width: 100%;
            border: 0;
            background: #F93C59;
            color: #ffffff;
            text-transform: uppercase;
            text-align: center;
            padding: 20px 0 20px 0;
            cursor: pointer;
        }
    }
`;
class CreatedFlatBond extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rent: '',
			postcode: '',
			memberFee: ''
		};

		this.getData = this.getData.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		// Gets the form data state which was passed from the App.js component, form page
		const rent = this.props.location.state.rent;
		this.setState({ rent: rent });
		const postcode = this.props.location.state.postcode;
		this.setState({ postcode: postcode });
		const memberFee = this.props.location.state.memberFee;
		this.setState({ memberFee: memberFee });
		console.log(this.props.location);
	};
	render() {
		return (
			<React.Fragment>
				<GlobalStyle />
				<div className="flat-bond">
					<h1>Your Flatbond has been created!</h1>
					<p>
						<b>Rent:</b> £{this.state.rent}
					</p>
					<p>
						<b>Postcode:</b> {this.state.postcode}
					</p>
					<p>
						<b>Your Member Fee:</b> £{this.state.memberFee}
					</p>
					<Link href="/" to="/">
						Create a new Flatbond
					</Link>
				</div>
			</React.Fragment>
		);
	}
}

export default CreatedFlatBond;
