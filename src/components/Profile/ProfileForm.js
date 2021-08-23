import classes from './ProfileForm.module.css';
import {useContext, useRef} from "react";
import AuthContext from "../../store/auth-context";
import {useHistory} from "react-router-dom";

const ProfileForm = () => {

  const newPasswordInputRef = useRef()

  const history = useHistory()

  const authCtx = useContext(AuthContext)

  const submitHandler = (event) => {
    event.preventDefault()

    const enteredPassword = newPasswordInputRef.current.value

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDrV2yBMgeU3jf0gZiSDIvZHdKMGvizQ2M', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      history.replace('/')
    })
  }

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input minLength='7' ref={newPasswordInputRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
