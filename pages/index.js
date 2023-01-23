import React from 'react';
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from 'styles/Home.module.css'
import Link from "next/link"
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import Layout from 'components/Layout'
import Head from 'next/head';


export default function Home() {
  return (
    <>
      <Head>
              <title>Home - Project Manager App</title>
              <meta name="description" content="Project Manager App" />
      </Head>
      <Layout>   
          <div className={styles.container}>
            <h1 className={inter.className} style={{textAlign:'center'}}>Home</h1>
            <div className={styles.container}>
              <p>Esta es la versión inicial (v1) del sistema de organización de tareas y proyectos</p>
              <div className={styles.container}>
                <button> <Link href='/projects'> Proyectos <HiOutlineArrowNarrowRight></HiOutlineArrowNarrowRight> </Link> </button>
              </div>
            </div>
          </div>
        </Layout>
    </>
  )
}
