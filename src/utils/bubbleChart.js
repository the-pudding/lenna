import _ from "lodash";
import raw from "$data/data.csv";

export const getYearRange = (step) => {
  if (!step) return [];
  if (step === 9) return [1972, 1990];
  if (step === 10) return [1991, 2010];
  if (step === 11) return [2011, 2021];
};
export const formatData = (startYear, endYear) => {
  const filtered = raw.filter(
    (d) => d.year && parseInt(d.year) >= startYear && parseInt(d.year) <= endYear
  );

  const groupNumbers = { ".com": 0, ".edu": 1, ".org": 2, other: 3 };

  const result = filtered.reduce(
    (acc, currentValue) => {
      let group;
      if (_.endsWith(currentValue.domain, ".com")) {
        group = ".com";
      } else if (_.endsWith(currentValue.domain, ".edu")) {
        group = ".edu";
      } else if (_.endsWith(currentValue.domain, ".org")) {
        group = ".org";
      } else {
        group = "other";
      }

      const myGroup = acc.filter((d) => d.name === group)[0].children;
      const myDomainEntry = myGroup.filter((d) => d.domain === currentValue.domain);

      if (myDomainEntry.length > 0) {
        return [
          ...acc.filter((d) => d.name !== group),
          {
            name: group,
            children: [
              ...myGroup.filter((d) => d.domain !== currentValue.domain),
              {
                group: groupNumbers[group],
                domain: currentValue.domain,
                value: myDomainEntry[0].value + 1
              }
            ]
          }
        ];
      }

      return [
        ...acc.filter((d) => d.name !== group),
        {
          name: group,
          children: [
            ...myGroup,
            { group: groupNumbers[group], domain: currentValue.domain, value: 1 }
          ]
        }
      ];
    },
    [
      { name: ".com", children: [] },
      { name: ".edu", children: [] },
      { name: ".org", children: [] },
      { name: "other", children: [] }
    ]
  );

  return { name: "root", children: result };
};
