
import styles from 'styles/Header.module.css'
import {FiUser} from 'react-icons/fi'

export function Header () {
    return (
      <header className={styles.header}>
          <nav className={styles.header__nav}>
            <p>Agile Project Manager</p>
            <div className={styles.userContainer}>
              <FiUser></FiUser>
            </div>
          </nav>
      </header>
    )
}