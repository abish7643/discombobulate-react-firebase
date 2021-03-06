import React, { Component } from "react";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";

import QuestionRender from "./question";

//const questionAsImageURL = 'https://i.ibb.co/zGNNf6k/1.png';

// import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const INITIAL_STATE = {
  answerInput: "",
  error: null,
  result: null,
};

class ChallengesPageClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      authUser: JSON.parse(localStorage.getItem("authUser")),
      user: {},
      questionData: {},
      nextQuestionNumber: 0,
      ...INITIAL_STATE,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ result: null });
    const userID = this.state.authUser.uid;
    this.props.firebase.user(userID).onSnapshot((snapshot) => {
      let userData = snapshot.data();
      let nextUserChallenge = userData.challengesCompleted + 1;

      this.setState({
        user: userData,
        nextQuestionNumber: nextUserChallenge,
      });

      this.props.firebase
        .question(this.state.nextQuestionNumber)
        .onSnapshot((snapshot) => {
          let question = snapshot.data();
          this.setState({
            questionData: question,
            loading: false,
          });
        });
    });
  }

  onClick = (event) => {
    this.setState({ loading: true });
    const { answerInput } = this.state;
    const { nextQuestionNumber } = this.state;
    const userID = this.state.authUser.uid;

    const answerQuestionUserData = {
      uid: userID,
      attemptedAnswer: answerInput,
      questionNumber: nextQuestionNumber,
    };

    const checkAnswer = this.props.firebase.checkAnswer();

    checkAnswer({ answerQuestionUserData })
      .then((result) => {
        this.setState({ result });
        this.setState({ loading: false });
        this.setState({ answerInput: "" });
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

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    const { answerInput, error, result } = this.state;
    let questions = this.state.questionData;
    const isInvalid = answerInput === "" || questions.number === 4;
    const loading = this.state.loading;
    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div className="container">
            <h1>
              Challenge{" "}
              <span className="highlighted__text">
                {loading === true ? (
                  <ClipLoader
                    size={16}
                    color={"#4CB8A4"}
                    loading={this.state.loading}
                  />
                ) : questions.number === 4 ? (
                  "Completed"
                ) : (
                  questions.number
                )}{" "}
              </span>
            </h1>
            <QuestionRender questions={questions} />
            <div className="loader">
              <div className="loader__inner">
                {loading && (
                  <ClimbingBoxLoader
                    size={20}
                    color={"#4CB8A4"}
                    loading={this.state.loading}
                  />
                )}
              </div>
            </div>
            <div className={questions.number === 4 ? "hidden__div" : ""}>
              <form className="formcontainer">
                <div className="form__group field">
                  <input
                    className="form__field"
                    name="answerInput"
                    value={this.state.answerInput}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Answer"
                    required
                  />
                  <label htmlFor="name" className="form__label">
                    Enter Answer
                  </label>
                </div>
                <button
                  disabled={isInvalid}
                  className="button__form__submit"
                  onClick={this.onClick}
                >
                  {questions.number === 4 ? "Completed" : "Crack"}{" "}
                  {loading && (
                    <ClipLoader size={8} color={"#4CB8A4"} loading={loading} />
                  )}{" "}
                </button>
              </form>
              <div className="error__div">
                {error && (
                  <p className="error__div__text muted__text smaller__text">
                    {error.message}
                  </p>
                )}
              </div>
              <div className="error__div">
                {result && (
                  <p className="error__div__text highlighted__text  smaller__text muted__text">
                    {result.data}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = (authUser) => !!authUser;
const ChallengesPage = compose(withFirebase)(ChallengesPageClass);

export default withAuthorization(condition)(ChallengesPage);
