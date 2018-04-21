import React from 'react';
import { Link } from 'react-router-dom';
import Base from './Base';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user
}) => (
  <div className="col-md-12">
  <div className="form-container">
  <div className="form-body">
    <form action="/" onSubmit={onSubmit}>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
      {<i className="fas fa-user icons"></i>}<input
          className="sign-up-inputs"
          placeholder="username"
          name="username"
          errorText={errors.username}
          onChange={onChange}
          value={user.username}
        />
      </div>
      <div className="field-line">
      <i className="fas fa-lock icons"></i><input
          className="sign-up-inputs"
          placeholder="password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>
      <div className="button-line">
        <input className="sign-up-button" type="submit" label="Log in" primary />
      </div>
      <div className="accounts">Don't have an account? <Link to={'/signup'}>Create one</Link>.</div>
    </form>
    </div>
  </div>
  </div>
);
export default LoginForm;