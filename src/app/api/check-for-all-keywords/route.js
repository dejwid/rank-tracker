import {doGoogleSearch} from "@/libs/rankingFunctions";
import mongoose from "mongoose";
import {Keyword} from "../../../models/Keyword";
import {Result} from "../../../models/Result";

export async function GET() {
  mongoose.connect(process.env.MONGODB_URI);
  const keywordsDocs = [...await Keyword.find()];

  const googleSearchPromises = [];
  const savePromises = [];
  for (const keywordDoc of keywordsDocs) {
    const googleSearchPromise = doGoogleSearch(keywordDoc.keyword);
    googleSearchPromise.then(responseId => {
      const savePromise = Result.create({
        domain: keywordDoc.domain,
        keyword: keywordDoc.keyword,
        brightDataResponseId: responseId,
      });
      savePromises.push(savePromise);
    });
    googleSearchPromises.push( googleSearchPromise );
  }
  await Promise.allSettled([...googleSearchPromises, ...savePromises]);
  return Response.json(true);
}