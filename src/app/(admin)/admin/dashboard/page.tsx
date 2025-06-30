import { Metadata } from "next";
import DashboardWrapper from "./wrapper";
import {
  getAllArticlesTruthScores,
  getAllProfilesTruthScores,
} from "@/sanity/lib/client";

export type DArticleType = {
  truthScore?: number;
};

export const metadata: Metadata = {
  title: "IB Dashboard",
};

export default async function DashboardPage() {
  const [articles, profiles] = await Promise.all([
    getAllArticlesTruthScores(),
    getAllProfilesTruthScores(),
  ]);
  return <DashboardWrapper articles={articles} profiles={profiles} />;
}
