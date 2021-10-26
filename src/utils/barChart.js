import _ from "lodash";
import raw from "$data/data.csv";
import baseColors from "../../properties/colors/base.json";

export const barColors = {
  ".org": baseColors.base["blue-1"].value,
  ".edu": baseColors.base["red"].value,
  ".com": baseColors.base["orange-1"].value,
  other: baseColors.base["orange-2"].value
};

export const barChartData = () => {
  const counts = raw
    .filter((d) => d.year && d.year >= 1972)
    .reduce((acc, currentValue) => {
      const year = parseInt(currentValue.year);
      const existing = acc.filter((d) => d.year === year);
      if (existing.length) {
        return [...acc.filter((d) => d.year !== year), { year, value: existing[0].value + 1 }];
      }
      return [...acc, { year, value: 1 }];
    }, []);
  const sorted = _.sortBy(counts, (d) => d.year);

  return sorted;
};

export const showUntilYear = (step, showUntil) => {
  const previous = showUntil;

  let year;
  if ((step < 4 && step >= 0) || step === undefined) year = 0;
  else if (step === 4) year = 1972;
  else if (step === 5 || step === 6) year = 1991;
  else if (step === 7) year = 1995;
  else if (step === 8) year = 2014;
  else if (step === 9) year = 2019;
  else year = 2022;

  return [year, previous];
};

const getDomain = (str) => {
  if (_.endsWith(str, ".com")) {
    return ".com";
  } else if (_.endsWith(str, ".edu")) {
    return ".edu";
  } else if (_.endsWith(str, ".org")) {
    return ".org";
  }
  return "other";
};

export const domainData = (step) => {
  if (step < 11) return null;

  const colors = raw
    .filter((d) => d.year && d.year >= 1972)
    .reduce((acc, currentValue) => {
      const domain = getDomain(currentValue.domain);
      const year = parseInt(currentValue.year);
      const existing = acc.filter((d) => d.year === year);
      if (existing.length) {
        const myDomainCount = existing[0][domain];
        if (myDomainCount) {
          return [
            ...acc.filter((d) => d.year !== year),
            { ...existing[0], [domain]: myDomainCount + 1 }
          ];
        }
        return [...acc.filter((d) => d.year !== year), { ...existing[0], [domain]: 1 }];
      }
      return [...acc, { year, [domain]: 1 }];
    }, []);
  const sorted = _.sortBy(colors, (d) => d.year);
  return sorted;
};
