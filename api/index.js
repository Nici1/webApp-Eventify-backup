import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import login from './routes/Login.js'
import register from './routes/Register.js'
import venue from './routes/Venue.js'
import { token_verification } from './common_functions.js';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import multer from 'multer';
import path from 'path'
import { get_Applications, get_Performer, insert_Application } from './model/database.js';

dotenv.config()

const app = express()
const port = process.env.PORT;

app.use(cors( {origin: 'https://eventify-4gdp.onrender.com',
  credentials: true,
  secure: true}));

app.use(cookieParser());
app.use(express.json())

/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  next();
});

*/


//app.use(cors())
app.use('/register', register);

app.use('/login', login);

app.use('/venue', venue);


app.get('/Events', async(req, res)=>{});

app.get("/", async (req, res) => {
  try {

    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=r&st=2024-02-08T17:00:54Z&se=2024-03-13T01:00:54Z&sv=2022-11-02&sr=c&sig=I41swLoigVUKdUUMfAM%2Fml%2BFlqywDfM5%2FtNDIfE8Y0Q%3D`);

    const containerClient = blobServiceClient.getContainerClient('');

    const images = []
    // Specify the blob name you want to download
    for (let i=0; i < 3; i++){
      const blobName = "b"+ `${i+1}`+ ".jpeg";
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Download the blob content
      const downloadBlobResponse = await blockBlobClient.downloadToBuffer();
      images[i] = downloadBlobResponse.toString('base64');
    
      }
      //console.log(images)

    // Now, downloadBlobResponse contains the content of the blob
    // You can use it as needed
    res.send(images)

  }
    
    catch(e){
      console.log(e)
    }
 
  
})
app.use(token_verification)

app.post('/apply', async (req, res) =>{

  console.log("Body ", req.body)

const id = await get_Performer(req.user.email)
console.log(id[0].ID)
await insert_Application(id[0].ID, req.body.selectedTime)
res.send('heheh')
  
})

app.post('/application', async (req, res) =>{

try {
    const { pageNumber, pageSize} = req.body; // Assuming pageNumber is passed as a query parameter
    
    if (isNaN(pageNumber)) {
      res.status(400).json({ error: 'Invalid pageNumber parameter' });
      return;
    }
    // Assuming get_Venue supports pagination and returns data based on pageNumber
    const result = await get_Applications(pageNumber, pageSize, req.user.id);
    console.log("sto sum dobil ", result)
    res.send(result)
    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
})


let m = multer()
app.post('/upload',  m.single('Image'), (req, res) =>{

  console.log("File ", req.file); 

  res.send('OK')
  
  const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=racwdli&st=2024-02-05T10:16:09Z&se=2024-05-04T17:16:09Z&sv=2022-11-02&sr=c&sig=0TU4TsK2ZKD03RMpluNeGZQjWpuDqZKAqGUfdN5fJNM%3D`);

  const containerName =  req.user.id;
  console.log(containerName)
  async function main() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  console.log(req.body)
  const content = req.file.buffer;
  const blobName = "img-user" + `${req.user.id}` + new Date().getTime() + `.png`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const contentType = 'image/png';  // Adjust this based on your file type

  // Upload the file to Azure Blob Storage with content type
  const uploadBlobResponse = await blockBlobClient.upload(content, content.length, {
    blobHTTPHeaders: { blobContentType: contentType }
  });

  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
  }
  main()
  
})







app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})



app.listen(port, () =>{
console.log(`Server is listening on port ${port}...`)
});

