import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from '@@/exports';

const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;
  const { token } = useToken();
  const intl = useIntl(); // 使用国际化钩子

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage: "url('/images/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} rel="noreferrer">
        {intl.formatMessage({ id: 'pages.welcome.tryMeLink' })} {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const intl = useIntl(); // 使用国际化钩子

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage: "url('/images/A_BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ.png')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            {intl.formatMessage({ id: 'pages.welcome.welcomeTitle' })}
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            {intl.formatMessage({ id: 'pages.welcome.welcomeDescription' })}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="/income/chart"
              title={intl.formatMessage({ id: 'pages.welcome.card1.title' })}
              desc={intl.formatMessage({ id: 'pages.welcome.card1.description' })}
            />

            <InfoCard
              index={2}
              title={intl.formatMessage({ id: 'pages.welcome.card2.title' })}
              href="/cad/chart"
              desc={intl.formatMessage({ id: 'pages.welcome.card2.description' })}
            />
            <InfoCard
              index={3}
              title={intl.formatMessage({ id: 'pages.welcome.card3.title' })}
              href="/assets/chart"
              desc={intl.formatMessage({ id: 'pages.welcome.card3.description' })}
            />

            <InfoCard
              index={4}
              title={intl.formatMessage({ id: 'pages.welcome.card4.title' })}
              href="/stock/stocks"
              desc={intl.formatMessage({ id: 'pages.welcome.card4.description' })}
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
