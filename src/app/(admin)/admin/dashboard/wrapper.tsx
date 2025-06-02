import {
  ArticlesTruthScoreChart,
  ProfilesTruthScoreChart,
} from "@/components/admin/admin/dashboard/truth-score-chart";
import { DArticleType } from "./page";

export default function DashboardWrapper({
  articles,
  profiles,
}: {
  articles: DArticleType[];
  profiles: DArticleType[];
}) {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="aspect-square rounded-xl bg-muted/50 text-center p-4 flex flex-col items-center">
          <div className="mb-4">Articles Truth Score</div>
          <ArticlesTruthScoreChart articles={articles} />
        </div>
        <div className="aspect-square rounded-xl bg-muted/50 text-center p-4 flex flex-col items-center">
          <div className="mb-4">Profiles Truth Score</div>
          <ProfilesTruthScoreChart profiles={profiles} />
        </div>
        <div className="aspect-square rounded-xl bg-muted/50" />
        <div className="aspect-square rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
