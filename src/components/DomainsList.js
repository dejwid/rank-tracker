'use client';
import DomainRow from "@/components/DomainRow";
import DoubleHeader from "@/components/DoubleHeader";

export default function DomainsList({domains,keywords,results}) {
  return (
    <div>
      <DoubleHeader
        preTitle={'Your domains'}
        mainTitle={domains.length+' Domains'} />
      {domains.map(domainDoc => (
        <DomainRow
          key={domainDoc._id}
          {...domainDoc}
          keywords={keywords.filter(k => k.domain === domainDoc.domain)}
          results={results.filter(r => r.domain === domainDoc.domain)}
        />
      ))}
    </div>
  );
}