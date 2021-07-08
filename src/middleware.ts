/*

 The middleware must do five things . It must check that the request has an xjwttoken header . The name of the header is arbitrary , u can set it to whatever you want , as long as the client making the request includes the header.

 It should check that the token found in the header is valid.

 It should check that the token has not yet expired . If the token is in the automatic renewal period , it should renew it and append it to the response headers as x-renewed-JWT-Token . Again , the name of the header is arbitrary as long as your client is looking for it in the response.

 If any one of the above mentioned requirements are not met , the middleware should end the req and return a 401 Unauthorized resutlt.

If all of the above requirements are met , the middleware should append the session object to express response.locals object where the authenticated route can access it .


 */


import { Request , Response , NextFunction } from "express";
import {decodeSession} from "./decode";
import {encodeSession} from "./encode";
import {DecodeResult, ExpirationStatus} from "./sessionmodel";
import { checkExpiration } from "./status";
//import {request} from "http";

/*
Express middleware , checks for a valid JSON web token and returns 401 unauthorized if one isn't found .
*/

export function requireJwtMiddleware(req: Request, res: Response , next: NextFunction){


	const unauthorized = (message: string ) => res.status(401).json({
		ok: false,
		status: 401,
		message: message
	});

	const requestHeader = "X-JWT_Token";
	const responseHeader = "X-Renewed-JWT-Token";
	const header = req.header(requestHeader);

	if(!header){
		unauthorized("Required ${requestHeader} header not found");
		return;
	}

	const decodedSession : DecodeResult = decodeSession(SECRET_KEY_HERE, header);

	if(decodeSession.type === "integrity-error" || decodedSession.type === "invalid-token"){
		unauthorized('Failed to decode or validate authorization token . Reason: ${decodedSession.type}');
		return;
	}

	const expiration : ExpirationStatus = checkExpiration(decodedSession.session);

	if(expiration === "expired"){
		unauthorized("Authorization token has expired . Please create a new authorization token ");
		return;
	}

	let session : Session;

	if(expiration == "grace"){
		// Automatically renew the session and send it back with response

		const {token, expires, issued} = encodeSession(SECRET_KEY_HERE, decodedSession.session);

		session = {
			...decodedSession.session,
			expires: expires,
			issued: issued
		};

		res.setHeader(responseHeader, token);
	}else{
		session = decodedSession.session;
	}

	// Set the session on response.locals object for routes to access

	response.locals = {
		...response.locals,
		session: session
	};

	// Request has a valid or renewed session . Call next to continue to the authenticated route handler

	next();
}
