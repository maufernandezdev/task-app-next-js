import React , { useContext, useEffect, useState } from 'react';
import { Inter } from '@next/font/google'
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] })
import styles from 'styles/Projects.module.css'
import useSWR from 'swr'
import Card from 'components/card/Card'
import Layout from 'components/Layout'
import {ModalContext} from 'components/ModalsContext';
import { AiOutlineArrowRight , AiOutlinePlus } from 'react-icons/ai'
import AddProject from 'components/addProject/AddProject';
import UpdateDeleteProject from 'components/updateDeleteProject/UpdateDeleteProject';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Projects() {
  const session = useSession();
  const router = useRouter();
  const {modalAddProjectOpen, setModalProjectVisibility, modalUpdateDeleteProject} = useContext(ModalContext);
  const { data, error } = useSWR('/api/projects', fetcher);
  
  useEffect(() => {
      if(session.status === 'unauthenticated') router.push('/')
  }, [session.status])
  
  const setModalState = () =>
  {
    setModalProjectVisibility(!modalAddProjectOpen)
  }
  return (
    <>
      <Head>
              <title>Projects - Project Manager App</title>
              <meta name="description" content="Project Manager App" />
      </Head>
      <Layout>
        <div className={styles.container}>
          <div className={styles.container__header}>
              <h1 className={inter.className}>¡Hola, <span>{session.status === 'authenticated' ? session.data.user.name: 'usuario'}</span>!</h1>
              <div className={styles.container__header_add}>
                <h3>Proyectos</h3>
                <AiOutlineArrowRight></AiOutlineArrowRight>
                <AiOutlinePlus onClick={setModalState}></AiOutlinePlus> 
              </div>
          </div>
              {
                data? (
                  data.map((project) => {
                      return(
                        <Card project = { project } key = { project._id } ></Card>
                        )
                  })
                ) : <div>Cargando proyectos...</div>
              }
        </div>
        {
          modalAddProjectOpen && (
            <AddProject></AddProject>
          )
        }
        {
          modalUpdateDeleteProject && (
            <UpdateDeleteProject></UpdateDeleteProject>
          )
        }
      </Layout>
    </>
  )
}
