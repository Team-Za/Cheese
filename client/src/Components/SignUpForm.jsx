import React from 'react';
import { Link } from 'react-router-dom';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <div className="col-md-12">
    <div className="form-container">
    <div className="form-body">
    <form action="/" onSubmit={onSubmit}>
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
      <i className="fas fa-envelope icons"></i><input
          className="sign-up-inputs"
          placeholder="email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
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
        <input className="sign-up-button" type="submit" value="Sign Up" primary />
      </div>
      <div className="accounts">Already have an account? <Link to={'/login'}>Log in</Link></div>
    </form>
    </div>
    </div>
  </div>
);
export default SignUpForm;
