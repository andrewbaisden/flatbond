import React, { Component } from 'react';
import axios from 'axios';
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: ''
        }
    }
    componentDidMount(){
        this.getFlatbondAPI()
    }
   async getFlatbondAPI(){
    try {
        const response = await axios.get('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/config');
        console.log('Response', response);
        console.log('Data', response.data);
        this.setState({data: response.data})
    } catch(err) {
        console.log(err)
    }
    }
    render() {
        return(
            <React.Fragment>
                <h1>Flatbond</h1>
            </React.Fragment>
        )
    }
}

export default App;