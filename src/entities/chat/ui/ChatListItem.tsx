import { Avatar } from '@/shared/ui';
import { Body, Item, Preview, Row, Time, Title } from './ChatListItem.styles';

interface ChatListItemProps {
  chatId: string;
  title: string;
  preview: string;
  time: string;
  active: boolean;
  onSelect: (chatId: string) => void;
}

export function ChatListItem({
  chatId,
  title,
  preview,
  time,
  active,
  onSelect,
}: ChatListItemProps) {
  return (
    <Item type="button" data-active={active} onClick={() => onSelect(chatId)}>
      <Avatar name={title} seed={chatId} />
      <Body>
        <Row>
          <Title>{title}</Title>
          <Time>{time}</Time>
        </Row>
        <Preview>{preview}</Preview>
      </Body>
    </Item>
  );
}
