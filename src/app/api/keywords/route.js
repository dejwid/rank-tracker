import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {doGoogleSearch} from "@/libs/rankingFunctions";
import {Keyword} from "@/models/Keyword";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {URL} from 'url';
import {Result} from "../../../models/Result";

export async function POST(req) {
  mongoose.connect(process.env.MONGODB_URI);
  const data = await req.json();
  const session = await getServerSession(authOptions);
  const keywordDoc = await Keyword.create({
    domain: data.domain,
    keyword: data.keyword,
    owner: session.user.email,
  });
  const responseId = await doGoogleSearch(data.keyword);
  await Result.create({
    domain: data.domain,
    keyword: data.keyword,
    brightDataResponseId: responseId,
  });
  return Response.json(keywordDoc);
}

export async function GET(req) {
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain');
  const keyword = url.searchParams.get('keyword');
  mongoose.connect(process.env.MONGODB_URI);
  const session = await getServerSession(authOptions);
  const keywordsDocs = await Keyword.find(
    keyword
      ? {domain,keyword,owner:session.user.email}
      : {domain,owner:session.user.email}
  );
  const resultsDocs = await Result.find({
    domain,
    keyword:keywordsDocs.map(doc => doc.keyword)
  });
  return Response.json({
    keywords: keywordsDocs,
    results: resultsDocs,
  });
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain');
  const keyword = url.searchParams.get('keyword');
  mongoose.connect(process.env.MONGODB_URI);
  const session = await getServerSession(authOptions);
  await Keyword.deleteOne({domain,keyword,owner:session.user.email});
  return Response.json(true);
}