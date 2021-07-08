// Deserialzing a json object

import { decode , TAlgorithm } from "jwt-simple";
import { Session } from "./sessionmodel";
import { DecodeResult } from "./sessionmodel";

export function decodeSession(secretKey: string, tokenString: string):DecodeResult{

	//Alwys use Hs512 to decode the token

	const algorithm: TAlgorithm = "HS512";

	let result: Session;

	try{
		result = decode(tokenString,secretKey,false,algorithm);
	}catch(_e){

		const e : Error = _e;

		//The error strings can be found here

		if(e.message === 'No token supplied' || e.message === "Not enough or too many segments"){

			return{
				type: "invalid-token"
			};
		}

		if(e.message === "Signature verifaction failed " || e.message === "Algorithm not supported" ){


			return{
				type: "integrity-error"
			};
		}

		//Handle json parse errors , thrown when the payload is nonsense

		if(e.message.indexOf("Unexpected token") === 0){
			return {
				type : "invalid-token"
			};
		}

		throw e;

	}

	return{
		type: "valid",
		session: result
	}
}
