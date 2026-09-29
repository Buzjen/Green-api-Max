import { styled } from '@linaria/react';
import { LoginForm } from '@/features/auth/login';
import { theme } from '@/shared/ui/theme';

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px 16px;
  background: ${theme.chatBg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 32px 28px 28px;
  border-radius: 24px;
  background: ${theme.surface};
  box-shadow: ${theme.shadowCard};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: ${theme.gradientAccent};
  font-size: 30px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
`;

const Subtitle = styled.div`
  margin: 8px 0 24px;
  color: ${theme.textSecondary};
  font-size: 14px;
  text-align: center;

  a {
    color: ${theme.accent};
  }
`;

export function LoginPage() {
  return (
    <Page>
      <Card>
        <Logo>💬</Logo>
        <Title>Веб-чат MAX</Title>
        <Subtitle>
          Введите параметры инстанса из{' '}
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noreferrer"
          >
            личного кабинета GREEN-API
          </a>
        </Subtitle>
        <LoginForm />
      </Card>
    </Page>
  );
}
