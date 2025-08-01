import {ZodIssue} from "zod";

//discriminated union
type ActionResult<T> = 
    {status: 'success', data: T} | {status: "error", error: string | ZodIssue[]}