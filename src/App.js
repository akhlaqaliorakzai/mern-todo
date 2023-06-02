import logo from './logo.svg';
import './App.css';
import image from './assets/images/image.webp';
import profile from './assets/images/profile.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup, Modal, Collapse } from 'react-bootstrap';
import PlusIcon from './assets/icons/PlusIcon';
import ListIcon from './assets/icons/ListIcon';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

function App() {

  //adding new item
  const [addItemData, setAddItemData] = useState();

  //loading all data
  const [populateData, setPopulateData] = useState();


  //For modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalData, setModalData] = useState()

  // for editing of text
  const [editBtn, setEditBtn] = useState();
  const [editContent, setEditContent] = useState();


  //this will load all todo items
  async function populate(){
    const response = await fetch("http://localhost:1337/api/get-items")
    const data = await response.json();

    if(response.status == 200){
      const tempData = data.items.map((item,index)=>(
        <div className='text-left bg-white bg-opacity-75 p-1 rounded border-bottom border-secondary shadow-lg'>
          <div className='row'>
            <div className='col-2 ]border border-dark'>
              <Button className='btn btn-info ' onClick={()=>completeTask(item)}>
                <FontAwesomeIcon icon={item.completed ? faCheckCircle : faClock} className='text-white'/>
              </Button>
            </div>
              <div className='col-6'>
                <p className='pt-2'>{item.content.substring(0,25)} {item.content.length>25 && "..."}</p>
                </div>
            <div className='col-2'>
              <Button variant='primary-outline' className='ms-3' onClick={()=>{setModalData(item); handleShow()}}>
                <FontAwesomeIcon icon={faExpand} className='text-secondary fs-5'/>
              </Button>
            </div>
            <div className='col-2'>
              <Button variant='danger-outline' className='' onClick={()=>deleteItem(item)}>
                <FontAwesomeIcon icon={faDeleteLeft} className='text-danger fs-4'/>
              </Button>
            </div>
          </div>
        </div>
        
      ))
      setPopulateData(tempData);
      
      
    }
    else{
      setPopulateData("")
    }

  }
  //rendering all the todo items
  useEffect(()=>{
    populate(); 
   },[])

   //this will add new todo item
  async function addItem(e){
    e.preventDefault();
    const response = await fetch("http://localhost:1337/api/add-item",{
      method : "POST",
      headers : {"Content-Type":"application/json"},
      body : JSON.stringify({item:addItemData}),
    })
    if(response.status == 200){
      populate();
    }
    else{
      alert("item already exists")
    }
  } 
//this will edit a todo item
  async function submitEditedItem(e){
    e.preventDefault();
    const response = await fetch("http://localhost:1337/api/edit-item",{
      method : "POST",
      headers : {"Content-Type":"application/json"},
      body : JSON.stringify({item : modalData.content, updatedItem : editContent}),
    })
    if(response.status == 200){
      populate();
      handleClose();
      setEditBtn(false);
    }
    else{
      alert("item already exists")
    }
    
  }

//this will mark tick the todo item which mean the task is completed
  async function completeTask(item){
    const response = await fetch("http://localhost:1337/api/tick-item",{
      method : "POST",
      headers : {"Content-Type":"application/json"},
      body : JSON.stringify({item:item}),
    })
    if(response.status == 200){
      populate();
    }
    else{
      alert("item already exists")
    }
  } 

   //this will delete todo item
  async function deleteItem(item){
    const response = await fetch("http://localhost:1337/api/delete-item",{
      method : "POST",
      headers : {"Content-Type":"application/json"},
      body : JSON.stringify({item:item.content}),
    })
    if(response.status == 200){
      populate();
    }
    else{
      alert("Operation Failed")
    }
  }
  return (
    <div>
      <div className='postion-relative text-center'>
          <img src={image} alt="image" className='image-opacity img-fluid'/>
            <div className='centered'>
                <img src={profile} alt="profile" className='img-fluid mt-5 rounded-circle mb-4 image border border-5 border-white'/>
                <Form onSubmit={addItem}>
                  <InputGroup>
                  <Form.Control type='text' required className="border border-white shadow-lg text-secondary" placeholder='Add new task' onChange={(e)=>setAddItemData(e.target.value)}/>
                    <Button type='submit' variant='secondary' className='plus-btn border border-white border-5 bg-secondary bg-opacity-10'>
                      <FontAwesomeIcon icon={faPlus} className='text-secondary rounded'/>
                    </Button>
                  </InputGroup>
                </Form>
              <p className='mt-4 your-todos text-white p-2 shadow-lg rounded border border-1'><FontAwesomeIcon icon={faList} className='text-white me-3'/>Your todos</p>
              
              {
                populateData ?
                populateData :
                  <p className='p-5 bg-white bg-opacity-75 rounded text-secondary shadow-lg'>
                    No task today
                  </p>
              } 
            </div>
      </div>

      
        {
          modalData && 
          <Modal show={show} onHide={handleClose} animation={false} size='lg'>
            <Modal.Header closeButton>
              <Modal.Title>Item</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-white shadow-lg m-3 rounded'>
              <p>Task: <span className='fw-bold'>{modalData.content}</span></p>
              <p>Created At: <span className='fw-bold'>{modalData.date}</span></p>
              <p>Completed: <span className='fw-bold'>{modalData.completed ? "Completed": "Not Completed"}</span></p>
              <Button variant='info text-white ps-4 pe-4' onClick={()=>setEditBtn(!editBtn)}>Edit</Button>
                <Collapse in={editBtn}>
                    <div id="example-collapse-text">
                        <Form onSubmit={(e)=>{submitEditedItem(e)}} className='bg-white border mt-3 rounded p-3'>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className='fs-5'>Edit Item</Form.Label>
                                <Form.Control type="text" defaultValue={modalData.content && modalData.content} required onChange={(e)=>setEditContent(e.target.value)} />
                            </Form.Group>
                            <Button type='submit' >Submit</Button>
                            
                        </Form>
                    </div>
                </Collapse>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        }
        
    </div>
  );
}

export default App;
