Auth:
The auth is going to be based on the secret codes, in other words
I generate a secret code and give it to the user.
There would be admin user who will be able to add
user

Resources:
```
intefrace User {
  id: number;
  name: string;
  profile_pic_url: string;
  role: "admin" | "user";
  secretKey: string;
}

interface Compliment {
  id: number;
  user_id: number;
  content: string;
  female_profile_id : number;
}

interface FemaleProfile {
  id: number;
  name: string;
  bio: string;
  compliments: Compliment[];
}
```
User:
User will have two roles admin/user.
Features:
Admin will be able to do crud on users in the system.
Admin will be able to add female profiles.
Users will be able to login using secret codes.
Change one's own pic/name
If admin would want to invalidate users, he
could gen a new code. (jwt will check for having same code)

Compliment specs:
- A user can write one compliment
Check if compliments arr item includes user's id.
Display change/delete if yes, or display a button to add compliment.
