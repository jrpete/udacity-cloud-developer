import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // Call an asynchronous GET function using /filteredimage as the path
  app.get( "/filteredimage", async ( req, res ) => {

    //instantiate a query parameter
    let { image_url } = req.query;

    //throw an HTTP 400 status code if the user does not enter a query parameter
    if ( !image_url ) {
      return res.status(400)
                .send(`400 Bad Request Response: Please enter a valid URL as a parameter in the following format: filteredimage?image_url='YourURL.jpg'"`);
    }

    //Call the filterImageFromURL function, passing it the URL of the image as the query parameter
    try {
      const imageFilter = await filterImageFromURL(image_url as string)

      //call the sendFile function if the image is succesfully retrived and serve it up to the user
      await res.status(200).sendFile(imageFilter, {}, (err) => {
        
        //throw an HTTP 422 status code if the image URL cannot be processed
        if (err) { return res.status(422).send(`422 Unprocessable Entity: Please select a different image URL as a parameter in the following format: filteredimage?image_url='YourURL.jpg'`); }

        //remove the image from local storage after it is served up
        deleteLocalFiles([imageFilter])
      })

      //throw a HTTP 422 status code if a HTTP 200 status code is code is not returned
      } catch (err) {
        res.status(422).send(`422 Unprocessable Entity: Please select a different image URL as a parameter in the following format: filteredimage?image_url='YourURL.jpg'`);
    }

  });
  

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("Please enter a URL query parameter to the end of the root in the following format: filteredimage?image_url='YourURL.jpg'")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();