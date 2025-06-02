import { ArticleDropdownMenu } from "@/components/admin/admin/article-drop-down";
import { TableTooltip } from "@/components/admin/admin/table-tooltip";
import { CircleProgress } from "@/components/admin/circle-progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MArticlesData, MArticleType } from "@/data/m-articles";
import extractTextFromBlocks from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { ArticleType } from "@/types";

export default function ArticlesWrapper({
  sanityArticles,
}: {
  sanityArticles: ArticleType[];
}) {
  return (
    <>
      <h1 className="text-xl mb-4">All Articles</h1>
      <div className="space-y-2">
        <div id="headings">
          <div className="bg-zinc-100 rounded-md px-2 py-4 grid grid-cols-[100px_1fr_50px_50px_50px_50px_50px_60px_60px_60px_60px_60px_60px] gap-4 items-center text-sm">
            <div>Status</div>
            <div>Name</div>
            <div>
              <TableTooltip triggerText="Rank&nbsp;(D)">
                SERP Rank on Desktop Devices (currentMonth)
              </TableTooltip>
            </div>
            <div>
              <TableTooltip triggerText="Rank&nbsp;(M)">
                SERP Rank on Mobile Devices (currentMonth)
              </TableTooltip>
            </div>
            <div>
              <TableTooltip triggerText="Volume">
                Keyword Monthly Search Volume
              </TableTooltip>
            </div>
            <div>Difficulty</div>
            <div>
              <TableTooltip triggerText="Traffic">
                Traffic from the last 30 days
              </TableTooltip>
            </div>
            <div>Backlinks</div>
            <div>Words</div>
            <div>
              <TableTooltip triggerText="Value">
                Article Daily Income Contribution
              </TableTooltip>
            </div>
            <div className="text-center">Score</div>
            <div>Author</div>
            <div>Action</div>
          </div>
        </div>
        {sanityArticles.map((article) => {
          const mArticle = MArticlesData?.find(
            (mArticle) => mArticle.articleId === article._id
          );
          return (
            <ArticleRow
              key={article._id}
              article={article}
              mArticle={mArticle}
            />
          );
        })}
      </div>
      <div>Count: {sanityArticles.length}</div>
    </>
  );
}

function ArticleRow({
  article,
  mArticle,
}: {
  article: ArticleType;
  mArticle?: MArticleType;
}) {
  const statusTagBgColor = mArticle
    ? {
        pending: "bg-red-300",
        "in-progress": "bg-yellow-300",
        "in-review": "bg-blue-300",
        published: "bg-green-300",
        deleted: "bg-gray-300",
      }[mArticle.status]
    : "bg-gray-300";

  const statusTagIconColor = mArticle
    ? {
        pending: "bg-red-500",
        "in-progress": "bg-yellow-500",
        "in-review": "bg-blue-500",
        published: "bg-green-500",
        deleted: "bg-gray-500",
      }[mArticle.status]
    : "bg-gray-500";

  const articleText = extractTextFromBlocks(article.body);

  const articleTextWords = articleText.split(" ").length;
  const introWords = article.intro.split(" ").length;
  const titleWords = article.title.split(" ").length;
  const totalWords = articleTextWords + introWords + titleWords;

  const progressColor =
    article.truthScore! >= 1 && article.truthScore! <= 10
      ? "orange"
      : article.truthScore! >= 11 && article.truthScore! <= 50
      ? "yellow"
      : article.truthScore! >= 51 && article.truthScore! <= 80
      ? "lime"
      : article.truthScore! > 80
      ? "green"
      : "red";

  const traffic = mArticle
    ? (() => {
        const date = new Date();
        const currentMonth = date
          .toLocaleString("default", { month: "short" })
          .toLowerCase();
        return (
          mArticle?.articleTraffic?.[
            currentMonth as keyof typeof mArticle.articleTraffic
          ]?.currentYear || 0
        );
      })()
    : 0;

  return (
    <div className="bg-zinc-100 rounded-md px-2 py-4 grid grid-cols-[100px_1fr_50px_50px_50px_50px_50px_60px_60px_60px_60px_60px_60px] gap-4 items-center text-sm">
      <div
        className={`${statusTagBgColor} flex items-center py-2 px-1 rounded-sm text-xs`}
      >
        <div
          className={`${statusTagIconColor} min-w-2 min-h-2 w-2 h-2 rounded-full mr-2`}
        />
        <span className="line-clamp-1">
          {mArticle ? mArticle.status : "N/A"}
        </span>
      </div>
      <div>{article.name}</div>
      <div>
        {(() => {
          const date = new Date();
          const currentMonth = date
            .toLocaleString("default", { month: "short" })
            .toLowerCase();
          return (
            mArticle?.desktopRank?.[
              currentMonth as keyof typeof mArticle.desktopRank
            ]?.currentYear || "N/A"
          );
        })()}
      </div>
      <div>
        {(() => {
          const date = new Date();
          const currentMonth = date
            .toLocaleString("default", { month: "short" })
            .toLowerCase();
          return (
            mArticle?.mobileRank?.[
              currentMonth as keyof typeof mArticle.mobileRank
            ]?.currentYear || "N/A"
          );
        })()}
      </div>
      <div>
        {mArticle
          ? `${mArticle.keywordSearchVolumeRange.low} - ${mArticle.keywordSearchVolumeRange.high}`
          : "N/A"}
      </div>
      <div>{mArticle ? mArticle.keywordDifficulty : "N/A"}</div>
      <div>{traffic}</div>
      {/* Topic Expertise Score - Calculate from articles in series and their rankinga */}
      <div className="text-center">{mArticle ? mArticle.pageBackLinks : 0}</div>
      <div className="text-center">{totalWords}</div>
      <div className="text-center">{`$${traffic / 20000}`}</div>
      <div className="flex items-center justify-center">
        <CircleProgress
          value={article.truthScore || 0}
          size={40}
          color={progressColor}
        />
      </div>
      <div>
        <Avatar>
          <AvatarImage
            src={urlForImage(article.author?.picture).url()}
            alt={article.author.name}
          />
          <AvatarFallback>IB</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <ArticleDropdownMenu article={article} mArticle={mArticle} />
      </div>
    </div>
  );
}
