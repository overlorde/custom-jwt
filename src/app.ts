import { Express } from "express";

import { Request , Response } from "express";

import { requireJwtMiddleware } from "./middleware";

import { encodeSession } from "./encode";
import {timeStamp} from "console";

const app = Express();

//Set up middleware to protect the /protected route . This must come before routes.

app.use("/protected",requireJwtMiddleware);

//If you want to protect all routes instead of just protected , uncomment next line

//app.use(requireJwtMiddleware);

//set up an HTTP post listener at /sessions , which will log in the caller and return a jwt

app.post('/sessions',(req: Request, res: Response)=>
	 {
		 //this route is unprotected , anybody can call it

		 //TODO: validate username and password

		 const session = encodeSession(SECRET_KEY_HERE,{
			id: userId,
			username: "some usename",
			dateCreated: timestamp

		 });

		 res.status(201).json(session);
	 }
);

//Set up an HTTP Get listener at /protected . The request can only access it if they have a valid jwt token

app.get("/protected",(req: Request,res:Response)=>{
	// The auth middleware protects this route and sets res.locals.session which can be accessed here

	const session : Session = res.locals.session;

	res.status(200).json({message: `Your username is ${session.username}`});

});
