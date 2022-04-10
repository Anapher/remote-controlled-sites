import { ScreenWebsiteContent } from '../../../shared/Screen';

type Props = {
   content: ScreenWebsiteContent;
};
export default function UrlScreenContent({ content }: Props) {
   return <iframe title="Content" src={content.url} frameBorder="0" style={{ width: '100%', height: '100%' }} />;
}
