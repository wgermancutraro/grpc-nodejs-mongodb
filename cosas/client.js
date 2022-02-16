const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('../todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo(
  'localhost:8000',
  grpc.credentials.createInsecure()
);
const buscadorStub = new todoPackage.Todo(
  'localhost:8080',
  grpc.credentials.createInsecure()
);

if (text)
  client.createTodo({ text }, (err, response) => {
    console.log(`Recieved from server ${JSON.stringify(response)}`);
    buscadorStub.createTodo({ text }, (err, response) =>
      console.log('Response from Buscador', response)
    );
  });

const call = client.readTodosStream();
call.on('data', (item) => {
  console.log('received item from server ' + JSON.stringify(item));
});

call.on('end', () => console.log('server done!'));
