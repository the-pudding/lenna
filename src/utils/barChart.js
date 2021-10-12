import _ from "lodash";
import raw from "$data/data.csv";
import baseColors from "../../properties/colors/base.json";

export const barColors = {
  ".org": baseColors.base["blue-1"].value,
  ".edu": baseColors.base["orange-1"].value,
  ".com": baseColors.base["red"].value,
  other: baseColors.base["orange-2"].value
};

export const barChartData = () => {
  const counts = raw
    .filter((d) => d.year)
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

export const showUntilYear = (step) => {
  if (step === 6) return 0;
  if (step === 7) return 1991;
  return 2022;
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

export const domainData = () => {
  const colors = raw
    .filter((d) => d.year)
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
