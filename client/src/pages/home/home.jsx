import { myInfo } from '../../features/app/signals/signals';
import { Nav, Main } from '../../features/home/index';
import "./styles.scss"

export default function Home() {
  console.log(myInfo.value);
  return (
    <section className='home'>
      <div className='content'>
        <Nav />
        <Main />
      </div>
    </section>
  )

}
