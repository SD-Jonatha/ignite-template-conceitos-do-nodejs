const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(item=> item.username === username)

  if(!user){
    return response.status(404).json({ error: "User not exist!"})
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

const userAlreadyExists = users.some((item)=> item.username === username);

if(userAlreadyExists){
  return response.status(400).json({error: "Username already exist!"});
  }

const user = {
  id: uuidv4(),
  name,
  username,
  todos: []
};

users.push(user);
/* const user = users.filter((item)=> item.username === username); */
return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;  
  
  const { title, deadline } = request.body;


  const newTodo = { 
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request; 
  const { title, deadline } = request.body;
  const { id } = request.params; 

  const putTodo = user.todos.find((item) => item.id === id);
  
  if(!putTodo){
    return response.status(404).json({ error: "Todo not exist!" })
  }
  
  putTodo.title = title,
  
  putTodo.deadline = new Date(deadline);



  return response.json(putTodo);


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const pathTodosDone = user.todos.find((item) => item.id == id);
  if(!pathTodosDone){
    return response.status(404).json({ error: "Todo not exist!" })
  }
  

  pathTodosDone.done = true;

  return response.json(pathTodosDone);


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const deleteTodo = user.todos.findIndex((item) => item.id === id);

  if(deleteTodo === -1){
    return response.status(404).json({ error: "Todo not exist!" })
  };
 
  user.todos.splice(deleteTodo, 1);

  return response.status(204).send();
});

module.exports = app;