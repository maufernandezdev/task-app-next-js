import styles from 'styles/Projects.module.css'
import { useState, useContext } from 'react';
import Link from 'next/link'
import {BiDotsVerticalRounded} from 'react-icons/bi'
import {ModalContext} from 'components/ModalsContext'

const Card = ({project}) => {
  
  const {modalUpdateDeleteProject, setModalUpdateDeleteProjectVisibility, setProjectToUpdateDelete} = useContext(ModalContext);
  const { _id:id } = project; 
  const rand = Math.random() * 5;
  const colors = ['673de6','EF4F1A','1798B5','B51749','E2F87D','63D93E'];
  const selectedColor = colors[rand.toFixed(0)];
  const [title , setTitle] = useState(project.name);
  const setModalState = (e,id,title) =>
  {  
    e.preventDefault();
    setProjectToUpdateDelete({id:id, name:title})
    setModalUpdateDeleteProjectVisibility(!modalUpdateDeleteProject);
  }

  return (
    <>
      <div key={id} className={styles.card}>
          <div className={styles.card__body}>
            <Link href={`/projects/${id}`} className={styles.link}>
              <div>
                <p style={{ backgroundColor:`#${selectedColor}`}}>{title.slice(0,1)}</p>  
                <h2>{title}</h2>
              </div>
            </Link>
            <div className={styles.projectOptions}>
              <BiDotsVerticalRounded onClick={(e)=>setModalState(e,id,title)}/>
            </div>
          </div>
      </div>
    </>
  )
}

export default Card;