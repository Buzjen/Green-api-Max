import { styled } from '@linaria/react';
import { useUnit } from 'effector-react';
import { chatModel } from '@/entities/chat';
import { media, theme } from '@/shared/ui/theme';
import { ChatSidebar } from '@/widgets/chat-sidebar';
import { ChatWindow } from '@/widgets/chat-window';

const Sidebar = styled.div`
  min-height: 0;
  border-right: 1px solid ${theme.borderSoft};
`;

const Content = styled.div`
  min-width: 0;
  min-height: 0;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  height: 100%;

  ${media.tablet} {
    grid-template-columns: 320px 1fr;
  }

  /* На узких экранах показываем либо список, либо чат */
  ${media.mobile} {
    grid-template-columns: 1fr;

    ${Sidebar} {
      border-right: none;
    }

    &[data-view='chat'] ${Sidebar}, &[data-view='list'] ${Content} {
      display: none;
    }
  }
`;

export function ChatPage() {
  const activeChatId = useUnit(chatModel.$activeChatId);
  return (
    <Layout data-view={activeChatId ? 'chat' : 'list'}>
      <Sidebar>
        <ChatSidebar />
      </Sidebar>
      <Content>
        <ChatWindow />
      </Content>
    </Layout>
  );
}
