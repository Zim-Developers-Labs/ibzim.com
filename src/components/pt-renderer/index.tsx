import PortableText from 'react-portable-text';
import { P } from './pt-components/p';
import blockProsCard from './pt-components/pros-card';
import Headings from './pt-components/headings';
import Blockquote from './pt-components/blockquote';
import { Li, Ol, Ul } from './pt-components/list';
import faqsComponent from './pt-components/faqs';
import blockConsCard from './pt-components/cons-card';
import imageModule from './pt-components/image';
import blockGreenCard from './pt-components/green-card';
import blockPartnersCard from './pt-components/partners-card';
import blockTable from './pt-components/table';
import blockButtonCta from './pt-components/button-cta';
import blockEcocashCalculator from './pt-components/calculators/ecocash-calculator';
import blockOneMoneyCalculator from './pt-components/calculators/onemoney-calculator';
import blockMukuruCalculator from './pt-components/calculators/mukuru-calculator';
import Superscript from './pt-components/sup';
import imageCarouselModule from './pt-components/image-carousel';
import annotationLink, { annotationInternalLink } from './pt-components/a';
import VideoEmbed from './pt-components/video-embed';
import annotationReference from './pt-components/reference';
import annotationChange from './pt-components/change';
import PHeadings from './pt-components/profile-headings';
import blockEmbed from './pt-components/embed';

const PtComponents = () => {
  return {
    blockProsCard,
    blockConsCard,
    imageModule,
    imagesModule: imageCarouselModule,
    blockEcocashCalculator,
    blockOneMoneyCalculator,
    blockMukuruCalculator,
    blockGreenCard,
    blockPartnersCard,
    blockVideoEmbed: VideoEmbed,
    blockTable,
    sup: Superscript,
    blockButtonCta,
    blockFAQs: faqsComponent,
    normal: P,
    blockquote: Blockquote,
    ...Headings,
    annotationLink,
    annotationReference,
    annotationInternalLink,
    ul: Ul,
    blockEmbed,
    ol: Ol,
    li: Li,
    link: (props: any) => props.children,
  };
};

type PtRendererType = {
  body: any;
};

export default function PtRenderer(props: PtRendererType) {
  return <PortableText content={props.body} serializers={PtComponents()} />;
}

// TxtComponents

const TxtComponents = () => {
  return {
    normal: (props: any) => props.children,
    annotationLink,
    annotationChange,
    ul: (props: any) => <ul>{props.children}</ul>,
    ol: (props: any) => <ol>{props.children}</ol>,
    li: (props: any) => <li>{props.children}</li>,
    link: (props: any) => props.children,
    annotationReference,
  };
};

export function TxtRenderer(props: PtRendererType) {
  return <PortableText content={props.body} serializers={TxtComponents()} />;
}

// Profile Components

const PPtComponents = () => {
  return {
    blockProsCard,
    blockConsCard,
    imageModule,
    imagesModule: imageCarouselModule,
    blockEcocashCalculator,
    blockOneMoneyCalculator,
    blockMukuruCalculator,
    blockGreenCard,
    blockPartnersCard,
    blockVideoEmbed: VideoEmbed,
    blockTable,
    sup: Superscript,
    blockButtonCta,
    blockFAQs: faqsComponent,
    normal: P,
    blockquote: Blockquote,
    ...PHeadings,
    annotationLink,
    annotationReference,
    annotationInternalLink,
    blockEmbed,
    ul: Ul,
    ol: Ol,
    li: Li,
    link: (props: any) => props.children,
  };
};

export function PPtRenderer(props: PtRendererType) {
  return <PortableText content={props.body} serializers={PPtComponents()} />;
}
