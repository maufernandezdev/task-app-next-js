import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from 'styles/Home.module.css'
import Link from "next/link"
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'


export default function Home() {

  return (
    <>
      <div className={styles.container}>
        <h1 className={inter.className} style={{textAlign:'center'}}>Home</h1>
        <div className={styles.container}>
          <p>Esta es la versión inicial (v0) del sistema de organización de tareas y proyectos</p>
          <div className={styles.container}>
            <button> <Link href='/tasks'> Tareas <HiOutlineArrowNarrowRight></HiOutlineArrowNarrowRight> </Link> </button>
          </div>
        </div>
      </div>
    </>
  )
}
