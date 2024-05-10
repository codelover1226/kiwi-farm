import { JsonObject } from "type-fest";

interface User {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: JsonObject;
  password: string;
}

export const fetchAgents = async (isSuperUser:boolean = false) => {
  try {
    const response = await fetch("/api/auth/getUsers", {
      method: "POST",
      body: JSON.stringify({isSuperUser}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data: User[] = await response.json();
      return {isSuccess:true, data}
    } else {
      const data = await response.json();
      return {isSuccess:false, data}      
    }
  } catch (error) {
    return {isSuccess:false, data:error.message}      
  }
};
