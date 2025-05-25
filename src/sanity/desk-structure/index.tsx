import { StructureResolver } from 'sanity/desk';
import articlesStructure from './articles-structure';
import authorsStructure from './authors-structure';
import industriesStructure from './industries-structure';
import seriesStructure from './series-structure';
import homeStructure from './home-structure';
import profilesStruture from './profiles-struture';
import pressStructure from './press-structure';
import policiesStructure from './policies-structure';
import newsStructure from './news-structure';

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      homeStructure(S, context),
      S.divider(),
      articlesStructure(S, context),
      newsStructure(S, context),
      profilesStruture(S, context),
      industriesStructure(S, context),
      seriesStructure(S, context),
      S.divider(),
      pressStructure(S, context),
      policiesStructure(S, context),
      S.divider(),
      authorsStructure(S, context),
    ]);
