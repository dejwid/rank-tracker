import {model, models, Schema} from "mongoose";

const KeywordSchema = new Schema({
  domain: {type: String, required: true},
  keyword: {
    type: String,
    required: true,
    validate: val => val.length > 0,
  },
  owner: {type: String, required: true},
}, {timestamps:true});

export const Keyword = models?.Keyword || model('Keyword', KeywordSchema);