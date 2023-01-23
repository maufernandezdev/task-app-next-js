import {Header}  from './Header'
import {Footer}  from './Footer'
import styles from 'styles/Layout.module.css'

export default function Layout ({children}) {
  return (
    <div className={styles.layout}>
        <Header></Header>
        <main className={styles.mainContainer}>
            {children}
        </main>
        <Footer></Footer>
    </div>
  )
}