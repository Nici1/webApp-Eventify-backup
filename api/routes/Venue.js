import express from 'express'
import { token_verification, convertToMySQLDateFormat } from '../common_functions.js'
import {insert_Venue, get_Venue, get_Venue_Country, get_Venue_City, get_Venue_info, get_time_Availability, get_date_Availability, get_MyVenues} from '../model/database.js'
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

    const result = await insert_Venue(Name, Capacity, Address, Category, req.user.id)


    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=racwdli&st=2024-02-08T22:31:23Z&se=2024-03-29T06:31:23Z&sv=2022-11-02&sr=c&sig=gn8efUSCxmUVAh7pjmCDexSV0YnpfMjfCFqelkZBGo8%3D`);
  
    const containerName =  req.user.id;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const contentType = 'image/png';  // Adjust this based on your file type

    
  

  for (let i=0; i < req.files.length; i++){

    const content = req.files[i].buffer;
    const blobName = "img-user" + `-${req.user.id}` + `-${result}`+`-${i}` + `.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    
    console.log(req.files[i].buffer)
    // Upload the file to Azure Blob Storage with content type
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: contentType }
    });
    console.log('hello')
  
  }

  

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


router.route('/Date').post(async (req, res)=>{
  console.log("Body ", req.body)

  

  // Example usage
  const inputDateString = req.body.date
  const mysqlDateFormat = convertToMySQLDateFormat(inputDateString);
  console.log(req.body.id, req.body.date)
  const r = await get_time_Availability(req.body.id, mysqlDateFormat)
  res.send(r)
  console.log("Result ", r); // Output: "2024-02-13"

})



router.route('/availability').post(async (req, res)=>{
  console.log("blabla ", req.body)
  const inputDateString = req.body.date
  const mysqlDateFormat = convertToMySQLDateFormat(inputDateString);
  const date = new Date(mysqlDateFormat);
  const r = await get_date_Availability(req.body.id, date.getMonth()+1)



    res.send(r)
  

})


router
.route('/getImages')
.post( async (req, res) => {
  console.log("Bsadf ", req.body.id)
  try {
    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=racwdli&st=2024-02-08T22:31:23Z&se=2024-03-29T06:31:23Z&sv=2022-11-02&sr=c&sig=gn8efUSCxmUVAh7pjmCDexSV0YnpfMjfCFqelkZBGo8%3D`);
    const containerName =  req.body.id;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const contentType = 'image/png';  // Adjust this based on your file type

  const images = []

      let i = 0;

      // Continue fetching images until an error occurs
      while (true) {
        const blobName = "img-user" + `-${req.body.id}` + `-${req.body.venue_id}`+`-${i}` + `.png`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
          // Download the blob content
          const downloadBlobResponse = await blockBlobClient.downloadToBuffer();
          const imageData = downloadBlobResponse.toString('base64');
          images.push(imageData);
          i++;
        } catch (error) {
          // Error fetching image, exit loop
          break;
        }
      }

  //console.log(images)
  res.send(images)

      }
        
        catch(e){
          console.log(e)
          res.send(e)
        }
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
      const blobName = "img-user" + `-${containerName}` + `-${result[i].ID}`+`-0` + `.png`;
      console.log("Blob name ", blobName)
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


router.route('/mine').post(async (req, res)=>{
  const { pageNumber, pageSize} = req.body; // Assuming pageNumber is passed as a query parameter
  const ID = req.user.id;
  


  try {
    
    if (isNaN(pageNumber)) {
      res.status(400).json({ error: 'Invalid pageNumber parameter' });
      return;
    }

    const venueData = await get_MyVenues(pageNumber, pageSize, ID)

    const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=racwdli&st=2024-02-08T22:31:23Z&se=2024-03-29T06:31:23Z&sv=2022-11-02&sr=c&sig=gn8efUSCxmUVAh7pjmCDexSV0YnpfMjfCFqelkZBGo8%3D`);
    const images = [];
    for (let i=1; i < pageSize+1; i++){
       try {
        const containerName = ID;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = `img-user-${containerName}-${i}-0.png`;
        console.log("blob name ", blobName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const downloadBlobResponse = await blockBlobClient.downloadToBuffer();
        images.push(downloadBlobResponse.toString('base64'));
      } catch (error) {
        console.error(`Error downloading blob ${i}:`, error);
        images.push(null); // Push null to images array to indicate error
      }
    }

    console.log(images)
    
    const responseObject = {
      result: venueData,
      images: images
    };

    // Send the response object
    res.send(responseObject);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})



export default router;