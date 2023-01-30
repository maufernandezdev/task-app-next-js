import React , { useContext, useEffect, useState } from 'react';
import { Inter } from '@next/font/google'
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] })
import styles from 'styles/Projects.module.css'
import Card from 'components/card/Card'
import Layout from 'components/Layout'
import {ModalContext} from 'components/ModalsContext';
import { AiOutlineArrowRight , AiOutlinePlus } from 'react-icons/ai'
import AddProject from 'components/addProject/AddProject';
import UpdateDeleteProject from 'components/updateDeleteProject/UpdateDeleteProject';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

export default function Projects() {

  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push('/')
    },
  });
  const {modalAddProjectOpen, setModalProjectVisibility, modalUpdateDeleteProject} = useContext(ModalContext);
  const { trigger: getUserInfo } = useSWRMutation(`/api/projects`, sendRequest);
  const [projects, setProjects] = useState([])
  const [userEmail, setUserEmail] = useState('')
  
  useEffect(() => {
    if(session.status === 'authenticated')
    {
      setUserEmail(session.data.user.email)
      const user = {
        method: 'GET',
        email: session.data.user.email,
      }
      getUserInformation(user)
    }
  }, [session.status])
  
  const getUserInformation = async (user) =>
  { 
    const data = await getUserInfo(user);
    const userData = await data.json();
    setProjects(userData)
  }
  
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
                projects? (
                  projects.length > 0 ?(
                  projects.map((project) => {
                      return(
                        <Card id = { project._id } title = { project.name } key = { project._id } ></Card>
                        )
                  })) : <div style={{display:'flex', justifyContent:'flex-start', width:'100%', marginTop:'1em'}}>
                          <h4 style={{fontSize:'1.1em'}}>Todavía no hay proyectos ...</h4>
                        </div>
                ) : <div style={{display:'flex', justifyContent:'flex-start', width:'100%', marginTop:'1em'}}>
                      <h4 style={{fontSize:'1.1em'}}>Cargando proyectos ...</h4>
                    </div>
              }
        </div>
        {
          modalAddProjectOpen && (
            <AddProject user={userEmail} ></AddProject>
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
