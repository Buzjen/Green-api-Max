import { useUnit } from 'effector-react';
import { ChatListItem, chatModel } from '@/entities/chat';
import { sessionModel } from '@/entities/session';
import { LogoutButton } from '@/features/auth/logout';
import {
  createChatModel,
  NewChatButton,
  NewChatForm,
} from '@/features/chat/create-by-phone';
import { formatRecent } from '@/shared/lib/date';
import { Button, ChatIcon } from '@/shared/ui';
import { $items } from '../model/sidebar';
import {
  Empty,
  EmptyText,
  FormSlot,
  Header,
  Heading,
  Instance,
  List,
  Sidebar,
  Title,
} from './ChatSidebar.styles';

export function ChatSidebar() {
  const [items, activeChatId, selectChat, isFormOpen, openForm, credentials] =
    useUnit([
      $items,
      chatModel.$activeChatId,
      chatModel.chatSelected,
      createChatModel.$isFormOpen,
      createChatModel.formOpened,
      sessionModel.$credentials,
    ]);

  return (
    <Sidebar>
      <Header>
        <Heading>
          <Title>Чаты</Title>
          {credentials && <Instance>Инстанс {credentials.idInstance}</Instance>}
        </Heading>
        <NewChatButton />
        <LogoutButton />
      </Header>

      {isFormOpen && (
        <FormSlot>
          <NewChatForm />
        </FormSlot>
      )}

      {items.length > 0 ? (
        <List>
          {items.map((item) => (
            <ChatListItem
              key={item.chatId}
              chatId={item.chatId}
              title={item.title}
              preview={item.preview}
              time={formatRecent(item.lastActivity)}
              active={item.chatId === activeChatId}
              onSelect={selectChat}
            />
          ))}
        </List>
      ) : (
        !isFormOpen && (
          <Empty>
            <ChatIcon width={40} height={40} />
            <EmptyText>Чатов пока нет</EmptyText>
            <Button variant="secondary" onClick={openForm}>
              Новый чат
            </Button>
          </Empty>
        )
      )}
    </Sidebar>
  );
}
