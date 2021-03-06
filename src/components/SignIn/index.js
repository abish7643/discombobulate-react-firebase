import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import { PasswordForgetLink } from "../PasswordForget";
// import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const SignInPage = () => (
  <div className="container">
    <h1>
      GET RIGHT INTO <span className="highlighted__text">ACTION</span>
    </h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  loading: false,
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = (event) => {
    this.setState({ loading: true });
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
        this.setState({ loading: false });
      });
    event.preventDefault();
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error, loading } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <form onSubmit={this.onSubmit} className="formcontainer">
        <div className="form__group field">
          <input
            className="form__field"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            required
          />
          <label htmlFor="name" className="form__label">
            Email Address
          </label>
        </div>
        <div className="form__group field">
          <input
            className="form__field"
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            required
          />
          <label htmlFor="name" className="form__label">
            Password
          </label>
        </div>

        <div className="error">
          {error && <p className="error__text">{error.message}</p>}
        </div>
        <button
          disabled={isInvalid}
          className="button__form__submit"
          type="submit"
        >
          Sign In <ClipLoader size={8} color={"#4CB8A4"} loading={loading} />
        </button>
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="form__bottom__links smaller__text">
    Don't have an Account?{" "}
    <Link to={ROUTES.SIGN_UP} className="link__decoration">
      <span className="highlighted__text">Sign Up</span>
    </Link>
  </p>
);

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);
export default SignInPage;
export { SignInForm, SignUpLink };
