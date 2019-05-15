import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import CreatedFlatBond from '../CreatedFlatBond';

xit('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
		<BrowserRouter>
			<CreatedFlatBond />
		</BrowserRouter>,
		div
	);
	ReactDOM.unmountComponentAtNode(div);
});
