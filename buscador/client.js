const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('../todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  'localhost:8080',
  grpc.credentials.createInsecure()
);

client.readTodos(null, (err, response) => {
  console.log('ReadTodos', response);
  if (response.items) response.items.forEach((item) => console.log(item.text));
});

const call = client.readTodosStream();
call.on('data', (item) => {
  console.log('received item from server ' + JSON.stringify(item));
});

call.on('end', () => console.log('server done!'));
