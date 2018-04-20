// import React from 'react';
// import { Link } from 'react-router';
// import { Card, CardText } from 'material-ui/Card';
// import RaisedButton from 'material-ui/RaisedButton';
// import TextField from 'material-ui/TextField';


// const LoginForm = ({
//   onSubmit,
//   onChange,
//   errors,
//   successMessage,
//   user
// }) => (
//   <Card className="form-container">
//     <form action="/" onSubmit={onSubmit}>
//       <h2 className="card-heading">Login</h2>

//       {successMessage && <p className="success-message">{successMessage}</p>}
//       {errors.summary && <p className="error-message">{errors.summary}</p>}

//       <div className="field-line">
//         <TextField
//           floatingLabelText="Email"
//           name="email"
//           errorText={errors.email}
//           onChange={onChange}
//           value={user.email}
//         />
//       </div>

//       <div className="field-line">
//         <TextField
//           floatingLabelText="Password"
//           type="password"
//           name="password"
//           onChange={onChange}
//           errorText={errors.password}
//           value={user.password}
//         />
//       </div>

//       <div className="button-line">
//         <RaisedButton type="submit" label="Log in" primary />
//       </div>

//       <CardText>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
//     </form>
//   </Card>
// );



// export default LoginForm;


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
  <div className="col-md-4">
  <div className="form-container">
  <Base/>
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