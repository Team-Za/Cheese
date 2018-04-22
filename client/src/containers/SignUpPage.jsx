import React from 'react';
import { withRouter } from 'react-router-dom';
import SignUpForm from '../Components/SignUpForm.jsx';
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import { resolve } from 'path';

class SignUpPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      step1complete: false,
      user: {
        email: '',
        username: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm = () => {
    // prevent default action. in this case, action is the form submission event

    //event.preventDefault();


    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&email=${email}&password=${password}`;
    return new Promise((resolve, reject) => {
      // create an AJAX request
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/auth/signup');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status === 200) {
          // success
          // change the component-container state
          this.setState({
            errors: {},
            step1complete: true
          });
          resolve(console.log(this.state.errors, "yo", xhr.response));
          // set a message
          localStorage.setItem('successMessage', xhr.response.message);
          sessionStorage.setItem("username", this.state.user.username);
          // make a redirect
          //this.props.router.replace('/login');
          // window.location.reload();
          //this.setPortfolio();
          // })
        } else {
          // failure
          const errors = xhr.response.errors ? xhr.response.errors : {};
          errors.summary = xhr.response.message;

          this.setState({
            errors
          });
          reject(console.log(this.state.errors, xhr.statusText));
        }
      };
      console.log("Step 1 complete");
      xhr.send(formData);
    })
  }
  setDefaults = (event) => {
    event.preventDefault();
    this.processForm()
      .then(() => {
        if (this.state.step1complete) {
          userApi.getByUsername(this.state.user.username)
            .then(res => {
              const tempPort = {
                userName: res.username,
                balance: 10000,
                UserId: res.id
              }
              console.log("Step 2 complete");
              //sessionStorage.setItem("UserId", res.id);
              portApi.create(tempPort)
                .then(() => {
                  console.log("Step 3 complete");
                  window.location.reload();
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err, this.state.step1complete))
        }
        else {
          console.log("Time for async await")
        }
      })
      .catch(err => console.log(err));
  };
  //return prom1;

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }


  /**
   * Render the component.
   */
  render() {
    return (
      <SignUpForm
        onSubmit={this.setDefaults}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}



export default withRouter(SignUpPage);
