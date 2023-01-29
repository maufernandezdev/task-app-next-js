import React , {useEffect} from 'react';
import styles from 'styles/Home.module.css'
import Link from "next/link"
import Layout from 'components/Layout'
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'


export default function Home() {
  const session = useSession();
  console.log(session)
  const router = useRouter();
  useEffect(() => {
    if(session.status === 'authenticated') router.push('/projects')
  }, [session.status])
  return (
    <>
      <Head>
              <title>Home - Project Manager App</title>
              <meta name="description" content="Project Manager App" />
      </Head>
      <Layout>   
          <div className={styles.container}>
            <h1>Manejá tus proyectos de la forma más fácil</h1>
            <div className={styles.content}>
              <p>Esta es la versión inicial (v1) del sistema de organización de proyectos y tareas. <br></br> Cree proyectos rápido, asigne nuevas tareas ... </p>
              <div className={styles.linkContainer}>
                <button><Link href='/login'>Empezar</Link></button>
              </div>
            </div>
          </div>
        </Layout>
    </>
  )
}
