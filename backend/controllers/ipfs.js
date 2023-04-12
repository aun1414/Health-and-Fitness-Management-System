const { sendError } = require('../utils/helper');
const Hash = require('ipfs-only-hash')

const ipfsClient = async function (){
    const { create } = await import('ipfs-http-client');
    //creating ipfs object
    let ipfs= await create(
        {
            host: "localhost",
            port: 5001,
            protocol: "http"
        }
    )

    return ipfs;

}

//get a file from ipfs that corresponds to a file hash
exports.getFile = async (req, res) => {
    
    
        try{
           

            //creating ipfs object
            ipfs = await ipfsClient();

         

            //getting file having same hash as provided in request body
            let file = await ipfs.cat(req.body.h)
            
            let data = {}

            //get lines of files
            for await (i of file){
                
                data = Buffer.from(i).toString();
                
            }

            
            

            //resturn file content
            res.status(200).json({success: true, data: data});
            // res.send({ title: 'GeeksforGeeks' });
        }
        catch(err){
            //on error return status fail
            console.log(err);
            res.status(400).json({success: false, error: err});
        }

        
}

//upload file to ipfs
exports.uploadFile = async (req, res) => {
    
    try{
        

        //creating ipfs object
        ipfs = await ipfsClient();

        //storing request body in data
        let data=JSON.stringify(req.body.content)

     

        //adding file to ipfs(file having data same as request body)
        let result = await ipfs.add({path: req.body.file, content: data})
       
       
        //calculating hash of data
        const hash = await Hash.of(data);
        console.log("Hash: ",hash);
        //return object having info of filepath and hash
        res.status(200).json({success: true, result: result, hashValue: hash})

    }
    catch(err){
        //on error return status fail
        console.log(err);
        res.status(400).json({success: false, error: err});
    }

    
}



//delete a file from ipfs
exports.deleteFile = async (req, res) => {
    
    
        try{
            console.log(req.body)

            //creating ipfs object
            ipfs = await ipfsClient();

          

            //resturn file content
            res.status(200).json({success: true});
        }
        catch(err){
            //on error return status fail
            console.log(err);
            res.status(400).json({success: false, error: err});
        }

        
}

