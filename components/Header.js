
import styles from 'styles/Header.module.css'
import {FiUser} from 'react-icons/fi'
import { useSession , signOut, signIn} from 'next-auth/react';
import {useState, useEffect, } from 'react';
import { useRouter } from 'next/router';

export function Header () {

  const session = useSession();
  const router = useRouter();
  const [userAuth, setuserAuth] = useState('Logout')
  useEffect(() => {
    if(session.status === 'unauthenticated') setuserAuth('Login')
  }, [session.status])

  const handleUserSession = () =>
  {
    session.status === 'unauthenticated'? router.push('/login') : signOut();
  }
  
    return (
      <header className={styles.header}>
          <nav className={styles.header__nav}>
            <p>Agile Project Manager</p>
            <div className={styles.authContainer}> 
              <div className={styles.userContainer}>
                <FiUser onClick={()=>{setMenu(!menu)}}></FiUser>
              </div>
              <button onClick={handleUserSession}>{userAuth}</button>
            </div>
          </nav>
      </header>  
  )
}