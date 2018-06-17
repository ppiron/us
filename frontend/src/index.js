import React, { Component } from 'react';
import { render } from 'react-dom';

function makeRequest(posted_url) {
  const request = new Request('http://localhost:3000/api/new', {
	    method: 'POST', 
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        posted_url: posted_url,
      }),
    })
  return fetch(request)
    .then( (response) => {
      return response.json();
    })
    .catch( (response) => response)
} 

function fade(elt, duration, mode) {
  let start = null
  let progress
  
  function step(time, elt, duration, mode) {
    if (!start) start = time
    progress = time - start
    elt.style.opacity = mode === 'out' ? 1 - progress/duration : progress/duration
    if (progress < duration) {
      window.requestAnimationFrame(function(time) {
        return step(time, elt, duration, mode)
      })
    } else {
      start = null
    }
  }
  function bar() {
    window.requestAnimationFrame(function(time) {
      return step(time, elt, duration, mode)
    })
  }
  return bar
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      text: '',
      data: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  onChange(event) {
    this.setState( 
        {
          text: event.target.value,
        }
      )
  }

  onKeyPress(event) {
    console.log(event.key)
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit(event) {
    makeRequest(this.state.text).then( data => {
      // console.log(data);
        this.setState( 
          {
            isLoading: false,
            data: data,
          }
        )
    })
  }

  navigate(event) {
    const url = this.state.data.original_url
    const re = /^(https?:\/\/)?([^\/]+\.[^\.\/]+)(\/.+)?/;
    const href = (url.match(re))[1] ? url : 'http://' + url;
    location.href = href
    event.preventDefault()
  }

  render() {
    
    if (this.state.data.error) {
      return (
        <div>
          <div id='container'>
          <p>Insert URL to be shorten</p>
          <input type="text" placeholder='https://www.example.com' value={this.state.text}
          onChange={this.onChange} onKeyPress={this.onKeyPress}/>
          <div className='button' onClick={this.onSubmit}>Submit</div>
          <div id='error'>{this.state.data.error}</div>
          </div>
        </div>
      )
    } 

    //console.log(this.state.data);
    let href;
    if (this.state.data.original_url) {
      const url = this.state.data.original_url;
      const re = /^(https?:\/\/)?([^\/]+\.[^\.\/]+)(\/.+)?/;
      href = (url.match(re))[1] ? url : 'http://' + url;
    }

    return (
      <div>
        <div id='container'>
          <p>Insert URL to be shorten</p>
          <input type="text" placeholder='https://www.example.com' value={this.state.text} 
          onChange={this.onChange} onKeyPress={this.onKeyPress}/>
          <div className='button' onClick={this.onSubmit}>Submit</div>
          <div id='url'>{!this.state.isLoading && `Original url: ${this.state.data.original_url}`}</div>
          <div id='shorturl'>
            {!this.state.isLoading && `Shortened url: `}
            {!this.state.isLoading && 
            <a href={!this.state.isLoading && href} onClick={this.navigate}>
              {this.state.data.shortened_url}
            </a>}
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));