// import React from 'react';
// import { Link } from 'react-router';
// import { Card, CardText } from 'material-ui/Card';
// import RaisedButton from 'material-ui/RaisedButton';
// import TextField from 'material-ui/TextField';


// const SignUpForm = ({
//   onSubmit,
//   onChange,
//   errors,
//   user,
// }) => (
//   <Card className="col-md-4 form-container">
//     <form action="/" onSubmit={onSubmit}>
//       <div className="card-heading">Sign Up</div>

//       {errors.summary && <p className="error-message">{errors.summary}</p>}

//       <div className="field-line">
//         <TextField
//           floatingLabelText="Name"
//           name="username"
//           errorText={errors.username}
//           onChange={onChange}
//           value={user.username}
//         />
//       </div>

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
//         <RaisedButton type="submit" label="Create New Account" primary />
//       </div>

//       <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
//     </form>
//   </Card>
// );



// export default SignUpForm;



import React from 'react';
import { Link } from 'react-router-dom';
import Base from './Base';

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
        <input className="sign-up-button" type="submit" label="Create New Account" primary />
      </div>
      <div className="accounts">Already have an account? <Link to={'/login'}>Log in</Link></div>
    </form>
    </div>
    </div>
  </div>
);
export default SignUpForm;
