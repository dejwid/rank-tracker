import axios from "axios";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import Chart from "./Chart";

export default function KeywordRow({keyword,domain,results:defaultResults}) {
  const resultsRef = useRef(defaultResults || []);
  const isCompleteRef = useRef(resultsRef.current.filter(r => r.complete).length > 0);
  const rankExistsRef = useRef(resultsRef.current.filter(r => r.rank).length > 0);
  const [isComplete,setIsComplete] = useState(isCompleteRef.current);
  const [rankExists,setRankExists] = useState(rankExistsRef.current);
  useEffect(() => {
    reFetchResultIfNoRank();
  }, []);
  function reFetchResultIfNoRank() {
    if (!isCompleteRef.current) {
      axios.get(`/api/results?domain=${domain}&keyword=${keyword}`).then(res => {
        resultsRef.current = res.data;
        isCompleteRef.current = res.data.filter(r => r.complete).length > 0;
        rankExistsRef.current = res.data.filter(r => r.rank).length > 0;
        setRankExists(rankExistsRef.current);
        setIsComplete(isCompleteRef.current);
      });
      setTimeout(() => {
        reFetchResultIfNoRank();
      }, 3000);
    }
  }
  return (
    <div className="flex gap-2 bg-white border border-blue-200 border-b-4 pr-0 rounded-lg items-center my-3">
      <Link
        href={'/domains/'+domain+'/'+encodeURIComponent(keyword)}
        className="font-bold grow block p-4"
      >
        {keyword}
      </Link>
      <div>
        <div className="min-h-[80px] w-[300px] flex items-center">
          {!rankExists && (
            <div className="block text-center w-full">
              {isComplete === true ? (
                <div>Not in top 100 :(</div>
              ) : (
                <div>Checking rank...</div>
              )}
            </div>
          )}
          {rankExists && (
            <div className="pt-2">
              <Chart results={resultsRef.current} width={300} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}