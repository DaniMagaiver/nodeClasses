//jshint esversion:8

//Este é geralmente o primeiro arquivo a ser executado

//Primeiro vamos importar no express
const express = require('express');
const app = express();
const { uuid, isUuid } = require('uuidv4');
app.use(express.json());

let projects = [];

function logRequest(request, response, next){
  const {method, url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function isValidId(request, response, next){
  const { id } = request.params;

  if(isUuid(id)){
    next();
  } else{
    return response.json({error:"Invalid id"});
  }
}

app.use(logRequest);
app.use('/projects/:id', isValidId);

//Irei escutar a porta 3333 e ouvir o método get.
app.get('/projects', (request, response) => {
  const { title } = request.query;
  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const {title, ano} = request.body;
  const project = {
    id: uuid(),
    title,
    ano,
  };

  projects.push(project);
  
  return response.status(201).json(project);
});

app.put('/projects/:id', (request, response) => {
  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);
  if(projectIndex < 0){
    return response.status(400).json({error:'Project not found'});
  }

  const {title, ano} = request.body;

  const project = {
    id,
    title,
    ano,
  };

  projects[projectIndex] = project;

  return response.json(projects[projectIndex]);
});

app.delete('/projects/:id', (request, response) => {
  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);
  if(projectIndex < 0){
    return response.status(400).json({error:'Project not found'});
  }
  
  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('Servidor inicializado com sucesso');
});