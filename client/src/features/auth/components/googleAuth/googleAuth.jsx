import { useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { authApiService } from "../../../../services/index";
import { useUser } from "../../../../context/userInfoContext";
import "./style.scss"

export default function GoogleAuth({ BtnText }) {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleAuth(codeResponse.access_token);
    },

    onError: (error) => {
      console.log('Login Failed:', error)
    },
  });

  async function googleAuth(userInfo) {
    try {
      const response = await authApiService.googleAuth(userInfo);
      const data = await response.json();
      if (data.message === "Login successfull") {
        setUser(data.userData.result[0]);
        navigate("/home/");
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    localStorage.removeItem('loggedIn'); // Remove logged-in status from storage
  };

  return (
    <button type="button" onClick={() => login()}>{BtnText}</button>
  );
}