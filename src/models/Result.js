import {model, models, Schema} from "mongoose";

const ResultSchema = new Schema({
  domain: {type: String, required: true},
  keyword: {type: String, required: true},
  brightDataResponseId: {type: String, required: true},
  rank: {type: Number},
  complete: {type: Boolean, default: false},
}, {timestamps:true});

export const Result = models?.Result || model('Result', ResultSchema);