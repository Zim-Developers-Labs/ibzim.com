import annotationLink from '../schemas/annotations/link';
import annotationChange from '../schemas/annotations/change';
import annotationReference from '../schemas/annotations/reference';
import annotationInternalLink from '../schemas/annotations/internal-link';
import body from '../schemas/blocks/body';
import article from '../schemas/documents/article/zim-article';
import author from '../schemas/documents/author';
import buttonCta from '../schemas/objects/button-cta';
import consCard from '../schemas/objects/cons-card';
import embed from '../schemas/objects/embed';
import faqs from '../schemas/objects/faqs/index';
import questionSchema from '../schemas/objects/faqs/question-schema';
import greenCard from '../schemas/objects/green-card';
import image from '../schemas/objects/image';
import partnersCard from '../schemas/objects/partners-card';
import productSummary from '../schemas/objects/product-summary';
import prosCard from '../schemas/objects/pros-card';
import table from '../schemas/objects/table';
import videoEmbed from '../schemas/objects/video-embed';
import home from '../schemas/singletons/home/zim-home';
import imageCarousel from '../schemas/objects/image-carousel';
import articleIndustry from '../schemas/documents/article-industry';
import ecocashCalculator from '../schemas/objects/calculators/ecocash';
import onemoneyCalculator from '../schemas/objects/calculators/onemoney';
import mukuruCalculator from '../schemas/objects/calculators/mukuru';
import articleSeries from '../schemas/documents/article-series';
import editor from '../schemas/documents/editor';
import profile from '../schemas/documents/profile/zim-profile';
import textBody from '../schemas/blocks/text-body';
import policy from '../schemas/documents/policy';
import press from '../schemas/documents/press';
import { newsSchemaTypes } from './news';

const annotations = [
  annotationLink,
  annotationChange,
  annotationReference,
  annotationInternalLink,
];

const blocks = [body, textBody];

const documents = [
  article,
  articleIndustry,
  articleSeries,
  author,
  editor,
  profile,
  policy,
  press,
];

const singletons = [home];

const objects = [
  faqs,
  consCard,
  prosCard,
  greenCard,
  image,
  partnersCard,
  questionSchema,
  productSummary,
  table,
  buttonCta,
  videoEmbed,
  imageCarousel,
  ecocashCalculator,
  onemoneyCalculator,
  mukuruCalculator,
  embed,
];

export const schemaTypes = [
  ...documents,
  ...objects,
  ...annotations,
  ...blocks,
  ...singletons,
  ...newsSchemaTypes,
];
