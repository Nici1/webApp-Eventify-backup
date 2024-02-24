
import jwt from 'jsonwebtoken'




async function token_verification(req, res, next){
    
  

    try {
        // Verify the token asynchronously
        
     
        if(req.body.token === undefined){
            const decoded = await jwt.verify(req.headers['token'], process.env.ACCESS_TOKEN_SECRET);
            console.log("Decoded: ", decoded)
            req.user = decoded;

        }
        else{
            const decoded = await jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
        }
        // If verification is successful, send the response
        
        next();
    } catch (err) {

        
        // Handle token verification error
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ error: 'Unauthorized' });
        
        
    }


    /*
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        // Verify the token asynchronously
        const decoded = await jwt.verify(req.cookie.cookieToken, process.env.ACCESS_TOKEN_SECRET);

        // If verification is successful, send the response
        req.user = decoded;
        next();
    } catch (err) {

        try{
            const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // If verification is successful, send the response
            req.user = decoded;
            next();
        }
        catch(err2){
            // Handle token verification error
            console.error('JWT Verification Error:', err2.message);
            res.status(401).json({ error: 'Unauthorized' });
        }
        
    }
*/

}

export {token_verification};