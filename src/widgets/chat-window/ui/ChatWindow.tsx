import { useUnit } from 'effector-react';
import { chatModel } from '@/entities/chat';
import { MessageInput } from '@/features/message/send';
import { ConnectionBadge } from '@/features/notifications/receive';
import { formatPhone } from '@/shared/lib/phone';
import { Avatar, BackIcon, Button, ChatIcon } from '@/shared/ui';
import {
  BackSlot,
  Footer,
  Header,
  Info,
  Pill,
  Placeholder,
  Subtitle,
  Title,
  Window,
} from './ChatWindow.styles';

const PLACEHOLDER_ICON_SIZE = 48;
const AVATAR_SIZE = 40;
import { MessageList } from './MessageList';

export function ChatWindow() {
  const [chat, selectChat] = useUnit([
    chatModel.$activeChat,
    chatModel.chatSelected,
  ]);

  if (!chat) {
    return (
      <Placeholder>
        <ChatIcon
          width={PLACEHOLDER_ICON_SIZE}
          height={PLACEHOLDER_ICON_SIZE}
        />
        <Pill>Выберите чат или создайте новый</Pill>
      </Placeholder>
    );
  }

  const phone = chat.phone ? formatPhone(chat.phone) : null;

  return (
    <Window>
      <Header>
        <BackSlot>
          <Button
            variant="icon"
            onClick={() => selectChat(null)}
            title="Назад к чатам"
          >
            <BackIcon />
          </Button>
        </BackSlot>
        <Avatar name={chat.title} seed={chat.chatId} size={AVATAR_SIZE} />
        <Info>
          <Title>{chat.title}</Title>
          <Subtitle>
            {phone && phone !== chat.title && <span>{phone}</span>}
            <ConnectionBadge />
          </Subtitle>
        </Info>
      </Header>

      <MessageList key={chat.chatId} />

      <Footer>
        <MessageInput key={chat.chatId} />
      </Footer>
    </Window>
  );
}
