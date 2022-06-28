let cl = console.log;

let baseurl ="http://localhost:3000/posts";

let postForm = document.getElementById('postForm');
let title = document.getElementById('title');
let body = document.getElementById('body');
let submitBtn = document.getElementById('submitBtn');
let updateBtn = document.getElementById('updateBtn');
let info = document.getElementById('info');
let postArray = [];

function makeHttpCall(methodName,url,body){
  return fetch(url,{
    method : methodName,
    body : body,
    headers : {
      'Content-type' : "application/json; charset=UTF-8",
      'Authrazation' : 'Bearer Token qwertyuiop',
    }
  }).then((res) => res.json())
}

async function getpost(){
  try{
    let responseData = await makeHttpCall('GET',baseurl);
    postArray = responseData;
    templeting(responseData)
  }catch(err){
    cl(err)
  }
}
function onEditHandler(eve){
  let getid = +eve.dataset.id;
  // cl(getid)
  localStorage.setItem('setId',getid)
  let getobj = postArray.find(obj => obj.id === getid)
  title.value = getobj.title;
  body.value = getobj.body;
  submitBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none');
}

function onDeleteHandler(eve){
  let getid = localStorage.getItem('setId');
  // cl(getid);
  let deletedUrl =`${baseurl}/${getid}`;
  makeHttpCall('DELETE',deletedUrl)
}
function onUpdateHandler(eve){
  let updatedid = localStorage.getItem('setId');
  // cl(updatedid)
  let updatedUrl = `${baseurl}/${updatedid}`;
  let updatedObj = {
    title : title.value,
    body : body.value,
  }
  makeHttpCall('PATCH',updatedUrl,JSON.stringify(updatedObj))
}

getpost()
function templeting(arr){
  let result ="";
  arr.forEach(ele =>{
    result +=`
    <div class="card">
    <div class="card-body">
      <h3>
        ${ele.title}
      </h3>
      <p>
        ${ele.body}
      </p>
      <p class="text-right">
        <button class="btn btn-success" data-id="${ele.id}" onclick="onEditHandler(this)">EDIT</button>
        <button class="btn btn-danger" data-id="${ele.id}" onclick="onDeleteHandler(this)">DELETE</button>
      </p>
    </div>
  </div>
    `
  });
  info.innerHTML = result;
}

async function onSubmitHandler(eve){
  eve.preventDefault();
  let obj = {
    userId :Math.ceil(Math.random() * 10),
    title : title.value,
    body : body.value, 
  }
  cl(obj);
  postArray.push(obj);
  postForm.reset();
  try{
    let responseData = await makeHttpCall('POST',baseurl,JSON.stringify(obj))
  }catch(err){
    cl(err)
  }
}




postForm.addEventListener('submit', onSubmitHandler)
updateBtn.addEventListener('click',onUpdateHandler)