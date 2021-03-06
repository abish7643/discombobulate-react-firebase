import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import UserList from "./userList";

// import { css } from "@emotion/core";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      limit: 2,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .users()
      .orderBy("AccountCreatedAt", "desc")
      .limit(this.state.limit)
      .onSnapshot((snapshot) => {
        let users = [];

        snapshot.forEach((doc) => users.push({ ...doc.data(), uid: doc.id }));

        this.setState({
          users,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { users, loading } = this.state;
    return (
      <div className="container">
        <h1>
          Newly Joined <span className="highlighted__text">Players</span>
        </h1>
        <div className="loader">
          <div className="loader__inner">
            {loading && (
              <ClimbingBoxLoader
                size={15}
                color={"#4CB8A4"}
                loading={this.state.loading}
              />
            )}
          </div>
        </div>
        <UserList users={users} />
      </div>
    );
  }
}

export default withFirebase(Landing);
