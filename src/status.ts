/*
checking the expiration status and handling with automatic renewal period
recieves a deserialized session object , look at its expires property and determine if the token is active , expired
 or in the grace renewal period . For this example , we'll say the renewal period is three hours if has been expired for less than three hours it can be automatically renewed.

*/

import {ExpirationStatus, Session} from "./sessionmodel";

export function checkExpiration(token:Session):ExpirationStatus{

	const now = Date.now();

	if(token.expires > now ) return "active";

	//Find the timestamp for the end of the token's grace period

	const threeHoursInMs = 3*60*60*1000;

	const threeHoursAfterExpiration = token.expires + threeHoursInMs;

	if(threeHoursAfterExpiration > now){

		return "grace";
	}



	return "expired";
}
