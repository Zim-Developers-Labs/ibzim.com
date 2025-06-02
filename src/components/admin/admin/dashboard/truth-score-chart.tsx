"use client";

import { DArticleType } from "@/app/(admin)/admin/dashboard/page";
import { DonutChart } from "../../donut-chart";

export const ArticlesTruthScoreChart = ({
  articles,
}: {
  articles: DArticleType[];
}) => {
  const chartdata = [
    {
      name: "Not Revised",
      amount: articles.filter((article) => !article.truthScore).length,
    },
    {
      name: "1 - 10%",
      amount: articles.filter(
        (article) => article.truthScore! >= 1 && article.truthScore! <= 10
      ).length,
    },
    {
      name: "11% - 50%",
      amount: articles.filter(
        (article) => article.truthScore! >= 11 && article.truthScore! <= 50
      ).length,
    },
    {
      name: "51% - 80%",
      amount: articles.filter(
        (article) => article.truthScore! >= 51 && article.truthScore! <= 80
      ).length,
    },
    {
      name: "Above 81%",
      amount: articles.filter((article) => article.truthScore! > 80).length,
    },
  ];

  return (
    <DonutChart
      className="mx-auto"
      data={chartdata}
      category="name"
      value="amount"
      showLabel={true}
      valueFormatter={(number: number) =>
        `${Intl.NumberFormat("us").format(number).toString()} Articles`
      }
    />
  );
};

export const ProfilesTruthScoreChart = ({
  profiles,
}: {
  profiles: DArticleType[];
}) => {
  const chartdata = [
    {
      name: "Not Revised",
      amount: profiles.filter((article) => !article.truthScore).length,
    },
    {
      name: "1 - 10%",
      amount: profiles.filter(
        (article) => article.truthScore! >= 1 && article.truthScore! <= 10
      ).length,
    },
    {
      name: "11% - 50%",
      amount: profiles.filter(
        (article) => article.truthScore! >= 11 && article.truthScore! <= 50
      ).length,
    },
    {
      name: "51% - 80%",
      amount: profiles.filter(
        (article) => article.truthScore! >= 51 && article.truthScore! <= 80
      ).length,
    },
    {
      name: "Above 81%",
      amount: profiles.filter((article) => article.truthScore! > 80).length,
    },
  ];

  return (
    <DonutChart
      className="mx-auto"
      data={chartdata}
      category="name"
      value="amount"
      showLabel={true}
      valueFormatter={(number: number) =>
        `${Intl.NumberFormat("us").format(number).toString()} Profiles`
      }
    />
  );
};
