import React , { useContext } from 'react';
import { Inter } from '@next/font/google'
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] })
import styles from 'styles/Projects.module.css'
import useSWR from 'swr'
import Card from 'components/card/Card'
import Layout from 'components/Layout'
import AddProject from 'components/updateDeleteProject/UpdateDeleteProject';
import {ModalContext} from 'components/ModalsContext';
import { AiOutlineArrowRight , AiOutlinePlus } from 'react-icons/ai'
import UpdateDeleteProject from 'components/updateDeleteProject/UpdateDeleteProject';

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Projects() {

  const {modalAddProjectOpen, setModalProjectVisibility, modalUpdateDeleteProject} = useContext(ModalContext);
  const { data, error } = useSWR('/api/projects', fetcher);

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
              <h1 className={inter.className}>¡Hola, usuario!</h1>
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
