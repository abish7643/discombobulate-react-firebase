import React from "react";

import { AuthUserContext, withAuthorization } from "../Session";
import PasswordChangeForm from "../PasswordChange";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div className="container">
        <h1>Account</h1>
        <div>
          <p className="neumorphic__shadow__padding">
            <span className="muted__text">Email:</span>{" "}
            <span className="highlighted__text">{authUser.email}</span>
          </p>
        </div>
        <h4 className="muted__text">Reset Your Password</h4>
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(AccountPage);
