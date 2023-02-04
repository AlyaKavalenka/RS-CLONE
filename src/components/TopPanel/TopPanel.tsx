import ChatInfo from '../ChatInfo/ChatInfo';
import './TopPanel.scss';
import TopPanelTools from '../TopPanelTools/TopPanelTools';
import TopPanelPinnedMessage from '../TopPanelPinnedMessage/TopPanelPinnedMessage';
// import TopPanelSettings from '../TopPanelSettings/TopPanelSettings';

export default function TopPanel() {
  return (
    <div className="top-panel">
      <ChatInfo />
      <TopPanelPinnedMessage />
      <TopPanelTools />
      {/* <TopPanelSettings /> */}
    </div>
  );
}
