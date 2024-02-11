import express from 'express'
import { token_verification } from '../common_functions.js'
import {insert_Venue, get_Venue, get_Venue_Country, get_Venue_City, get_Venue_info} from '../../model/database.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors';
import multer from 'multer'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';



const router = express.Router()

//router.use(cookieParser());
router.use(token_verification);




let m = multer()

router
.route('')
.post( m.array('Image',12), async(req, res)=>{

  //console.log("Body", req.body)
  //console.log("File", req.files[0])
  const {Name, Capacity, Address, Category} = req.body
 
    
  try{

    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=racwdli&st=2024-02-08T22:31:23Z&se=2024-03-29T06:31:23Z&sv=2022-11-02&sr=c&sig=gn8efUSCxmUVAh7pjmCDexSV0YnpfMjfCFqelkZBGo8%3D`);
  
    const containerName =  req.user.id;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const contentType = 'image/png';  // Adjust this based on your file type

    
  

  for (let i=0; i < req.files.length; i++){

    const content = req.files[i].buffer;
    const blobName = "img-user" + `${req.user.id}` + `-${i}` + `.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    
    console.log(req.files[i].buffer)
    // Upload the file to Azure Blob Storage with content type
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: contentType }
    });
    console.log('hello')
  
  }

  

  //console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
  const result = await insert_Venue(Name, Capacity, Address, Category, req.user.id)
  res.send({ status: "success"})
  }
    catch(e){
      console.log(e)
    res.send({ status: "failure"})
    }
    
    
})
.put(async(req, res)=>{
    const {Name, Capacity, Address, Category} = req.body
    const result = await insert_Venue(Name, Capacity, Address, Category, req.user.id)
    res.send(result)
})


router
.route('/getImage')
.get( async (req, res) => {
  try {
    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=r&st=2024-02-08T17:00:54Z&se=2024-03-13T01:00:54Z&sv=2022-11-02&sr=c&sig=I41swLoigVUKdUUMfAM%2Fml%2BFlqywDfM5%2FtNDIfE8Y0Q%3D`);
console.log('hello')
const containerName =  req.user.id;
const containerClient = blobServiceClient.getContainerClient(containerName);

// Specify the blob name you want to download
const blobName = "img-user11707237208518.png";
const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// Download the blob content
const downloadBlobResponse = await blockBlobClient.downloadToBuffer();

// Now, downloadBlobResponse contains the content of the blob
// You can use it as needed
console.log(`Downloaded blob ${blobName} successfully`, downloadBlobResponse);

  }
    
    catch(e){
      console.log(e)
    }
  res.send('okay')
});


router.route('/list').post(async (req, res) => {
  try {
    const { pageNumber, pageSize, City} = req.body; // Assuming pageNumber is passed as a query parameter
    
    if (isNaN(pageNumber)) {
      res.status(400).json({ error: 'Invalid pageNumber parameter' });
      return;
    }
    console.log("CCCCCC ", City)
    // Assuming get_Venue supports pagination and returns data based on pageNumber
    const result = await get_Venue(pageNumber, pageSize, City);
    console.log(result)
    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=racwdli&st=2024-02-08T22:31:23Z&se=2024-03-29T06:31:23Z&sv=2022-11-02&sr=c&sig=gn8efUSCxmUVAh7pjmCDexSV0YnpfMjfCFqelkZBGo8%3D`);
    const images = [];
    for (let i=0; i < pageSize; i++){
      const containerName =  result[i].LandlordID;
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Specify the blob name you want to download
      const blobName = "img-user" + `${containerName}` + `-0` + `.png`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Download the blob content
      const downloadBlobResponse = await blockBlobClient.downloadToBuffer();
      

      images[i] = downloadBlobResponse.toString('base64');
      
    }
    
    const responseObject = {
      result: result,
      images: images
    };

    // Send the response object
    res.send(responseObject);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.route('/list/country').get(async (req, res) => {
  try {
    
    const result = await get_Venue_Country();
    res.send(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/list/city').post(async (req, res) => {
  try {
    
    const result = await get_Venue_City();
    console.log(result[0]);
    res.send(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/:bookName').get(async (req, res)=>{
  const { bookName } = req.params;
  console.log(req.params)
  try{
      const venueData = await get_Venue_info(bookName)
      console.log(venueData)
      res.send({venueData: venueData});
  }
  catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
  }

})



export default router;