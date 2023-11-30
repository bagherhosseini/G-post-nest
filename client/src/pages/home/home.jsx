import { Nav, Main } from '../../features/home/index';
import useCookie from '../../hooks/useCookie';
import "./styles.scss"

export default function Home() {
  const [authToken, updateAuthToken, removeAuthToken] = useCookie("authToken");
  // if(authToken === "undefined" || authToken === undefined || authToken === null || authToken === ""){
  //   return (
  //     <div style={{background: "#1F1D2B", color: "white"}}>
  //       loading...
  //     </div>
  //   );
  // }

  return (
    <section className='home'>
      {
        authToken === "undefined" || authToken === undefined || authToken === null || authToken === "" ? (
          <div style={{ background: "#1F1D2B", color: "white" }}>
            loading...
          </div>
        ) : (
          <div className='content'>
            <Nav />
            <Main />
          </div>
        )
      }
    </section>
  )

}
