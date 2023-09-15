import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Domain} from "@/models/Domain";
import axios from "axios";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import DomParser from 'dom-parser';
import {URL} from "url";
import {Keyword} from "../../../models/Keyword";
import {Result} from "../../../models/Result";

async function getIconUrl(domain) {
  const response = await axios.get(`https://`+domain);
  const parser = new DomParser();
  const parsedHTML = parser.parseFromString(response.data, 'text/html');
  const links = parsedHTML.getElementsByTagName('link');
  let href = '';
  for (const link of links) {
    const rel = link.attributes?.find(a => a.name === 'rel')?.value || '';
    if (rel.includes('icon')) {
      href = link.attributes?.find(a => a.name === 'href')?.value;
    }
  }
  if (href.includes('://')) {
    return href;
  } else {
    return `https://` + domain + href;
  }
}

export async function POST(req) {
  const data = await req.json();
  mongoose.connect(process.env.MONGODB_URI);
  const session = await getServerSession(authOptions);
  let icon = null;
  try {
    icon = await getIconUrl(data?.domain);
  } catch(e) {
    console.error(e);
  }
  const doc = await Domain.create({
    domain: data?.domain,
    owner: session?.user?.email,
    icon,
  });
  return Response.json(doc);
}

export async function GET() {
  mongoose.connect(process.env.MONGODB_URI);
  const session = await getServerSession(authOptions);
  const email = session.user?.email;
  const domains = await Domain.find({owner:email});
  const keywords = await Keyword.find({
    owner:email,
    domain:domains.map(doc => doc.domain),
  });
  const results = await Result.find({
    domain:domains.map(doc => doc.domain),
    keyword:keywords.map(doc => doc.keyword)
  });
  return Response.json({domains,keywords,results});
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGODB_URI);
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain');
  const session = await getServerSession(authOptions);
  await Domain.deleteOne({owner:session.user?.email,domain});
  return Response.json(true);
}