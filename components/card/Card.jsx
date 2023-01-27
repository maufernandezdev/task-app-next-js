import styles from 'styles/Projects.module.css'
import { useState, useContext, useEffect } from 'react';
import Link from 'next/link'
import {BiDotsVerticalRounded} from 'react-icons/bi'
import {ModalContext} from 'components/ModalsContext'

const Card = ({project}) => {
  
  const {modalUpdateDeleteProject, setModalUpdateDeleteProjectVisibility, setProjectToUpdateDelete} = useContext(ModalContext);
  const { _id:id } = project; 
  const [selectedColor, setSelectedColor] = useState('');
  const [title , setTitle] = useState(project.name);

  useEffect(() => {

    const lowerTitle = title.toLowerCase();
    const firstCaracter = lowerTitle.slice(0,1);
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z'];
    const colors = ['673de6','EF4F1A','1798B5','B51749','E2F87D','63D93E'];
    alphabet.forEach((element, index) => {
      if(firstCaracter === element)
      {
        if(index < 5) return setSelectedColor(colors[0])
        if(index < 10) return setSelectedColor(colors[1])
        if(index < 15) return setSelectedColor(colors[2])
        if(index < 20) return setSelectedColor(colors[3])
        if(index < 25) return setSelectedColor(colors[4])
        if(index > 25) return setSelectedColor(colors[5])
      }
    });
    
  }, [])
  
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